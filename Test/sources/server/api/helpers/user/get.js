module.exports = {
  description: 'Get user info',

  inputs: {
    req: {
      type: 'ref',
    },
    data: {
      type: 'ref',
      required: true,
    },
  },

  fn: async function (inputs, exits) {
    let { id } = inputs.data;
    let { req } = inputs;
    
    let foundUser = await User.findOne(req, {
      where: { id: id }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });

    if (!foundUser) {
      return exits.success({ status: false, message: sails.__('Người dùng không tồn tại trong hệ thống') });
    }

    return exits.success({ status: true, data: foundUser });
  }

}