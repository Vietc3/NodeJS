module.exports = {
  description: 'update manufacturing card',

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
      code,
      createdAt,
      notes,
      finishedProducts,
      materials,
      updatedBy,
      branchId,
    } = inputs.data;
    let { req } = inputs
    // Chuẩn bị dữ liệu
    finishedProducts = (finishedProducts || []).map(item => ({...item, quantity: parseFloat(item.quantity) || 0}));
    materials = (materials || []).map(item => ({...item, quantity: parseFloat(item.quantity) || 0}));
    
    // Kiểm tra tòn tại phiếu sản xuất
    let foundManufacturingCard = await ManufacturingCard.findOne(req, {
      where: {
        id: id,
        branchId,
        deletedAt: 0
      }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    if (!foundManufacturingCard) {
      return exits.success({status: false, message: sails.__(sails.config.constant.NOT_FOUND_MANUFACTURING_CARD)});
    }
    
    // Kiểm tra code
    if(code && code !== foundManufacturingCard.code) {
      // kiểm tra có chứa tiền tố tự sinh không
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.manufacturingCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }

      // kiểm tra mã phiếu đã tồn tại
      let count  = await ManufacturingCard.count(req, {code});
      if(count > 0) {
        return exits.success({status: false, message: require('util').format(sails.__(sails.config.constant.INTERCEPT.EXIST_CODE), code)});
      }
    }
    
    // Tìm thành phẩm của phiếu
    let foundManufacturingProducts = await ManufacturingCardFinishedProduct.find(req, {
      where: {
        manufacturingCardId: id,
      }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    // Tìm nguyên vật liệu của phiếu
    let foundManufacturingMaterials = await ManufacturingCardMaterial.find(req, {
      where: {
        manufacturingCardId: id,
      }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    // lấy sự thay đổi thành phẩm
    let changeProductQuantity = {};
    foundManufacturingProducts.map(item => changeProductQuantity[item.productId] = (changeProductQuantity[item.productId] || 0) - item.quantity)
    finishedProducts.map(item => changeProductQuantity[item.id] = (changeProductQuantity[item.id] || 0) + item.quantity)
    
    // lấy sự thay đổi nvl
    let changeMaterialQuantity = {};
    foundManufacturingMaterials.map(item => changeMaterialQuantity[item.productId] = (changeMaterialQuantity[item.productId] || 0) - item.quantity)
    materials.map(item => changeMaterialQuantity[item.id] = (changeMaterialQuantity[item.id] || 0) + item.quantity)
    
    // kiểm tra số lượng thành phẩm và nguyên vật liệu có đủ để update
    let foundProducts = {};
    for(let productId in changeProductQuantity) {
      let quantity = changeProductQuantity[productId];
      
      // Tìm sản phẩm
      let foundProduct = await Product.findOne(req, {id: productId});
      if(!foundProduct) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
      }
      
      let foundProductStock = await ProductStock.findOne(req, {productId: productId, branchId});

      if(!foundProductStock) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
      }
      delete foundProductStock.id;

      foundProducts[productId] = {...foundProduct, ...foundProductStock};
      
      if(quantity < 0 && foundProductStock.manufacturingQuantity < -quantity) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_MANUFACTURING_QUANTITY)});
      }
    }
    for(let productId in changeMaterialQuantity) {
      let quantity = changeMaterialQuantity[productId];
      // Tìm sản phẩm

      if (!foundProducts[productId]) {
        let foundProduct = await Product.findOne(req, {id: productId});
        
        if(!foundProduct) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
        }

        let foundProductStock = await ProductStock.findOne(req, {productId: productId, branchId});

        if(!foundProductStock) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
        }

        delete foundProductStock.id;

        foundProducts[productId] = {...foundProduct, ...foundProductStock};
      }      

      if(quantity > 0 && foundProducts[productId].manufacturingQuantity < quantity) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_MANUFACTURING_QUANTITY)});
      }
    }
    
    //cập nhật thông tin phiếu sản xuất
    let arrUpdatedManufacturingCard = await ManufacturingCard.update(req, { id, branchId }).set({
      code: code || foundManufacturingCard.code,
      createdAt,
      notes,
      branchId,
      updatedBy: updatedBy,
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    let updatedManufacturingCard = arrUpdatedManufacturingCard[0];
    
    // Xóa danh sách thành phẩm và nguyên vật liệu liên quan
    let destroyManufacturingProduct = await ManufacturingCardFinishedProduct.destroy(req, {manufacturingCardId: id});
    let destroyManufacturingMaterial = await ManufacturingCardMaterial.destroy(req, {manufacturingCardId: id});
    let createFinishedProducts = [];
    let createMaterials = [];
    // Tạo danh sách thành phẩm và nvl mới
    for (let product of finishedProducts){
      let {id, quantity} = product;
      let foundProduct = foundProducts[id];
      let createdManufacturingProduct = await ManufacturingCardFinishedProduct.create(req, {
        code: foundProduct.code,
        name: foundProduct.name,
        quantity: quantity,
        manufacturingCardId: updatedManufacturingCard.id,
        productId: id,
        createdBy: updatedBy,
        updatedBy
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      createFinishedProducts.push(createdManufacturingProduct)
      // cập nhật tồn kho sản xuất của thành phẩm
      await ProductStock.update(req, { productId: id, branchId }).set({
        manufacturingQuantity: foundProduct.manufacturingQuantity + changeProductQuantity[id],
      });
      foundProduct.manufacturingQuantity += changeProductQuantity[id];
      delete changeProductQuantity[id]
    }

    let promiseProduct = [];

    for (let productId in changeProductQuantity) {
      let foundProduct = foundProducts[productId];
      promiseProduct.push(ProductStock.update(req, { productId, branchId }).set({
        manufacturingQuantity: foundProduct.manufacturingQuantity + changeProductQuantity[productId],
      }))
    }

    if (promiseProduct.length)
      await Promise.all(promiseProduct);
    
    for (let product of materials){
      let {id, quantity} = product;
      let foundProduct = foundProducts[id];
      let createdManufacturingProduct = await ManufacturingCardMaterial.create(req, {
        code: foundProduct.code,
        name: foundProduct.name,
        quantity: quantity,
        manufacturingCardId: updatedManufacturingCard.id,
        productId: id,
        createdBy: updatedBy,
        updatedBy
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      createMaterials.push(createdManufacturingProduct)
      // cập nhật tồn kho sản xuất của thành phẩm
      await ProductStock.update(req, { productId: id, branchId }).set({
        manufacturingQuantity: foundProduct.manufacturingQuantity - changeMaterialQuantity[id],
      });
      foundProduct.manufacturingQuantity -= changeMaterialQuantity[id];

      delete changeMaterialQuantity[id]
    }

    let promiseMaterial = [];

    for (let productId in changeMaterialQuantity) {
      let foundProduct = foundProducts[productId];

      promiseMaterial.push(ProductStock.update(req, { productId, branchId }).set({
        manufacturingQuantity: foundProduct.manufacturingQuantity - changeMaterialQuantity[productId],
      }))
    }
    
    if (promiseMaterial.length)
      await Promise.all(promiseMaterial);

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.MANUFACTURE,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: id,
      objectContentOld: {...foundManufacturingCard, finishedProducts: foundManufacturingProducts, materials: foundManufacturingMaterials },
      objectContentNew: {...updatedManufacturingCard, finishedProducts: createFinishedProducts, materials: createMaterials },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })
    
    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({status: true, data: updatedManufacturingCard});
  }

}