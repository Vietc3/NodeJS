/**
 * ImportReturnCardProduct.js
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
      maxLength: 150,
    },
    quantity: { // Số lượng
      type: 'number'
    },
    returnUnitPrice: { // Giá nhập lại
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
    notes: { // Ghi chú
      type: 'string',
      maxLength: 250,
    },
    deletedAt: { // Ngày xóa
      type: 'number',
      example: 1502844074211
    },
    importReturnCardId: { 
      model: 'ImportReturnCard'
    },
    productId: {
      model: 'Product'
    }
  },
  multitenant: true,
};
  
  