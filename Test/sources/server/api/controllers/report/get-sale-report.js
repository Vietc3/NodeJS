
module.exports = {

  friendlyName: 'Get Dash board data',

  description: 'Get dash board data',

  inputs: {
    filter: {
      type: 'json',
    },
    startDate: {
      type: "number"
    },
    endDate: {
      type: "number"
    },
    options: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let { filter, startDate, endDate, options } = inputs;    
    let branchId = this.req.headers['branch-id'];
    let reportSale = await sails.helpers.report.getSaleReport(this.req ,{ filter, startDate, endDate, options, branchId })

    this.res.json(reportSale)

  }
};
