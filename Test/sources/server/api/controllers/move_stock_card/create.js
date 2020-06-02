module.exports = {

  friendlyName: 'Create Move Stock Card',

  description: 'Create a new move stock card',

  inputs: {
    code: {
      type: 'string',
      maxLength: 50,
    },
    movedAt: {
      type: 'number',
      required: true
    },
    movedBy: {
      type: 'number',
      required: true
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    products: {
      type: 'json',
      required: true,
    },
    reason: {
      type: 'number'
    },
    reference: {
      type: 'string'
    }
  },

  fn: async function (inputs) {
    let {
      code,
      movedAt,
      movedBy,
      notes,
      products,
      reason,
      reference
    } = inputs;
    let branchId = this.req.headers['branch-id']
    let createdMoveStockCard = await sails.helpers.moveStockCard.create(this.req, {
      code,
      movedAt,
      movedBy,
      notes,
      products,
      reason,
      reference,
      branchId,
      createdBy: this.req.loggedInUser.id,
    });

    this.res.json(createdMoveStockCard);
  }
};
