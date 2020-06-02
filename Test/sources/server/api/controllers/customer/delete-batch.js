module.exports = {
  friendlyName: "Delete Customers",

  description: "Delete multiple customers",

  inputs: {
    ids: {
      type: 'json'
    },
  },

  fn: async function(inputs) {
    let { ids } = inputs;
    let type = parseInt(this.req.params.type);
    let permissionName = type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? sails.config.constant.ROLE_CUSTOMER : sails.config.constant.ROLE_SUPPLIER;
    let check = await sails.helpers.checkPermission(permissionName, sails.config.constant.PERMISSION_TYPE.TYPE_ALL, this.req);
    
    if(!check){
      this.res.json({
        status: false,
        error: sails.__('Không có quyền thực hiện thao tác này')
      });
      return;
    }

    if (!ids || !Array.isArray(ids) || !ids.length) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }

    let deletedCustomer = await Customer.update(this.req, { id: { in: ids }, type: type}).set({
      deletedAt: new Date().getTime(),
      updatedBy: this.req.loggedInUser.id
    }).intercept({ name: 'UsageError' }, ()=>{
      this.res.json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }).fetch();

    this.res.json({
      status: true,
      data: deletedCustomer
    });
  }
};