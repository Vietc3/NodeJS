module.exports = {
    friendlyName: "Delete Income/expense Card",
  
    description: "Delete a income/expense Card.",
  
    inputs: {
  
    },
  
    fn: async function(inputs) {
      let foundIncomeExpenseCard = await IncomeExpenseCard.findOne({
        where: {
          id: this.req.params.id,
          deletedAt: 0
          }
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin phiếu bị thiếu hoặc không hợp lệ')
        });
        return;
      });
  
      if (!foundIncomeExpenseCard) {
        this.res.status(400).json({
          status: false,
          error: sails.__('Phiếu không tồn tại trong hệ thống')
        });
        return;
      }
  
      var deleteIncomeExpenseCard = await IncomeExpenseCard.updateOne({ id: this.req.params.id }).set({
        deletedAt: new Date().getTime(),
        updatedBy: this.req.loggedInUser.id
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin đơn hàng bị thiếu hoặc không hợp lệ')
        });
        return;
      });
  
      this.res.json({
        status: true,
        data: deleteIncomeExpenseCard
      });
    }
  };
  