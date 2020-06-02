module.exports = {
  description: 'get model related to expense card type id',
  
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
    let {expenseCardTypeCode, expenseCardTypeId} = inputs.data;
    let req = inputs.req;

    let paymentModel = null;
    let modelHelper = null;
    let reason = null;
    let cardType = null;

    let foundIncomeExpenseTypes = await IncomeExpenseCardType.find(req, _.pickBy({code: expenseCardTypeCode, id: expenseCardTypeId}, value => value !== undefined));
    let foundIncomeExpenseType = foundIncomeExpenseTypes[0];
    
    if(foundIncomeExpenseType.code === sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT.code){
      paymentModel = ImportCard;
      modelHelper = sails.helpers.importCard;
      reason = sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER;
      cardType = 'import';
      canceledStatus = sails.config.constant.IMPORT_CARD_STATUS.CANCELED;
    } else if(foundIncomeExpenseType.code === sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN.code){
      paymentModel = ImportCard;
      modelHelper = sails.helpers.invoiceReturn;
      reason = sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN;
      cardType = 'invoiceReturn';
      canceledStatus = sails.config.constant.INVOICE_RETURN_CARD_STATUS.CANCELED;
    }
    
    return exits.success({status: true, data: {paymentModel, modelHelper, reason, cardType, incomeExpenseCardTypeId: foundIncomeExpenseType.id}});
  }

}