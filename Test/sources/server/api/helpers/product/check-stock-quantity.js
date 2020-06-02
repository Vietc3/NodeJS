module.exports = {
  description: 'check product quantity whether less than stock quantity',

  inputs: {
    req: {
      type: "ref"
    },
    stockIds: { // [{stockId, products, quantity}]
      type: "ref",
      required: true
    },
    branchId: {
      type: "number"
    }
  },

  fn: async function (inputs, exits) {
    let {req, stockIds, branchId} = inputs;
    let _stocks = {};
    let foundProducts = {};
    let failProduct = [];    

    stockIds.map(stock => {
      stock.products && stock.products.map(product => {
        _stocks[stock.stockId] = _stocks[stock.stockId] || {};
        _stocks[stock.stockId][product.productId] =(_stocks[stock.stockId][product.productId] || 0) + product.quantity
      })
    })

    for (let stockId in _stocks) {
      for (let product in _stocks[stockId]) {
        let quantity = _stocks[stockId][product];
        let foundProduct = await Product.findOne(req, {id: parseInt(product), deletedAt: 0}).populate('unitId');
        
        if(!foundProduct) {
          failProduct.push(product);
          continue;
        }      
        
        let foundStock = await Stock.findOne(req, { id: stockId });

        if (!foundStock) {
          return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
        }        
      
        let foundProductStock = await sails.helpers.product.getQuantity(req, {productId: foundProduct.id, branchId: branchId});
        
        let store = sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]
        
        if(foundProductStock[store] < quantity) {
          failProduct.push(product);                     
        }
        foundProducts[product] = {...foundProduct, ...foundProductStock};
      }
      
    }

    return exits.success({status: failProduct.length === 0, data: {failProduct, foundProducts}, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_STOCK_QUANTITY)});
  }

}