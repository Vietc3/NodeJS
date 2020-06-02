module.exports = {

    friendlyName: 'Get Customer',

    description: 'Get customer info.',

  fn: async function (inputs) {
    let type = parseInt(this.req.params.type);
    
    let permissionName = type == sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? sails.config.constant.ROLE_CUSTOMER : sails.config.constant.ROLE_SUPPLIER;
    let check = await sails.helpers.checkPermission(permissionName, sails.config.constant.PERMISSION_TYPE.TYPE_VIEW_ONLY, this.req);
    
    if(!check){
      return ({
        status: false,
        error: sails.__('Không có quyền thực hiện thao tác này')
      });
    }

    let foundCustomer = await sails.helpers.customer.get(this.req, {
      id: this.req.params.id,
      type: type,
      branchId: this.req.headers['branch-id']
    })
    
    return (foundCustomer);
  }
};
  