/**
 * IncomeExpenseCard.js
 *
 * @description :: A model definition represents an income expense card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: {
      type: 'string',
      unique: true
    },
    type: { // 1 - thu, 2 - chi
      type: 'number',
      required: true
    },
    incomeExpenseAt: {
      type: 'number',
      example: 1502844074211,
      required: true
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    amount: { // Tổng tiền đã thanh toán các đơn hàng
      type: 'number'
    },
    depositAmount: { // Tiền đặt cọc được sử dụng trong tổng tiền
      type: 'number'
    },
    status: { // 1 - finished, 2 - canceled
      type: 'number',
      required: true
    },
    remainingValue: { // sổ quỹ còn lại
      type: 'number'
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },    
    customerType: { // 1 - khách hàng , 2 - nhà cung cấp, 3 - nhân viên, 4 - khác
      type: 'number',
      allowNull: true
    }, 
    customerId: {
      type: 'number',
    },
    customerName: { //tên người nộp/nhận trong trường hợp không thuộc loại đối tác nào
      type: 'string',
      maxLength: 250,
      allowNull: true
    },

    incomeExpenseCardTypeId: {
      model: 'IncomeExpenseCardType'
    },
    incomeExpenseCardDetail: {
      collection: 'IncomeExpenseCardDetail',
      via: 'incomeExpenseCardId'
    },
    branchId: { // Chi nhánh
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

};