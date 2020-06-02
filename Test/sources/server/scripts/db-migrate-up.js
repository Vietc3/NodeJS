var DBMigrate = require(`db-migrate`);

module.exports = {
  friendlyName: 'migrate up',
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
    result = await (c ? mainDb.up(c) : mainDb.up())
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
      result = await (c ? newDbMigrate.up(c) : newDbMigrate.up())
      if(result) console.log(result.map(item => item.name));
    }
  }
};

