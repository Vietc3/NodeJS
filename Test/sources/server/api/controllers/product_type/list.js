const _ = require("lodash");

module.exports = {
  friendlyName: "Get data Product Type",

  description: "Get data Product Type.",
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
    select: {
      type: "json"
    }
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select } = inputs;
    
    filter = _.extend(filter || {}, { deletedAt: 0});

    let foundProductsTypes = await ProductType.find(this.req,
      _.pickBy(
        {
          where: filter,
          sort: sort || "name ASC",
          select: select
        }, value => value != undefined)).intercept({ name: "UsageError" }, () => {
          this.res.status(400).json({
            status: false,
            error: sails.__("Thông tin yêu cầu không hợp lệ")
          });
          return;
        });

    let countProduct = await Promise.all(_.map(foundProductsTypes, item => {
      return Product.count(this.req,{
        productTypeId: item.id,
        deletedAt: 0
      }).intercept({ name: "UsageError" }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__("Thông tin yêu cầu không hợp lệ")
        });
      });
    }))

    _.forEach(foundProductsTypes, (item, index) => {
      item.productsCount = countProduct[index]
    })

    foundProductsTypes = sails.helpers.manualSortFilter(foundProductsTypes, manualFilter, manualSort);

    this.res.json({
      status: true,
      data: limit ? foundProductsTypes.slice(skip, limit + skip) : foundProductsTypes,
      count: foundProductsTypes.length
    });
  }
};
