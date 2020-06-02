/**
 * Branch.js
 *
 * @description :: A model definition represents a branch.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      code: {
        type: 'string',
        required: true,
        unique: true,
      },
      value: {
        type: 'ref',
        columnType: 'longtext',
        required: true,
      },
      
      createdBy: {
        model: 'User'
      },
      updatedBy: {
        model: 'User'
      },
    },
    multitenant: true,
  
  };
  
  