const _ = require("lodash");

module.exports = {

  friendlyName: 'Get Product Units',

  description: 'Get list of product units',
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
    limit = limit || 0;
    skip = skip || 0;
    filter = _.extend(filter || {}, { deletedAt: 0 });
    let productUnitCheckCards = await ProductUnit.find(this.req,
      _.pickBy(
        {
          where: filter,
          sort: sort || "updatedAt DESC",
        }, value => value != undefined))
      .intercept({ name: "UsageError" }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__("Thông tin yêu cầu không hợp lệ")
        });
        return;
      });

    productUnitCheckCards = sails.helpers.manualSortFilter(productUnitCheckCards, manualFilter, manualSort);

    this.res.json({
      status: true,
      data: limit ? productUnitCheckCards.slice(skip, limit + skip) : productUnitCheckCards,
      count: productUnitCheckCards.length
    });
  }
};

