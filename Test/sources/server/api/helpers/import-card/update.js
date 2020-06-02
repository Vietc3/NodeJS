module.exports = {
  description: 'update import card',

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
      importedAt,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      deliveryAddress,
      status,
      recipientId,
      products,
      updatedBy,
      reason,
      reference,
      paidAmount,
      debtAmount,
      branchId,
      isActionLog,
    } = inputs.data;

    let {req} = inputs;

    let foundImportCard = await ImportCard.findOne(req, { id: id, branchId })

    if (!foundImportCard) {
      return exits.success({ message: sails.__("Không tìm thấy phiếu nhập"), status: false });
    }

    //kiểm tra mã phiếu có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(foundImportCard.code !== code && code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.importCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    if(!code)
      code = foundImportCard.code

    if ( finalAmount && foundImportCard.paidAmount > finalAmount ) return exits.success({ message: sails.__("Số tiền phải chi không được phép nhỏ hơn số tiền đã chi"), status: false });

    let changedProductStockQuantity = {};
    if ( products && products.length > 0 ) {
      let oldProducts = await ImportCardProduct.find(req, { importCardId: id }).populate("productId")

      // Kiểm tra tồn kho
      for(let product of oldProducts) {
        if(product.productId && product.productId.type == sails.config.constant.PRODUCT_TYPES.merchandise){
          let {productId, quantity, stockId} = product;
          changedProductStockQuantity[stockId] = changedProductStockQuantity[stockId] || {};
          changedProductStockQuantity[stockId][productId.id] = (changedProductStockQuantity[stockId][productId.id] || 0) + quantity;
        }
      }
      
      products.map(item => {
        if(item.type == sails.config.constant.PRODUCT_TYPES.merchandise){
          let {productId, quantity, stockId} = item;
          changedProductStockQuantity[stockId] = changedProductStockQuantity[stockId] || {};
          changedProductStockQuantity[stockId][productId] = (changedProductStockQuantity[stockId][productId] || 0) - quantity;
        }
      })

      let check = await sails.helpers.product.checkStockQuantity(
        req, 
        Object.keys(changedProductStockQuantity).map(item => ({
          stockId: item, 
          products: Object.keys(changedProductStockQuantity[item]).map(product => ({
            productId: product,
            quantity: changedProductStockQuantity[item][product]
          }))
        })), 
        branchId);
        
      if(!check.status) {
        return exits.success(check);
      }
    }

    //cập nhật thông tin phiếu nhập
    let updatedImportCard = await ImportCard.update(req, { id: id, branchId: branchId }).set(_.pickBy({
      code: code,
      importedAt: importedAt,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      deliveryAmount: deliveryAmount,
      finalAmount: finalAmount,
      notes: notes,
      deliveryAddress: deliveryAddress,
      status: status,
      reason,
      recipientId,
      reference,
      products: products,
      updatedBy: updatedBy,
      paidAmount,
      debtAmount,
      branchId: branchId

    }, value => value !== undefined)).intercept('E_UNIQUE', () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.EXIST_INVOICE_CODE)});
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
    }).fetch();
    let foundProductImports = await ImportCardProduct.find(req, { importCardId: id });
    let updatedProductImports = [];
    //update product
    if ( products && products.length > 0 ) {    
      //xóa các sản phẩm liên quan đến phiếu nhập cũ trong bảng ImportCardProduct
      let importCardProductArray = await ImportCardProduct.destroy(req, { importCardId: id });

      //tạo các sản phẩm trong bảng ImportCardProduct
      for (let index in products) {
        let newImportCardProduct = await ImportCardProduct.create(req, {
          productCode: products[index].productCode,
          productName: products[index].productName,
          quantity: products[index].quantity,
          unitPrice: products[index].unitPrice,
          discount: products[index].discount,
          taxAmount: products[index].taxAmount,
          finalAmount: products[index].finalAmount,
          costUnitPrice: products[index].costUnitPrice,
          notes: products[index].notes,
          importCardId: id,
          productId: products[index].productId,
          invoiceProductId: products[index].invoiceProductId,
          createdBy: updatedBy,
          updatedBy: updatedBy,
          stockId: products[index].stockId
        }).intercept({ name: 'UsageError' }, () => {
          return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
        }).fetch();
        updatedProductImports.push(newImportCardProduct)
      }
    }

    // CẬP NHẬT TỒN KHO CHO TRẢ HÀNG
    for(let stockId in changedProductStockQuantity) {
      for(let productId in changedProductStockQuantity[stockId]){
        let updateQuantity = await sails.helpers.product.updateQuantity(req, {
          id: productId, 
          branchId,
          stockQuantity: -changedProductStockQuantity[stockId][productId],
          stockId: stockId
        })
        if(!updateQuantity.status) {
          return exits.success(updateQuantity);
        }
      }
    }

    if (isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: reason == sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER ? sails.config.constant.ACTION_LOG_TYPE.IMPORT 
        : reason == sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN ? sails.config.constant.ACTION_LOG_TYPE.INVOICE_RETURN : sails.config.constant.ACTION_LOG_TYPE.EXPORT_FINISHED_PRODUCT,
        action: sails.config.constant.ACTION.UPDATE,
        objectId: id,
        objectContentOld: {...foundImportCard, products: foundProductImports},
        objectContentNew: {...updatedImportCard[0], products: updatedProductImports.length && updatedProductImports || foundProductImports},
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({ status: true, data: updatedImportCard[0] });
  }
}
