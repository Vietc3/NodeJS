module.exports = {
  description: 'cancel import return card',

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
    
    // kiểm tra phiếu xuất
    let foundExport = await ExportCard.findOne(req, { id: id, branchId }) 

    if ( !foundExport ) return exits.success({ status: false, message: sails.__("Không tìm thấy phiếu trả hàng nhập")})

    if ( foundExport.status === sails.config.constant.EXPORT_CARD_STATUS.CANCELED ) return exits.success({ status: false, message: sails.__("Phiếu trả hàng nhập này đã bị hủy")})

    if ( foundExport.paidAmount > 0 ) {
      return exits.success({ message: sails.__("Không thể hủy đơn trả hàng nhập này vì đã có phát sinh phiếu thu. Bạn cần hủy phiếu thu trước."), status: false });
    }
    // hủy phiếu export
    let cancelExportCard = await sails.helpers.exportCard.cancel(req, {id, updatedBy, branchId})

    if (!cancelExportCard.status) return exits.success(cancelExportCard)

    //Tạo công nợ (tăng) nhà cung cấp
    if(cancelExportCard.data[0].recipientId) {
      let createDebt = await sails.helpers.debt.create(req, {
        changeValue: cancelExportCard.data[0].finalAmount,
        originalVoucherId: cancelExportCard.data[0].id,
        originalVoucherCode: cancelExportCard.data[0].code,
        type: sails.config.constant.DEBT_TYPES.DELETE_IMPORT_RETURN,
        customerId: cancelExportCard.data[0].recipientId,
        createdBy: updatedBy,
      });
      if(!createDebt.status) {
        return exits.success(createDebt);
      }
    }

    return exits.success({ status: true, data: cancelExportCard })
  }
}