module.exports = {
  description: 'update product',

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
    var {
      id,
      name,
      code,
      unitId,
      productTypeId,
      customerId,
      notes,
      description,
      saleUnitPrice,
      costUnitPrice,
      quantity,
      stockMin,
      lastImportPrice,
      updatedBy,
      image,
      maxDiscount,
      barCode,
      branchId,
      stockId,
      isActionLog,
      type
    } = inputs.data;
    let { req } = inputs;
    let foundProduct = await Product.findOne(req, {
      where: {
        id: id
      }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__('Thông tin sản phẩm bị thiếu hoặc không hợp lệ') });
    });

    if (!foundProduct) {
      return exits.success({ status: false, message: sails.__('Sản phẩm không tồn tại trong hệ thống') });
    }

    let updatedProduct = foundProduct;
    
    //kiểm tra mã sản phẩm có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      if(foundProduct.code !== code ){
        let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.product, code);
        if(!checkExistPrefix.status){
          return exits.success(checkExistPrefix);
        }
      }
    }
    else {
      code = sails.config.cardcode.product + id;
    }
    if (barCode) {
      if (foundProduct.barCode !== barCode ) {
      let foundBarCode = await Product.find(req, { where: { barCode: barCode } })
       if ( foundBarCode.length) {
        return exits.success({ status: false, message: sails.__('Mã vạch đã tồn tại')})
        }
      }
    }
    
      updatedProduct = await Product.update(req, { id: foundProduct.id }).set(
        _.pickBy(
          {
            name: name,
            code: code,
            unitId: unitId,
            productTypeId: productTypeId,
            customerId: customerId,
            notes: notes,
            description: description,
            updatedBy: updatedBy,
            deletedAt: 0,
            maxDiscount,
            barCode,
            type
          }, value => value !== undefined)).intercept({ name: 'UsageError' }, () => {
            return exits.success({ status: false, message: sails.__('Thông tin không hợp lệ') });
          }).intercept("E_UNIQUE", () => {
            return exits.success({ status: false, message: sails.__('Mã sản phẩm đã tồn tại') });
          }).fetch();

          let foundProductPrice = await sails.helpers.product.getPrice(req, {productId: foundProduct.id, branchId: branchId});
          let foundProductStock = await sails.helpers.product.getQuantity(req, {productId: foundProduct.id, branchId: branchId});
          if(!foundProductStock) {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_PRODUCT)});
          } 

          let updateProductPrice = await ProductPrice.update(req, {
            productId: foundProduct.id, 
            branchId: branchId})
            .set({
              costUnitPrice,
              saleUnitPrice,
              lastImportPrice,
              updatedBy: updatedBy,
            }).fetch();

          let updateProductStock = await ProductStock.update(req, {
            productId: foundProduct.id, 
            branchId: branchId})
            .set({
              stockMin: stockMin,
              updatedBy: updatedBy,
            }).fetch();

      
      let foundStock = await Stock.findOne(req, { id: stockId });
        if (!foundStock) {
          return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
        } 
      if (foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]] !== quantity) {
        let createdStockCheckCard = await sails.helpers.stockCheckCard.create(req, {
          createdBy: updatedBy,
          notes: sails.config.constant.autoCheckStockUpdateProduct + code,
          branchId: branchId,
          stockId: stockId,
          products: [{
            id: foundProduct.id,
            differenceQuantity: quantity - foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]],
            reason: sails.config.constant.reasonOther
          }]
        })
        
        if (!createdStockCheckCard.status) 
          return exits.success(createdStockCheckCard)
      }

    if (isActionLog) {
      // tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT,
        action: sails.config.constant.ACTION.UPDATE,
        objectId: id,
        objectContentOld: {...foundProduct, stockId, branchId, stockQuantity: foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]],
          costUnitPrice: foundProductPrice.costUnitPrice, saleUnitPrice: foundProductPrice.saleUnitPrice, stockMin: foundProductStock.stockMin },
        objectContentNew: {...updatedProduct[0], costUnitPrice, saleUnitPrice, stockMin, stockId, branchId, stockQuantity: quantity },
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({ status: true, data: updatedProduct[0] })
  }

}