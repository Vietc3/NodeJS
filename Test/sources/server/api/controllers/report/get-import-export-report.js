module.exports = {

  friendlyName: 'Get Inventory Report data',

  description: 'Get Inventory data',

  inputs: {
    selectProduct: {
      type: 'json',
    },
    type: {
      type: 'json',
      required: true
    },
    stockId: { // truyen arr
      type: 'json',
      required: true 
    },
    startDate: {
      type: "number"
    },
    endDate: {
      type: "number"
    },
  },

  fn: async function (inputs) {
    let { type, stockId, startDate, endDate, selectProduct } = inputs;
    let branchId = this.req.headers['branch-id'];
    if (type.length == 0) {
      let dataType = await ProductType.find(this.req, { deletedAt: 0 })

      if (!dataType.length) {
        return this.res.json({
                  status: true,
                  data: []
                });
      }
      
      let arrType = [];

      _.forEach(dataType, item => {
        arrType.push(item.id)
      })

      type = arrType
    }

    let ImportExportReport = await sails.helpers.report.importExport(this.req, { selectProduct, type, startDate, endDate, branchId, stockId })

    this.res.json(ImportExportReport);
  }
};
