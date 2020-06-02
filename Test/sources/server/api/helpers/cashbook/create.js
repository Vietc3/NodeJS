module.exports = {
  description: 'create cashbook',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let {
      changeValue,
      originalVoucherId,
      originalVoucherCode,
      type,
      customerId,
    } = inputs.data;
    let req = inputs.req;

    changeValue = parseFloat(changeValue) || 0;
    
    if(changeValue === 0){
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_UPDATE_DEBT)});
    }
    
    let foundIncomeExpense = await IncomeExpenseCard.findOne(req, 
      {id: id, status: {'!=': sails.config.constant.INCOME_EXPENSE_CARD_STATUS.CANCELED}
    })
    
    if(!foundIncomeExpense) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }
    
    let newRemainingValue = (foundIncomeExpense.remainingValue || 0) + changeValue;

    // Tạo record sổ quỹ
     let updateIncomeExpense = await IncomeExpenseCard.update(req, {
      id: id
    }).set({
      remainingValue: newRemainingValue
    }).fetch();
      
    return exits.success({status: true});
  }

}