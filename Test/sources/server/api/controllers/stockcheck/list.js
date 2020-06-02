module.exports = {
  friendlyName: "Get StockCheck Cards",

  description: "Get many stockcheck cards",

  inputs: {
    filter: {
      type: "json"
    },
    manualFilter: {
      type: "json"
    },
    manualSort: {
      type: "json"
    },
    sort: {
      type: 'string',
    },
    limit: {
      type: "number"
    },
    skip: {
      type: "number"
    },
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort } = inputs;
    let branchId = this.req.headers['branch-id'];

    filter = _.extend(filter || {}, { deletedAt: 0, branchId: branchId });
    let stockCheckCards = await StockCheckCard.find(this.req, {
      where: filter,
      sort: sort || "updatedAt DESC",
    })
      .populate('stockCheckCardProducts')
      .intercept({ name: "UsageError" }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__("Thông tin yêu cầu không hợp lệ")
        });
        return;
      });

    let filteredStockCheckCards = stockCheckCards.slice().map(item => {
      let realQuantity = 0;
      let realAmount = 0;
      item.stockCheckCardProducts.map(o => {
        realQuantity += o.realQuantity;
        realAmount += o.realAmount;
      });

      return { ...item, realQuantity, realAmount }
    });

    let getUser = await User.find(this.req, {
      select: ["id", "fullName"]
    })
    
    await _.forEach(filteredStockCheckCards, item => {
      _.forEach(getUser, elem => {
        if ( item.createdBy === elem.id ) {          
          item.userName = elem.fullName;
          return;
        }
      })
    })
    
    filteredStockCheckCards = sails.helpers.manualSortFilter(filteredStockCheckCards, manualFilter, manualSort);

    this.res.json({
      status: true,
      data: limit ? filteredStockCheckCards.slice(skip, limit + skip) : filteredStockCheckCards,
      count: filteredStockCheckCards.length
    });
  }
};
