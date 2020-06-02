module.exports = {
  description: 'create product unit',

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
    let {
      name,
      createdBy
    } = inputs.data;
    let { req } = inputs;

    let foundProductUnit = await ProductUnit.find(req, {
      name
    });
    if (foundProductUnit.length > 0) {
      return exits.success({ status: false, message: sails.__('Đơn vị tính sản phẩm đã tồn tại') });
    }

    let newProductUnitRecord = await ProductUnit.create(req, {
      name,
      createdBy: createdBy,
      updatedBy: createdBy,
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__('Đơn vị tính sản phẩm bị thiếu hoặc không hợp lệ') });
    }).fetch();

    return exits.success({ status: true, data: newProductUnitRecord })
  }

}