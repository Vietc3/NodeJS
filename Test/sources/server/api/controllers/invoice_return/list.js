

module.exports = {

  friendlyName: 'Get Invoice Return',

  description: 'Get list of invoiceReturn',

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
    let branchId = this.req.headers['branch-id'];

    let result = await sails.helpers.invoiceReturn.list(this.req, {filter, sort, limit, skip, manualFilter, manualSort, branchId});
  
  return result
  }
};

