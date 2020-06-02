module.exports = {
  description: 'create export finish product from manufacturing stock',

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
      code,
      movedAt,
      movedBy,
      notes,
      reason,
      reference,
      createdBy,
      branchId,
      products, // [{productId, quantity, stockId }]
    } = inputs.data;
    let { req } = inputs
    // chuẩn bị dữ liệu
    movedAt = movedAt || new Date().getTime();
    if(!products) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_ANY_PRODUCT)});
    }
    products = products.map(item => ({...item, quantity: parseFloat(item.quantity) || 0}))
    

    // Kiểm tra tồn tại sản phẩm và số lượng còn đủ trong kho chính
    let changedProductQuantity = {};
    let changeManufaturingQuantity = {};

    
    products.map(item => {
      let {productId, quantity, stockId} = item;
      changedProductQuantity[stockId] = changedProductQuantity[stockId] || {};
      changedProductQuantity[stockId][productId] = (changedProductQuantity[stockId][productId] || 0) + quantity;
      changeManufaturingQuantity[productId] = (changeManufaturingQuantity[productId] || 0) - quantity;

    })
    // Kiểm tra tồn tại sản phẩm và số lượng tồn trong kho sản xuất
    let checkedManufacturingQuantity = await sails.helpers.product.checkManufacturingQuantity(req, products, branchId);
    let {failProduct, foundProducts} = checkedManufacturingQuantity.data;
    if(!checkedManufacturingQuantity.status) {
      return exits.success(checkedManufacturingQuantity);
    }
    
    // kiểm tra sản phẩm xuất có phải thành phẩm không?
    for(let productId in foundProducts) {
      let product = foundProducts[productId];
      if(product.category !== sails.config.constant.PRODUCT_CATEGORY_TYPE.FINISHED) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.IS_NOT_FINISH_PRODUCT)});
      }
    }
    
    if(code) {
      // kiểm tra có chứa tiền tố tự sinh không
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.moveStockFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }

      // kiểm tra mã phiếu đã tồn tại
      let count  = await MoveStockCard.count({code});
      if(count > 0) {
        return exits.success({status: false, message: require('util').format(sails.__(sails.config.constant.INTERCEPT.EXIST_CODE), code)});
      }
    }
    
    // tạo phiếu chuyển kho
    let createdMoveStockCard = await MoveStockCard.create(req, {
      code,
      movedAt,
      movedBy,
      notes,
      reason,
      branchId,
      status: sails.config.constant.MOVE_STOCK_STATUS.FINISHED,
      reference,
      createdBy,
      updatedBy: createdBy,
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    
    // update code nếu không truyền code
    if(!code) {
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: sails.config.constant.CARD_TYPE.moveStock,
        newId: createdMoveStockCard.id,
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      let arrCreatedMoveStockCard = await MoveStockCard.update(req, {id: createdMoveStockCard.id, branchId}).set({
        code: createdCode.data,
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      createdMoveStockCard = arrCreatedMoveStockCard[0];
    }
    
    // Thêm sản phần vào moveStockProduct
    let promises = [];
    let productPromises = [];
    for (product of products) {
      let {
        quantity,
        productId,
        stockId
      } = product;
      let foundProduct = foundProducts[productId];
      
      promises.push(MoveStockCardProduct.create(req, {
        productCode: foundProduct.code,
        productName: foundProduct.name,
        productUnit: foundProduct.unitId.name,
        quantity,
        productId,
        moveStockCardId: createdMoveStockCard.id,
        createdBy,
        updatedBy: createdBy,
        stockId
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch());
    }

    if (Object.keys(changedProductQuantity).length) {
      for (let stockId in changedProductQuantity) {
        for (let productId in changedProductQuantity[stockId]){
          foundProduct = foundProducts[productId];
          let foundStock = await Stock.findOne(req, { id: stockId });
              
          if (!foundStock) {
            return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
          }
          let store = sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex];

          productPromises.push(ProductStock.update(req, { productId, branchId }).set({
            [store]: foundProduct[store] + changedProductQuantity[stockId][productId],
            updatedBy: createdBy
          }));
        }
      }
    }

    if (Object.keys(changeManufaturingQuantity).length) {
      for (let productId in changeManufaturingQuantity){
        foundProduct = foundProducts[productId];
        productPromises.push(ProductStock.update(req, { productId, branchId }).set({
          manufacturingQuantity: foundProduct.manufacturingQuantity + changeManufaturingQuantity[productId],
          updatedBy: createdBy
        }));
      }
    }
    
    let createdMoveStockCardProducts = await Promise.all(promises);
    
    // Cập nhật tồn kho
    let updatedProducts = await Promise.all(productPromises);

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: createdBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.EXPORT_FINISHED_PRODUCT,
      action: sails.config.constant.ACTION.CREATE,
      objectId: createdMoveStockCard.id,
      objectContentNew: {...createdMoveStockCard, products: createdMoveStockCardProducts },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }
    
    return exits.success({status: true, data: createdMoveStockCard});
  }

}