module.exports = {

  friendlyName: 'Get List Order Card',

  description: 'Get list order card',

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
    },
    manualFilter: {
      type: "json"
    },
    manualSort: {
      type: "json"
    },
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort } = inputs;
    let branchId = this.req.headers['branch-id'];

    let foundOrder = await sails.helpers.orderCard.list(this.req, { filter, sort, limit, skip, manualFilter, manualSort, branchId}) 

      this.res.json(foundOrder);
  }
};