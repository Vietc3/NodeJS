module.exports = {
  description: 'list order cards',

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
    let { filter, sort, limit, skip, manualFilter, manualSort, branchId } = inputs.data;

    let {req} = inputs;
    
    filter = _.extend(filter || {}, { deletedAt: 0, branchId: branchId });

    let foundOrderCard = await OrderCard.find(req, {
      where: filter,
      sort: sort || 'createdAt DESC',
    }).populate("customerId")
      .intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__("Thông tin không hợp lệ") });
      });
    
    let getUser = await User.find(req, {
      select: ["id", "fullName"]
    })
    
    await _.forEach(foundOrderCard, item => {
      _.forEach(getUser, elem => {
        if ( item.createdBy === elem.id ) {          
          item.createdBy = elem;
          return;
        }
      })
    })

    foundOrderCard = sails.helpers.manualSortFilter(foundOrderCard, manualFilter, manualSort);

    return exits.success({status: true, data: limit ? foundOrderCard.slice(skip, limit + skip) : foundOrderCard, count: foundOrderCard.length});
  }

}