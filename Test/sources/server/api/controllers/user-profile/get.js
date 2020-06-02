module.exports = {

    friendlyName: 'Get User Profile',
  
    description: 'Get one user profile',
  
    inputs: {
  
    },
  
    fn: async function (inputs) {
      let foundUser = await User.findOne(this.req, {
        where: {
          id: this.req.loggedInUser.id,
          deletedAt: 0
        }
      }).intercept({
        name: 'UsageError'
      }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__('Người dùng không tồn tại trong hệ thống')
        });
        return;
      });
  
      if (!foundUser) {
        this.res.status(400).json({
          status: false,
          error: sails.__('Người dùng không tồn tại trong hệ thống')
        });
        return;
      }
      
      if (foundUser.avatar)
        foundUser.avatar = unit8ArrayToBase64(new Buffer.from(foundUser.avatar, 'base64'))

      foundUser = {
        ...foundUser,
        password: "",
      }
  
      this.res.json({
        status: true,
        data: foundUser
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
  