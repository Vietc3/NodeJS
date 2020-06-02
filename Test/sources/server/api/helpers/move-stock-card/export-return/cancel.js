module.exports = {
  description: 'cancel import move stock card',

  inputs: {
    req: {
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
      updatedBy,
      branchId      
    } = inputs.data;
    let {req} = inputs
    // Kiểm tra tồn tại phiếu chuyển hàng cần cancel
    let foundMoveStockCard = await MoveStockCard.findOne(req, {id, branchId}).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    if(!foundMoveStockCard) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_MOVE_STOCK_CARD)});
    }
    
    // Lấy sản phẩm trong phiếu chuyển kho
    let foundMoveStockCardProducts = await MoveStockCardProduct.find(req, {moveStockCardId: id});
    let changeProductQuantity = {};
    let changeManufaturingQuantity = {};

    foundMoveStockCardProducts.map(item => {
      let {productId, quantity, stockId} = item;
      changeProductQuantity[stockId] = changeProductQuantity[stockId] || {};
      changeProductQuantity[stockId][productId] = (changeProductQuantity[stockId][productId] || 0) + quantity;
      changeManufaturingQuantity[productId] = (changeManufaturingQuantity[productId] || 0) + quantity;
    });
    
    // kiểm tra tồn tại sản phẩm và còn đủ số lượng trong kho chính
    let check = await sails.helpers.product.checkStockQuantity(
      req, 
      Object.keys(changeProductQuantity).map(item => ({
        stockId: item, 
        products: Object.keys(changeProductQuantity[item]).map(product => ({
          productId: product,
          quantity: changeProductQuantity[item][product]
        }))
      })), 
      branchId);
    if(!check.status) {
      return exits.success(check);
    }
    let {foundProducts} = check.data;
     
    // update phiếu chuyển kho
    let arrUpdatedMoveStockCard = await MoveStockCard.update(req, {id, branchId}).set({
      status: sails.config.constant.MOVE_STOCK_STATUS.CANCELED,
      updatedBy,
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    let canceledMoveStockCard = arrUpdatedMoveStockCard[0];
    
    // cập nhật số lượng tồn trong kho sản xuất
    let promises = [];
    if (Object.keys(changeProductQuantity).length) {
      for (let stockId in changeProductQuantity){
        for (let productId in changeProductQuantity[stockId]) {
          foundProduct = foundProducts[productId];
          let foundStock = await Stock.findOne(req, { id: stockId });

          if (!foundStock) {
            return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
          } 
          let store = sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex];
          promises.push(ProductStock.update(req, {productId, branchId}).set({
            [store]: foundProduct[store] - changeProductQuantity[stockId][productId],
            updatedBy
          }));
        }
      }
    }

    if (Object.keys(changeManufaturingQuantity).length) {
      for (let productId in changeManufaturingQuantity){
        foundProduct = foundProducts[productId];
        promises.push(ProductStock.update(req, { productId, branchId }).set({
          manufacturingQuantity: foundProduct.manufacturingQuantity + changeManufaturingQuantity[productId],
          updatedBy
        }));
      }
    }
    let updatedMoveStockCardProducts = await Promise.all(promises);

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.IMPORT_STOCK,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: id,
      objectContentOld: {...foundMoveStockCard, products: foundMoveStockCardProducts },
      objectContentNew: {...canceledMoveStockCard, products: foundMoveStockCardProducts },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }
    
    return exits.success({status: true, data: canceledMoveStockCard});
  }

}