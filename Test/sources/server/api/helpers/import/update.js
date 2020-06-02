module.exports = {
  description: 'update import card',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    },
  },

  fn: async function (inputs, exits) {
    let {
      id,
      code,
      products,
      finalAmount,
      totalAmount,
      importedAt,
      notes,
      reason,
      recipientId,
      reference,
      updatedBy,
      paidAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      branchId,
      isActionLog
    } = inputs.data;

    let {req} = inputs;
  
    
    let foundImportCard = await ImportCard.findOne(req, { id: id, branchId })
    if (!foundImportCard) {
      return exits.success({ message: sails.__("Không tìm thấy phiếu nhập"), status: false });
    }

    //kiểm tra mã phiếu có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if (foundImportCard.code !== code && code) {
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.importCardFirstCode, code);
      if (!checkExistPrefix.status) {
        return exits.success(checkExistPrefix);
      }
    }

    if (!code)
      code = foundImportCard.code
    
    //Kiểm tra lịch sử trả hàng
    let foundImportReturn = await ExportCard.findOne(req, {
      where: { reference: foundImportCard.code, reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER, status: sails.config.constant.EXPORT_CARD_STATUS.FINISHED }
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });
    if (foundImportReturn) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_UPDATE_IMPORT_BECAUSE_RETURNED) });
    }

    if (finalAmount && foundImportCard.paidAmount > finalAmount) return exits.success({ message: sails.__("Số tiền phải chi không được phép nhỏ hơn số tiền đã chi"), status: false });
    if (products && products.length > 0) {
      let changedProductQuantity = {};
      let oldProducts = await ImportCardProduct.find(req, { importCardId: id });

        for(let product of oldProducts) {
          let {productId, quantity, stockId} = product;          
          changedProductQuantity[stockId] = changedProductQuantity[stockId] || {};
          changedProductQuantity[stockId][productId] = (changedProductQuantity[stockId][productId] || 0) + quantity;
        }
        
        products.map(item => {
          let {productId, quantity, stockId} = item;
          productId = productId.id ? productId.id : productId;
          changedProductQuantity[stockId] = changedProductQuantity[stockId] || {};
          changedProductQuantity[stockId][productId] = (changedProductQuantity[stockId][productId] || 0) - quantity;
        })

        let check = await sails.helpers.product.checkStockQuantity(
          req, 
          Object.keys(changedProductQuantity).map(item => ({            
            stockId: item, 
            products: Object.keys(changedProductQuantity[item]).map(product => ({
              productId: product,
              quantity: changedProductQuantity[item][product]
            }))
          })), 
          branchId);
          if(!check.status) {      
            return exits.success({status: false, message: sails.__(check.message)});
          }
    }

    let changeValue = finalAmount - foundImportCard.finalAmount;
    //Tạo công nợ khách hàng
    if (recipientId && changeValue !== 0) {
      let createDebt = await sails.helpers.debt.create(req, {
        changeValue: changeValue,
        originalVoucherId: id,
        originalVoucherCode: code,
        type: sails.config.constant.DEBT_TYPES.UPDATE_IMPORT,
        customerId: recipientId,
        createdBy: updatedBy,
      });
      if (!createDebt.status) {
        return exits.success(createDebt);
      }
    }

    //cập nhật thông tin phiếu nhập
    let updatedImportCard = await ImportCard.update(req, { id: id }).set(_.pickBy({
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      reason,
      reference,
      products,
      updatedBy,
      paidAmount,
      importedAt,
      debtAmount: finalAmount - paidAmount,
      branchId: branchId
    }, value => value !== undefined)).intercept("E_UNIQUE", () => {
      return exits.success({ status: false, message: sails.__("Mã đã tồn tại") });
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
    }).fetch();
    let foundProductImports = await ImportCardProduct.find(req, { importCardId: id });
    let updatedProductImports = [];
    //update product
    if (products && products.length > 0) {
      for (let index in products) {
        //cập nhật các sản phẩm cũ
        let oldProduct = await ImportCardProduct.find(req, { where: { productId: products[index].productId.id ? products[index].productId.id : products[index].productId, importCardId: id } })
        if (oldProduct.length > 0) {
          for (let i in oldProduct) {
            // cập nhật lại giá vốn của sản phẩm cũ
            if (reason === sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER) {
              let updateOldPriceProduct = await sails.helpers.product.updateCostPrice(req, {
                id: products[index].productId.id ? products[index].productId.id : products[index].productId,
                price: oldProduct[i].finalAmount - (foundImportCard.totalAmount ? oldProduct[i].finalAmount*(foundImportCard.discountAmount/foundImportCard.totalAmount) : 0),
                quantity: -oldProduct[i].quantity,
                type: sails.config.constant.import,
                branchId: branchId
              });

              if (!updateOldPriceProduct.status) return exits.success(updateOldPriceProduct)              
              //cập nhật lại tồn kho của sản phẩm cũ
              let foundProduct = await sails.helpers.product.updateQuantity(req, {
                id: oldProduct[i].productId,
                stockQuantity: -oldProduct[i].quantity,
                isNegativeQuantity: true,
                branchId: branchId,
                stockId: oldProduct[i].stockId
              });
            }
          }
          let importCardProductArray = await ImportCardProduct.destroy(req, { importCardId: id, productId: products[index].productId.id ? products[index].productId.id : products[index].productId });
        }
        //cập nhật giá vốn sản phẩm mới
        let updatePriceProduct = await sails.helpers.product.updateCostPrice(req, {
          id: products[index].productId.id ? products[index].productId.id : products[index].productId,
          price: products[index].finalAmount - (totalAmount ? products[index].finalAmount*(discountAmount/totalAmount) : 0),
          quantity: products[index].quantity,
          type: sails.config.constant.import,
          branchId: branchId
        });

        if (!updatePriceProduct.status) return exits.success(updatePriceProduct)        
        //cập nhật tồn kho sản phẩm mới
        let foundProduct = await sails.helpers.product.updateQuantity(req, {
          id: products[index].productId.id ? products[index].productId.id : products[index].productId,
          stockQuantity: products[index].quantity, // Số lượng tồn kho
          branchId: branchId,
          stockId: products[index].stockId
        });
      }

      //xóa các sản phẩm liên quan đến phiếu nhập cũ trong bảng ImportCardProduct
      let importCardProductArray = await ImportCardProduct.destroy(req, { importCardId: id });

      //tạo các sản phẩm trong bảng ImportCardProduct
      for (let index in products) {  
        let newImportCardProduct = await ImportCardProduct.create(req, {
          productCode: products[index].productCode,
          productName: products[index].productName,
          quantity: products[index].quantity,
          unitPrice: products[index].unitPrice,
          discount: products[index].discount,
          taxAmount: products[index].taxAmount,
          finalAmount: products[index].finalAmount,
          notes: products[index].notes,
          importCardId: id,
          productId: products[index].productId.id ? products[index].productId.id : products[index].productId,
          createdBy: updatedBy,
          updatedBy: updatedBy,
          stockId: products[index].stockId

        }).intercept({ name: 'UsageError' }, () => {
          return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
        }).fetch();
        updatedProductImports.push(newImportCardProduct)
      }      
    }

    if (isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.IMPORT,
        action: sails.config.constant.ACTION.UPDATE,
        objectId: id,
        objectContentOld: {...foundImportCard, products: foundProductImports},
        objectContentNew: {...updatedImportCard[0], products: updatedProductImports.length && updatedProductImports || foundProductImports},
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({ status: true, data: updatedImportCard[0] });
  }
}