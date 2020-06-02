module.exports = {
  friendlyName: "Update Product",

  description: "Update a product.",

  inputs: {
    name: {
      type: "string",
    },

    code: {
      type: "string",
    },

    unitId: {
      type: "number",
    },

    productTypeId: {
      type: "number",
    },

    notes: {
      type: "string",
    },

    category: {
       type: "number",
    },

    description: {
      type: "string",
    },

    saleUnitPrice: {
      type: "number",
    },
    quantity: {
      type: "number"
    },
    stockMin: {
      type: "number"
    },
    costUnitPrice: {
      type: "number",
    },
    customerId: {
      type: "number",
    },
    lastImportPrice: {
      type: "number",
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
    var {
      name,
      code,
      unitId,
      productTypeId,
      customerId,
      notes,
      description,
      saleUnitPrice,
      costUnitPrice,
      quantity,
      stockMin,
      lastImportPrice,
      image,
      maxDiscount,
      barCode,
      stockId,
      type
    } = inputs;
    let branchId = this.req.headers['branch-id'];

    let updatedProduct = await sails.helpers.product.update(this.req, {
      id: this.req.params.id,
      name,
      code,
      unitId,
      productTypeId,
      customerId,
      notes,
      description,
      saleUnitPrice,
      costUnitPrice,
      quantity,
      stockMin,
      lastImportPrice,
      image,
      updatedBy: this.req.loggedInUser.id,
      maxDiscount,
      barCode,
      branchId,
      stockId,
      isActionLog: true,
      type
    })
    this.res.json(updatedProduct);
  }
};
