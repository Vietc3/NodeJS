module.exports = {

    friendlyName: 'Create CashBook Record',
  
    description: 'Create a new cashbook record',
  
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
  
    fn: async function (inputs) {
      let {
        customerId,
        changeValue,
        originalVoucherId,
        type,
        notes,
      } = inputs;

      let foundCashBook = await CashBook.find({
        where: {deletedAt: 0},
        sort: 'createdAt DESC',
        limit: 1,
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.json({
          status: false,
          error: sails.__('Sổ quỹ không tồn tại trong hệ thống')
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

      let foundCustomer = await Customer.findOne({
        where: {id: customerId, deletedAt: 0}
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.json({
          status: false,
          error: sails.__('Khách hàng không tồn tại trong hệ thống')
        });
        return;
      });
  
      if (!foundCustomer) {
        this.res.json({
          status: false,
          error: sails.__('Khách hàng không tồn tại trong hệ thống')
        });
        return;
      }
      else {
        var newCashBookRecord = await CashBook.create(this.req, {
          changeValue,
          remainingValue:  foundCashBook.remainingValue + changeValue,
          originalVoucherId,
          type,
          notes,
          customerId,
          createdBy: this.req.loggedInUser.id,
          updatedBy: this.req.loggedInUser.id
        }).intercept('E_UNIQUE', () => {
          this.res.json({
            status: false,
            error: sails.__('Sổ quỹ đã tồn tại')
          });
          return;
        }).intercept({ name: 'UsageError' }, () => {
          this.res.json({
            status: false,
            error: sails.__('Thông tin sổ quỹ bị thiếu hoặc không hợp lệ')
          });
          return;
        }).fetch();
      }
     
    
      this.res.json({
        status: true,
        data: newCashBookRecord
      });
    }
  };
  