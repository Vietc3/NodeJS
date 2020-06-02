module.exports = {

  friendlyName: 'Get Product',

  description: 'Get one product',

  inputs: {

  },

  fn: async function (inputs) {
    let branchId = this.req.headers['branch-id'];
    let foundProduct = await sails.helpers.product.get(this.req,{productId: this.req.params.id, branchId: branchId});

    return foundProduct;
  }

};