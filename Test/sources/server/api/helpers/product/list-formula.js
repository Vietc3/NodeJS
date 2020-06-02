module.exports = {
  description: 'get formulas',

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
    let { filter, sort, limit, skip, manualFilter, manualSort, select, selectArrayId } = inputs.data;
    let { req } = inputs;

    filter = _.extend(filter || {}, { deletedAt: 0 });

    let options = {
      select: select || [
        '*',
        'materialId.name',
        'materialId.code',
        'productId.name',
        'productId.code' ],
      model: ManufacturingFormula, 
      filter: {...filter, ...manualFilter}, 
      populates: ['productId', 'materialId'],
      limit,
      skip,
      sort: sort || 'updatedAt DESC',
      selectArrayId,
      count: true
    };
    
    let {foundData, count} = await sails.helpers.customSendNativeQuery(req, options);   

    return exits.success({ status: true, data: foundData, count});

  }
}