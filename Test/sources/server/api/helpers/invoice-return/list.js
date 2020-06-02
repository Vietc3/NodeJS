module.exports = {
  description: 'list invoice return card',

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

    filter = _.extend(filter || {}, { reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN });

    let invoiceReturns = await sails.helpers.importCard.list(req, { 
      filter, 
      sort, 
      limit, 
      skip, 
      manualFilter,
      manualSort, 
      select, 
      branchId,
      type: sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER 
    })

    return exits.success(invoiceReturns)
  }
}