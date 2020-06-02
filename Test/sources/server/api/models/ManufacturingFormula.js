/**
 * ManufacturingFormula.js
 *
 * @description :: A model definition represents a manufacturing formula.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    quantity: {
      type: 'number',
    },
    deletedAt: {
      type: 'number',
    },


    productId: {
      model: 'Product',
    },
    materialId: {
      model: 'Product',
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
  
  