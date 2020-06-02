/**
 * Debt.js
 *
 * @description :: A model definition represents a debt card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes : {
    customerId: { // Khách hàng hoặc nhà cung cấp
        model: 'Customer'
      },
    changeValue: { // Giá trị thay đổi
      type: 'number'
    },
    remainingValue: { // Công nợ còn lại
      type: 'number'
    },
    originalVoucherId: { // ID của chứng từ gốc
      type: 'string'
    },
    originalVoucherCode: { // mã phiếu của chứng từ gốc
      type: 'string'
    },
    type: { // Loại phiếu thu hoặc phiếu chi
      type: 'number'
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
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

