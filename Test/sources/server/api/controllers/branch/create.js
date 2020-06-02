module.exports = {

  friendlyName: 'Create branch',

  description: 'Create branch',

  inputs: {
    email: {
      type: 'string',
      isEmail: true
    },
    name: {
      type: 'string',
      required: true,
    },
    phoneNumber: {
      type: 'string',
    },
    address: {
      type: 'string'
    },
    status: {
      type: 'number' // 1: Đang hoạt động, 2: Ngừng hoạt động
    },
  },


  fn: async function (inputs) {
    let {
      email,
      name,
      phoneNumber,
      address,
      status
    } = inputs;
    
    let createdNewBranch = await sails.helpers.branch.create(this.req, {
      email,
      name,
      phoneNumber,
      address,
      status,
      createdBy: this.req.loggedInUser.id,
      isActionLog: true
    });
    
    return createdNewBranch;
  }
};
