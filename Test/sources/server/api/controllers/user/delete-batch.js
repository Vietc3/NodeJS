module.exports = {
    friendlyName: "Delete Multiple User",
  
    description: "Delete multiple user",
  
    inputs: {
      ids: {
        type: 'json'
      },
    },
  
    fn: async function (inputs) {
      let ids = inputs.ids;
  
      if (!ids || !Array.isArray(ids) || !ids.length) {
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      }

      //kiểm tra xem user có tự xóa chính mình không
      let findLoggedInUser = ids.find(item => item === this.req.loggedInUser.id);
      if(findLoggedInUser){
        this.res.json({
          status: false,
          error: sails.__('Bạn không được xóa tài khoản của chính mình')
        });
        return;
      }

      let findAdmin = ids.find(item => item === 1);

      if (findAdmin) {
        this.res.json({
          status: false,
          error: sails.__('Bạn không được quyền xóa tài khoản Admin')
        });
        return;
      }

      let foundUser = await User.find(this.req, { id: { in: ids } })

      let deletedUsers = await User.update(this.req, { id: { in: ids } }).set({
        deletedAt: new Date().getTime(),
        updatedBy: this.req.loggedInUser.id
      }).intercept({ name: 'UsageError' }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      }).fetch();
      
      let promises = [];
      for(let user of deletedUsers) {
        promises.push(User.update(this.req, {id: user.id}).set({
          email: user.email.replace('@', `_deleted_${new Date().getTime()}@`)
        }).fetch());
      }
      
      deletedUsers = await Promise.all(promises);

      // tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(this.req, {
        userId: this.req.loggedInUser.id,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.USER,
        action: sails.config.constant.ACTION.DELETE,
        objectContentOld: foundUser.map(item => ({...item, password: "", avatar: ""})),
        objectContentNew: deletedUsers.map(item => ({...item[0], password: "", avatar: ""})),
        deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
        branchId: this.req.headers['branch-id']
      })

      if (!createActionLog.status) {
        return createActionLog
      }
  
      this.res.json({
        status: true,
        data: deletedUsers
      });
    }
  };
  