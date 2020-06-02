/**
 * Branch.js
 *
 * @description :: A model definition represents a branch.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      email: {
        type: 'string',
        isEmail: true,
        maxLength: 50,
        example: 'mary.sue@example.com',
        allowNull: true
      },
      name: {
        type: 'string',
        required: true,
        maxLength: 150
      },
      status: {
        type: 'number' // 1: Đang hoạt động, 2: Ngừng hoạt động
      },
      phoneNumber: {
        type: 'string',
        maxLength: 50,
        allowNull: true
      },
      address: {
        type: 'string',
        allowNull: true
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

      manufacturingcards: {
        collection: 'ManufacturingCard',
        via: 'branchId'
      },
      invoices: {
        collection: 'Invoice',
        via: 'branchId'
      },
      customers: {
        collection: 'Customer',
        via: 'branchId'
      },
      depositcards: {
        collection: 'DepositCard',
        via: 'branchId'
      },
      exportcards: {
        collection: 'ExportCard',
        via: 'branchId'
      },
      importcards: {
        collection: 'ImportCard',
        via: 'branchId'
      },
      incomeexpensecards: {
        collection: 'IncomeExpenseCard',
        via: 'branchId'
      },
      movestockcards: {
        collection: 'MoveStockCard',
        via: 'branchId'
      },
      productprices: {
        collection: 'ProductPrice',
        via: 'branchId'
      },
      productstocks: {
        collection: 'ProductStock',
        via: 'branchId'
      },
      stocks: {
        collection: 'Stock',
        via: 'branchId'
      },

    },
    multitenant: true,
  
  };
  
  