module.exports = {
  description: 'cancel invoice return card',

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

    let {req } = inputs;
    
    // kiểm tra phiếu chi
    let foundImport = await ImportCard.findOne(req, { id, branchId }) 

    if ( !foundImport ) return exits.success({ status: false, message: sails.__("Không tìm thấy phiếu nhập")})

    if ( foundImport.status === sails.config.constant.IMPORT_CARD_STATUS.CANCELED ) return exits.success({ status: false, message: sails.__("Phiếu trả hàng này đã bị hủy")})

    if ( foundImport.paidAmount > 0 ) {
      return exits.success({ message: sails.__("Không thể hủy đơn trả hàng này vì đã có phát sinh phiếu chi. Bạn cần hủy phiếu chi trước."), status: false });
    }
    // hủy phiếu import
    let cancelInvoice = await sails.helpers.importCard.cancel(req, {id, updatedBy, branchId})

    if (!cancelInvoice.status) return exits.success(cancelInvoice)

    //Tạo công nợ (tăng) khách hàng
    if(cancelInvoice.data[0].recipientId) {
      let createDebt = await sails.helpers.debt.create(req, {
        changeValue: cancelInvoice.data[0].finalAmount,
        originalVoucherId: cancelInvoice.data[0].id,
        originalVoucherCode: cancelInvoice.data[0].code,
        type: sails.config.constant.DEBT_TYPES.DELETE_INVOICE_RETURN,
        customerId: cancelInvoice.data[0].recipientId,
        createdBy: updatedBy,
      });
      if(!createDebt.status) {
        return exits.success(createDebt);
      }
    }

    let foundInvoice = await Invoice.findOne(req, { code: foundImport.reference, branchId })

    if ( !foundInvoice ) return exits.success({ status: false, message: sails.__("Không tìm thấy đơn hàng") })

    // cập nhật lại số lượng trả lại sản phẩm đơn hàng
    for ( let item of cancelInvoice.products ) {
      let foundInvoiceProduct = await InvoiceProduct.findOne(req, {
        invoiceId: foundInvoice.id,
        id: item.invoiceProductId
      })

      if (!foundInvoiceProduct) return exits.success({ status: false, message: sails.__("Không tìm thấy sản phẩm trong đơn hàng") })

      let updateInvoiceProduct = await InvoiceProduct.update(req, { id: foundInvoiceProduct.id }).set({
        returnQuantity: foundInvoiceProduct.returnQuantity - item.quantity,
        updatedBy
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      }).fetch();

    }

    return exits.success({ status: true, data: cancelInvoice })
  }
}