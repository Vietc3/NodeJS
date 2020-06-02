module.exports = {
  description: 'cancel import card',

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
    let { id, updatedBy, branchId } = inputs.data;

    let {req} = inputs;
        
  
    
    // kiểm tra phiếu chi
    let foundImport = await ImportCard.findOne(req, { id: id, branchId }) 

    if ( !foundImport ) return exits.success({ status: false, message: sails.__("Không tìm thấy phiếu nhập")})

    if ( foundImport.status === sails.config.constant.IMPORT_CARD_STATUS.CANCELED ) return exits.success({ status: false, message: sails.config.constant.INTERCEPT.CANCELLED_IMPORT_CARD})

    if ( foundImport.paidAmount > 0 ) {
      return exits.success({ message: sails.__("Không thể hủy phiếu nhập này vì đã có phát sinh phiếu chi. Bạn cần hủy phiếu chi trước."), status: false });
    }
    
    //Kiểm tra lịch sử trả hàng
    let foundImportReturn = await ExportCard.findOne(req, {
      where: { reference: foundImport.code, reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER, status: sails.config.constant.EXPORT_CARD_STATUS.FINISHED, branchId }
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
    
    if(foundImportReturn) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_CANCEL_IMPORT_BECAUSE_RETURNED)});
    }

    //hủy phiếu nhập
    let cancelImportCard = await sails.helpers.importCard.cancel(req, {id, updatedBy, branchId})

    if (!cancelImportCard.status) return exits.success(cancelImportCard)

    //cập nhật công nợ cho nhà cung cấp (giảm công nợ ncc)
    if(cancelImportCard.data[0].recipientId && cancelImportCard.data[0].finalAmount > 0){
      let createDebt = await sails.helpers.debt.create(req, {
        changeValue: -cancelImportCard.data[0].finalAmount,
        originalVoucherId: id,
        originalVoucherCode: cancelImportCard.data[0].code,
        type: sails.config.constant.DEBT_TYPES.DELETE_IMPORT,
        customerId: cancelImportCard.data[0].recipientId,
        createdBy: updatedBy,
      });
      if(!createDebt.status) {
        return exits.success(createDebt);
      }
    }

    return exits.success({ status: true, data: cancelImportCard});
  }
}