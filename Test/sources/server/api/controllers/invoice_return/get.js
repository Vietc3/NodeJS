module.exports = {

  friendlyName: 'Get Invoice Return',

  description: 'Get invoice return info',

  fn: async function () {
    let branchId = this.req.headers['branch-id']

    let result = await sails.helpers.invoiceReturn.get(this.req, this.req.params.id, branchId);

    return result
   
  }

};
