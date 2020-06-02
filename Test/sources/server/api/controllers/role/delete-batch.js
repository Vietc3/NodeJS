module.exports = {
  friendlyName: "Delete Role",

  description: "Delete role",

  inputs: {
    ids: {
      type: 'json'
    },
  },

  fn: async function (inputs) {
    let ids = inputs.ids;

    if (!ids || !Array.isArray(ids) || !ids.length) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }

    let findAdmin = ids.find(item => item === 1);

    if (findAdmin) {
      this.res.json({
        status: false,
        error: sails.__('Bạn không được quyền xóa bộ phận Admin')
      });
      return;
    }
    
    let foundUser = await User.find(this.req, { roleId: { in: ids } })
    
    if(foundUser.length > 0){
      this.res.json({
        status: false,
        error: sails.__('Không thể xóa vì đã được gán cho 1 số người dùng')
      });
      return;
    }

    let foundRole = await Role.find(this.req, { id: { in: ids } });

    let deletedRoles = await Role.update(this.req, { id: { in: ids } }).set({
      deletedAt: new Date().getTime(),
      updatedBy: this.req.loggedInUser.id
    }).intercept({ name: 'UsageError' }, () => {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }).fetch();

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.ROLE,
      action: sails.config.constant.ACTION.DELETE,
      objectContentOld: foundRole,
      objectContentNew: deletedRoles,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: deletedRoles
    });
  }
};
