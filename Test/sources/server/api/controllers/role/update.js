module.exports = {
  friendlyName: "Update Role",

  description: "Update a role.",

  inputs: {
    name: {
      type: "string",
    },
    notes: {
      type: "string",
    },
    type: {
      type: 'json',
      required: true,
    },

  },

  fn: async function (inputs) {
    var {
      name,
      notes,
      type,
    } = inputs;
    
    if (parseInt(this.req.params.id) === 1) {
      this.res.json({
        status: false,
        error: sails.__('Bạn không quyền sửa bộ phận Admin')
      });
      return;
    }

    let foundRole = await Role.findOne(this.req, { id: this.req.params.id });

    var updatedRole = await Role.update(this.req, {
      id: this.req.params.id
    }).set({
      name: name,
      notes: notes,
      updatedBy: this.req.loggedInUser.id
    }).intercept("E_UNIQUE", () => {
      this.res.json({
        status: false,
        error: sails.__('Tên bộ phận đã tồn tại')
      });
      return;
    }).intercept({
      name: 'UsageError'
    }, () => {
      this.res.json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }).fetch();

    // update type in RolePermission table
    let foundRolePermission = await RolePermission.find(this.req, { roleId: this.req.params.id });

    await RolePermission.destroy(this.req, {
      roleId: this.req.params.id
    });

    let PermissionArray = await Permission.find(this.req, {});

    let permissions = await Promise.all(_.map(PermissionArray, (item) => {
      let newRolePermission = RolePermission.create(this.req, {
        roleId: this.req.params.id,
        permissionId: item.id,
        type: type[item.name] || 0,
        createdBy: this.req.loggedInUser.id,
        updatedBy: this.req.loggedInUser.id
      }).fetch();
      return newRolePermission;
    }));

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.ROLE,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: this.req.params.id,
      objectContentOld: {...foundRole, permission: foundRolePermission},
      objectContentNew: {...updatedRole[0], permission: permissions},
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    let dataPermission = await sails.helpers.user.getPermission(this.req, { roleId: this.req.params.id })
    
    this.res.json({
      status: true,
      data: dataPermission,
    });
  }
};
