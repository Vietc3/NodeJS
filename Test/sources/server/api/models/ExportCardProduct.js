/**
 * ExportCardProduct.js
 *
 * @description :: A model definition represents products of an export card.
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
    quantity: { // Số lượng
      type: 'number'
    },
    unitPrice: { // Giá xuất
      type: 'number'
    },
    discount: { // Chiết khấu
      type: 'number'
    },
    taxAmount: {
      type: 'number'
    },
    finalAmount: { // Tổng giá trị nhà cung câp hay khách hàng cần trả
      type: 'number'
    },
    importProductId: {// id của product import
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
    exportCardId: { 
      model: 'ExportCard'
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
  
  