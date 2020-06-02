/**
 * ProductType.js
 *
 * @description :: A model definition represents a type of product.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    file: {
      type: 'ref',
      columnType: 'mediumblob',
      required: true,
    },
    extension: {
      type: 'string',
      maxLength: 50,
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    
    productId: {
      model: 'Product'
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

