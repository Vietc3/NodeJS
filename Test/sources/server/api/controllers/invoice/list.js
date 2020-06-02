const _ = require("lodash");

module.exports = {

  friendlyName: 'Get Invoices',

  description: 'Get invoices',

  inputs: {
    filter: {
      type: "json"
    },
    manualFilter: {
      type: "json"
    },
    manualSort: {
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
    let { filter, sort, limit, skip, manualFilter, manualSort } = inputs;
    let branchId= this.req.headers['branch-id']
    let foundInvoices = await sails.helpers.invoice.list(this.req, { filter, sort, limit, skip, manualFilter, manualSort, branchId })

    this.res.json(foundInvoices);
  }
};
