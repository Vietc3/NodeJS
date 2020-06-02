module.exports = {
  friendlyName: "Update StockCheckCard",

  description: "Update one stockcheck card",

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

  fn: async function (inputs) {
    var { stockCheckCard, stockCheckProducts } = inputs;
    var updatedStockCheckCard = await sails.helpers.stockCheckCard.update(this.req, {
      id: this.req.params.id,
      ...stockCheckCard,
      products: stockCheckProducts,
      updatedBy: this.req.loggedInUser.id,
    })

    this.res.json(updatedStockCheckCard);
  }
};
