/**
 * IncomeExpenseCardType.js
 *
 * @description :: A model definition represents a type of income expense card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 150,
    },
    type: {
      type: 'number',
      required: true
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    auto: {
      type: 'number',
    },
    shouldUpdateDebt: { // 0: không, 1: có
      type: 'number',
    },
    code: {
      type: 'number',
    },


    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },


    incomeExpenseCards: {
      collection: 'IncomeExpenseCard',
      via: 'incomeExpenseCardTypeId'
    }
  },
  multitenant: true,

};

