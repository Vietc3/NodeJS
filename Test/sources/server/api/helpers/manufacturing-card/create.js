module.exports = {
  description: 'create manufacturing card',

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
      createdAt,
      notes,
      status,
      finishedProducts,
      materials,
      createdBy,
      branchId,
    } = inputs.data;
    
    let {req} = inputs
    
    // Chuẩn bị dữ liệu
    finishedProducts = (finishedProducts || []).map(item => ({...item, quantity: parseFloat(item.quantity) || 0}));
    materials = (materials || []).map(item => ({...item, quantity: parseFloat(item.quantity) || 0}));
    
    // Kiểm tra tồn tại nguyên vật liệu và số lượng còn đủ trong kho sx
    let checkedManufacturingQuantity = await sails.helpers.product.checkManufacturingQuantity(req, materials.map(item => ({productId: item.id, quantity: item.quantity})), branchId);
    let {failProduct, foundProducts} = checkedManufacturingQuantity.data;
    if(!checkedManufacturingQuantity.status) {
      return exits.success(checkedManufacturingQuantity);
    }
    
    // Kiểm tra tồn tại sản phầm cần sản xuất
    let objProducts = {};
    for (let product of finishedProducts) {
      let foundProduct = await Product.findOne(req, {id: product.id});

      if(!foundProduct) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
      }

      let foundProductStock = await ProductStock.findOne(req, {productId: product.id, branchId});
      
      if(!foundProductStock) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
      }
      delete foundProductStock.id;
      
      objProducts[product.id] = {...foundProduct, ...foundProductStock};
    }
    
    // Kiểm tra tồn tại nguyên vật liệu
    for (let material of materials) {
      let foundProductStock = await ProductStock.findOne(req, {productId: material.id, branchId});
      
      if(!foundProductStock) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
      }
      delete foundProductStock.id;

      let foundProduct = await Product.findOne(req, {id: material.id});

      if(!foundProduct) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
      }     

      objProducts[material.id] = {...foundProduct, ...foundProductStock};
    }
    
    // Kiểm tra mã phiếu có bị trùng không
    if(code) {
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

    //tạo thông tin phiếu sản xuất
    let newManufacturingCardRecord = await ManufacturingCard.create(req, {
      code,
      createdAt,
      notes,
      branchId,
      status: sails.config.constant.MANUFACTURING_STATUS.FINISHED,
      createdBy,
      updatedBy: createdBy
    }).intercept('E_UNIQUE', () => {
      return error('Phiếu sản xuất đã tồn tại');
    }).intercept({ name: 'UsageError' }, () => {
      return error("Thông tin không hợp lệ");
    }).fetch()

    //cập nhật mã phiếu sản xuất tự động
    if (!code) {
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: sails.config.constant.CARD_TYPE.manufacturingCard,
        newId: newManufacturingCardRecord.id,
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      let arrUpdatedManufacturingCardRecord = await ManufacturingCard.update(req, {id: newManufacturingCardRecord.id}).set({
        code: createdCode.data
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      
      newManufacturingCardRecord = arrUpdatedManufacturingCardRecord[0];
    }
    let createFinishedProducts = [];
    //tạo sản phẩm trong bảng ManufacturingCardFinishedProduct
    for (let product of finishedProducts) {
      let {id, quantity} = product;
      let foundProduct = objProducts[id];
      
      let newFisnishedProduct = await ManufacturingCardFinishedProduct.create(req, {
        code: foundProduct.code,
        name: foundProduct.name,
        quantity: quantity,
        manufacturingCardId: newManufacturingCardRecord.id,
        productId: foundProduct.id,
        createdBy: createdBy,
        updatedBy: createdBy
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      createFinishedProducts.push(newFisnishedProduct)
      // Thêm tồn kho sản xuất của thành phẩm
      await ProductStock.update(req, { productId: foundProduct.id, branchId }).set({
        manufacturingQuantity: foundProduct.manufacturingQuantity + quantity,
      });
      objProducts[foundProduct.id].manufacturingQuantity += quantity;
    }
    let createMaterials = [];
    for (let material of materials) {
      let {id, quantity} = material;
      let foundMaterial = objProducts[id];
      
      let newMaterial = await ManufacturingCardMaterial.create(req, {
        code: foundMaterial.code,
        name: foundMaterial.name,
        quantity: quantity,
        manufacturingCardId: newManufacturingCardRecord.id,
        productId: foundMaterial.id,
        createdBy: createdBy,
        updatedBy: createdBy
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      createMaterials.push(newMaterial)
      // Trừ tồn kho sản xuất của nguyên vật liệu
      await ProductStock.update(req, { productId: foundMaterial.id, branchId }).set({
        manufacturingQuantity: foundMaterial.manufacturingQuantity - quantity,
      });
    }

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: createdBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.MANUFACTURE,
      action: sails.config.constant.ACTION.CREATE,
      objectId: newManufacturingCardRecord.id,
      objectContentNew: {...newManufacturingCardRecord, finishedProducts: createFinishedProducts, materials: createMaterials },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({status: true, data: newManufacturingCardRecord});
  }

}