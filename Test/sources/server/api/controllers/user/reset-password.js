module.exports = {

  friendlyName: 'Reset Password',

  description: 'Reset password.',

  inputs: {
    password: {
      type: 'string'
    },
    confirmpassword: {
      type: 'string'
    },
    resetPasswordToken: {
        type: 'string'
      },
  },
  
  
  fn: async function (inputs) {
    const {
      confirmpassword,
      resetPasswordToken
    } = inputs;

    var foundUser = await User.findOne(this.req, {
        resetPasswordToken: resetPasswordToken
    })

    if (!foundUser) {
      this.res.json({
        status: false,
        error: sails.__("Người dùng không tồn tại trong hệ thống")
      });
      return;
    }

    let new_password = await sails.helpers.passwords.hashPassword(confirmpassword);

    let updatePasswordUser = await User.update(this.req, {
        id: foundUser.id,
      }).set({
        password: new_password,
        resetPasswordToken:''
      }).fetch();

    delete updatePasswordUser.password

    this.res.json({
      status: true,
      data: updatePasswordUser
    })
  }

};
