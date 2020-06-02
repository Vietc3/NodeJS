/**
 * ManufacturingCardFinishedProduct.js
 *
 * @description :: A model definition represents finished products of an manufacturing card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: {
      type: 'string',
      maxLength: 50,
    },
    name: {
      type: 'string',
    },
    quantity: {
      type: 'number'
    },
    manufacturingCardId: {
      model: 'ManufacturingCard'
    },
    productId: {
      model: 'Product'
    }
  },
  multitenant: true,

};

