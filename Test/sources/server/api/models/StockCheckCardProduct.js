/**
 * StockCheckCardProduct.js
 *
 * @description :: A model definition represents products of stockcheck card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    productCode: {
      type: 'string',
      maxLength: 50,
    },
    productName: {
      type: 'string',
    },
    stockQuantity: {
      type: 'number',
    },
    realQuantity: {
      type: 'number',
    },
    realAmount: {
      type: 'number',
    },
    differenceQuantity: {
      type: 'number',
    },
    differenceAmount: {
      type: 'number',
    },
    reason: {
      type: 'string',
      maxLength: 125,
    },


    stockCheckCardId: {
      model: 'StockCheckCard'
    },
    productId: {
      model: 'Product'
    }
  },
  multitenant: true,

};

