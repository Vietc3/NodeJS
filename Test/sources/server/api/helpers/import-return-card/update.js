module.exports = {
  description: 'create import return card',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    },
  },

  fn: async function (inputs, exits) {
    let {
      id,
      products, // [{productCode, productName, quantity, unitPrice, discount, taxAmount, finalAmount, productId},]
      finalAmount,
      code,
      notes,
      updatedBy,
      customerId,
      totalAmount,
      discountAmount,
      paidAmount,
      debtAmount,
      branchId,
      isActionLog,
      exportedAt
    } = inputs.data;

    let {req} = inputs;
    
    // lấy phiếu xuất cũ
    let foundExport = await ExportCard.findOne(req, { id: id, branchId: branchId});
    
    if ( !foundExport ) return exits.success({ status: false, message: sails.__("Không tìm thấy phiếu trả hàng nhập")});

    //kiểm tra mã phiếu có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(foundExport.code !== code && code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.exportCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    if(!code)
      code = foundExport.code

    // kiểm phiếu thu
    if ( finalAmount && foundExport.paidAmount > finalAmount ) return exits.success({ message: sails.__("Số tiền phải thu không được phép nhỏ hơn số tiền đã thu"), status: false });
    let changeValue = Number(finalAmount) - foundExport.finalAmount;
    
    // cập nhật phiếu export
    let updateImportReturn = await sails.helpers.exportCard.update(req, {
      id,
      products,
      finalAmount,
      code,
      notes,
      updatedBy,
      recipientId: customerId,
      totalAmount,
      discountAmount,
      reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER,
      paidAmount,
      exportedAt,
      debtAmount: debtAmount ? debtAmount : Number(finalAmount) - foundExport.paidAmount,
      branchId: branchId,
      isActionLog
    })

    if (!updateImportReturn.status) exits.success(updateImportReturn);
    
    if(changeValue !== 0) {
      //Tạo công nợ nhà cung cấp
      if(updateImportReturn.updatedExportCard[0].recipientId){
        let createDebt = await sails.helpers.debt.create(req, {
          changeValue: -changeValue,
          originalVoucherId: id,
          originalVoucherCode: updateImportReturn.updatedExportCard[0].code,
          type: sails.config.constant.DEBT_TYPES.UPDATE_IMPORT_RETURN,
          customerId: updateImportReturn.updatedExportCard[0].recipientId,
          createdBy: updatedBy,
        });
        if(!createDebt.status) {
          return exits.success(createDebt);
        }
      }
    }
    
    return exits.success({status: true, data: updateImportReturn})
  }
}