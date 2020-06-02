module.exports = {
  description: 'get stock list',

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
    let { req } = inputs;
    let { filter, select, sort, limit, skip } = inputs.data;
    
    filter = filter || {};

    let options = {
      select: select || [
        '*',
        'branchId.name',
        'branchId.name as branchName', 
        'branchId.id', 
      ],
      model: Stock, 
      filter: _.extend(filter, filter.deletedAt === undefined ? {deletedAt: 0} : {}),
      populates: ['branchId'],
      limit,
      skip,
      sort: sort || 'branchId.name ASC',
      count: true,
    };
    
    let {foundData, count} = await sails.helpers.customSendNativeQuery(req, options); 

    return exits.success({
      status: true,
      data: foundData,
      count,
    });
  }
}