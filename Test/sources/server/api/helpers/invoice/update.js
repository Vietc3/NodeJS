module.exports = {
  description: 'update invoice card',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let {
      id,
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      deliveryAddress,
      status,
      products,
      deliveryType,
      payAmount,
      updatedBy,
      branchId, 
      isActionLog,
      invoiceAt
    } = inputs.data;

    let {req} = inputs;
    
    // Chuẩn bị dữ liệu
    finalAmount = parseFloat(finalAmount) || 0;
    products = products || [];
    payAmount = payAmount === undefined ? 0 : payAmount;
    
    // Kiểm tra tồn tại đơn hàng
    let foundInvoiceCard = await Invoice.findOne(req, {
      id,
      branchId,
      status: {'!=': sails.config.constant.INVOICE_CARD_STATUS.CANCELED}
    }).intercept({ name: 'UsageError' }, ()=>{
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    
    if (!foundInvoiceCard) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_INVOICE)});
    }

    //kiểm tra mã phiếu có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(foundInvoiceCard.code !== code && code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.invoiceFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    if(!code)
      code = sails.config.cardcode.invoiceFirstCode + id;

    //Kiểm trả đơn hàng đã trả hàng chưa, nếu trả rồi thì không cho cập nhật
    foundInvoiceReturn= await ImportCard.findOne(req, {
      where: { reference: foundInvoiceCard.code, reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN, status: sails.config.constant.INVOICE_RETURN_CARD_STATUS.FINISHED, branchId }
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });

    if (foundInvoiceReturn) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_UPDATE_INVOICE_BECAUSE_RETURNED)});
    }
    
    let foundInvoiceProducts = await InvoiceProduct.find(req, { invoiceId: id}).populate("productId")

    if (!foundInvoiceProducts) return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    // Kiểm tra tồn kho
    let changedProductQuantity = {};

    for(let invoiceProduct of foundInvoiceProducts) {
      if(invoiceProduct.productId.type == sails.config.constant.PRODUCT_TYPES.merchandise){
        let {productId, quantity, stockId} = invoiceProduct;
        changedProductQuantity[stockId] = changedProductQuantity[stockId] || {};
        changedProductQuantity[stockId][productId.id] = (changedProductQuantity[stockId][productId.id] || 0) - quantity;
      }
    }
    
    products.map(item => {
      if(item.type == sails.config.constant.PRODUCT_TYPES.merchandise){
        let {productId, quantity, stockId} = item;
        changedProductQuantity[stockId] = changedProductQuantity[stockId] || {};
        changedProductQuantity[stockId][productId] = (changedProductQuantity[stockId][productId] || 0) + quantity;
      }
    })
    let check = await sails.helpers.product.checkStockQuantity(
      req, 
      Object.keys(changedProductQuantity).map(item => ({
        stockId: item, 
        products: Object.keys(changedProductQuantity[item]).map(product => ({
          productId: product,
          quantity: changedProductQuantity[item][product]
        }))
      })), 
      branchId);
    if(!check.status) {      
      return exits.success({status: false, message: sails.__(check.message)});
    }

    // Kiểm tra tổng số tiền đã thanh toán
    if(foundInvoiceCard.paidAmount > finalAmount) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_UPDATE)});
    }
    
    // Lưu đơn hàng
    let arrUpdatedInvoice = await Invoice.update(req, { id, branchId }).set(_.pickBy({
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      status,
      deliveryType,
      invoiceAt,
      deliveryAddress,
      paidAmount: foundInvoiceCard.paidAmount + payAmount,
      debtAmount: finalAmount - (foundInvoiceCard.paidAmount + payAmount),
      updatedBy,
    }, value => value !== null)).intercept('E_UNIQUE', () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.EXIST_INVOICE_CODE)});
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    let updatedInvoice = arrUpdatedInvoice[0];
    
    // xóa các sản phẩm liên quan đến đơn hàng cũ trong bảng InvoiceProduct
    let newInvoiceProducts = [];
    if ( products.length > 0 ) {
      let destroyInvoiceProducts = await InvoiceProduct.find(req, {invoiceId: id});
      destroyInvoiceProducts = destroyInvoiceProducts || [];
      
      await InvoiceProduct.destroy(req, {
        invoiceId: id
      });
      //tạo các sản phẩm trong bảng InvoiceProduct      
      for (let index in products) {
        let {
          productCode,
          productName,
          quantity,
          unitPrice,
          discount,
          discountType,
          taxAmount,
          finalAmount,
          notes,
          productId,
          costUnitPrice,
          stockId
        } = products[index];
        
        let newInvoiceProduct = await InvoiceProduct.create(req, {
          productCode,
          productName,
          quantity,
          unitPrice,
          discount,
          discountType,
          taxAmount,
          finalAmount,
          costUnitPrice,
          notes,
          invoiceId: id,
          productId,
          createdBy: updatedBy,
          updatedBy,
          stockId
        }).intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        }).fetch();
        newInvoiceProducts.push(newInvoiceProduct);
      }
    }

    let changeValue = finalAmount - foundInvoiceCard.finalAmount;
    if(changeValue !== 0) {
      //Tạo công nợ khách hàng
      if(foundInvoiceCard.customerId){
        let createDebt = await sails.helpers.debt.create(req, {
          changeValue: changeValue,
          originalVoucherId: id,
          originalVoucherCode: updatedInvoice.code,
          type: sails.config.constant.DEBT_TYPES.UPDATE_INVOICE,
          customerId: foundInvoiceCard.customerId,
          createdBy: updatedBy,
        });
        if(!createDebt.status) {
          return exits.success(createDebt);
        }
      }
    }

    // CẬP NHẬT TỒN KHO CHO ĐƠN HÀNG
    for(let stockId in changedProductQuantity) {
      for(let productId in changedProductQuantity[stockId]){
        let updateQuantity = await sails.helpers.product.updateQuantity(req, {
          id: productId, 
          branchId,
          stockQuantity: -changedProductQuantity[stockId][productId],
          stockId: stockId
        })
        if(!updateQuantity.status) {
          return exits.success(updateQuantity);
        }
      }
    }

    // tạo nhật kí 
    if (isActionLog) {
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.INVOICE,
        action: sails.config.constant.ACTION.UPDATE,
        objectId: id,
        objectContentOld: {...foundInvoiceCard, products: foundInvoiceProducts },
        objectContentNew: {...updatedInvoice, products: newInvoiceProducts },
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }    

    return exits.success({status: true, 
      data: {updatedInvoice, newInvoiceProducts}
    });
  }

}