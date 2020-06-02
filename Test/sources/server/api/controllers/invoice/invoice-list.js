module.exports = {

  friendlyName: 'Get List Invoice',

  description: 'Get list invoice',

  inputs: {
    filter: {
      type: "json"
    },
    sort: {
      type: 'string',
    },
    limit: {
      type: "number"
    },
    skip: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip} = inputs;
    let branchId = this.req.headers['branch-id'];
    let foundInvoices = await sails.helpers.invoice.listInvoice(this.req, {filter, sort, limit, skip}, branchId) 

    this.res.json(foundInvoices);
  }
};