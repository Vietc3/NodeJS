module.exports = {

  friendlyName: 'Get Sales Couneter data',

  description: 'Get sales couneter data',

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
    objData: {
      type: "ref"
    },
    stockId :{
      type: 'json'
    }
  },

  fn: async function (inputs) {
    let { filter, startDate, endDate, objData, stockId } = inputs;
    let branchId = this.req.headers['branch-id'];
    let productSalesCounter = await sails.helpers.report.getSalesCounter(this.req, { filter, startDate, endDate, objData, branchId, stockId})

    this.res.json(productSalesCounter)

  }
};
