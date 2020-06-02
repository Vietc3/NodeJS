module.exports = {
    friendlyName: "Delete Income/expense Cards",
  
    description: "Delete multiple income/expense Cards",
  
    inputs: {
      ids: {
        required: true,
        type: 'json'
      },
    },
  
    fn: async function(inputs) {
      let ids = inputs.ids;
  
      if (!ids || !Array.isArray(ids) || !ids.length) {
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      }
  
      let deletedIncomeExpenseCards = await IncomeExpenseCard.update({ id: { in: ids }}).set({
        deletedAt: new Date().getTime(),
        updatedBy: this.req.loggedInUser.id
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      this.res.json({
        status: true,
        data: deletedIncomeExpenseCards
      });
    }
  };
  