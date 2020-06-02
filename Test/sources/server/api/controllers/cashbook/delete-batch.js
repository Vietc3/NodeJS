module.exports = {
    friendlyName: "Delete Cash Books",
  
    description: "Delete multiple cash books",
  
    inputs: {
      ids: {
        type: 'json'
      },
      
    },
  
    fn: async function(inputs) {
      let ids = inputs.ids;
  
      if (!ids || !Array.isArray(ids) || !ids.length) {
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      }
  
      let deletedCashBooks = await CashBook.update({ id: { in: ids }}).set({
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
        data: deletedCashBooks
      });
    }
  };
  