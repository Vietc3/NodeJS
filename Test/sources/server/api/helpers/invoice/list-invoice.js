module.exports = {
  description: 'get list invoice cards',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    },
    branchId: {
      type: "number"
    }
  },

  fn: async function (inputs, exits) {
    let { filter, sort, limit, skip, select, manualFilter } = inputs.data;

    let {req, branchId} = inputs;

    filter = _.extend(filter || {}, { deletedAt: 0, branchId });

    let options = {
      select: select || [
        '*',
        'customerId.id', 
        'customerId.name as customerName',
        'user.fullName as userName'
      ],
      model: Invoice, 
      filter: {...filter, ...manualFilter },
      customPopulates: `left join customer customerId on customerId.id = m.customerId left join user user on user.id = m.createdBy`,
      limit,
      skip,
      sort: sort || 'createdAt DESC',
      count: true
    };

    let {foundData, count} = await sails.helpers.customSendNativeQuery(req, options);

    exits.success({
      status: true,
      data: foundData,
      count: count
    })
  }

}