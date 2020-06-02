module.exports = {

    friendlyName: 'Get General Debt Report data',
  
    description: 'Get General Debt Report data',
  
    inputs: {
      type: {
        type: 'number',
        required: true
      },
      startDate: {
        type: "number"
      },
      endDate: {
        type: "number"
      },
      isCheckDebt: {
        type: "ref"
      },
    },
  
    fn: async function (inputs) {
      let { type, startDate, endDate, isCheckDebt } = inputs;
      let branchId = this.req.headers['branch-id'];

      let reportDebt = await sails.helpers.report.generalDebt(this.req, { type, startDate, endDate, isCheckDebt, branchId });

      this.res.json(reportDebt)
    }
}