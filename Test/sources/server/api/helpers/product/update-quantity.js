module.exports = {
  description: 'update stock quantity',

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
    let {id, stockQuantity, manufacturingQuantity, isNegativeQuantity, branchId, stockId} = inputs.data;
    let {req} = inputs;
    
    let foundProduct = await Product.findOne(req, {
      where: {
        id: id,
      }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    
    if (!foundProduct) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
    }

    let foundStock = await Stock.findOne(req, { id: stockId });

    if (!foundStock) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
    }  

    let foundProductStock = await sails.helpers.product.getQuantity(req, {productId: id, branchId: branchId});
    
    let store = sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]
      
    //cập nhật tồn kho cho sản phẩm
    let newStockQuantity = foundProductStock[store] + (stockQuantity || 0);
    let newManufacturingQuantity = foundProductStock.manufacturingQuantity + (manufacturingQuantity || 0);
    if(!isNegativeQuantity && (newStockQuantity < 0 || newManufacturingQuantity < 0)) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NEGATIVE_QUANTITY)});
    }

    await ProductStock.update(req, { productId: id, branchId: branchId }).set({
      [store]: Number(newStockQuantity).toFixed(2), // SL tồn kho
      manufacturingQuantity: Number(newManufacturingQuantity).toFixed(2) // SL sản xuất
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    return exits.success({status: true})
  }

}