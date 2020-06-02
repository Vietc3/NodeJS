module.exports = {

  friendlyName: 'Get Role',

  description: 'Get one role',

  inputs: {

  },

  fn: async function (inputs) {
    let foundRole = await Role.findOne(this.req, {
      where: {
        id: this.req.params.id,
        deletedAt: 0
      }
    }).populate('rolePermissions').intercept({
      name: 'UsageError'
    }, () => {
      this.res.status(400).json({
        status: false,
        message: sails.__('Bộ phận không tồn tại trong hệ thống')
      });
      return;
    });

    if (!foundRole) {
      this.res.status(400).json({
        status: false,
        message: sails.__('Bộ phận không tồn tại trong hệ thống')
      });
      return;
    }

    let RolePermissionArray = foundRole.rolePermissions
    let typeRolePermisisons = {}
    for (let i in RolePermissionArray) {
      let foundPermission = await Permission.findOne(this.req, {id: RolePermissionArray[i].permissionId});
      typeRolePermisisons = {
        ...typeRolePermisisons,
        [foundPermission.name]: RolePermissionArray[i].type
      }
    }

    this.res.json({
      status: true,
      data: RolePermissionArray,
      type: typeRolePermisisons,
      role: foundRole
    });
  }

};
