/**
 * ProductStock.js
 *
 * @description :: A model definition represents a stock of product.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      stockQuantity: {
        type: 'number',
      },
      stockQuantity2: {
        type: 'number',
      },
      stockQuantity3: {
        type: 'number',
      },
      stockQuantity4: {
        type: 'number',
      },
      stockQuantity5: {
        type: 'number',
      },
      stockQuantity6: {
        type: 'number',
      },
      manufacturingQuantity: {
        type: 'number',
      },
      deletedAt: {
        type: 'number',
      },
  
      productId: {
        model: 'Product',
      },
      branchId: {
        model: 'Branch',
      },
      stockMin: {
        type: 'number',
      },
      createdBy: {
        model: 'User'
      },
      updatedBy: {
        model: 'User'
      },
      stockQuantity2: {
        type: 'number',
      },
      stockQuantity3: {
        type: 'number',
      },
      stockQuantity4: {
        type: 'number',
      },
      stockQuantity5: {
        type: 'number',
      },
      stockQuantity6: {
        type: 'number',
      },
    },
    multitenant: true,
  
  };
  
  