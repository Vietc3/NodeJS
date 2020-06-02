module.exports = {

  friendlyName: 'Get User',

  description: 'Get one user',

  inputs: {

  },

  fn: async function (inputs) {
    let foundUser = await User.findOne(this.req, {
      where: {
        id: this.req.params.id,
        deletedAt: 0
      }
    }).intercept({
      name: 'UsageError'
    }, () => {
      return ({
        status: false,
        message: sails.__('Người dùng không tồn tại trong hệ thống')
      });
    });

    if (!foundUser) {
      return ({
        status: false,
        message: sails.__('Người dùng không tồn tại trong hệ thống')
      });
    }

    delete foundUser.password;

    return ({
      status: true,
      data: foundUser
    });
  }

};
