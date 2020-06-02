
module.exports = {
  friendlyName: "Update Import Return Card",

  description: "Update import return card.",

  inputs: {
    code: {
      type: 'string'
    },
    finalAmount: {
      type: 'number',
    },
    totalAmount: {
      type: 'number',
    },
    discountAmount: {
      type: 'number',
    },
    notes: {
      type: 'string',
    },
    importId: {
      type: 'number',
    },
    products: {
      type: 'json',
      required: true,
    },
    customerId: {
      type: 'number',
    },
    exportedAt: {
      type: 'number'
    }
  },

  fn: async function (inputs) {
    var {
      finalAmount,
      notes,
      code,
      importId,
      products,
      customerId,
      discountAmount,
      totalAmount,
      exportedAt
    } = inputs;
    let branchId = this.req.headers['branch-id'];

    let updatedImportReturnRecord = await sails.helpers.importReturnCard.update(this.req, {
      id: this.req.params.id,
      finalAmount,
      code,
      notes,
      importId,
      reason: sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE,
      products,
      customerId,      
      discountAmount,
      totalAmount,
      updatedBy: this.req.loggedInUser.id,
      branchId,
      exportedAt,
      isActionLog: true
    });

    this.res.json(updatedImportReturnRecord);
  }
}
