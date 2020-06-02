module.exports = {

  friendlyName: 'Get Invoice Info',

  description: 'Get invoice info',

  fn: async function () {
    let branchId = this.req.headers['branch-id']
    let result = await sails.helpers.invoice.get(this.req, {id: this.req.params.id, branchId, isCheck: true});
    if(result.status) {
      let foundInvoice = result.data.foundInvoice;
      let invoiceProductArray = result.data.invoiceProductArray;
      let incomeCards = result.data.incomeCards;
      let invoiceReturns = result.data.invoiceReturns;
      this.res.json({
        status: true,
        data: foundInvoice, invoiceProductArray, incomeCards, invoiceReturns
      });
    }
    else{
      this.res.json({
        status: false,
        error: result.message
      });
    }
  }

};
