module.exports = {

  friendlyName: 'Get Avatar',

  description: 'Get one avatar',

  inputs: {

  },

  fn: async function (inputs) {
    let foundUser = await User.findOne(this.req, {
      where: {
        id: this.req.loggedInUser.id,
        deletedAt: 0
      },
      select:[ 'avatar' ]
    }).intercept({
      name: 'UsageError'
    }, () => {
      return ({
        status: false,
        error: sails.__('Người dùng không tồn tại trong hệ thống')
      });
    });

    if (!foundUser) {
      return ({
        status: false,
        error: sails.__('Người dùng không tồn tại trong hệ thống')
      });
    }
    
    if (foundUser.avatar)
      foundUser.avatar = unit8ArrayToBase64(new Buffer.from(foundUser.avatar, 'base64'))

    return ({
      status: true,
      data: foundUser.avatar
    });
  }

};

function unit8ArrayToBase64(unit8Array) {
  let binary = '';

  for (let i = 0; i < unit8Array.byteLength; i++) {
      binary += String.fromCharCode(unit8Array[i])
  }

  return binary;
};
  