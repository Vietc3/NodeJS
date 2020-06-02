module.exports = {
    friendlyName: "Update Income/expense Card",
  
    description: "Update a income/expense Card.",
  
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
        }
    },
  
    fn: async function(inputs) {
      var { 
        code,
        type,
        incomeExpenseAt,
        notes,
        amount,
      } = inputs;

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
  
      //TODO: xử lý hình ảnh upload
  
      var updatedIncomeExpenseCard = await IncomeExpenseCard.updateOne({ id: this.req.params.id, deletedAt: 0 }).set({
        code: code, 
        type: type,
        incomeExpenseAt: incomeExpenseAt,
        amount: amount,
        notes: notes,
        updatedBy: this.req.loggedInUser.id
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      //TODO: Cần tạo phiếu kiểm kho tự động khi thay đổi tồn kho
  
      this.res.json({
        status: true,
        data: updatedIncomeExpenseCard
      });
    }
  };
  