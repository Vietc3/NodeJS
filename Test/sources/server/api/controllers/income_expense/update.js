module.exports = {
  friendlyName: "Update Income Expense",

  description: "Update Income Expense Card.",

  inputs: {
    data: {
      type: 'ref',
      required: true,
    },
  },

  fn: async function (inputs) {
    let { 
      id,
      code,
      paymentDetail, // [{cardId, payAmount}]
      amount,
      depositAmount,
      customerId, 
      customerType,
      incomeExpenseAt,
      notes, 
      updatedBy
    } = inputs.data;
    let req = this.req;

    let type = parseInt(this.req.params.type);
    let permissionName = sails.config.constant.ROLE_INCOME_EXPENSE;
    let check = await sails.helpers.checkPermission(permissionName, sails.config.constant.PERMISSION_TYPE.TYPE_ALL, this.req);
    let branchId = this.req.headers['branch-id'];

    if (!check) {
      this.res.json({
        status: false,
        error: sails.__('Không có quyền thực hiện thao tác này')
      });
      return;
    }

    
    let updatedIncomeExpense = {};
    if(type === sails.config.constant.INCOME_EXPENSE_TYPES.INCOME) {
      updatedIncomeExpense = await sails.helpers.income.update(req, {
        id,
        code,
        paymentDetail, // [{cardId, payAmount}]
        amount,
        depositAmount,
        customerId, 
        customerType,
        incomeExpenseAt,
        notes, 
        updatedBy: this.req.loggedInUser.id,
        branchId
      });
    } else{
      updatedIncomeExpense = await sails.helpers.expense.update(req, {
        id,
        code,
        paymentDetail, // [{cardId, payAmount}]
        amount,
        depositAmount,
        customerId, 
        customerType,
        incomeExpenseAt,
        notes, 
        updatedBy: this.req.loggedInUser.id,
        branchId
      });
    }

    this.res.json(updatedIncomeExpense);
  }
};
