module.exports = {
  friendlyName: "Delete Income Expense Types",

  description: "Delete Income Expense Types.",

  inputs: {
    arrId: {
      required: true,
      type: "json"
    }
  },

  fn: async function(inputs) {
    let req = this.req;

    let foundIncomeExpenseCardTypes = await IncomeExpenseCardType.find(req, {where: { id: {in: inputs.arrId}} })
    
    let deletedIncomeExpenseCardTypes = await IncomeExpenseCardType.update(req, {
      where: { id: {in: inputs.arrId} }
    }).set({ deletedAt: new Date().getTime(), updatedBy: this.req.loggedInUser.id })
			.intercept({ name: "UsageError" }, () => {
				this.res.json({
					status: false,
					error: sails.__("Thông tin yêu cầu không hợp lệ")
				});
				return;
			})
      .fetch();
    
    //tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.INCOME_EXPENSE_TYPE,
      action: sails.config.constant.ACTION.DELETE,
      objectContentOld: foundIncomeExpenseCardTypes,
      objectContentNew: deletedIncomeExpenseCardTypes,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    return { status: true, data: deletedIncomeExpenseCardTypes };
  }
};
