module.exports = {

    friendlyName: 'Get user Role',
  
    description: 'Get one role',
  
    inputs: {
      req: {
        type: "ref",
      },
      data: {
        type: "ref",
        required: true,
      },
    },
  
    fn: async function (inputs, exits) {
      let { id } = inputs.data;
      let { req } = inputs;

      let foundUser = await User.findOne(req, {
        where: {
          id: id,
          deletedAt: 0
        }
      }).intercept({
        name: 'UsageError'
      }, () => {
        return exits.success({
          status: false,
          message: sails.__('Người dùng không tồn tại trong hệ thống')
        });;
      });
  
      if (!foundUser) {
        return exits.success({
          status: false,
          message: sails.__('Người dùng không tồn tại trong hệ thống')
        });
      }
  
      let foundRole = await Role.findOne(req, {
        where: {
          id: foundUser.roleId,
          deletedAt: 0
        }
      }).populate('rolePermissions').intercept({
        name: 'UsageError'
      }, () => {
        return exits.success({
          status: false,
          message: sails.__('Bộ phận không tồn tại trong hệ thống')
        });;
      });
  
      if (!foundRole) {
        return exits.success({
          status: false,
          message: sails.__('Bộ phận không tồn tại trong hệ thống')
        });
      }
  
      let RolePermissionArray = foundRole.rolePermissions
      let typeRolePermisisons = {}
      for (let i in RolePermissionArray) {
        let foundPermission = await Permission.findOne(req, {id: RolePermissionArray[i].permissionId});
        typeRolePermisisons = {
          ...typeRolePermisisons,
          [foundPermission.name]: RolePermissionArray[i].type
        }
      }
  
      exits.success({
        status: true,
        data: RolePermissionArray,
        type: typeRolePermisisons,
        role: foundRole
      });
    }
  
  };
  