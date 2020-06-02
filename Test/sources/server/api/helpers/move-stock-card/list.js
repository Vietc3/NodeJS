module.exports = {
  description: 'list move stock cards',

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
    let { filter, sort, limit, skip, manualFilter, manualSort } = inputs.data;
    let {req} = inputs
    filter = _.extend(filter || {}, { deletedAt: 0 });
    let foundMoveStockCard = await MoveStockCard.find(req, {
      where: filter,
      sort: sort || 'createdAt DESC',
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
    
    let getUser = await User.find(req, {
      select: ["id", "fullName"]
    })
    
    await _.forEach(foundMoveStockCard, item => {
      _.forEach(getUser, elem => {
        if ( item.createdBy === elem.id ) {          
          item.createdBy = elem;
          return;
        }
      })
    })

    foundMoveStockCard = sails.helpers.manualSortFilter(foundMoveStockCard, manualFilter, manualSort);

    return exits.success({status: true, data: limit ? foundMoveStockCard.slice(skip, limit + skip) : foundMoveStockCard, count: foundMoveStockCard.length});
  }

}