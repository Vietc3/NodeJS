/**
 * OrderCard.js
 *
 * @description :: A model definition represents an order card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const _ = require("lodash");
module.exports = {

  attributes: {
    code: {
      type: 'string',
      maxLength: 50,
      unique: true
    },
    totalAmount: {
      type: 'number'
    },
    discountAmount: {
      type: 'number'
    },
    taxAmount: {
      type: 'number'
    },
    finalAmount: {
      type: 'number'
    },
    deliveryAmount: {
      type: 'number'
    },
    deliveryAddress: {
      type: 'string',
    },
    deliveryType: {  // 1: nhận tại cửa hàng, 2: giao hàng tận nơi, 3: khác
      type: 'number',
    },
    status: { // 1: Đặt hàng, 2: Hoàn thành, 3: Hủy
      type: 'number',
      required: true,
    },
    type: { // 1 là xuất, 2 là nhập
      type: 'number',
      required: true,
    },
    customerId: {
      model: 'Customer'
    },
    paidAmount: { //Tổng tiền khách đã trả
      type: 'number'
    },
    debtAmount: { // Tổng tiền khách còn nợ
      type: 'number'
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    branchId: {
      type: 'number'
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    orderAt: {
      type: 'number',
      example: 1502844074211
    },
    expectedAt: { // Ngày dự kiến
      type: 'number',
      example: 1502844074211
    },
    
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },
    

    orderCardProducts: {
      collection: 'OrderCardProduct',
      via: 'orderCardId'
    }
  },
  multitenant: true,
  
};

