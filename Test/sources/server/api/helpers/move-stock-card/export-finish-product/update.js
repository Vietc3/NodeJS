module.exports = {
  description: 'create import move stock card',

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
      notes,
      code,
      movedBy,
      reference,
      branchId,
      products // [{productId, quantity, stockId}]
    } = inputs.data;
    let {req} = inputs
    // chuẩn bị dữ liệu
    if(!products) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_ANY_PRODUCT)});
    }
    products = products.map(item => ({...item, quantity: parseFloat(item.quantity) || 0}))
    
    // Kiểm tra tồn tại phiếu chuyển hàng cần update
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
      changeProductQuantity[stockId][productId] = (changeProductQuantity[stockId][productId] || 0) - quantity;
      changeManufaturingQuantity[productId] = (changeManufaturingQuantity[productId] || 0) - quantity;
    });
    
    // giá trị quantity thay đổi
    products.map(item => {
      let {productId, quantity, stockId} = item;
      changeProductQuantity[stockId] = changeProductQuantity[stockId] || {};
      changeProductQuantity[stockId][productId] = (changeProductQuantity[stockId][productId] || 0) + quantity;
      changeManufaturingQuantity[productId] = (changeManufaturingQuantity[productId] || 0) + quantity;
    })

    // kiểm tra tồn tại sản phẩm và còn đủ số lượng trong kho chính hoặc kho sản xuất không
    let foundProducts = {};
    for(let stockId in changeProductQuantity) {
      for(let productId in changeProductQuantity[stockId]) {
        let quantity = changeProductQuantity[stockId][productId];
        // Kiểm tra tồn tại sản phẩm
        let foundProduct = await Product.findOne(req, {id: productId}).populate('unitId');
        if(!foundProduct) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
        }
        let foundStock = await Stock.findOne(req, { id: stockId });
              
        if (!foundStock) {
          return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
        }

        let store = sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex];

        // kiểm tra sản phẩm xuất có phải thành phẩm không
        if(foundProduct.category !== sails.config.constant.PRODUCT_CATEGORY_TYPE.FINISHED) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.IS_NOT_FINISH_PRODUCT)});
        }

        let foundProductStock = await ProductStock.findOne(req, {productId, branchId});

        if(!foundProductStock) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
        }

        
        // kiểm tra còn đủ số lượng trong kho
        if(quantity < 0 && foundProductStock[store] < -quantity) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_STOCK_QUANTITY)});
        }
        if(changeManufaturingQuantity[productId] > 0 && foundProductStock.manufacturingQuantity < changeManufaturingQuantity[productId]) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_MANUFACTURING_QUANTITY)});
        }
        
        foundProducts[productId] = {... foundProduct, ...foundProductStock};
      }
    }
      
    if(code && code !== foundMoveStockCard.code) {
      // kiểm tra có chứa tiền tố tự sinh không
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.moveStockFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }

      // kiểm tra mã phiếu đã tồn tại
      let count  = await MoveStockCard.count(req, {code});
      if(count > 0) {
        return exits.success({status: false, message: require('util').format(sails.__(sails.config.constant.INTERCEPT.EXIST_CODE), code)});
      }
    }
    
    // update phiếu chuyển kho
    let arrUpdatedMoveStockCard = await MoveStockCard.update(req, {id, branchId}).set({
      notes,
      code,
      updatedBy,
      movedBy,
      reference,
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    let updatedMoveStockCard = arrUpdatedMoveStockCard[0];
    
    // Xóa sản phẩm trong phiếu chuyển kho
    let deletedMoveStockCardProducts = await MoveStockCardProduct.destroy(req, {moveStockCardId: id}).fetch();
    
    // Thêm sản phần vào moveStockProduct
    let promises = [];
    let productPromises = [];
    for (product of products) {
      let {
        quantity,
        productId,
        stockId
      } = product;
      foundProduct = foundProducts[productId];
      
      promises.push(MoveStockCardProduct.create(req, {
        productCode: foundProduct.code,
        productName: foundProduct.name,
        productUnit: foundProduct.unitId.name,
        quantity,
        productId,
        moveStockCardId: updatedMoveStockCard.id,
        createdBy: updatedBy,
        updatedBy,
        stockId
      }).intercept('E_UNIQUE', () => {
        return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch());
    }
    
    if (Object.keys(changeProductQuantity).length) {
      for (let stockId in changeProductQuantity){
        for (let productId in changeProductQuantity[stockId]) {
          foundProduct = foundProducts[productId];

          let foundStock = await Stock.findOne(req, { id: stockId });
          if (!foundStock) {
            return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
          }
          let store = sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex];
          productPromises.push(ProductStock.update(req, {productId, branchId}).set({
            [store]: foundProduct[store] + changeProductQuantity[stockId][productId],
            // manufacturingQuantity: foundProduct.manufacturingQuantity - changeProductQuantity[productId],
            updatedBy
          }));
        }
      }
    }

    if (Object.keys(changeManufaturingQuantity).length) {
      for (let productId in changeManufaturingQuantity){
        foundProduct = foundProducts[productId];
        productPromises.push(ProductStock.update(req, { productId, branchId }).set({
          manufacturingQuantity: foundProduct.manufacturingQuantity - changeManufaturingQuantity[productId],
          updatedBy
        }));
      }
    }
      
    let createdMoveStockCardProducts = await Promise.all(promises);
    
    // Cập nhật tồn kho
    let updatedProducts = await Promise.all(productPromises);

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.EXPORT_FINISHED_PRODUCT,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: id,
      objectContentOld: {...foundMoveStockCard, products: foundMoveStockCardProducts },
      objectContentNew: {...updatedMoveStockCard, products: createdMoveStockCardProducts },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })    

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({status: true, data: updatedMoveStockCard});
  }

}