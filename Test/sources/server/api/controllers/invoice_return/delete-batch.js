module.exports = {
  friendlyName: "Delete Invoice Return",

  description: "Delete multiple invoice return",

  inputs: {
    ids: {
      type: 'json'
    },
  },

  fn: async function (inputs) {
    let ids = inputs.ids;

    let deletedInvoiceReturns = await InvoiceReturn.deleteInvoiceReturns(ids, this.req.loggedInUser.id, (error) => {
      if(error){
        this.res.json({
          status: false,
          error: sails.__(error)
        });
        return;
      }
    });
    this.res.json({
      status: true,
      data: deletedInvoiceReturns
    });
  }
};
