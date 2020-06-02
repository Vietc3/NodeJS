const _ = require("lodash");

module.exports = {

  friendlyName: 'Get Manufacturing Cards',

  description: 'Get manufacturing cards',

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
    filter = {...filter, branchId: this.req.headers['branch-id']} 
    let foundManufacturingCards = await ManufacturingCard.getManufacturingCards(this.req, filter, sort, limit, skip, manualFilter, manualSort, (error) => {
      if(error){
        this.res.json({
          status: false,
          error: sails.__(error)
        });
        return;
      }
    });

    if ( foundManufacturingCards )
      this.res.json({
        status: true,
        data: limit ? foundManufacturingCards.slice(skip, limit + skip) : foundManufacturingCards,
        count: foundManufacturingCards.length
      });
  }
};
