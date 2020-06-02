module.exports = {
  description: 'get stock',
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
    let { id, branchId } = inputs.data;
    let {req} = inputs;
    
    let foundStock = await Stock.findOne(req, {
        where: { id: id }
      }).intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        });
    
    if (!foundStock) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
    }

    let checkBanch = await sails.helpers.checkBranch(foundStock.branchId, req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }

    return exits.success({ status: true, data: foundStock});;
  }
}