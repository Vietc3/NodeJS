module.exports = {

  friendlyName: 'Get Debts',

  description: 'Get debts',

  inputs: {
    filter: {
      type: 'json',
    },
    sort: {
      type: 'json',
    },
    limit: {
      type: 'number',
    },
    skip: {
      type: 'number',
    },
    manualFilter: {
      type: "json"
    },
    manualSort: {
      type: "json"
    },
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort } = inputs;
    let branchId = this.req.headers['branch-id'];

    filter = _.extend(filter || {}, { deletedAt: 0 });

    let foundDebtCards = await Debt.find(this.req, {
      where: filter,
      sort: sort || 'createdAt DESC',
    }).populate("customerId")
      .intercept({ name: 'UsageError' }, () => {
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        })
        return;
      });

    foundDebtCards = sails.helpers.manualSortFilter(foundDebtCards, manualFilter, manualSort);

    let getUser = await User.find(this.req, {
      select: ["id", "fullName"]
    })

    if (getUser) {
      _.forEach(foundDebtCards, item => {
        _.forEach(getUser, elem => {
          if (item.createdBy === elem.id) {
            item.createdBy = { ...elem }
          }
        })
      })
    }

    this.res.json({
      status: true,
      data: limit ? foundDebtCards.slice(skip, limit + skip) : foundDebtCards,
      count: foundDebtCards.length,
    });
  }
};
