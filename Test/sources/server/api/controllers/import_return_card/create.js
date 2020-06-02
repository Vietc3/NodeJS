module.exports = {

  friendlyName: 'Create Import Return Card',

  description: 'Create a new import return card',

  inputs: {
    code: {
      type: 'string',
      maxLength: 50,
    },
    totalAmount: {
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
    noteIncomeExpense: {
      type: 'string',
      maxLength: 250,
    },
    customerId: {
      type: 'number',
      required: true,
    },
    products: {
      type: 'json',
      required: true,
    },
    discountAmount: {
      type: 'number',
    },
    exportedAt: {
      type: 'number'
    }

  },

  fn: async function (inputs) {
    let {
      code,
      totalAmount,
      finalAmount,
      paidAmount,
      notes,
      noteIncomeExpense,
      customerId,
      discountAmount,
      products,
      exportedAt
    } = inputs;
    let branchId = this.req.headers['branch-id'];

    let result = await sails.helpers.importReturnCard.create(this.req, {
      code,
      totalAmount,
      finalAmount,
      paidAmount,
      notes,
      noteIncomeExpense,
      customerId,
      discountAmount,
      products,
      createdBy: this.req.loggedInUser.id,
      exportedAt,
      branchId,
      isActionLog: true
    })

    this.res.json(result);

  }
};
