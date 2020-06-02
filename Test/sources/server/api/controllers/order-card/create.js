module.exports = {

  friendlyName: 'Create Order Card',

  description: 'Create a new order card',

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
    let {
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

    let createdInvoice = await sails.helpers.orderCard.create(this.req, {
      code,
      type,
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
      paidAmount,
      debtAmount,
      depositAmount,
      orderAt,
      expectedAt,
      status,
      createdBy: this.req.loggedInUser.id,
      branchId,
      isActionLog: true
    });

    this.res.json(createdInvoice);
  }
};
