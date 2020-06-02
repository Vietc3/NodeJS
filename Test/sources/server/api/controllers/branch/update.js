module.exports = {

  friendlyName: 'update branch',

  description: 'update branch',

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
    
    let updatedNewBranch = await sails.helpers.branch.update(this.req, {
      id: this.req.params.id,
      email,
      name,
      phoneNumber,
      address,
      status,
      updatedBy: this.req.loggedInUser.id,
      isActionLog: true
    });
    
    return updatedNewBranch;
  }
};
