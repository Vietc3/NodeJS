module.exports = {

  friendlyName: 'Get DepositCard',

  description: 'Get list of depositCard',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select, branchId } = inputs.data;
    let req = inputs.req;

    filter = _.extend(filter || {}, { deletedAt: 0, branchId: branchId });

    foundDeposits = await DepositCard.find(req, _.pickBy({
      where: filter,
      select: select,
      sort: sort || 'createdAt DESC',
    }, value => value != undefined))
      .populate('customerId')
      .intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
      });


    foundDeposits = sails.helpers.manualSortFilter(foundDeposits, manualFilter, manualSort);

    await Promise.all(_.map(foundDeposits, async item => {
      if(item.originalVoucherId) {
        let typeIncomeExpense = await IncomeExpenseCard.findOne(req, {
          id: item.originalVoucherId
        })

        item.typeIncomeExpense = typeIncomeExpense.type
      }
      
      return item;
    }))

    return exits.success({ status: true, data: limit ? foundDeposits.slice(skip, limit + skip) : foundDeposits, count: foundDeposits.length });
  }
};