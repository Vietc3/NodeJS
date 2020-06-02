module.exports = {
  friendlyName: "Update Income Expense Type",

  description: "Update Income Expense Type.",

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

    let foundIncomeExpenseCardType = await IncomeExpenseCardType.findOne(req, { id: this.req.params.id })

    let updatedIncomeExpenseCardType = await IncomeExpenseCardType.update(req, { id: this.req.params.id })
      .set({ name, type, notes, updatedBy: this.req.loggedInUser.id })
      .intercept("E_UNIQUE", () => {
        this.res.json({
          status: false,
          error: sails.__("Tên loại thu chi đã tồn tại")
        });
        return;
      })
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
      action: sails.config.constant.ACTION.UPDATE,
      objectId: this.req.params.id,
      objectContentOld: foundIncomeExpenseCardType,
      objectContentNew: updatedIncomeExpenseCardType,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: updatedIncomeExpenseCardType[0]
    });
  }
};
