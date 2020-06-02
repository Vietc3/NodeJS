module.exports = {
  friendlyName: "Update Import Card",

  description: "Update an import card",

  inputs: {
    code: {
      type: 'string',
      required: true,
      maxLength: 50,
    },
    importedAt: {
      type: 'number',
      required: true
    },
    totalAmount: {
      type: 'number'
    },
    discountAmount: {
      type: 'number'
    },
    taxAmount: {
      type: 'number'
    },
    deliveryAmount: {
      type: 'number'
    },
    finalAmount: {
      type: 'number'
    },
    paidAmount: {
      type: 'number'
    },
    notes: {
      type: 'string',
      maxLength: 250,
    },
    status: {
      type: 'number',
      required: true,
    },
    recipientId: {
      type: 'number',
      required: true,
    },
    products: {
      type: 'json',
      required: true,
    },
    reference: {
      type: 'string',
      maxLength: 150,
    },
    reason: {
      type: 'number'
    },
    importedAt: {
      type: 'number'
    }
  },

  fn: async function (inputs) {
    var {
      code,
      importedAt,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      recipientId,
      products,
      reference,
      paidAmount,
      reason,
      importedAt
    } = inputs;
    let branchId = this.req.headers['branch-id'];

    let result = await sails.helpers.import.update(this.req, {
      id: this.req.params.id,
      code,
      products,
      finalAmount,
      totalAmount,
      importedAt,
      notes,
      reason,
      recipientId,
      reference,
      updatedBy: this.req.loggedInUser.id,
      paidAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      branchId,
      importedAt,
      isActionLog: true
    })
    if(result.status){
      this.res.json({
        status: true,
        data: result.data
      });
    }
    else {
      this.res.json({
        status: false,
        error: result.message
      });
    }
  }
};
