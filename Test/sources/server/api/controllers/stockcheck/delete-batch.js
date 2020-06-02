module.exports = {
  friendlyName: "Delete StockCheck Cards",

  description: "Delete multiple stockcheck cards",

  inputs: {
    ids: {
      type: 'json'
    },
  },

  fn: async function(inputs) {
    let ids = inputs.ids;
    if (!ids || !Array.isArray(ids) || !ids.length) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }

    let deletedStockCheckCards = await StockCheckCard.update(this.req, { id: { in: ids }}).set({
      deletedAt: new Date().getTime(),
      updatedBy: this.req.loggedInUser.id
    }).intercept({ name: 'UsageError' }, ()=>{
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    });

    this.res.json({
      status: true,
      data: deletedStockCheckCards
    });
  }
};
