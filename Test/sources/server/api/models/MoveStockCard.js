/**
 * MoveStockCard.js
 *
 * @description :: A model definition represents a move stock card.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    code: { // Mã phiếu
      type: 'string',
      maxLength: 50,
      unique: true,
    },
    movedAt: { // Ngày chuyển hàng
      type: 'number',
      example: 1502844074211,
      required: true
    },
    notes: { // Ghi chú
      type: 'string',
      maxLength: 250,
    },
    // IMPORT: {id: 1, name: 'Nhập kho sản xuất'},
    // EXPORT_FINISHED_PRODUCT: {id: 2, name: 'Xuất thành phẩm'},
    // EXPORT_RETURN: {id: 3, name: 'Xuất trả lại'},
    reason: { // Lí do chuyển hàng
      type: 'number',
      required: true,
    },
    status: { // Trạng thái phiếu (1 - finished, 2 - canceled)
      type: 'number',
      required: true,
    },
    reference: { // Tham chiếu
      type: 'string',
      maxLength: 150,
    },
    deletedAt: { // Ngày xóa
      type: 'number',
      example: 1502844074211
    },
    branchId: { // Chi nhánh
      model: 'Branch'
    },
    movedBy: {
      model: 'User'
    },
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },
    moveStockCardProducts: {
      collection: 'MoveStockCardProduct',
      via: 'moveStockCardId'
    }
  },
  multitenant: true,
};

