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

const jwt = require("jsonwebtoken");

module.exports = async function(req, res, proceed) {
  if (req.header("authorization")) {
    // if one exists, attempt to get the header data
    var token = req.header("authorization").split("JWT ")[1];
    
    // if there's nothing after "JWT", no go
    if (!token) return res.status(403).send({message: sails.__("Không tìm thấy token")});
    // if there is something, attempt to parse it as a JWT token
    return jwt.verify(token, sails.config.jwt_secret, async function(err, payload) {
      if (err || !payload.user) return res.status(403).send({message: sails.__("Token không hợp lệ")});
      // check if this user still exist in User
      var userRecord = await User.findOne(req, {
        email: payload.user.email.toLowerCase()
      });

      // check user is activated or not
      // ...
      
      // check store expiry
      let storeInfo = (await StoreConfig.findOne(req, {type: 'store_info'})).value;
      let expirydate = _.isJson(storeInfo) ? JSON.parse(storeInfo).expirydate : null;

      if(expirydate && _.moment(expirydate, 'x').isValid() && _.moment(expirydate, 'x') < _.moment()){
        return res.status(403).send({message: sails.__("Hết hạn dùng thử cửa hàng")});
      }

      if (!userRecord) return res.status(403).send({message: sails.__("Không tìm thấy thông tin người dùng")});

      // Expose the user record as an extra property on the request object (`req.loggedInUser`).
      // > Note that we make sure `req.loggedInUser` doesn't already exist first.
      if (req.loggedInUser !== undefined) {
        throw new Error(
          "Cannot attach logged-in user as `req.loggedInUser` because this property already exists!  (Is it being attached somewhere else?)"
        );
      }

      req.loggedInUser = userRecord;

      return proceed();
    });
  }

  return res.status(403).send({message: sails.__("Không thể xác thực yêu cầu")});
};
