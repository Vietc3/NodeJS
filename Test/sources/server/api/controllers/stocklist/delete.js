module.exports = {

  friendlyName: 'delete stock',

  description: 'delete stock',
  
  inputs: {
    moveTo: {
      type: "number",
      required: true
    }
  },

  fn: async function (inputs) {
    let {moveTo} = inputs;
    
    let deletedStock = await sails.helpers.stockList.deleteStock(this.req, {
      id: this.req.params.id,
      moveTo: moveTo,
      updatedBy: this.req.loggedInUser.id,
      isActionLog: true
    });
    
    return deletedStock;
  }
};
