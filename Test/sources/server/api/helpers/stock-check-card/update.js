module.exports = {
  description: 'update stock check card',

  inputs: {
    req :{
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let {
      id,
      notes,
      products, //[{id, differenceQuantity, reason}]
      code,
      checkedAt,
      updatedBy
    } = inputs.data;
    let {req} = inputs;
    // Kiểm tra phiếu có tồn tại không
    let foundStockCheckCard = await StockCheckCard.findOne(req, {
      id,
      status: sails.config.constant.STOCK_CHECK_CARD_STATUS.FINISHED
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.config.constant.INTERCEPT.UsageError });
    });

    if (!foundStockCheckCard) {
      return exits.success({ status: false, message: 'Không tìm thấy phiếu kiểm kho' });
    }

    //kiểm tra mã phiếu có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if (foundStockCheckCard.code !== code && code) {
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.stockCheckCardFirstCode, code);
      if (!checkExistPrefix.status) {
        return exits.success(checkExistPrefix);
      }
    }

    if (!code)
      code = sails.config.cardcode.stockCheckCardFirstCode + id;

    let updatedStockCheckCard = await StockCheckCard.update(req, { id: id }).set(
      _.pickBy(
        {
          checkedAt,
          notes,
          code,
          updatedBy: updatedBy
        }, value => value != undefined
      )).intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: 'Thông tin không hợp lệ' });
      }).intercept("E_UNIQUE", () => {
        return exits.success({ status: false, message: 'Mã phiếu kiểm kho đã tồn tại' });
      }).fetch();

      updatedStockCheckCard = updatedStockCheckCard[0];
    let foundProductStockCheckCard = await StockCheckCardProduct.find({stockCheckCardId: id})
    await StockCheckCardProduct.destroy(req, {
      id: { nin: _.compact(_.map(products, "id")) },
      stockCheckCardId: id
    });
    let updateProductStockCheck = [];
    for (let i = 0; i < products.length; i++) {
      let stockCheckProduct = _.pick(products[i], [
        "productCode",
        "productName",
        "stockQuantity",
        "realQuantity",
        "realAmount",
        "differenceQuantity",
        "differenceAmount",
        "reason",
        "productId"
      ]);

      if (products[i].id) {
        let updateProduct = await StockCheckCardProduct.update(req, {
          id: products[i].id
        }).set(stockCheckProduct).fetch();
        updateProductStockCheck.push(updateProduct[0])
      } else {
        let createProduct = await StockCheckCardProduct.create(req, {
          ...stockCheckProduct,
          stockCheckCardId: id,
          createdBy: updatedBy,
          updatedBy: updatedBy
        }).fetch();
        updateProductStockCheck.push(createProduct)
      }
    }

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.STOCK_CHECK,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: id,
      objectContentOld: {...foundStockCheckCard, products: foundProductStockCheckCard},
      objectContentNew: {...updatedStockCheckCard, products: updateProductStockCheck},
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId: req.headers['branch-id']
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({ status: true, data: updatedStockCheckCard });
  }

}