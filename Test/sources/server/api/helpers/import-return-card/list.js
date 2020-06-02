module.exports = {
  description: 'list invoice return card',

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
    let { filter, sort, limit, skip, manualFilter, manualSort, select, branchId } = inputs.data;

    let {req} = inputs;

    filter = _.extend(filter || {}, { reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER });

    let importReturns = await sails.helpers.exportCard.list(req, { 
      filter, 
      sort, 
      limit, 
      skip, 
      manualFilter, 
      manualSort, 
      select, 
      type: sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER,
      branchId
    })

    return exits.success(importReturns)
  }
}