module.exports = {
  description: 'cancel a invoice card',

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
      updatedBy,
      branchId
    } = inputs.data;

    let {req} = inputs;
   

    //Kiểm tra lịch sử thanh toán
    let foundInvoiceCard = await Invoice.findOne(req, {
      id,
      branchId
    }).intercept({ name: 'UsageError' }, ()=>{
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    
    if(foundInvoiceCard.paidAmount > 0) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_CANCEL_INVOICE_BECAUSE_PAID)});
    }
    
    //Kiểm tra lịch sử trả hàng
    let foundInvoiceReturn = await ImportCard.findOne(req, {
      where: { reference: foundInvoiceCard.code, reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN, status: sails.config.constant.IMPORT_CARD_STATUS.FINISHED }
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
    
    if(foundInvoiceReturn) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_CANCEL_INVOICE_BECAUSE_RETURNED)});
    }
    
    // cập nhật trạng thái hủy
    let arrCanceledInvoice = await Invoice.update(req, { id, branchId }).set(_.pickBy({
      status: sails.config.constant.INVOICE_CARD_STATUS.CANCELED,
      updatedBy
    }, value => value !== null)).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    let canceledInvoice = arrCanceledInvoice[0];
    
    if(canceledInvoice.customerId && canceledInvoice.finalAmount > 0){
      //Giảm công nợ cho khách hàng
      let createDebt = await sails.helpers.debt.create(req, {
        changeValue: -canceledInvoice.finalAmount,
        originalVoucherId: canceledInvoice.id,
        originalVoucherCode: canceledInvoice.code,
        type: sails.config.constant.DEBT_TYPES.DELETE_INVOICE,
        customerId: canceledInvoice.customerId,
        createdBy: updatedBy,
      });
      if(!createDebt.status) {
        return exits.success(createDebt);
      }
    }
    // CẬP NHẬT TỒN KHO
    let foundInvoiceProducts = await InvoiceProduct.find(req, {invoiceId: id}).populate("productId");
    foundInvoiceProducts = foundInvoiceProducts || [];
    
    for(let invoiceProduct of foundInvoiceProducts) {
      
      if(invoiceProduct.productId && invoiceProduct.productId.type == sails.config.constant.PRODUCT_TYPES.merchandise){

        let updateQuantity = await sails.helpers.product.updateQuantity(req, {
          id: invoiceProduct.productId.id, 
          stockQuantity: invoiceProduct.quantity,
          branchId,
          stockId: invoiceProduct.stockId
        })
        
        if(!updateQuantity.status) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        }
      }
    }

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.INVOICE,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: id,
      objectContentOld: {...foundInvoiceCard, products: foundInvoiceProducts },
      objectContentNew: {...canceledInvoice, products: foundInvoiceProducts },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({status: true, data: {canceledInvoice}});
  }

}