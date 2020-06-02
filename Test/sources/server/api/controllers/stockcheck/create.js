module.exports = {
  friendlyName: "Create StockCheckCard",

  description: "Create a new stockcheck card",

  inputs: {
    stockCheckCard: {
      type: "json",
      required: true
    },
    stockCheckProducts: {
      type: "json",
      required: true
    }
  },

  fn: async function(inputs) {
    let { stockCheckCard, stockCheckProducts } = inputs;
    let branchId = this.req.headers['branch-id'];
    var newStockCheckCard = await sails.helpers.stockCheckCard.create(this.req, {
      ...stockCheckCard,
      branchId: branchId,
      products: stockCheckProducts,
      createdBy: this.req.loggedInUser.id,
      isActionLog: true
    })

    this.res.json(newStockCheckCard);
  }
};
