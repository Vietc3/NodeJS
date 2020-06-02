module.exports = {
  friendlyName: 'Create database',
  description: 'Create database for new store',
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

    console.log('Create and initialize database for new store');
    console.log('Database name to create: ' + db_name);

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
    dbm.createDatabase(db_name).then(() => {
      config.default.flags = '';
      dbm = dbmigrate.getInstance(true, { env: 'default', config });
      dbm.up().then(()=> {
        console.log('Init database successfully.');
        return exits.success();
      });
    });
  }
};
