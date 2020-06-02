module.exports = {
  friendlyName: "Delete Income Expense Type",

  description: "Delete Income Expense Type",

  fn: async function() {
    let req = this.req;

    let foundIncomeExpenseType = await IncomeExpenseCardType.findOne(req, { id: this.req.params.id })

    let deletedIncomeExpenseType = await IncomeExpenseCardType.update(req, { id: this.req.params.id })
      .set({ deletedAt: new Date().getTime(), updatedBy: this.req.loggedInUser.id })
      .intercept({ name: "UsageError" }, () => {
        this.res.json({
          status: false,
          error: sails.__("Thông tin yêu cầu không hợp lệ")
        });
        return;
      }).fetch();
    
    //tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.INCOME_EXPENSE_TYPE,
      action: sails.config.constant.ACTION.DELETE,
      objectId: this.req.params.id,
      objectContentOld: foundIncomeExpenseType,
      objectContentNew: deletedIncomeExpenseType,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }
      
    this.res.json({
      status: true,
      data: deletedIncomeExpenseType[0]
    });
  }
};
