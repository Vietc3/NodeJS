/**
 * ProductPrice.js
 *
 * @description :: A model definition represents a price of product.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      costUnitPrice: {
        type: 'number',
      },
      lastImportPrice: {
        type: 'number',
      },
      saleUnitPrice: {
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
      createdBy: {
        model: 'User'
      },
      updatedBy: {
        model: 'User'
      },
  
    },
    multitenant: true,
  
  };
  
  