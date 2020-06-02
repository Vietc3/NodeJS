module.exports = {
    friendlyName: "Delete User",
  
    description: "Delete a user.",
  
    inputs: {
  
    },
    fn: async function (inputs) {
      //kiểm tra xem user có tự xóa chính mình không
      if(this.req.loggedInUser.id == this.req.params.id){
        this.res.json({
          status: false,
          error: sails.__('Bạn không được xóa tài khoản của chính mình')
        });
        return;
      }

      // Kiểm tra email có tồn tại
      let foundUser = await User.findOne(this.req, {id: this.req.params.id});
      
      if(!foundUser) {
        return this.res.json({
          status: false,
          error: sails.__('Người dùng không tồn tại trong hệ thống')
        });
      }
      
      let updateUser = await User.update(this.req, {
        id: this.req.params.id
      }).set({
        email: foundUser.email.replace('@', `_deleted_${new Date().getTime()}@`),
        deletedAt: new Date().getTime(),
        updatedBy: this.req.loggedInUser.id
      }).intercept({
        name: 'UsageError'
      }, () => {
        this.res.json({
          status: false,
          error: sails.__('Người dùng không tồn tại trong hệ thống')
        });
        return;
      }).fetch();
  
      this.res.json({
        status: true,
        data: updateUser[0]
      });
    }
  };
  