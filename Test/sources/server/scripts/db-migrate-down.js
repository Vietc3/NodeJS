var DBMigrate = require(`db-migrate`);
const Datasource = require('mutilTenant/datasource');

module.exports = {
  friendlyName: 'migrate down',
  description: '',
  
  inputs: {
    c: {
      description: 'number of migration script will be execute.',
      type: 'number'
    }
  },

  fn: async function ({c}) {
    let foundTenants = await sails.sendNativeQuery("select * from tenants INNER join (SELECT schema_name FROM information_schema.schemata) db on db.schema_name = tenants.database");
    foundTenants = foundTenants.rows;
    
    let mainDb = DBMigrate.getInstance(true);
    let result = null;
    console.log("DATABASE: " + mainDb.config.dev.database);
    result = await (c ? mainDb.down(c) : mainDb.down())
    if(result) console.log(result.map(item => item.name));
    for(let db of foundTenants) {
      let newDbMigrate = DBMigrate.getInstance(true, {
        config: {
          dev: {
            "host": db.host,
            "user": db.user,
            "password" : db.password,
            "database": db.database,
            "driver": "mysql",
            "multipleStatements": true
          }
        }
      });
      console.log("DATABASE: " + db.database);
      result = await (c ? newDbMigrate.down(c) : newDbMigrate.down())
      if(result) console.log(result.map(item => item.name));
    }
  }
};

