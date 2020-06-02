module.exports = {
  description: 'create invoice return card',

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
      products, // [{productCode, productName, quantity, unitPrice, discount, taxAmount, finalAmount, productId},]
      finalAmount,
      code,
      notes,
      invoiceId,
      updatedBy,
      customerId,
      totalAmount,
      discountAmount,
      paidAmount,
      branchId,
      debtAmount,
      importedAt,
      isActionLog
    } = inputs.data;

    let {req} = inputs;
    
    let invoice;
    let invoiceProducts = [];
    let importProducts;
    
    // Kiểm tra tồn tại phiếu trả hàng
    let foundInvoiceReturnCard = await ImportCard.findOne(req, {
      id,
      branchId,      
      status: {'!=': sails.config.constant.INVOICE_CARD_STATUS.CANCELED},
      reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN
    }).intercept({ name: 'UsageError' }, ()=>{
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    
    if (!foundInvoiceReturnCard) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_INVOICE_RETURN)});
    }

    //kiểm tra mã phiếu có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(foundInvoiceReturnCard.code !== code && code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.importCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    if(!code)
      code = foundInvoiceReturnCard.code
    
    if (invoiceId) { // để cập nhật bên phiếu chi ko có truyền phiếu đơn hàng
      invoice = await Invoice.findOne(req, { id: invoiceId, branchId });
      
      if ( !invoice ) {
        return exits.success({ message: sails.__("Phiếu đơn hàng không tồn tại"), status: false });
      }

      invoiceProducts = await InvoiceProduct.find(req, { invoiceId: invoiceId });
      importProducts = await ImportCardProduct.find(req, { importCardId: id });

      if ( products.length > 0 ) {
        // kiểm tra quantity 
        for (let product of products) {
          for ( let item of importProducts ) {
            for (let elem of invoiceProducts) {
              if (elem.id === product.invoiceProductId && item.invoiceProductId === product.invoiceProductId
                && product.quantity > (elem.quantity + item.quantity - elem.returnQuantity) ) {
                  return exits.success({status: false,  message: sails.__("Số lượng sản phẩm trả hàng lớn hơn số lượng sản phẩm đơn hàng") })
              }
            }
          }
        }
        
      }
    }

    // lấy phiếu xuất cũ
    let foundImport = await ImportCard.findOne(req, { id: id, branchId });

    // kiểm phiếu chi
    if ( finalAmount && foundImport.paidAmount > finalAmount ) return exits.success({ message: sails.__("Số tiền phải chi không được phép nhỏ hơn số tiền đã chi"), status: false });

    // cập nhật phiếu import
    let updateInvoiceReturn = await sails.helpers.importCard.update(req, {
      id,
      products,
      finalAmount,
      code,
      notes,
      updatedBy,
      recipientId: customerId,
      totalAmount,
      discountAmount,
      reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN,
      reference: invoice ? invoice.code : undefined,
      paidAmount,
      branchId,
      importedAt,
      debtAmount: debtAmount === 0 || debtAmount ? debtAmount : Number(finalAmount) - foundImport.paidAmount,// cập nhật số tiền lại của phiếu trả hàng
      isActionLog
    })
    if (!updateInvoiceReturn.status) return exits.success(updateInvoiceReturn)
      
    let changeValue = Number(finalAmount) - foundImport.finalAmount;
    if(changeValue !== 0) {
      //Tạo công nợ khách hàng
      if(updateInvoiceReturn.data.recipientId){
        let createDebt = await sails.helpers.debt.create(req, {
          changeValue: -changeValue,
          originalVoucherId: id,
          originalVoucherCode: updateInvoiceReturn.data.code,
          type: sails.config.constant.DEBT_TYPES.UPDATE_INVOICE_RETURN,
          customerId: updateInvoiceReturn.data.recipientId,
          createdBy: updatedBy,
        });
        if(!createDebt.status) {
          return exits.success(createDebt);
        }
      }
    }

    if ( products && products.length > 0 ) {
      // cập nhật số lượng trả hàng Invoice
      for (let product of products) {
        for (let elem of invoiceProducts) {
          if (elem.id === product.invoiceProductId) {
            for ( let item of importProducts ) {
              if (item.invoiceProductId === elem.id) {
                let invoiceReturnProduct = await InvoiceProduct.update(req, { id: elem.id }).set({
                  returnQuantity: (Number(product.quantity) - item.quantity) + elem.returnQuantity,
                  updatedBy: updatedBy
                }).intercept({ name: 'UsageError' }, () => {
                  return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
                }).fetch();
                break;
              }
            }
            break;
          }
        }
      }
    }

    return exits.success({status: true, data: updateInvoiceReturn})
  }
}