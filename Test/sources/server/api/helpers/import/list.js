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
      let { filter, sort, limit, skip, manualFilter, manualSort, select, branchId } = inputs.data;

      let {req} = inputs;
  
      filter = _.extend(filter || {}, { reason: sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER });
  
      let importCards = await sails.helpers.importCard.list(req, { 
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
  
      exits.success(importCards)
    }
  }