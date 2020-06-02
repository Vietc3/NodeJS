module.exports = {
  friendlyName: 'Drop database',
  description: 'Drop database for a store',
  inputs: {
    db_name: {
      type: "string"
    }
  },
  exits: {
    success: {},
  },
  fn: async function (inputs, exits) {

    let {
      db_name
    } = inputs;

    var dbmigrate = require('db-migrate');

    var config = {
      default: {
        "host": { "ENV" : "DB_HOST" },
        "user": { "ENV" : "DB_USER" },
        "password" : { "ENV" : "DB_PASSWORD" },
        "database": db_name,
        "driver": "mysql",
        "flags": "-CONNECT_WITH_DB",
        "multipleStatements": true
      }
    };

    var dbm = dbmigrate.getInstance(true, { env: 'default', config });
    dbm.dropDatabase(db_name).then(() => {
      console.log('Drop database successfully.');
      return exits.success();
    });
  }
};
