module.exports = {

    friendlyName: 'Get Income/expense Card',
  
    description: 'Get one income/expense Card',
  
    inputs: {
  
    },
  
    fn: async function (inputs) {
      let foundIncomeExpenseCard = await IncomeExpenseCard.findOne({
        where: {id: this.req.params.id,deletedAt: 0}
      });
  
      if (!foundIncomeExpenseCard) {
        this.res.status(400).json({
          status: false,
          error: sails.__('Phiếu không tồn tại trong hệ thống')
        });
        return;
      }
      
      this.res.json({
        status: true,
        data: foundIncomeExpenseCard
      });
    }
  
  };
  