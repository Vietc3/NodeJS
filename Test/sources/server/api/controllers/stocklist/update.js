module.exports = {

  friendlyName: 'update stock',

  description: 'update stock',

  inputs: {
    name: {
      type: 'string',
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
      address,
      notes
    } = inputs;
    
    let updatedStock = await sails.helpers.stockList.update(this.req, {
      id: this.req.params.id,
      name,
      address,
      notes,
      updatedBy: this.req.loggedInUser.id
    });
    
    return updatedStock;
  }
};
