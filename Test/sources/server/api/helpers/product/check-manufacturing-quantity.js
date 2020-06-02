module.exports = {
  description: 'check product quantity whether less than manufacturing quantity',

  inputs: {
    req: {
      type: "ref"
    },
    products: { // [{productId, quantity}]
      type: "ref",
      required: true
    },
    branchId: {
      type: "number"
    }
  },

  fn: async function (inputs, exits) {
    let { req, products, branchId} = inputs;
    let _products = {};
    let foundProducts = {};
    let failProduct = [];
    
    products.map(product => _products[product.productId] = (_products[product.productId] || 0) + product.quantity)
    
    for (let productId in _products) {
      let quantity = _products[productId];
      let foundProduct = await Product.findOne(req, {id: productId, deletedAt: 0}).populate('unitId');
      
      if(!foundProduct) {
        failProduct.push(productId);
        continue;
      }

      let foundProductStock = await sails.helpers.product.getQuantity(req, {productId: foundProduct.id, branchId: branchId});
      if(foundProductStock.manufacturingQuantity < quantity) {
        failProduct.push(productId);
      }
      foundProducts[productId] = {...foundProduct, ...foundProductStock};
    }

    return exits.success({status: failProduct.length === 0, data: {failProduct, foundProducts}, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_MANUFACTURING_QUANTITY)});
  }

}