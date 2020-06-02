const bcrypt = require("bcryptjs")

module.exports = {


  friendlyName: 'Update Password',


  description: 'Update password.',

  inputs: {
    password: {
      type: 'string'
    },
    newpassword: {
      type: 'string'
    },
  },
  
  fn: async function (inputs) {
    const {
      password,
      newpassword
    } = inputs;

    var loggedInUser = this.req.loggedInUser;

    var foundUser = await User.findOne(this.req, {
      id: loggedInUser.id
    })

    if (!foundUser) {
      this.res.json({
        status: false,
        error: sails.__("Người dùng không tồn tại trong hệ thống")
      });
      return;
    }

    await sails.helpers.passwords.checkPassword(password, foundUser.password)
      .intercept("incorrect", () => {
        this.res.json({
          status: false,
          error: sails.__("Mật khẩu không đúng")
        })
        return;
      })

    if(password === newpassword)
    {
      this.res.json({
        status: false,
        error: sails.__("Mật khẩu mới phải khác mật khẩu hiện tại")
      })
      return;
    }

    let new_password = await sails.helpers.passwords.hashPassword(newpassword);

    let updatePasswordUser = await User.update(this.req, {
        id: loggedInUser.id
      }).set({
        password: new_password
      }).fetch();

    this.res.json({
      status: true,
    })
  }

};
