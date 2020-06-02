module.exports = {
  friendlyName: "Update Order Card",

  description: "Update an order card",

  inputs: {
    code: {
      type: 'string',
    },
    type: {
      type: 'number'
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
    finalAmount: {
      type: 'number'
    },
    depositAmount: {
      type: 'number'
    },
    notes: {
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
    paidAmount: {
      type: 'number'
    },
    debtAmount: {
      type: 'number'
    },
    orderAt: {
      type: 'number'
    },
    expectedAt: {
      type: 'number'
    },
    deliveryAmount: {
      type: 'number'
    },
    deliveryType: {
      type: 'number',
    },
    deliveryAddress: {
      type: 'string',
    },
    status: {
      type: 'number'
    },
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
      products,
      payType,
      deliveryType,
      type,
      paidAmount,
      debtAmount,
      depositAmount,
      orderAt,
      expectedAt,
      status
    } = inputs;
    let branchId = this.req.headers['branch-id'];

    let updatedInvoice = await sails.helpers.orderCard.update(this.req, {
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
      products,
      payType,
      deliveryType,
      type,
      paidAmount,
      debtAmount,
      depositAmount,
      orderAt,
      expectedAt,
      status,
      updatedBy: this.req.loggedInUser.id,
      branchId
    })

    this.res.json(updatedInvoice);
   
  }
};
