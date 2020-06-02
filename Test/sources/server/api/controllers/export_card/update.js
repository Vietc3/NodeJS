module.exports = {
  friendlyName: "Update Export Card",

  description: "Update an export card",

  inputs: {
    code: {
      type: 'string',
      required: true,
      maxLength: 50,
    },
    exportedAt: {
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
    finalAmount: {
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
    reason: {
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
      type: "string"
    },
    deleteProducts: {
      type: 'json',
    },
  },

  fn: async function (inputs) {
    var {
      code,
      exportedAt,
      totalAmount,
      discountAmount,
      taxAmount,
      finalAmount,
      notes,
      status,
      recipientId,
      products,
      reason,
      reference,
      deleteProducts
    } = inputs;

    let updatedExportCard = ExportCard.updateExportCard(
      this.req.params.id,
      code,
      exportedAt,
      totalAmount,
      discountAmount,
      taxAmount,
      finalAmount,
      notes,
      status,
      recipientId,
      products,
      this.req.loggedInUser.id,
      reason,
      reference,
      deleteProducts,
      (error) =>{
        if(error){
          this.res.json({
            status: false,
            error: sails.__(error)
          });
          return;
        }
      }
    )

    this.res.json({
      status: true,
      data: updatedExportCard
    });
  }
};
