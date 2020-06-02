/**
 * DepositCard.js
 *
 * @description :: A model definition represents a deposit card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes : {
    customerId: { // Khách hàng hoặc nhà cung cấp
      model: 'Customer'
    },
    code: {
      type: 'string',
      unique: true
    },
    customerName: { // Tên người nộp
      type: 'string'
    },
    amount: { // Giá trị thay đổi
      type: 'number'
    },
    originalVoucherId: { // ID của chứng từ gốc
      type: 'number'
    },
    originalVoucherCode: { // mã phiếu của chứng từ gốc
      type: 'string'
    },
    // 1 - đặt cọc
    // 2 - rút cọc
    type: {
      type: 'number'
    },
    depositDate: {
      type: 'number',
      example: 1502844074211
    },
    status: {
      type: 'number',
      required: true,
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    branchId: {
      model: 'Branch'
    },
    createdBy: { 
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    }
  },
  multitenant: true,
}

