/******************************************************************/
/* Briefing:                                                      */ 
/* The default database configured in datasource is "multitenant" */
/* have a table with all Tenant named Tenants. We created a model */
/* Tenant to get the tenants based on the domain.                 */
/*                                                                */
/******************************************************************/
const Datasource = require('mutilTenant/datasource');

module.exports.multitenancy = function(req){
  // We call the tenants model defined in our sails app
  const Tenants = sails.models.tenants;
  // this function require return a Promise
  return new Promise(async (resolve, reject) => {
    let isMultitenant = process.env.MULTI_TENANT === 'Y' && process.env.DB_IDENTITY !== undefined && process.env.DB_IDENTITY.length > 0;
    let datasource = {};
    let identity; // anything
    
    if(typeof req === 'string') {
      identity = req;
    } else if(req && req.headers && req.headers.origin){
      let url = new URL(req.headers.origin);
      identity = url.hostname;
    }

    if(!isMultitenant || (isMultitenant && identity === process.env.DB_IDENTITY)) {
      datasource = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        schema: true,
        adapter: 'sails-mysql',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        identity: identity || 'demo',
      };
    } else {
      // kiểm tra identity có hợp lệ
      if(!(identity && typeof identity === 'string' && identity.length > 0)) {
        reject({
          status: false,
          message: sails.__("Thông tin cửa hàng không hợp lệ")
        });
      }
      
      datasource = await Tenants.findOne({
        identity
      });
      if(datasource) datasource = _.pick(datasource, ['host', 'port', 'schema', 'adapter', 'user', 'password', 'database', 'identity']);
    }
    
    // Return a Datasource object
    resolve(new Datasource(datasource));
  });
}