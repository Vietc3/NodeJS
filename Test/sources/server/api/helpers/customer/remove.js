module.exports = {
  description: 'Delete a customer',

  inputs: {
    req: {
      type: 'ref',
    },
    data: {
      type: 'ref',
      required: true,
    },
  },

  fn: async function (inputs, exits) {
    let { id, type, updatedBy, branchId } = inputs.data;
    let { req } = inputs;

    // Kiểm tra customer id có tồn tại không
    let foundCustomer = await Customer.findOne(req, {
      id,
      type: type,
      branchId,
      deletedAt: 0
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    if(!foundCustomer) {
      return exits.success({
        status: false,
        message: sails.__("Khách hàng không tồn tại trong hệ thống")
      });
    } 

    if(type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER){
      let findCustomerInvoice = await Invoice.find(req, {
        where: {customerId: id, branchId, deletedAt: 0}
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      });

      if(findCustomerInvoice.length > 0){
        return exits.success({ message: sails.__("Không thể xóa vì đã có đơn hàng"), status: false });
      }

      let findCustomerInvoiceReturn = await ImportCard.find(req, {
        where: { recipientId: id, reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN, branchId, deletedAt: 0 }
      }).intercept({ name: 'UsageError' }, () => {
          return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      })
      if(findCustomerInvoiceReturn.length > 0){
        return exits.success({ message: sails.__("Không thể xóa vì đã có phiếu trả hàng"), status: false });
      }
    }

    else{
      let findCustomerImport = await ImportCard.find(req, {
        where: {recipientId: id, reason: sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER, branchId, deletedAt: 0}
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      });

      if(findCustomerImport.length > 0){
        return exits.success({ message: sails.__("Không thể xóa vì đã có phiếu nhập hàng"), status: false });
      }

      let findCustomerImportReturn = await ExportCard.find(req, {
        where: { recipientId: id, reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER, branchId, deletedAt: 0 }
      }).intercept({ name: 'UsageError' }, () => {
          return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      })
      if(findCustomerImportReturn.length > 0){
        return exits.success({ message: sails.__("Không thể xóa vì đã có phiếu trả hàng nhập"), status: false });
      }
      
      let findCustomerProduct = await Product.find(req, {
        where:{customerId: id, deletedAt: 0}
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      });

      if(findCustomerProduct.length > 0){
        return exits.success({ message: sails.__("Không thể xóa vì đang là nhà cung cấp của một sản phẩm"), status: false });
      }
    }

    let findCustomerDeposit = await DepositCard.find(req, {
      where:{customerId: id, branchId, deletedAt: 0}
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
    });

    if(findCustomerDeposit.length > 0){
      return exits.success({ message: sails.__("Không thể xóa vì đã có phiếu ký gửi"), status: false });
    }

    let findCustomerDebt = await Debt.find(req, {
      where:{customerId: id, deletedAt: 0}
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
    });

    if(findCustomerDebt.length > 0){
      return exits.success({ message: sails.__("Không thể xóa vì đã có công nợ"), status: false });
    }

    let findCustomerIncExp = await IncomeExpenseCard.find(req, {
      where:{customerId: id, branchId, deletedAt: 0}
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
    });

    if(findCustomerIncExp.length > 0){
      return exits.success({ message: sails.__("Không thể xóa vì đã có phiếu thu chi"), status: false });
    }

    var updateCustomer = await Customer.update(req, { id: id, type: type, branchId, deletedAt: 0 }).set({
      code: foundCustomer.code + ` ${new Date().getTime()}`,
      deletedAt: new Date().getTime(),
      updatedBy
    }).intercept({ name: 'UsageError' }, ()=>{
      return exits.success({ message: sails.__("Khách hàng không tồn tại trong hệ thống"), status: false });
    }).fetch();

    // tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? sails.config.constant.ACTION_LOG_TYPE.CUSTOMER : sails.config.constant.ACTION_LOG_TYPE.SUPPLIER,
      action: sails.config.constant.ACTION.DELETE,
      objectId: updateCustomer[0].id,
      objectContentOld: foundCustomer,
      objectContentNew: updateCustomer[0],
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({ status: true, data: updateCustomer[0] });
  }
}