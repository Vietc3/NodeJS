/**
 * Customer.js
 *
 * @description :: A model definition represents a customer, a provider or a manufacturer.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 150,
    },
    code: {
      type: 'string',
      maxLength: 50,
      unique: true
    },
    address: {
      type: 'string',
      maxLength: 250
    },
    tel: {
      type: 'string',
      maxLength: 100
    },
    fax: {
      type: 'string',
      maxLength: 50
    },
    mobile: {
      type: 'string',
      maxLength: 100
    },
    email: {
      type: 'string',
      maxLength: 50
    },
    gender: {
      type: 'string',
      maxLength: 50
    },
    birthday: {
      type: 'number',
      example: 1502844074211
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    type: {
      type: 'number',
      required: true
    },
    group: {
      type: 'string',
      maxLength: 50
    },
    totalIn: {
      type: 'number'
    },
    totalOut: {
      type: 'number'
    },
    totalOutstanding: {
      type: 'number'
    },
    maxDeptAmount: {
      type: 'number'
    },
    maxDeptDays: {
      type: 'number',
    },
    taxCode: {
      type: 'string',
      maxLength: 50
    },
    totalDeposit: {
      type: 'number'
    },
    initialDeptAmount: {
      type: 'number'
    },
    fix: {
      type: 'number',
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    province: {
      type: "string",
      maxLength: 250,
    },
    district:{
      type: "string",
      maxLength: 250,
    },
    commune:{
      type: "string",
      maxLength: 250,
    },
    branchId: { // Chi nhánh
      model: 'Branch'
    },
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },
    customerId: { // Nhà cung cấp
      model: 'Customer'
    },
    products: {
      collection: 'Product',
      via: 'customerId'
    },
    invoices: {
      collection: 'Invoice',
      via: 'customerId'
    },
    deposits: {
      collection: 'DepositCard',
      via: 'customerId'
    },
    debts : {
      collection: 'Debt',
      via: 'customerId'
    }
  },
  multitenant: true,

};

