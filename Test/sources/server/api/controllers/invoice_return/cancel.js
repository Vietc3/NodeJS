module.exports = {
    friendlyName: "Delete Invoice Return",
  
    description: "Delete an invoice return.",
    
    fn: async function () {
      let branchId = this.req.headers['branch-id'];

      let cancelInvoiceReturn = await sails.helpers.invoiceReturn.cancel(this.req, {id: this.req.params.id, updatedBy: this.req.loggedInUser.id, branchId });

      this.res.json(cancelInvoiceReturn);
    }
  };
  