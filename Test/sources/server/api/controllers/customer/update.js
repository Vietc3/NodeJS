module.exports = {
    friendlyName: "Update Customer",
  
    description: "Update a Customer.",
  
    inputs: {
        name: {
          type: "string",
          required: true,
          maxLength: 150,
        },
        code: {
          type: "string",
          maxLength: 50,
        },
        address: {
          type: 'string',
          maxLength: 250,
        },
        tel: {
          type: 'string',
          maxLength: 50
        },
        mobile: {
          type: 'string',
          maxLength: 50,
        },
        email: {
          type: 'string',
          maxLength: 50,
        },
        gender: {
          type: 'string',
          maxLength: 50,
        },
        birthday: {
          type: 'number'
        },
        notes: {
          type: 'string',
          maxLength: 250,
        },
        maxDeptAmount: {
          type: 'number'
        },
        maxDeptDays: {
          type: 'number'
        },
        taxCode: {
          type: 'string',
          maxLength: 50,
        },
        province: {
          type: "string",
          maxLength: 250,
        },
        district:{
          type: "string",
          maxLength: 250,
        },
        commune:{
          type: "string",
          maxLength: 250,
        },
      },    
    fn: async function(inputs) {
      var { 
        name,
        code,
        address,
        tel,
        mobile,
        email,
        gender,
        birthday,
        notes,
        maxDeptAmount,
        maxDeptDays,
        taxCode,
        province,
        district,
        commune,
      } = inputs;
      
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

      let branchId = this.req.headers['branch-id'];
      
      var updatedCustomer = await sails.helpers.customer.update(this.req, {...inputs, branchId, type, updatedBy: this.req.loggedInUser.id, id: this.req.params.id, isActionLog: true})  
  
      return updatedCustomer;
    }
  };
  