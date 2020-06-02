module.exports = {
  friendlyName: "Delete Export Card",

  description: "Delete an export card.",
  
  inputs: {
    id: {
      type: 'number',
      required: true
    },
  },

  fn: async function (inputs) {
    let {id} = inputs;
    let branchId = this.req.headers['branch-id']
    let canceledMoveStockCard = await sails.helpers.moveStockCard.cancel(this.req, {
      id,
      updatedBy: this.req.loggedInUser.id, 
      branchId
    });

    this.res.json(canceledMoveStockCard);
  }
};
