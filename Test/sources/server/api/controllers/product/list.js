module.exports = {

  friendlyName: 'Get Products',

  description: 'Get list of products',

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
    },
    select: {
      type: "json"
    },
    selectArrayId: { // select theo id
      type: "json"
    },
    groupBy:{
      type: 'string',
    },
    time: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select, selectArrayId, groupBy, time } = inputs;  
    let branchId = this.req.headers['branch-id'];

    let foundProducts = await sails.helpers.product.list(this.req, { filter, sort, limit, skip, manualFilter, manualSort, select, branchId, selectArrayId, groupBy, time });

    this.res.json(foundProducts);
  }
};