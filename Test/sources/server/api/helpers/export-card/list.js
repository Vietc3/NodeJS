module.exports = {
  description: 'list export card',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    },
  },

  fn: async function (inputs, exits) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select, type, branchId } = inputs.data;

    let {req} = inputs;

    filter = _.extend(filter || {}, { deletedAt: 0 , branchId: branchId});

    let foundExportCards = await ExportCard.find(req, {
      where: filter,
      sort: sort || 'exportedAt DESC',
    }).populate("exportCardProducts")
      .intercept({ name: 'UsageError' }, () => {
        exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      });
    
    let customers = await Customer.find(req, { where: { type: type || sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER }})

    if (!customers.length) return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });

    _.forEach(foundExportCards, item => {
      _.forEach(customers, elem => {
        if ( item.recipientId == elem.id ) {
          item.customerId = elem;
          return;
        }
      })
    })

    let getUser = await User.find(req, {
      select: ["id", "fullName"]
    })
    if (!getUser.length) return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    
    await _.forEach(foundExportCards, item => {
      _.forEach(getUser, elem => {
        if ( item.createdBy === elem.id ) {          
          item.userName = elem.fullName;
          return;
        }
      })
    })

    foundExportCards = sails.helpers.manualSortFilter(foundExportCards, manualFilter, manualSort);
    
    exits.success({ data: limit ? foundExportCards.slice(skip, limit + skip) : foundExportCards, status: true, count: foundExportCards.length });
  }
}