module.exports = {
  friendlyName: "Convert Stock Quantity",

  description: "convert stock quantity",

  inputs: {
    firstProductId: {
      type: 'number'
    },
    firstProductQuantity: {
      type: 'number'
    },
    secondProductId: {
      type: 'number'
    },
    secondProductQuantity: {
      type: 'number'
    },
    stockId: {
      type: 'number'
    }
  },

  fn: async function (inputs) {
    let {
      firstProductId,
      firstProductQuantity,
      secondProductId,
      secondProductQuantity,
      stockId
    } = inputs;
    let branchId = this.req.headers['branch-id'];
    let convert = await sails.helpers.stockCheckCard.create(this.req, {
      createdBy: this.req.loggedInUser.id,
      notes: sails.config.constant.autoCheckStockChangeStockProduct,
      branchId: branchId,
      stockId: stockId,
      products: [{
        id: firstProductId,
        differenceQuantity: -firstProductQuantity,
        reason: sails.config.constant.STOCK_CHECK_CARD_REASON.CONVERT_QUANTITY
      },
      {
        id: secondProductId,
        differenceQuantity: secondProductQuantity,
        reason: sails.config.constant.STOCK_CHECK_CARD_REASON.CONVERT_QUANTITY
      }
    ]
    });

    if (convert.status) {
      // tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(this.req, {
        userId: this.req.loggedInUser.id,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT,
        action: sails.config.constant.ACTION.EXCHANGE,
        objectId: convert.data.id,
        objectContentNew: {...convert.data, products: convert.products},
        deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
        branchId
      })

      if (!createActionLog.status) {
        return createActionLog
      }
    }

    this.res.json(convert);
  }
};
