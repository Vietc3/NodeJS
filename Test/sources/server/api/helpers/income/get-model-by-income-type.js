module.exports = {
  description: 'get model related to income card type id',
  
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
    let {incomeCardTypeCode, incomeCardTypeId} = inputs.data;
    let req = inputs.req;
    
    let paymentModel = null;
    let modelHelper = null;
    let cardType = null;

    let foundIncomeExpenseTypes = await IncomeExpenseCardType.find(req, _.pickBy({code: incomeCardTypeCode, id: incomeCardTypeId}, value => value !== undefined));
    let foundIncomeExpenseType = foundIncomeExpenseTypes[0];

    if(foundIncomeExpenseType.code === sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE.code){
      paymentModel = Invoice;
      cardType = 'invoice';
      modelHelper = sails.helpers.invoice;
      canceledStatus = sails.config.constant.INVOICE_CARD_STATUS.CANCELED;
    } else if(foundIncomeExpenseType.code === sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN.code){
      paymentModel = ExportCard;
      modelHelper = sails.helpers.importReturnCard;
      cardType = 'importReturn';
      canceledStatus = sails.config.constant.INVOICE_RETURN_CARD_STATUS.CANCELED;
    }
    
    return exits.success({status: true, data: {paymentModel, modelHelper, cardType, incomeExpenseCardTypeId: foundIncomeExpenseType.id}});
  }

}