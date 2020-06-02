module.exports = {

  friendlyName: 'Create Product',

  description: 'Create a new product',

  inputs: {
    name: {
      type: "string"
    },
    unitId: {
      type: "number"
    },
    code: {
      type: "string"
    },
    costUnitPrice: {
      type: "number"
    },
    saleUnitPrice: {
      type: "number"
    },
    quantity: {
      type: "number"
    },
    stockMin: {
      type: "number"
    },
    productTypeId: {
      type: "number"
    },
    category: {
      type: "number"
    },
    customerId: {
      type: "number",
    },
    description: {
      type: "string"
    },
    image: {
      type: "json"
    },
    maxDiscount: {
      type: 'number'
    },
    barCode: {
      type: 'string'
    },
    stockId: {
      type: "number",
    },
    type: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let {
      name,
      costUnitPrice,
      unitId,
      code,
      saleUnitPrice,
      productTypeId,
      customerId,
      quantity,
      stockMin,
      description,
      image,
      maxDiscount,
      barCode,
      stockId,
      type
    } = inputs;
    let branchId = this.req.headers['branch-id'];
    var newProductRecord = await sails.helpers.product.create(this.req, {
      name,
      costUnitPrice,
      unitId,
      code,
      saleUnitPrice,
      productTypeId,
      customerId,
      description,
      quantity,
      stockMin,
      createdBy: this.req.loggedInUser.id,
      maxDiscount,
      barCode,
      branchId,
      stockId,
      isActionLog: true,
      type
    })
    if (newProductRecord.status) {
      if (image) await fileStorage.addToCollection(newProductRecord.data.id, "productId").member(image);
    }

    this.res.json(newProductRecord);
  }
};
