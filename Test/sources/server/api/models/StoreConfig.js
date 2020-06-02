/**
 * StoreConfig.js
 *
 * @description :: A model definition represents a customer, a provider or a manufacturer.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type: {
      type: 'string',
    },
    value: {
      type: 'ref',
      columnType: 'longtext',
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
