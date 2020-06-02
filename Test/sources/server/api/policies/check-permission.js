/**
 * JWT Auth Policy
 *
 * Simple policy to allow any authenticated user via JWT token
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 *
 */
// const jwt = require("jsonwebtoken");
module.exports = function(permissionName, type) {
  return async function (req, res, proceed) {
    let check = true;

    if ( typeof(permissionName) === "string"){

    check = check && (await sails.helpers.checkPermission(permissionName, type, req));

    } else {
      
      if (permissionName.or) {
      let promises = [];
        _.forEach(permissionName.or, item =>{
          let name = Object.keys(item)[0];

          promises.push(sails.helpers.checkPermission(name, item[name], req));

        })
        check = check && (await Promise.all(promises)).some(item => item === true)
        
      }

      if (permissionName.and) {
        let promises = [];
          _.forEach(permissionName.and, item =>{
            let name = Object.keys(item)[0];
  
            promises.push(sails.helpers.checkPermission(name, item[name], req));
  
          })
          check = check && (await Promise.all(promises)).every(item => item === true)
      }
    }
    if(check) return proceed()

    return res.status(403).send({message: sails.__("Không đủ quyền để thực hiện yêu cầu")});
  }
}