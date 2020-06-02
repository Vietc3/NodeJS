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
    
    let foundExportCards = await ExportCard.getExportCards(filter, sort, limit, skip, manualFilter, manualSort, (error) => {
      if(error){
        this.res.json({
          status: false,
          error: sails.__(error)
        });
        return;
      }
    });
    this.res.json({
      status: true,
      data: limit ? foundExportCards.slice(skip, limit + skip) : foundExportCards,
      count: foundExportCards.length
    });
  }
};
