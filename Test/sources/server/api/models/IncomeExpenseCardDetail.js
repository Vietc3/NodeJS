/**
 * IncomeExpenseCardDetail.js
 *
 * @description :: A model definition represents detail of income expense card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    paidAmount: {
      type: 'number'
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },    
    paidCardId: { // id của đơn hàng (hoặc phiếu nào đó) được thanh toán
      type: 'number',
    },
    
    incomeExpenseCardId: {
      model: 'IncomeExpenseCard'
    },
    incomeExpenseCardTypeId: {
      model: 'IncomeExpenseCardType'
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