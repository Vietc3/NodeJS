/**
 * ActionLog.js
 *
 * @description :: A model definition represents action of store.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    userId: {
      type: "number" // 0: hệ thống, 1,2,3,4... user
    },
    function: {
      type: "number" // 1: xác thực tk đăng nhập, 2: sản phẩm, 3: đơn hàng, 
      // 4: trả hàng, 5: nhập hàng, 6: trả hàng nhập, 7: đặt hàng bán, 8: đặt hàng nhập,
      // 9: phiếu thu, 10: phiếu chi, 11: đặt cọc, 12: công nợ, 13: khách hàng, 14: NCC, 15: CN, 16: Kho, 17: Kiểm kho
    },
    action: {
      type: "number" // 1: Đăng nhập, 2: Thêm mới, 3: Cập nhật, 4: Hủy, 5: Xóa, 6: Ngừng KD, 7: Điều chỉnh
    },
    objectId: {
      type: "number"
    },
    objectContentOld: {
      type: "string"
    }, 
    objectContentNew: {
      type: "string"
    },    
    deviceInfo: {
      type: "string"
    },
    branchId: {
      type: "number"
    },

  },
  multitenant: true,

};

