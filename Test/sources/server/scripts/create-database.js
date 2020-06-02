module.exports = {
  friendlyName: 'Create database',
  description: '',

  fn: async function () {
    var dotenv = require('dotenv');
    dotenv.config();
    await sails.helpers.database.create('ohstore');
  }
};

