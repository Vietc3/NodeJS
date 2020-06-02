/**
 * StockCheckCard.js
 *
 * @description :: A model definition represents a stockcheck card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: {
      type: 'string',
      maxLength: 50,
    },
    status: {
      type: 'number',
      required: true,
    },
    checkedAt: {
      type: 'number',
      example: 1502844074211,
      required: true,
    },
    finishedAt: {
      type: 'number',
      example: 1502844074211
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    branchId: {
      type: 'number'
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
    },
    stockId: {// id của kho
      model: 'Stock'
    },

    stockCheckCardProducts: {
      collection: 'StockCheckCardProduct',
      via: 'stockCheckCardId'
    }
  },
  multitenant: true,

};

