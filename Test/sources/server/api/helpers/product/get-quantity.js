module.exports = {
  description: 'get a quantity of product',

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
    let { productId, branchId } = inputs.data;
    let { req } = inputs;
    
    let foundProductStock = await ProductStock.find(req, {
      where: {
        productId: productId,
        branchId: branchId
      }
    });

    foundProductStock = foundProductStock[0];

    if (!foundProductStock) {
      foundProductStock = {
        productId: productId,
        branchId: branchId,
        manufacturingQuantity: 0
      }
      Object.values(sails.config.constant.STOCK_QUANTITY_LIST).map(item => foundProductStock[item] = 0);
    }

    return exits.success(foundProductStock);
  }
}