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
      type: 'number'
    },
  },

  exits: {
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
  },


  fn: async function (inputs) {
    var loggedInUser = this.req.loggedInUser;
    var newEmail = inputs.email;
    if (newEmail !== undefined) {
      newEmail = newEmail.toLowerCase();
    }

    // If the email address is changing, make sure it is not already being used.
    if (newEmail !== loggedInUser.email) {
      let conflictingUser = await User.findOne(this.req, { email: newEmail });
      if (conflictingUser) {
        throw 'emailAlreadyInUse';
      }
    }

    // Start building the values to set in the db.
    var valuesToSet = {
      email: newEmail,
      fullName: inputs.fullName,
      birthday: inputs.birthday,
      phoneNumber: inputs.phoneNumber,
      gender: inputs.gender,
      address: inputs.address,
      language: inputs.language,
      avatar: inputs.avatar,
    };

    // Save to the db
    await User.update(this.req, { id: loggedInUser.id })
      .set(valuesToSet)
      .fetch();

    // TODO: If an email address change was requested, and re-confirmation is required,

  }

};