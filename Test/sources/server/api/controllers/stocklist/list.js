module.exports = {

  friendlyName: 'Get List stock',

  description: 'Get list stock',
  
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
  },

  fn: async function (inputs) {
    let { filter, select, sort, limit, skip, manualFilter, manualSort } = inputs;

    let foundStockList = await sails.helpers.stockList.list(this.req, { filter, select, sort, limit, skip }) 

    return (foundStockList);
  }
};