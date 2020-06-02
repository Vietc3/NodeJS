module.exports = {
  description: 'get a price of product',

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

    let foundProductPrice = await ProductPrice.find(req, {
      where: {
        productId: productId,
        branchId: branchId
      }
    });
    foundProductPrice = foundProductPrice[0];

    if(!foundProductPrice){
      foundProductPrice = {
        productId: productId,
        branchId: branchId,
        costUnitPrice: 0,
        lastImportPrice: 0,
        saleUnitPrice: 0
      }
    }

    return exits.success(foundProductPrice);
  }
}