module.exports = {
  friendlyName: "Cancel Income Expense",

  description: "Cancel Income Expense Card",


  fn: async function(inputs) {
    let req = this.req;
    let type = parseInt(req.params.type);
    let permissionName = sails.config.constant.ROLE_INCOME_EXPENSE;
    let check = await sails.helpers.checkPermission(permissionName, sails.config.constant.PERMISSION_TYPE.TYPE_ALL, this.req);
    let branchId = this.req.headers['branch-id'];

    if(!check){
      this.res.json({
        status: false,
        error: sails.__('Không có quyền thực hiện thao tác này')
      });
      return;
    }
    
    let canceledIncomeExpense = {};
    if(type === sails.config.constant.INCOME_EXPENSE_TYPES.INCOME) {
      canceledIncomeExpense = await sails.helpers.income.cancel(req, {
        id: this.req.params.id,
        updatedBy: this.req.loggedInUser.id,
        branchId
      });
    } else{
      canceledIncomeExpense = await sails.helpers.expense.cancel(req, {
        id: this.req.params.id,
        updatedBy: this.req.loggedInUser.id,
        branchId
      });
    }

    this.res.json(canceledIncomeExpense);
  }
};
