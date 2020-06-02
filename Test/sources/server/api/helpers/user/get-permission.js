module.exports = {
  description: 'Get permission',

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
    let { roleId, userId } = inputs.data;
    let { req } = inputs;
    
    if(userId) {
      let foundUser = await User.findOne(req, {id: userId});
      roleId = foundUser.roleId;
    }

    let userRole = await Role.findOne(req, {
        id: roleId
    }).populate("rolePermissions")

    let arrPermission = await Permission.find(req, {})
    let permissionObject = {};
    _.forEach(arrPermission, item => {
        permissionObject[item.id] = item
    })
    let permissions = {};
    _.forEach(userRole.rolePermissions, item => {
        let permissionName = permissionObject[item.permissionId].name;
        permissions[permissionName] = item.type
    })

    for (let i in userRole.rolePermissions) {
        let permissionName = await Permission.findOne(req, {
            id: userRole.rolePermissions[i].permissionId
        })
        userRole.rolePermissions[i].permissionName = permissionName.name;
    }
    if (Object.keys(permissions).length  === 0 ) {
        return exits.success({ status: false, message: sails.__('Không tìm thấy quyền') });
    }

    return exits.success({ status: true, dataRole: userRole , dataPermisson: permissions});
  }
}