module.exports = {

  friendlyName: 'Get Export Cards',

  description: 'Get export cards',

  inputs: {
    filter: {
      type: 'json',
    },
    sort: {
      type: 'json',
    },
    limit: {
      type: 'number',
    },
    skip: {
      type: 'number',
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
    filter = {...filter, branchId: this.req.headers['branch-id'] } 
    let listMoveStockCard = await sails.helpers.moveStockCard.list(this.req, {filter, sort, limit, skip, manualFilter, manualSort});
    
    this.res.json(listMoveStockCard);
  }
};
