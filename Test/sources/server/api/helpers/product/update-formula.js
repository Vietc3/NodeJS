module.exports = {
  description: 'update formula',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    },
    productId: {
      type: "string",
    },
    loggedInUser: {
      type: 'number',
    }
  },

  fn: async function (inputs, exits) {
    let { data, productCode, loggedInUser } = inputs.data;
    let { req } = inputs;
    let foundProduct = await Product.findOne(req, {
      where: {
        code: productCode,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });

    if (!foundProduct) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT) });
    }
    
    //cập nhật công thức cho sản phẩm
    await ManufacturingFormula.destroy(req, { productId: foundProduct.id });
    let productFormulas = [];

    for (let i in data) {
      let foundMaterial = await Product.findOne(req, { code: i });

      if(!foundMaterial) {
        return exits.success({ status: false, data:  {err: i }, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT) })
      }

      let foundMaterialFormula = await ManufacturingFormula.create(req, {
        productId: foundProduct.id,
        materialId: foundMaterial.id,
        quantity: Number(data[i]),
        createdBy: loggedInUser,
        updatedBy: loggedInUser,
      }).fetch();

      productFormulas.push(foundMaterialFormula);
    };

    if (foundProduct.category === sails.config.constant.PRODUCT_CATEGORY_TYPE.MATERIAL)
      await Product.update(req, { id: foundProduct.id }).set({ category: sails.config.constant.PRODUCT_CATEGORY_TYPE.FINISHED }).fetch();

    return exits.success({ status: true, data: productFormulas })
  }

}