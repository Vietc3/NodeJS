module.exports = {
  friendlyName: "Get Income Expense",

  description: "Get one income expense card.",

  fn: async function(inputs) {
    let req = this.req;
    let type = parseInt(req.params.type);
    let permissionName = sails.config.constant.ROLE_INCOME_EXPENSE;
    let check = await sails.helpers.checkPermission(permissionName, sails.config.constant.PERMISSION_TYPE.TYPE_VIEW_ONLY, this.req);

    if(!check){
      this.res.json({
        status: false,
        error: sails.__('Không có quyền thực hiện thao tác này')
      });
      return;
    }
    let foundIncomeExpense = {};
    
    if(type === sails.config.constant.INCOME_EXPENSE_TYPES.INCOME) {
      foundIncomeExpense = await sails.helpers.income.get(req, {
        id: this.req.params.id
      });
    } else{
      foundIncomeExpense = await sails.helpers.expense.get(req, {
        id: this.req.params.id
      });
    }

    this.res.json(foundIncomeExpense);
  }
};
