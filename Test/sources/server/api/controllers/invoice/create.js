module.exports = {

  friendlyName: 'Create Invoice',

  description: 'Create a new invoice',

  inputs: {
    code: {
      type: 'string',
    },
    totalAmount: {
      type: 'number',
      required: true,
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
    depositAmount: {
      type: 'number'
    },
    notes: {
      type: 'string',
    },
    noteIncomeExpense: {
      type: 'string',
    },
    deliveryAddress: {
      type: 'string',
    },
    customerId: {
      type: 'number',
    },
    products: {
      type: 'json',
      required: true,
    },
    payType: {
      type: 'number',
    },
    deliveryType: {
      type: 'number',
    },
    paidAmount: {
      type: 'number'
    },
    debtAmount: {
      type: 'number'
    },
    incomeExpenseAt: {
      type: 'number'
    },
    invoiceAt: {
      type: 'number'
    }
  },

  fn: async function (inputs) {
    let {
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      noteIncomeExpense,
      deliveryAddress,
      customerId,
      products,
      payType,
      deliveryType,
      paidAmount,
      debtAmount,
      depositAmount,
      incomeExpenseAt,
      invoiceAt
    } = inputs;
    let branchId = this.req.headers['branch-id']
    let createdInvoice = await sails.helpers.invoice.create(this.req, {
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      noteIncomeExpense,
      deliveryAddress,
      customerId,
      products,
      payType,
      deliveryType,
      paidAmount,
      debtAmount,
      depositAmount,
      branchId,
      incomeExpenseAt,
      invoiceAt,
      createdBy: this.req.loggedInUser.id,
      isActionLog: true
    });

    this.res.json(createdInvoice);
  }
};
