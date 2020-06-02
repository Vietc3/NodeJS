var DBMigrate = require(`db-migrate`);
const util = require('util');
var mysql = require('mysql');

module.exports = {
  friendlyName: 'reset seed data',
  description: '',
  
  inputs: {
    db: { // --db=main,ohstore
      description: 'array database name',
      type: 'string'
    }
  },

  fn: async function ({db}, exits) {
    db = db.split(',').map(item => item.trim()).filter(item => item !== '');
    if(!db.length) {
      return exits.success({status: false, message: sails.__("Input không hợp lệ")})
    }
    let connections = [];
    
    let mainDb = DBMigrate.getInstance(true).config.dev.database;
    if(db.includes("main") || db.includes(mainDb)) {
      connections.push(_.pick(DBMigrate.getInstance(true).config.dev, ['host', 'user', 'password', 'database']));
    }
    
    db = db.filter(item => item !== 'main' && item !== mainDb);
    if(db.length){
      let queryStr = "select * from tenants INNER join (SELECT schema_name FROM information_schema.schemata) db on db.schema_name = tenants.database where tenants.database in ('" + db.join("', '") + "');";
      
      let foundTenants = await sails.sendNativeQuery(queryStr);
      foundTenants = foundTenants.rows;
      if(foundTenants.length !== db.length) {
        return exits.success({status: false, message: sails.__("Database không tồn tại")})
      }
      
      foundTenants.forEach(item => {
        connections.push({
          "host": item.host,
          "user": item.user,
          "password" : item.password,
          "database": item.database,
        });
      });
    }
    console.log(connections);
    for(let i in connections) {
      let conn = mysql.createConnection(connections[i]);
      let query = util.promisify(conn.query).bind(conn);
      
      await query('delete from customer;');
      await query('delete from debt;');
      await query('delete from deposit;');
      await query('delete from depositcard;');
      await query('delete from exportcard;');
      await query('delete from exportcardproduct;');
      await query('delete from filestorage;');
      await query('delete from importcard;');
      await query('delete from importcardproduct;');
      await query('delete from importreturncard;');
      await query('delete from importreturncardproduct;');
      await query('delete from incomeexpensecard;');
      await query('delete from incomeexpensecarddetail;');
      await query('delete from invoice;');
      await query('delete from invoiceproduct;');
      await query('delete from manufacturingcard;');
      await query('delete from manufacturingcardfinishedproduct;');
      await query('delete from manufacturingcardmaterial;');
      await query('delete from manufacturingformula;');
      await query('delete from movestockcard;');
      await query('delete from movestockcardproduct;');
      await query('delete from ordercard;');
      await query('delete from ordercardproduct;');
      await query('delete from product;');
      await query('delete from productprice;');
      await query('delete from productstock;');
      await query('delete from producttype;');
      await query('delete from productunit;');
      await query('delete from stockcheckcard;');
      await query('delete from stockcheckcardproduct;');
    }
    
    return exits.success({status: true});
  }
};

