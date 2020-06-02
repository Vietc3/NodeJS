module.exports = {

  friendlyName: 'Create Customer',

  description: 'Create a new customer',

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

  fn: async function (inputs) {
    let {
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
    let branchId = this.req.headers['branch-id'];
    if(!check){
      this.res.json({
        status: false,
        error: sails.__('Không có quyền thực hiện thao tác này')
      });
      return;
    }
    var newCustomerRecord = await sails.helpers.customer.create(this.req, {...inputs, branchId, type, updatedBy: this.req.loggedInUser.id, createdBy: this.req.loggedInUser.id, isActionLog: true })

    return newCustomerRecord;
  }
};


