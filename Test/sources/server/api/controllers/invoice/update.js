module.exports = {
  friendlyName: "Update Invoice",

  description: "Update an invoice",

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
    notes: {
      type: 'string',
    },
    deliveryAddress: {
      type: 'string',
    },
    customerId: {
      type: 'number',
    },
    status: {
      type: 'string',
      required: true,
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
    invoiceAt: {
      type: 'number'
    }
  },

  fn: async function (inputs) {
    var {
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      deliveryAddress,
      customerId,
      status,
      products,
      payType,
      deliveryType,
      paidAmount,
      debtAmount,
      invoiceAt
    } = inputs;
    let branchId = this.req.headers['branch-id']
    let updatedInvoice = await sails.helpers.invoice.update(this.req, {
      id: this.req.params.id,
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      deliveryAddress,
      customerId,
      status,
      products,
      deliveryType,
      paidAmount,
      branchId,
      invoiceAt,
      updatedBy: this.req.loggedInUser.id,
      isActionLog: true
    })

    this.res.json(updatedInvoice);
   
  }
};
