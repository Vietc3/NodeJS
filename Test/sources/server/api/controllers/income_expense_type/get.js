module.exports = {
  friendlyName: "Get one income expense type",

  description: "Get one income expense type.",

  fn: async function() {
    let req = this.req;

    let foundIncomeExpenseCardType = await IncomeExpenseCardType.find(req, {
      where: { id: this.req.params.id }
    }).intercept({ name: "UsageError" }, () => {
				this.res.json({
					status: false,
					error: sails.__("Thông tin yêu cầu không hợp lệ")
				});
				return;
			});

    if (!foundIncomeExpenseCardType) {
      this.res.json({
        status: false,
        error: sails.__("Loại thu chi không tồn tại trong hệ thống")
      });
      return;
    }

    this.res.json({
      status: true,
      data: foundIncomeExpenseCardType
    });
  }
};
