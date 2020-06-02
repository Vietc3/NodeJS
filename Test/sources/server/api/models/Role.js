/**
 * Role.js
 *
 * @description :: A model definition represents a role.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 150,
      unique: true
    },
    deletedAt: {
      type: 'number',
      example: 1502844074211
    },
    notes: {
      type: 'string'
    },



    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    },

    users: {
      collection: 'User',
      via: 'roleId'
    },
    rolePermissions: {
      collection: 'RolePermission',
      via: 'roleId'
    }
  },
  multitenant: true,

};

