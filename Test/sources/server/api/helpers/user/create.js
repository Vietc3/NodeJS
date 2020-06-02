module.exports = {
  description: 'Get user info',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: 'ref',
      required: true,
    },
  },

  fn: async function (inputs, exits) {
    let { 
      email,
      fullName,
      password,
      address,
      phoneNumber,
      isActivated,
      isActive,
      roleId,
      branchId,
      birthday,
      createdBy,
      isActionLog
    } = inputs.data;
    
    let {req} = inputs;
    var newEmail = email.toLowerCase();
    
    // kiểm tra email đã tồn tại chưa
    var newUserRecord = await User.create(req, _.extend({
        email: newEmail,
        password: await sails.helpers.passwords.hashPassword(password),
        fullName,
        address,
        isAdmin: roleId == 1 ? true : false,
        phoneNumber,
        isActivated,
        isActive,
        roleId,
        branchId,
        birthday,
      }, sails.config.custom.verifyEmailAddresses ? {
        registrationToken: await sails.helpers.strings.random('url-friendly'),
      } : {
        isActivated: true
      }))
      .intercept('E_UNIQUE', () => {
        return exits.success({
          status: false,
          message: sails.__('Email đã tồn tại')
        });
      })
      .intercept({
        name: 'UsageError'
      }, 'invalid')
      .fetch();

    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      await sails.helpers.sendTemplateEmail.with({
        to: newEmail,
        subject: 'Please confirm your account',
        template: 'email-verify-account',
        templateData: {
          fullName: fullName,
          token: newUserRecord.registrationToken
        }
      });
    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }
    

    let newUser = {
      ...newUserRecord,
      password: ""
    }

    // tạo nhật kí
    if(isActionLog) {
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.USER,
        action: sails.config.constant.ACTION.CREATE,
        objectId: newUser.id,
        objectContentNew: newUser,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId: req.headers['branch-id']
      })
    }
    
    return exits.success({
      status: true,
      data: newUser,
    });
  }

}