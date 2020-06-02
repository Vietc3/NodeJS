module.exports = {
  description: 'list import card',

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
    
    filter = _.extend(filter || {}, { deletedAt: 0, branchId: branchId});

    let options = {
      select: select || [
        '*',
        'recipientId.id', 
        'recipientId.name',
      ],
      model: ImportCard, 
      filter: {...filter, ...manualFilter },
      customPopulates: `left join customer recipientId on recipientId.id = m.recipientId`,
      limit,
      skip,
      sort: sort || 'createdAt DESC',
      count: true
    };

    let {foundData, count} = await sails.helpers.customSendNativeQuery(req, options);
    
    exits.success({ data: foundData, status: true, count: count});
  }
}