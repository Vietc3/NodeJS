module.exports = {

  friendlyName: 'Create User',

  description: 'Sign up for a new user account.',

  inputs: {
    email: {
      required: true,
      type: 'string',
      isEmail: true,
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 150,
    },

    fullName: {
      required: true,
      type: 'string',
    },
    roleId: {
      required: true,
      type: 'number',
    },
    branchId: {
      required: true,
      type: 'string',
    },
    phoneNumber: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    isActivated: {
      type: 'boolean',
    },
    isActive: {
      type: 'number',
    },

    birthday: {
      type: 'number',
    },

  },


  exits: {
    success: {
      description: 'New user account was created successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
    },

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
      isActivated,
      isActive,
      roleId,
      branchId,
      birthday
    } = inputs;
    
    let createdUser = await sails.helpers.user.create(this.req, {
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
      createdBy: this.req.loggedInUser.id,
      isActionLog: true
    });

    return createdUser;
  }

};
