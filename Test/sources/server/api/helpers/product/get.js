module.exports = {
    description: 'get a product',
  
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

      let foundProduct = await Product.findOne(req, {
        where: {id: productId, deletedAt: 0},
      }).populate("unitId")
      .intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, error: sails.__('Sản phẩm không tồn tại trong hệ thống')});
      })
  
      if (!foundProduct) {
        return exits.success({status: false, error: sails.__('Sản phẩm không tồn tại trong hệ thống')});
      }

      let foundProductPrice = await sails.helpers.product.getPrice(req, {productId: foundProduct.id, branchId: branchId});

      let foundProductStock = await sails.helpers.product.getQuantity(req, {productId: foundProduct.id, branchId: branchId});

      foundProduct = _.extend({
        ...foundProduct,
        costUnitPrice: foundProductPrice.costUnitPrice,
        lastImportPrice: foundProductPrice.lastImportPrice,
        saleUnitPrice: foundProductPrice.saleUnitPrice,
      }, _.pick(foundProductStock, ['stockMin', 'manufacturingQuantity', ...Object.values(sails.config.constant.STOCK_QUANTITY_LIST)]))

      return exits.success({status: true, data: foundProduct});
    }
  }