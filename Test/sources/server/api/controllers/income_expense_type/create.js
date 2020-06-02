module.exports = {
  friendlyName: "Create Income Expense Type",

  description: "Create Income Expense Type",

  inputs: {
    name: {
      required: true,
      type: "string",
      maxLength: 255
    },
		type: {
      type: 'number',
      required: true
    },
    notes: {
      type: "string",
      maxLength: 255
    }
  },

  fn: async function(inputs) {
    let { name, type, notes } = inputs;
    let req = this.req;
    
    let foundIncomeExpenseType = await IncomeExpenseCardType.findOne(req, {
      name,
			type,
      deletedAt: 0
    });

    if (foundIncomeExpenseType) {
      return { status: false, error: sails.__("Loại thu/chi đã tồn tại") };
    } else {
      let createdIncomeExpenseCardType = await IncomeExpenseCardType.create(req, {
        name,
				type,
        notes,
        createdBy: this.req.loggedInUser.id,
        updatedBy: this.req.loggedInUser.id,
      })
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
        action: sails.config.constant.ACTION.CREATE,
        objectId: createdIncomeExpenseCardType.id,
        objectContentNew: createdIncomeExpenseCardType,
        deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
        branchId: this.req.headers['branch-id']
      })

      if (!createActionLog.status) {
        return createActionLog
      }

      return { status: true, data: createdIncomeExpenseCardType };
    }
  }
};
