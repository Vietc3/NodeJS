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
      type: 'number'
    },
    originalVoucherCode: { // mã phiếu của chứng từ gốc
      type: 'string'
    },
    // 1 - Tạo đơn hàng
    // 2 - Sửa đơn hàng
    // 3 - Hủy đơn hàng
    // 4 - Tạo trả hàng
    // 5 - Sửa trả hàng
    // 6 - Hủy trả hàng
    // 7 - Tạo nhập hàng
    // 8 - Sửa nhập hàng
    // 9 - Hủy nhập hàng
    // 10 - Tạo trả hàng nhập
    // 11 - Sửa trả hàng nhập
    // 12 - Hủy trả hàng nhập
    // 13 - Tạo phiếu thu
    // 14 - Sửa phiếu thu
    // 15 - Hủy phiếu thu
    // 16 - Tạo phiếu chi
    // 17 - Sửa phiếu chi
    // 18 - Hủy phiếu chi
    // 19 - Người dùng điều chỉnh
    type: {
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

