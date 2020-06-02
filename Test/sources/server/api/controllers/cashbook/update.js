module.exports = {
    friendlyName: "Update Cash Book",
  
    description: "Update a cash book",
  
    inputs: {
      customerId: {
        type: 'number',
        required: true,
      },
      changeValue: {
        type: 'number'
      },
      originalVoucherId: {
        type: 'number'
      },
      type: {
        type: 'number'
      },
      notes: {
        type: 'string',
        maxLength: 250,
      },
    },
  
    fn: async function(inputs) {
      var { 
        customerId,
        changeValue,
        originalVoucherId,
        type,
        notes
      } = inputs;

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
          error: sails.__('Thông tin sổ quỹ không tồn tại trong hệ thống')
        });
        return;
      }
      else{
        var updatedCashBook = await CashBook.updateOne({ id: this.req.params.id }).set({ 
          changeValue,
          remainingValue: foundCashBook.remainingValue - foundCashBook.changeValue + changeValue,
          originalVoucherId,
          type,
          notes
        }).intercept('E_UNIQUE', () => {      
          this.res.json({
            status: false,
            error: sails.__('Sổ quỹ đã tồn tại')
          });
          return;
        }).intercept({ name: 'UsageError' }, ()=>{
          this.res.json({
            status: false,
            error: sails.__('Thông tin yêu cầu không hợp lệ')
          });
          return;
        });
      }

      this.res.json({
        status: true,
        data: updatedCashBook
      });
    }
  };
  