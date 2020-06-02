module.exports = {
  description: 'create product',

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
      name,
      costUnitPrice,
      unitId,
      code,
      saleUnitPrice,
      productTypeId,
      customerId,
      quantity,
      stockMin,
      description,
      image,
      createdBy,
      maxDiscount,
      barCode,
      branchId,
      stockId,
      isActionLog,
      type
    } = inputs.data;
    let { req } = inputs;
    
    //kiểm tra mã sản phẩm có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.product, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    if (barCode) {
      let foundBarCode = await Product.find(req, { where: { barCode: barCode } })
      if (foundBarCode.length) return exits.success({ status: false, message: sails.__('Mã vạch đã tồn tại')})
    }
    
    let newProductRecord = await Product.create(req, {
      name,
      unitId,
      code,
      productTypeId,
      customerId,
      description,
      category: sails.config.constant.PRODUCT_CATEGORY_TYPE.MATERIAL,
      barCode,
      createdBy: createdBy,
      updatedBy: createdBy,
      maxDiscount: maxDiscount || 100,
      type
    }).intercept('E_UNIQUE', () => {
      return exits.success({ status: false, message: sails.__('Mã sản phẩm đã tồn tại') });
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__('Thông tin sản phẩm bị thiếu hoặc không hợp lệ') });
    }).fetch();

    let updateCodeProduct = newProductRecord;
    
    if (!code) {
      updateCodeProduct = await Product.update(req, { id: newProductRecord.id }).set({
        code: sails.config.cardcode.product + newProductRecord.id
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__('Thông tin không hợp lệ') });
      }).fetch();
      updateCodeProduct = updateCodeProduct[0];
    }

    let productBranchs = await Branch.find(req, { deletedAt: 0 });

    let arrProductBranch = [];
    
    _.forEach(productBranchs, item => {
      arrProductBranch.push(ProductPrice.create(req, {
        productId: updateCodeProduct.id, 
        branchId: item.id,
        costUnitPrice: branchId == item.id ? costUnitPrice : 0,
        saleUnitPrice: branchId == item.id ? saleUnitPrice : 0,
        lastImportPrice: 0,
        createdBy: createdBy,
        updatedBy: createdBy,
      }))
  
      arrProductBranch.push(ProductStock.create(req, {
        productId: updateCodeProduct.id, 
        branchId: item.id,
        stockMin: branchId == item.id ? stockMin : 0,
        manufacturingQuantity: 0,
        createdBy: createdBy,
        updatedBy: createdBy,
      }))
    })

    await Promise.all(arrProductBranch)

    if (quantity) {
      let createdStockCheckCard = await sails.helpers.stockCheckCard.create(req, {
        createdBy,
        notes: sails.config.constant.autoCheckStockCreateProduct + (code ? code : updateCodeProduct.code),
        branchId: branchId,
        stockId,
        products: [{
          id: updateCodeProduct.id,
          differenceQuantity: quantity,
          reason: sails.config.constant.reasonOther
        }]
      })

      if (!createdStockCheckCard.status) 
        return exits.success(createdStockCheckCard)
    }
    
    if(isActionLog) {
      // tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT,
        action: sails.config.constant.ACTION.CREATE,
        objectId: updateCodeProduct.id,
        objectContentNew: {...updateCodeProduct, costUnitPrice, saleUnitPrice, stockMin, stockId, branchId, stockQuantity: quantity },
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({ status: true, data: {...updateCodeProduct, costUnitPrice, saleUnitPrice, stockMin, stockId, branchId } })
  }

}