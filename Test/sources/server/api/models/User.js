/**
 * User.js
 *
 * @description :: A model definition represents a user.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 50,
      example: 'mary.sue@example.com'
    },
    fullName: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s name.',
      maxLength: 150,
      example: 'Mary Sue van der McHenst'
    },
    isAdmin: {
      type: 'boolean',
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
    },
    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },
    birthday: {
      type: 'number',
      example: 1502844074211
    },
    phoneNumber: {
      type: 'string',
      maxLength: 50
    },
    gender: {
      type: 'string',
      maxLength: 7
    },
    address: {
      type: 'string'
    },
    language: {
      type: 'string',
      maxLength: 50
    },
    isActivated: {
      type: 'boolean'
    },
    isActive: {
      type: 'boolean'
    },
    isInvited: {
      type: 'boolean'
    },
    registrationToken: {
      type: 'string'
    },
    resetPasswordToken: {
      type: 'string'
    },
    avatar: {
      type: 'ref',
      columnType: 'mediumblob',
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    branchId: {
      type: 'string',
    },
    roleId: {
      model: 'Role'
    },
    incomeExpenseCards: {
      collection: 'IncomeExpenseCard',
      via: 'createdBy'
    },
    incomeExpenseCards: {
      collection: 'IncomeExpenseCard',
      via: 'updatedBy'
    },
    productstocks: {
      collection: 'ProductStock',
      via: 'createdBy'
    },
    productstocks: {
      collection: 'ProductStock',
      via: 'updatedBy'
    },
    productprices: {
      collection: 'ProductPrice',
      via: 'createdBy'
    },
    productprices: {
      collection: 'ProductPrice',
      via: 'updatedBy'
    },
    branchs: {
      collection: 'Branch',
      via: 'createdBy'
    },
    branchs: {
      collection: 'Branch',
      via: 'updatedBy'
    },
    invoices: {
      collection: 'Invoice',
      via: 'userId'
    },
    invoices: {
      collection: 'Invoice',
      via: 'createdBy'
    },
    invoices: {
      collection: 'Invoice',
      via: 'updatedBy'
    },
    productTypes: {
      collection: 'ProductType',
      via: 'createdBy'
    },
    productTypes: {
      collection: 'ProductType',
      via: 'updatedBy'
    },
    productUnits: {
      collection: 'ProductUnit',
      via: 'createdBy'
    },
    productUnits: {
      collection: 'ProductUnit',
      via: 'updatedBy'
    },
    roles: {
      collection: 'Role',
      via: 'createdBy'
    },
    roles: {
      collection: 'Role',
      via: 'updatedBy'
    },
    stockCheckCards: {
      collection: 'StockCheckCard',
      via: 'createdBy'
    },
    stockCheckCards: {
      collection: 'StockCheckCard',
      via: 'updatedBy'
    },
    customers: {
      collection: 'Customer',
      via: 'createdBy'
    },
    customers: {
      collection: 'Customer',
      via: 'updatedBy'
    },
    deposits: {
      collection: 'DepositCard',
      via: 'createdBy'
    },
    deposits: {
      collection: 'DepositCard',
      via: 'updatedBy'
    },
    fileStorages: {
      collection: 'FileStorage',
      via: 'createdBy'
    },
    fileStorages: {
      collection: 'FileStorage',
      via: 'updatedBy'
    },
    importCards: {
      collection: 'ImportCard',
      via: 'createdBy'
    },
    importCards: {
      collection: 'ImportCard',
      via: 'updatedBy'
    },
    debts: {
      collection: "Debt",
      via: "createdBy"
    },
    debts: {
      collection: "Debt",
      via: "updatedBy"
    },
    incomeExpenseCardTypes: {
      collection: 'IncomeExpenseCardType',
      via: 'createdBy'
    },
    incomeExpenseCardTypes: {
      collection: 'IncomeExpenseCardType',
      via: 'updatedBy'
    },
    products: {
      collection: 'Product',
      via: 'createdBy'
    },
    products: {
      collection: 'Product',
      via: 'updatedBy'
    },
    moveStockCards: {
      collection: 'MoveStockCard',
      via: 'createdBy'
    },
    moveStockCards: {
      collection: 'MoveStockCard',
      via: 'updatedBy'
    },
    moveStockCards: {
      collection: 'MoveStockCard',
      via: 'movedBy'
    },
    stocks: {
      collection: 'Stock',
      via: 'updatedBy'
    },
    stocks: {
      collection: 'Stock',
      via: 'createdBy'
    },
    counters: {
      collection: 'Counter',
      via: 'updatedBy'
    },
    counters: {
      collection: 'Counter',
      via: 'createdBy'
    },
  },
  multitenant: true,

};

