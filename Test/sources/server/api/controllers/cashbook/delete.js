module.exports = {
    friendlyName: "Delete Cash Book",
  
    description: "Delete a cash book",
  
    inputs: {
      
    },
  
    fn: async function(inputs) {

      let foundCashBook = await CashBook.findOne({
        where: {id: this.req.params.id, deletedAt: 0}
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      if (!foundCashBook) {
        this.res.json({
          status: false,
          error: sails.__('Sổ quỹ không tồn tại trong hệ thống')
        });
        return;
      }

      var updatedCashBook = await CashBook.updateOne({ id: this.req.params.id }).set({
        deletedAt: new Date().getTime(),
        updatedBy: this.req.loggedInUser.id
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      this.res.json({
        status: true,
        data: updatedCashBook
      });
    }
  };
  