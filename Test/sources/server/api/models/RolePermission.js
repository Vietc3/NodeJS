/**
 * RolePermission.js
 *
 * @description :: A model definition represents a role and permission.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    roleId: {
      model: 'Role',
      required: true,
    },
    permissionId: {
      model: 'Permission',
      required: true,
    },
    type: { //0: không phân quyền, 1: xem, 2: xem và sửa
      type: 'number',
      required: true,
    },
    

    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    }
  },
  multitenant: true,

};
  
  