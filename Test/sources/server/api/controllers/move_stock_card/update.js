module.exports = {
  friendlyName: "Update move stock Card",

  description: "Update an move stock card",

  inputs: {
    code: {
      type: 'string',
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    movedBy: {
      type: 'number',
      required: true
    },
    reference: {
      type: 'string'
    },
    products: {
      type: 'json',
      required: true,
    },
  },

  fn: async function (inputs) {
    var {
      code,
      notes,
      movedBy,
      reference,
      products
    } = inputs;
    let branchId = this.req.headers['branch-id'] 
    let updatedMoveStockCard = await sails.helpers.moveStockCard.update(this.req, {
      id: this.req.params.id,
      updatedBy: this.req.loggedInUser.id,
      notes,
      movedBy,
      reference,
      products,
      branchId,
      code
    });

    this.res.json(updatedMoveStockCard);
  }
};
