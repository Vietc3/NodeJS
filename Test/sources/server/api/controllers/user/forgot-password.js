module.exports = {

  friendlyName: ' Forgot Password',

  description: 'Forgot Password.',

  inputs: {
    email: {
      type: 'string'
    },
  },

  fn: async function (inputs, exits) {
    let { email } = inputs;
    let url = this.req.headers.origin + sails.config.constant.FORGOT_PASSWORD;

    let foundUser = await User.findOne(this.req, {
        email: email
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.config.constant.INTERCEPT.UsageError});
      });
    
      if (!foundUser) {
        return exits.success({status: false, message: "Email không tồn tại"});
      }
      if ( foundUser.isAction === 0 ) {
        return exits.success({status: false, message: "Không thể đăng nhập vì tài khoản đã bị khóa"});
      }
    let updateUser = await User.update(this.req, {id: foundUser.id }).set({
      resetPasswordToken: await sails.helpers.strings.random('url-friendly')
    }).fetch();

    let content = sails.config.changePasswordMailContent(foundUser.fullName, foundUser.email, url + "/"+ updateUser[0].resetPasswordToken);

    let updateUsePassWord = await sails.helpers.common.sendMail({ from: process.env.DEFAULT_EMAIL_FROM, to: email, subject: content.subject, html: content.html })

    this.res.json(updateUsePassWord);
  }
};
