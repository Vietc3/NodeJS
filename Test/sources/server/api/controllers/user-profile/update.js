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
      type: 'boolean'
    },
    isActive: {
      type: 'boolean'
    },
    isInvited: {
      type: 'boolean'
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
      address,
      phoneNumber,
      birthday,
      gender,
      avatar,
    } = inputs;    

    var loggedInUser = this.req.loggedInUser;
    var newEmail = email;
    if (newEmail !== undefined) {
      newEmail = newEmail.toLowerCase();
    }

    // If the email address is changing, make sure it is not already being used.
    if (newEmail !== loggedInUser.email) {
      let conflictingUser = await User.findOne(this.req, {
        email: newEmail
      });
      if (conflictingUser) {
        this.res.json({
          status: false,
          error: sails.__('Email đã tồn tại')
        });
        throw 'emailAlreadyInUse';
      }
    }

    var valuesToSet = {
      email: newEmail,
      fullName: fullName,
      birthday: birthday,
      phoneNumber: phoneNumber,
      address: address,
      gender: gender,
      avatar: avatar,
    };

    var updateUser = await User.update(this.req, {
      id: loggedInUser.id
    }).set(valuesToSet).fetch();

    let infoUser = {
      ...updateUser[0],
      password: ""
    }

    this.res.json({
      status: true,
      data: infoUser,
    });
  }

};
