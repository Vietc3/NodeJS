module.exports = {
  friendlyName: "Delete Customer",

  description: "Delete a customer.",


  fn: async function(inputs) {
    let type = parseInt(this.req.params.type);
    let permissionName = type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? sails.config.constant.ROLE_CUSTOMER : sails.config.constant.ROLE_SUPPLIER;
    let check = await sails.helpers.checkPermission(permissionName, sails.config.constant.PERMISSION_TYPE.TYPE_ALL, this.req);
    if(!check){
      this.res.json({
        status: false,
        message: sails.__('Không có quyền thực hiện thao tác này')
      });
      return;
    }

    let branchId = this.req.headers['branch-id'];

    let deleteCustomer = await sails.helpers.customer.remove(this.req, {
      id: this.req.params.id,
      type,
      updatedBy: this.req.loggedInUser.id,
      branchId
    })

    this.res.json(deleteCustomer)
  }
};
