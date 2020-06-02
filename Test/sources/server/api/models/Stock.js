/**
 * Stock.js
 *
 * @description :: A model definition represents a stock.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      name: {
        type: 'string',
        required: true,
      },
      address: {
        type: 'string',
        allowNull: true
      },
      notes: {
        type: 'string',
        allowNull: true
      },
      deletedAt: {
        type: 'number',
        example: 1502844074211
      },
      stockColumnIndex: {
        type: 'number'
      },
      
      branchId: {
        model: 'Branch'
      },
      createdBy: {
        model: 'User'
      },
      updatedBy: {
        model: 'User'
      },

      exportCardProducts: {
        collection: 'ExportCardProduct',
        via: 'stockId'
      },
      moveStockCardProducts: {
        collection: 'MoveStockCardProduct',
        via: 'stockId'
      },
      importCardProducts: {
        collection: 'ImportCardProduct',
        via: 'stockId'
      },
      invoiceProducts: {
        collection: 'InvoiceProduct',
        via: 'stockId'
      },
      stockCheckCards: {
        collection: 'StockCheckCard',
        via: 'stockId'
      },

    },
    multitenant: true,
  
  };
  
  