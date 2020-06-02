module.exports = {

  friendlyName: 'Get Import Export Detail Report',

  description: 'Get import export detail report',

  inputs: {
    type: {
      type: 'json',
      required: true
    },
    startDate: {
      type: "number"
    },
    endDate: {
      type: "number"
    },
    id: {
      type: "number"
    },
    stockId: { // truyen arr
      type: 'json',
      required: true 
    },
  },

  fn: async function (inputs) {
    let { type, startDate, endDate, id, stockId } = inputs;
    let branchId = this.req.headers['branch-id'];
    let ImportExportDetailReport = await sails.helpers.report.importExportDetail(this.req, { type, id, startDate, endDate, branchId, stockId })

    this.res.json(ImportExportDetailReport);
  }
};
