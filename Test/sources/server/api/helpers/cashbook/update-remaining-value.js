module.exports = {
  description: 'update remaining value',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: 'ref',
      required: true,
    },
  },

  fn: async function (inputs, exits) {
    let { incomeExpenseAt, changeValue, branchId } = inputs.data;
    let req = inputs.req;
    
    // // chuẩn bị data
    // changeValue = parseFloat(changeValue);
    
    // // Tìm phiếu trước thời gian cập nhật
    // let foundPreviousIncomeExpense = await IncomeExpenseCard.find(req,{
      // where: {incomeExpenseAt: {'<': incomeExpenseAt},
      // status: {'!=': sails.config.constant.INCOME_EXPENSE_CARD_STATUS.CANCELED},
      // branchId: branchId
    // },
    // limit:1
    // });
    
    // // Tìm phiếu tại thời gian cập nhật
    // let foundIncomeExpense = await IncomeExpenseCard.find(req,{
      // where: {incomeExpenseAt: {'>=': incomeExpenseAt},
      // status: {'!=': sails.config.constant.INCOME_EXPENSE_CARD_STATUS.CANCELED},
      // branchId: branchId
    // },
    // limit:1
    // });

    // // Cập nhật remainingValue từ thời gian này trở đi
    // let queryStr = "update incomeExpenseCard set remainingValue=(remainingValue + $1)"; 
    // let updatedIncomeExpenseCards = await sails.sendNativeQuery(req, queryStr, [ changeValue, foundIncomeExpense.incomeExpenseAt]);  

    return exits.success({status: true});
  }

}