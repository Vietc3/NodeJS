module.exports = {
  friendlyName: "Get data Income Expense Type",

  description: "Get data Income Expense Types.",

  inputs: {
    filter: {
      type: "json"
    },
    manualFilter: {
      type: "json"
    },
    manualSort: {
      type: "json"
    },
    sort: {
      type: 'string',
    },
    limit: {
      type: "number"
    },
    skip: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort } = inputs;
    let req = this.req;
    
    filter = _.extend(filter || {});

    let foundIncomeExpenseCardTypes = await IncomeExpenseCardType.find(
      req, 
      _.pickBy(
        {
          where: filter,
          sort: sort || ["code ASC", "updatedAt DESC"],
        },
        value => value != undefined
      )
    )
      .intercept({ name: "UsageError" }, () => {
        this.res.json({
          status: false,
          error: sails.__("Thông tin yêu cầu không hợp lệ")
        });
        return;
      });
    
    foundIncomeExpenseCardTypes = sails.helpers.manualSortFilter(foundIncomeExpenseCardTypes, manualFilter, manualSort);

    this.res.json({
      status: true,
      data: skip && limit ? foundIncomeExpenseCardTypes.slice(skip, limit + skip) : foundIncomeExpenseCardTypes,
      count: foundIncomeExpenseCardTypes.length
    });
  }
};
