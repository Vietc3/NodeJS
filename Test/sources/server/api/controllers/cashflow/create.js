module.exports = {

    friendlyName: 'Create Income/expense Card',
  
    description: 'Create a new income/expense Card',
  
    inputs: {
      code: {
        type: 'string',
        maxLength: 50,
        required: true
      },
      type: {
          type: 'number',
          required: true
      },
      incomeExpenseAt: {
          type: 'number',
          required: true
      },
      notes: {
          type: 'string',
          maxLength: 250,
      },
      amount: {
          type: 'number'
      },
      customerId: {
        type: 'number',
        required: true
      },
      originalInvoiceId:{
        type: 'number',
        required: true
      }
    },
  
    fn: async function (inputs) {
      let {
        code,
        type,
        notes,
        incomeExpenseAt,
        amount,
        originalInvoiceId,
        customerId
      } = inputs;

      var newIncomeExpenseCardRecord = await IncomeExpenseCard.create(this.req, {
        code,
        type,
        notes,
        amount,
        incomeExpenseAt:incomeExpenseAt,
        originalInvoiceId:originalInvoiceId,
        customerId:customerId,
        createdBy: this.req.loggedInUser.id,
        updatedBy: this.req.loggedInUser.id
      }).intercept('E_UNIQUE', () => {
        this.res.status(400).json({
          status: false,
          error: sails.__('Mã phiếu đã tồn tại trong hệ thống')
        });
        return;
      }).intercept({ name: 'UsageError' }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin phiếu bị thiếu hoặc không hợp lệ')
        });
        return;
      }).fetch();
  
      this.res.json({
        status: true,
        data: newIncomeExpenseCardRecord
      });
    }
  };
  