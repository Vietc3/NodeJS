module.exports = {

  friendlyName: 'Get manufacturing formulas',

  description: 'Get list of manufacturing formula',

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
    groupBy: {
      type: 'string',
    }
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select, selectArrayId } = inputs;

    let foundFormulas = await sails.helpers.product.listFormula(this.req, { filter, sort, limit, skip, manualFilter, manualSort,select, selectArrayId });

    this.res.json(foundFormulas);
  }
};