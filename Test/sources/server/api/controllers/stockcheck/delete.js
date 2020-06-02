module.exports = {
  friendlyName: "Delete StockCheckCard",

  description: "Delete one stockcheck card.",

  fn: async function(inputs) {
    let branchId = this.req.headers['branch-id'];
    let deletedStockCheckCard = await StockCheckCard.update(this.req, { id: this.req.params.id, branchId: branchId })
      .set({ deletedAt: new Date().getTime() })
      .fetch();

    this.res.json({
      status: true,
      data: deletedStockCheckCard[0]
    });
  }
};
