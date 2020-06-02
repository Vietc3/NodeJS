/**
 * ProdductUnit.js
 *
 * @description :: A model definition represents a unit of product.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 150,
      unique: true
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211,
    },


    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },


    products: {
      collection: 'Product',
      via: 'unitId'
    }
  },
  multitenant: true,

};

