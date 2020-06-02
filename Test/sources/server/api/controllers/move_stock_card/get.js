module.exports = {

  friendlyName: 'Get Export Card',

  description: 'Get export card',

  inputs: {

  },

  fn: async function (inputs) {
    let branchId = this.req.headers['branch-id']
    let foundMoveStockCard = await sails.helpers.moveStockCard.get(this.req, {id: this.req.params.id, branchId});

    this.res.json(foundMoveStockCard);
  }

};
