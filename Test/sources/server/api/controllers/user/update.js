module.exports = {


  friendlyName: 'Update Profile',


  description: 'Update user profile.',

  inputs: {
    email: {
      type: 'string'
    },
    fullName: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    birthday: {
      type: 'number'
    },
    phoneNumber: {
      type: 'string',
      maxLength: 50
    },
    gender: {
      type: 'string',
      maxLength: 7
    },
    address: {
      type: 'string'
    },
    language: {
      type: 'string',
      maxLength: 50
    },
    avatar: {
      type: 'string'
    },
    isActivated: {
      type: 'number'
    },
    isActive: {
      type: 'number'
    },
    isInvited: {
      type: 'number'
    },
    roleId: {
      type: 'number'
    },
    branchId: {
      type: 'string'
    }
  },

  exits: {
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
  },


  fn: async function (inputs) {
    const {
      email,
      fullName,
      password,
      address,
      phoneNumber,
      isActive,
      roleId,
      branchId,
      language,
      birthday
    } = inputs;
    
    var loggedInUser = this.req.loggedInUser;
    var newEmail = email;
    if (newEmail !== undefined) {
      newEmail = newEmail.toLowerCase();
    }    

    // If the email address is changing, make sure it is not already being used.
    if (newEmail !== loggedInUser.email && this.req.params.id === loggedInUser.id) {
      let conflictingUser = await User.findOne(this.req, {
        email: newEmail
      });
      if (conflictingUser) {
        throw 'emailAlreadyInUse';
      }
    }

    let foundUser = await User.findOne(this.req, { id: this.req.params.id });

    if ( roleId || isActive ) {    
      
      if (parseInt(this.req.params.id) === 1 && foundUser && (foundUser.roleId !== roleId && roleId || isActive !== 1 && isActive ) ) {
        this.res.json({
          status: false,
          error: sails.__('Bạn không quyền sửa tài khoản Admin')
        });
        return;
      }
    }

    var valuesToSet = {
      email: newEmail,
      fullName: fullName,
      birthday: birthday,
      phoneNumber: phoneNumber,
      address: address,
      roleId: roleId,
      branchId: branchId,
      language: language,
      isActive: isActive,
    };

    
    if (password && password !== "") valuesToSet = {
      ...valuesToSet,
      password: await sails.helpers.passwords.hashPassword(password)
    }    
    
    var updateUser = await User.update(this.req, {
      id: this.req.params.id
    }).set(_.pickBy(valuesToSet, value => value !== undefined && value !== null))
    .intercept('E_UNIQUE', () => {
      this.res.json({
        status: false,
        error: sails.__('Email đã tồn tại')
      });
      return;
    }).fetch();

    foundUser= {
      ...foundUser,
      password: "",
      avatar: ""
    }
    
    let infoUser = {
      ...updateUser[0],
      password: "",
      avatar: ""
    }

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.USER,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: this.req.params.id,
      objectContentOld: foundUser,
      objectContentNew: infoUser,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: infoUser,
    });
  }

};
