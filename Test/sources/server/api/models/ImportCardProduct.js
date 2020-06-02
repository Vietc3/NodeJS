/**
 * ImportCardProduct.js
 *
 * @description :: A model definition represents products of an import card.
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
    quantity: {
      type: 'number'
    },
    unitPrice: {
      type: 'number'
    },
    discount: {
      type: 'number'
    },
    taxAmount: {
      type: 'number'
    },
    finalAmount: {
      type: 'number'
    },
    costUnitPrice: {
      type: 'number'
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    returnQuantity: {
      type: 'number'
    },
    invoiceProductId: {
      type: 'number'
    },
    importCardId: {
      model: 'ImportCard'
    },
    productId: {
      model: 'Product'
    },
    stockId: {// id của kho
      model: 'Stock'
    },
  },
  multitenant: true,

};

