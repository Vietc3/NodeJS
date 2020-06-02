module.exports = {
  description: 'create stock check card',

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
      createdBy,
      notes,
      products, //[{id, differenceQuantity, reason}]
      code,
      checkedAt,
      branchId,
      stockId,
      isActionLog
    } = inputs.data;
    let { req } = inputs;
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.stockCheckCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    let foundStock = await Stock.findOne(req, { id: stockId });
    if (!foundStock) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
    }  

    //kiểm tra tồn kho của sản phẩm
    for(let product of products){
      let foundProduct = await Product.findOne(req, {
        where: {
          id: product.id || product.productId
        }
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__('Thông tin sản phẩm bị thiếu hoặc không hợp lệ') });
      });

      if (!foundProduct) {
        return exits.success({ status: false, message: sails.__('Sản phẩm không tồn tại trong hệ thống') });
      }
      let productId = product.id || product.productId;
      let foundProductStock = await sails.helpers.product.getQuantity(req, {productId: productId, branchId: branchId});

      if(product.differenceQuantity < 0){
        if(foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]] + product.differenceQuantity < 0) {
          return exits.success({ status: false, message: sails.__('Số lượng tồn kho của sản phẩm không đủ') });
        }
      }
    }
        
    //tạo phiếu kiểm kho
    let createdStockCheckCard = await StockCheckCard.create(req, {
      code,
      status: sails.config.constant.STOCK_CHECK_CARD_STATUS.FINISHED,
      checkedAt: checkedAt || new Date().getTime(),
      branchId: branchId,
      stockId,
      notes,
      createdBy: createdBy,
      updatedBy: createdBy
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({ status: false, message: sails.__('Thông tin không hợp lệ') });
    }).fetch();
    
    if(!code){
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: sails.config.constant.CARD_TYPE.stockCheckCard,
        newId: createdStockCheckCard.id,
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      let updatedStockCheckCard = await StockCheckCard.update(req, {
        id: createdStockCheckCard.id
      }).set(
        {
          code: createdCode.data
        })
        .intercept({ name: "UsageError" }, () => {
          return exits.success({ status: false, message: sails.__('Thông tin không hợp lệ') });
        }).fetch();
      
      createdStockCheckCard = updatedStockCheckCard[0];
    }
    let productStockChecks = []
    //tạo sản phẩm của phiếu kiểm kho
    for(let product of products){
      let foundProduct = await Product.findOne(req, {
        where: {
          id: product.id || product.productId
        }
      });
      let productId = product.id || product.productId;
      let foundProductStock = await sails.helpers.product.getQuantity(req, {productId: productId, branchId: branchId});

      let foundProductPrice = await sails.helpers.product.getPrice(req, {productId: productId, branchId: branchId});
      
      let createdStockCheckCardProduct = await StockCheckCardProduct.create(req, {
        productCode: foundProduct.code,
        productName: foundProduct.name,
        stockQuantity: foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]],
        realQuantity: foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]] + product.differenceQuantity,
        realAmount: Number((foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]] + product.differenceQuantity) * foundProductPrice.costUnitPrice).toFixed(0),
        differenceQuantity: product.differenceQuantity,
        differenceAmount: Number(product.differenceQuantity * foundProductPrice.costUnitPrice).toFixed(0),
        productId: product.id || product.productId,
        category: foundProduct.category,
        stockCheckCardId: createdStockCheckCard.id,
        createdBy: createdBy,
        updatedBy: createdBy,
        reason: product.reason
      }).intercept({ name: "UsageError" }, () => {
        return exits.success({ status: false, message: sails.__('Thông tin không hợp lệ') });
      }).fetch();
      productStockChecks.push(createdStockCheckCardProduct)
      //cập nhật lại tồn kho cho sản phẩm
      let updateProduct = await sails.helpers.product.updateQuantity(req, {
        id: product.id || product.productId, 
        stockQuantity: product.differenceQuantity,
        branchId: branchId,
        stockId: stockId
      });

      if (!updateProduct.status) 
        return exits.success(updateProduct)
    }
    // tạo nhật kí
    if (isActionLog) {
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.STOCK_CHECK,
        action: sails.config.constant.ACTION.CREATE,
        objectId: createdStockCheckCard.id,
        objectContentNew: {...createdStockCheckCard, products: productStockChecks},
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }
    
    return exits.success({ status: true, data: createdStockCheckCard, products: productStockChecks })
  }

}