module.exports = {
  description: 'get order card',
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

    let foundOrder = await OrderCard.findOne(req, {
        where: { id: id }
      }).populate("customerId")
        .intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        });
    
    if (!foundOrder) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_ORDER), isBranchId: true});
    }

    let checkBanch = await sails.helpers.checkBranch(foundOrder.branchId, req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }

    let orderCardProductArray = await OrderCardProduct.find(req, { orderCardId: foundOrder.id }).populate("productId");
    
    for(let item of orderCardProductArray) {
      let productStock = await ProductStock.find(req, {productId: item.productId.id, branchId});
      
      if (productStock.length) {
        let product = productStock[0];

        let stockQuantity = 0;

        for(let index in sails.config.constant.STOCK_QUANTITY_LIST) {
          stockQuantity += product[sails.config.constant.STOCK_QUANTITY_LIST[index]]
        }

        item.productId = {...item.productId, stockQuantity: stockQuantity}
      }
      else item.productId = {...item.productId, stockQuantity: 0}
      
    }

    let createdBy = await User.findOne(req, {
      where: { id: foundOrder.createdBy },
      select: ["id", "fullName"]
    })

    if (createdBy) foundOrder.createdBy = createdBy;

    return exits.success({ status: true, data: foundOrder, orderCardProductArray });;
  }

}