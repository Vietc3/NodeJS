module.exports = {

    friendlyName: 'Cancel Invoice',
  
    description: 'Cancel an invoice',
  
    fn: async function () {
      let branchId = this.req.headers['branch-id']
      let canceledInvoice = await sails.helpers.invoice.cancel(this.req, {
        id: this.req.params.id,
        updatedBy: this.req.loggedInUser.id,
        branchId
      });

      this.res.json(canceledInvoice);      
    }
  };
  