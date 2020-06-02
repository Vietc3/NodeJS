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
    let {id, deletedBy, branchId } = inputs.data;
    let { req} = inputs
    // kiểm tra phiếu có tồn tại
    let foundManufacturingCard = await ManufacturingCard.findOne(req, {
      where: {
        id: id,
        deletedAt: 0,
        branchId
      }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });

    if (!foundManufacturingCard) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_MANUFACTURING_CARD)});
    }
    
    let finishedProducts = await ManufacturingCardFinishedProduct.find(req, { manufacturingCardId: id });
    let oldMaterials = await ManufacturingCardMaterial.find(req, { manufacturingCardId: id });

    //kiểm tra số lượng tồn kho sản xuất của thành phẩm có đủ để xóa không
    let foundProducts = {};
    
    for (let i in finishedProducts){
      let foundProduct = await Product.findOne(req, {
        where: {
          id: finishedProducts[i].productId,
          deletedAt: 0
        }
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
  
      if (!foundProduct) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
      }

      let foundProductStock = await ProductStock.findOne(req, {productId: finishedProducts[i].productId, branchId})

      if (!foundProductStock) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
      }

      delete foundProductStock.id

      foundProducts[finishedProducts[i].productId] = {...foundProduct, ...foundProductStock};
      
      if (foundProductStock.manufacturingQuantity < finishedProducts[i].quantity) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_MANUFACTURING_QUANTITY)});
      }
    }

    for (let i in oldMaterials){
      if (!foundProducts[oldMaterials[i].productId]) {
        let foundProduct = await Product.findOne(req, {
          where: {
            id: oldMaterials[i].productId,
            deletedAt: 0
          }
        }).intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        });
    
        if (!foundProduct) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
        }

        let foundProductStock = await ProductStock.findOne(req, {productId: oldMaterials[i].productId, branchId})

        if (!foundProductStock) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
        }

        delete foundProductStock.id

        foundProducts[oldMaterials[i].productId] = {...foundProduct, ...foundProductStock};
      }
    }

    // Cập nhật trạng thái phiếu
    let arrUpdatedManufacturingCard = await ManufacturingCard.update(req, { id: id }).set({
      status: sails.config.constant.MANUFACTURING_STATUS.CANCELED,
      updatedBy: deletedBy
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    let updatedManufacturingCard = arrUpdatedManufacturingCard[0];

    //trừ tồn kho sản xuất của thành phẩm liên quan đến phiếu sản xuất
    for (let i in finishedProducts) {
      if (foundManufacturingCard.status === sails.config.constant.MANUFACTURING_STATUS.FINISHED) {
        let foundProduct = foundProducts[finishedProducts[i].productId]
        if(!foundProduct) {
          foundProduct = await Product.findOne(req, {
            where: {
              id: finishedProducts[i].productId,
              deletedAt: 0
            }
          }).intercept({ name: 'UsageError' }, () => {
            return error("Thông tin không hợp lệ");
          });
          
          if (!foundProduct) {
            return error("Không tìm thấy sản phẩm");
          }
        }
    
        await ProductStock.update(req, { productId: finishedProducts[i].productId, branchId }).set({
          manufacturingQuantity: foundProduct.manufacturingQuantity - finishedProducts[i].quantity,
        })
        
        foundProduct.manufacturingQuantity -= finishedProducts[i].quantity;
      }
    }

    //thêm tồn kho sản xuất của nguyên vật liệu liên quan đến phiếu sản xuất
    for (let i in oldMaterials) {
      if (foundManufacturingCard.status == sails.config.constant.MANUFACTURING_STATUS.FINISHED){
        let foundProduct = foundProducts[oldMaterials[i].productId]
        if(!foundProduct) {
          foundProduct = await Product.findOne(req, {
            where: {
              id: oldMaterials[i].productId,
              deletedAt: 0
            }
          }).intercept({ name: 'UsageError' }, () => {
            return error("Thông tin không hợp lệ");
          });
          
          if (!foundProduct) {
            return error("Không tìm thấy sản phẩm");
          }
        }
        
        await ProductStock.update(req, { productId: oldMaterials[i].productId, branchId }).set({
          manufacturingQuantity: foundProduct.manufacturingQuantity + oldMaterials[i].quantity,
        })
      }
    }

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: deletedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.MANUFACTURE,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: id,
      objectContentOld: {...foundManufacturingCard, finishedProducts: finishedProducts, materials: oldMaterials },
      objectContentNew: {...updatedManufacturingCard, finishedProducts: finishedProducts, materials: oldMaterials },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({status: true, data: updatedManufacturingCard});
  }

}