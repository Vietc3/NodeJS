module.exports = {
    friendlyName: "Create Debt, CashBook, Income/Expense",
  
    description: "Create debt, cashbook, income/expense",
  
    inputs: {
      code: {
        type: 'string',
        required: true,
        maxLength: 50,
      },
      idCard: {
        type: 'number'
      },
      finalAmount: {
        type: 'number'
      },
      customerId: {
        type: 'number',
        required: true,
      },
      userId: {
        type: 'string',
      },
      type: {
        type: 'string'
      },
      paidAmount: {
        type: 'number'
      },
      debtAmount: {
        type: 'number'
      },
    },
  
    fn: async function (inputs, exits) {
      var {
        code,
        idCard,
        finalAmount,
        customerId,
        userId,
        type,
        paidAmount,
        debtAmount,
      } = inputs;
      
        let foundCustomer = await Customer.findOne({
          where: {id: customerId}
        }).intercept({ name: 'UsageError' }, ()=>{
          throw 'Thông tin không hợp lệ';
        });
  
        if (!foundCustomer) {
          throw "Khách hàng không tồn tại trong hệ thống";
        }
        else {
          var firstDebtRecord = await Debt.create({
            changeValue: finalAmount,
            remainingValue: foundCustomer.totalOutstanding + finalAmount,
            originalVoucherId: code,
            notes: sails.config.constant.autoDeptCardCreate + type + sails.config.constant.space + code,
            customerId: foundCustomer.id,
            type: (type == sails.config.constant.import ||  type == sails.config.constant.invoiceReturn) ? 
              sails.config.constant.INCOME_EXPENSE_TYPE.TYPE_RECEIPT
            : sails.config.constant.INCOME_EXPENSE_TYPE.TYPE_PAYMENT,
            createdBy: userId,
            updatedBy: userId
          }).intercept('E_UNIQUE', () => {
            throw 'Công nợ đã tồn tại';
          }).intercept({ name: 'UsageError' }, () => {
            throw 'Thông tin không hợp lệ';
          }).fetch();
  
          let foundCashBook = await CashBook.find({
            where: {deletedAt: 0},
            sort: 'createdAt DESC',
            limit: 1,
          }).intercept({ name: 'UsageError' }, ()=>{
            throw 'Thông tin không hợp lệ';
          });
  
          let remainingCashBook = foundCashBook[0] && foundCashBook[0].remainingValue ? foundCashBook[0].remainingValue : 0;
          var newCashBookRecord = await CashBook.create({
            changeValue : finalAmount,
            remainingValue:  Number(remainingCashBook + finalAmount),
            originalVoucherId: code,
            customerId: customerId,
            notes: sails.config.constant.autoCashBookCreate + type + sails.config.constant.space + code,
            createdBy: userId,
            updatedBy: userId
          }).intercept('E_UNIQUE', () => {
            throw 'Sổ quỹ đã tồn tại';
          }).intercept({ name: 'UsageError' }, () => {
            throw 'Thông tin không hợp lệ';
          }).fetch();

          let incomeExpenseCardTypeId;
          if(type == sails.config.constant.import)
            incomeExpenseCardTypeId = sails.config.constant.AUTO_INCOME_EXPENSE_TYPE.PAYMENT_IMPORT;

          else if(type == sails.config.constant.invoice)
            incomeExpenseCardTypeId = sails.config.constant.AUTO_INCOME_EXPENSE_TYPE.RECEIPT_INVOICE;

          else if(type == sails.config.constant.invoiceReturn)
            incomeExpenseCardTypeId = sails.config.constant.AUTO_INCOME_EXPENSE_TYPE.PAYMENT_INVOICE_RETURN;

          else
            incomeExpenseCardTypeId = sails.config.constant.AUTO_INCOME_EXPENSE_TYPE.RECEIPT_IMPORT_RETURN;
  
          let createdIncomeExpenseCard = await IncomeExpenseCard.create({
            type : (type == sails.config.constant.import ||  type == sails.config.constant.invoiceReturn) ? 
              sails.config.constant.INCOME_EXPENSE_TYPE.TYPE_PAYMENT
              : sails.config.constant.INCOME_EXPENSE_TYPE.TYPE_RECEIPT,
            incomeExpenseAt : new Date().getTime(),
            notes: ((type == sails.config.constant.import || type ==  sails.config.constant.invoiceReturn) ? sails.config.constant.autoExpenseCreate : sails.config.constant.autoIncomeCreate) 
                    + type + sails.config.constant.space + code,
            customerId: customerId,
            originalInvoiceId: idCard,
            amount : (type == sails.config.constant.import || type ==  sails.config.constant.invoiceReturn) ? -finalAmount : finalAmount,
            paymentType: sails.config.constant.tempCard,
            incomeExpenseCardTypeId: incomeExpenseCardTypeId,
            createdBy: userId,
            updatedBy: userId
          })
            .intercept({ name: "UsageError" }, () => {
              throw "Thông tin không hợp lệ";
            })  
            .fetch();
      
          let updatedIncomeExpenseCard = await IncomeExpenseCard.updateOne({
            id: createdIncomeExpenseCard.id
          })
            .set({ code: ((type == sails.config.constant.import || type ==  sails.config.constant.invoiceReturn) ? sails.config.cardcode.expenseFirstCode : sails.config.cardcode.incomeFirstCode) + createdIncomeExpenseCard.id })
            .intercept({ name: "UsageError" }, () => {
              throw "Thông tin không hợp lệ"
            });
  
          var secondDebtRecord = await Debt.create({
            changeValue: type == sails.config.constant.invoice ? -paidAmount : -finalAmount,
            remainingValue: type == sails.config.constant.invoice ? (foundCustomer.totalOutstanding + debtAmount) : foundCustomer.totalOutstanding,
            originalVoucherId: code,
            notes: sails.config.constant.autoDeptCardPaid + type + sails.config.constant.space + code,
            customerId: foundCustomer.id,
            type: (type == sails.config.constant.import ||  type == sails.config.constant.invoiceReturn) ? 
              sails.config.constant.INCOME_EXPENSE_TYPE.TYPE_PAYMENT
            : sails.config.constant.INCOME_EXPENSE_TYPE.TYPE_RECEIPT,
            createdBy: userId,
            updatedBy: userId
          }).intercept('E_UNIQUE', () => {
            throw 'Công nợ đã tồn tại';
          }).intercept({ name: 'UsageError' }, () => {
            throw "Thông tin không hợp lệ";
          }).fetch();
          
          if(type == sails.config.constant.invoice){
              var updatedCustomer = await Customer.updateOne({ id: customerId }).set({
                totalOutstanding: secondDebtRecord.remainingValue
              }).intercept({ name: 'UsageError' }, ()=>{
                throw 'Thông tin không hợp lệ';
              });
            }
        }
        return exits.success() ;
    }
};
  