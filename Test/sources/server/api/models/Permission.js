/**
 * Permission.js
 *
 * @description :: A model definition represents a permission.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 150,
      unique: true,
    },
    description: {
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

    rolePermissions: {
      collection: 'RolePermission',
      via: 'permissionId'
    }
  },
  multitenant: true,
};

