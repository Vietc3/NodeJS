module.exports = {
  description: 'update import card',

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
    let {
      id,
      price,
      quantity,
      type,
      branchId
    } = inputs.data;
    
    let {req} = inputs;

    let foundProduct = await Product.findOne(req, { id: id });

    if (!foundProduct) return exits.success({ status: false, message: sails.__("Không tìm thấy sản phẩm") })

    let foundProductStock = await sails.helpers.product.getQuantity(req, {productId: id, branchId: branchId});
    const stocks = Object.values(sails.config.constant.STOCK_QUANTITY_LIST);
    let totalQuantity = 0;
    stocks.map(stock => {
      totalQuantity += foundProductStock[stock];
    })   
    let foundProductPrice = await sails.helpers.product.getPrice(req, {productId: id, branchId: branchId});

    let unitPrice;

    if (type == sails.config.constant.import) {
      if (totalQuantity <= 0) {
        unitPrice = price;
      }
      else {
        if ((totalQuantity + quantity) === 0)
          unitPrice = 0;
        else
          unitPrice = Number((foundProductPrice.costUnitPrice * totalQuantity
            + price * quantity)
            / (totalQuantity + quantity)).toFixed(0);
      }
    }
    else {
      if ((totalQuantity - quantity) === 0)
        unitPrice = 0;
      else
        unitPrice = Number(((foundProductPrice.costUnitPrice * totalQuantity)
          - (price * quantity))
          / (totalQuantity - quantity)).toFixed(0);
    }
    await ProductPrice.update(req, {productId: id, branchId: branchId}).set({
      costUnitPrice: unitPrice,
      lastImportPrice: type == sails.config.constant.import ? price : foundProductPrice.lastImportPrice
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__("Thông tin không hợp lệ") })
    }).fetch();

    return exits.success({ status: true })
  }
}