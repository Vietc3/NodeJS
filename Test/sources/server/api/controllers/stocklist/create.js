module.exports = {

  friendlyName: 'Create new stock',

  description: 'Create new stock',

  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    branchId: {
      type: 'number',
      required: true,
    },
    address: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
  },


  fn: async function (inputs) {
    let {
      name,
      branchId,
      address,
      notes
    } = inputs;
    
    let createdNewStock = await sails.helpers.stockList.create(this.req, {
      name,
      branchId,
      address,
      notes,
      createdBy: this.req.loggedInUser.id,
      isActionLog: true
    });
    
    return createdNewStock;
  }
};
