module.exports = {

  friendlyName: 'Create Import Card',

  description: 'Create a new import card',

  inputs: {
    code: {
      type: 'string',
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
    depositAmount: {
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
    reason: {
      type: 'number'
    },
    reference: {
      type: 'string',
      maxLength: 150,
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
      code,
      importedAt,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      paidAmount,
      notes,
      noteIncomeExpense,
      recipientId,
      products,
      reference,
      depositAmount,
      reason,
      incomeExpenseAt
    } = inputs;
    let branchId = this.req.headers['branch-id']
    let result = await sails.helpers.import.create(this.req, {
      code,
      products,
      finalAmount,
      totalAmount,
      importedAt,
      notes,
      noteIncomeExpense,
      reason,
      recipientId,
      reference,
      createdBy: this.req.loggedInUser.id,
      paidAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      depositAmount,
      branchId,
      incomeExpenseAt,
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
