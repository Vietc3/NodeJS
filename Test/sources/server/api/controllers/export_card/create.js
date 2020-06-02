module.exports = {

  friendlyName: 'Create Export Card',

  description: 'Create a new export card',

  inputs: {
    code: {
      type: 'string',
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
      type: 'string'
    }
  },

  fn: async function (inputs) {
    let {
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
      reference
    } = inputs;
    
    let branchId = req.headers['branch-id'];

    var result = await ExportCard.createExportCard(
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
      (error)=> {
        if(error){
          this.res.json({
            status: false,
            error: sails.__(error)
          });
          return;
        }
      }
    );

    let newExportCardRecord = result.newExportCardRecord;
    let exportCardProductArray = result.exportCardProductArray;

    this.res.json({
      status: true,
      data: newExportCardRecord, exportCardProductArray
    });
  }
};
