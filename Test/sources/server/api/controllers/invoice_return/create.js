module.exports = {

  friendlyName: 'Create Invoice Return Card',

  description: 'Create a new invoice return card',

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
    payAmount: {
      type: 'number'
    },
    notes: {
      type: 'string',
    },
    noteIncomeExpense: {
      type: 'string',
    },
    invoiceId: {
      type: 'number',
    },
    products: {
      type: 'json',
      required: true,
    },
    customerId: {
      type: 'number',
    },
    incomeExpenseAt: {
      type: 'number'
    },
    importedAt: {
      type: 'number'
    }
  },

  fn: async function (inputs) {
    let {
      finalAmount,
      notes,
      noteIncomeExpense,
      code,
      invoiceId,
      products,
      customerId,
      discountAmount,
      totalAmount,
      payAmount,
      incomeExpenseAt,
      importedAt
    } = inputs;

    let branchId = this.req.headers['branch-id']
    
    let result = await sails.helpers.invoiceReturn.create(this.req, {
      finalAmount,
      notes,
      noteIncomeExpense,
      code,
      invoiceId,
      products,
      customerId,
      createdBy: this.req.loggedInUser.id,
      totalAmount,
      discountAmount,
      payAmount,
      branchId,
      incomeExpenseAt,
      importedAt,
      isActionLog: true
    })
    
    this.res.json(result);
  }
}
