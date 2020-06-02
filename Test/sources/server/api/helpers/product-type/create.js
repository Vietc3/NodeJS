module.exports = {
  description: 'create product type',

  inputs: {
    req :{
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let { name, notes, createdBy } = inputs.data;
    let { req } = inputs;
    
    let productType = await ProductType.find(req, {
      name
    });
    if (productType.length > 0) {
      return exits.success({ status: false, message: sails.__('Tên nhóm sản phẩm đã tồn tại') });
    } else {
      let createProductType = await ProductType.create(req, {
        name,
        notes,
        createdBy: createdBy,
        updatedBy: createdBy,
      })
        .intercept({ name: "UsageError" }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.EXIST_INVOICE_CODE)})
        }).fetch();

      return exits.success({ status: true, data: createProductType })
    }
  }
}