module.exports = {
  friendlyName: "Create Income Expense",

  description: "Create Income Expense",

  inputs: {
    data: {
      type: 'ref',
      required: true,
    },
  },

  fn: async function (inputs) {
    let req = this.req;
    let type = parseInt(req.params.type);
    let permissionName = sails.config.constant.ROLE_INCOME_EXPENSE;
    let check = await sails.helpers.checkPermission(permissionName, sails.config.constant.PERMISSION_TYPE.TYPE_ALL, this.req);

    if (!check) {
      this.res.json({
        status: false,
        message: sails.__('Không có quyền thực hiện thao tác này')
      });
      return;
    }
    
    let { 
      code, 
      notes, 
      customerId, 
      customerType,
      originalInvoiceId, 
      incomeExpenseAt,
      incomeExpenseCardTypeId,
      paymentDetail, // [{cardId, payAmount}]
      depositAmount,
      amount,
    } = inputs.data;
    let createdIncomeExpense = {};
    let branchId = this.req.headers['branch-id'];
    if(type === sails.config.constant.INCOME_EXPENSE_TYPES.INCOME) {
      createdIncomeExpense = await sails.helpers.income.create(req, {
        code, 
        notes, 
        customerId, 
        customerType,
        originalInvoiceId, 
        incomeExpenseAt, 
        incomeExpenseCardTypeId,
        paymentDetail, // [{cardId, payAmount}]
        depositAmount,
        amount,
        createdBy: this.req.loggedInUser.id,
        branchId,
        isActionLog: true
      });
    } else{
      createdIncomeExpense = await sails.helpers.expense.create(req, {
        code, 
        notes, 
        customerId, 
        customerType,
        originalInvoiceId, 
        incomeExpenseAt, 
        incomeExpenseCardTypeId,
        paymentDetail, // [{cardId, payAmount}]
        depositAmount,
        amount,
        createdBy: this.req.loggedInUser.id,
        branchId,
        isActionLog: true
      });
    }

    this.res.json(createdIncomeExpense);
  }
};