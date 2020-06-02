/**
 * MoveStockCardProduct.js
 *
 * @description :: A model definition represents products of move stock card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    productCode: { // Mã sản phẩm
      type: 'string',
      maxLength: 50,
    },
    productName: { // Tên sản phẩm
      type: 'string',
    },
    productUnit: { // Tên sản phẩm
      type: 'string',
      maxLength: 150,
    },
    quantity: { // Số lượng
      type: 'number'
    },
    notes: { // Ghi chú
      type: 'string',
      maxLength: 250,
    },
    deletedAt: { // Ngày xóa
      type: 'number',
      example: 1502844074211
    },
    moveStockCardId: { 
      model: 'MoveStockCard'
    },
    productId: {
      model: 'Product'
    },
    stockId: {// id của kho
      model: 'Stock'
    },
  },
  multitenant: true,
};
  
  