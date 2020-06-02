/**
 * Tenants.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
 
module.exports = {
 
  attributes: {
    host: 'string',
    port: 'number',
    schema: 'boolean',
    adapter: 'string',
    user: 'string',
    password: 'string',
    database: 'string',
    identity: 'string',
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 50,
      example: 'mary.sue@example.com'
    },
    phoneNumber: {
      type: 'string',
      maxLength: 50
    },
  },
};