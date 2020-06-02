module.exports = {

  friendlyName: 'Create Role',

  description: 'Create a new role',

  inputs: {
    name: {
      type: "string",
      required: true
    },
    notes: {
      type: "string"
    },
    type: {
      type: 'json',
      required: true,
    },
  },

  fn: async function (inputs) {
    let {
      name,
      notes,
      type,
    } = inputs;

    var newRole = await Role.create(this.req, {
      name: name,
      notes: notes,
      createdBy: this.req.loggedInUser.id,
      updatedBy: this.req.loggedInUser.id
    }).intercept('E_UNIQUE', () => {
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
        error: sails.__('Thông tin quyền bị thiếu hoặc không hợp lệ')
      });
      return;
    }).fetch();

    let PermissionArray = await Permission.find(this.req, {});

    let permissions = await Promise.all(_.map(PermissionArray, (item) => {
      let newRolePermission = RolePermission.create(this.req, {
        roleId: newRole.id,
        permissionId: item.id,
        type: type[item.name] || 0,
        createdBy: this.req.loggedInUser.id,
        updatedBy: this.req.loggedInUser.id
      }).fetch();
      return newRolePermission;
    }));

    var foundRole = await Role.find(this.req, {id: newRole.id}).populate('rolePermissions');

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.ROLE,
      action: sails.config.constant.ACTION.CREATE,
      objectId: newRole.id,
      objectContentNew: {...newRole, permission: permissions},
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: foundRole[0]
    });
  }
};
