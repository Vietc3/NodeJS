module.exports = {
  friendlyName: "Delete Multiple Invoices",

  description: "Delete multiple invoices",

  inputs: {
    ids: {
      type: 'json'
    },
  },

  fn: async function (inputs) {
    let ids = inputs.ids;
    var deletedInvoices = await Invoice.deleteInvoices(ids, this.req.loggedInUser.id, (error) => {
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
      data: deletedInvoices
    });
  }
};
