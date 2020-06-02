module.exports = {
  description: 'list invoice cards',

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
    let { filter, sort, limit, skip, manualFilter, select, branchId } = inputs.data;

    let {req} = inputs;
    
    filter = _.extend(filter || {}, { deletedAt: 0, branchId });

    let options = {
      select: select || [
        '*',
        'customerId.id', 
        'customerId.name',
      ],
      model: Invoice, 
      filter: {...filter, ...manualFilter },
      customPopulates: `left join customer customerId on customerId.id = m.customerId`,
      limit,
      skip,
      sort: sort || 'createdAt DESC',
      count: true
    };

    let {foundData, count} = await sails.helpers.customSendNativeQuery(req, options);

    return exits.success({status: true, data: foundData, count: count});
  }

}