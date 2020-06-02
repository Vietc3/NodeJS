module.exports = {
  friendlyName: "Update Invoice Return",

  description: "Update invoice return.",

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
    importedAt: {
      type: 'number'
    }
  },

  fn: async function (inputs) {
    var {
      finalAmount,
      notes,
      code,
      invoiceId,
      products,
      customerId,
      discountAmount,
      totalAmount,
      importedAt
    } = inputs;
    
    let branchId = this.req.headers['branch-id']

    let updatedInvoiceReturnRecord = await sails.helpers.invoiceReturn.update(this.req, {
      id: this.req.params.id,
      finalAmount,
      code,
      notes,
      invoiceId,
      reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN,
      products,
      customerId,      
      discountAmount,
      totalAmount,
      branchId,
      importedAt,
      updatedBy: this.req.loggedInUser.id,
      isActionLog: true
    });

    this.res.json(updatedInvoiceReturnRecord);
  }
}