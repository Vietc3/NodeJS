const jwt = require("jsonwebtoken");
module.exports = {
  friendlyName: "Create Debt, CashBook, Income/Expense",

  description: "Create debt, cashbook, income/expense",

  inputs: {
    permissionName: {
      type: 'string',
    },
    type: {
      type: 'number'
    },
    req: {
      type: 'ref',
    }
  },

  fn: function (inputs) {
    var {
      permissionName,
      type,
      req
    } = inputs;
    
    if(permissionName){
      if (req.header("authorization")) {
        let token = req.header("authorization").split("JWT ")[1];
        if (!token) return false;
        return jwt.verify(token, sails.config.jwt_secret, async function(err, payload) {
          if (err) return false;
          if(payload.user){
            let getPermission = await sails.helpers.user.getPermission(req, {userId: payload.user.id});
            if( getPermission.dataPermisson[permissionName] >= type ){
              return true;
            }
          }
        });
      }
      return false;
    }
    else
      return true;
  }
};
  