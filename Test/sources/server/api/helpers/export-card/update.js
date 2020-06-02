module.exports = {
  description: 'update export card',

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
      exportedAt,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      deliveryAddress,
      status,
      recipientId,
      products,
      updatedBy,
      reason,
      reference,
      paidAmount,
      debtAmount,
      branchId,
      isActionLog
    } = inputs.data;

    let {req} = inputs;

    let foundExportCard = await ExportCard.findOne(req, { id: id , branchId: branchId})

    if (!foundExportCard) {
      return exits.success({ message: sails.__("Không tìm thấy phiếu trả hàng nhập"), status: false });
    }

    //kiểm tra mã phiếu có thay đổi không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(foundExportCard.code !== code && code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.exportCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    if(!code)
      code = foundExportCard.code

    let changeProductQuantity = {};

    if ( products && products.length > 0 ) {

      // Kiểm tra tồn kho
      let oldProducts = await ExportCardProduct.find(req, { exportCardId: id }); 

      for(let product of oldProducts) {
        let {productId, quantity, stockId} = product;
        changeProductQuantity[stockId] = changeProductQuantity[stockId] || {};
        changeProductQuantity[stockId][productId] = (changeProductQuantity[stockId][productId] || 0) - quantity;
       }

      products.map(item => {
        let {productId, quantity, stockId} = item;
        productId = productId.id || productId;
        changeProductQuantity[stockId] = changeProductQuantity[stockId] || {};
        changeProductQuantity[stockId][productId] = (changeProductQuantity[stockId][productId] || 0) + quantity;
        })

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
          return exits.success({status: false, message: sails.__(check.message)});
        }
    }

    //cập nhật thông tin phiếu xuất
    let updatedExportCard = await ExportCard.update(req, { id: id }).set({
      code: code,
      exportedAt: exportedAt,
      totalAmount: totalAmount,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      deliveryAmount: deliveryAmount,
      finalAmount: finalAmount,
      notes: notes,
      deliveryAddress: deliveryAddress,
      status: status,
      reason,
      recipientId,
      reference,
      products: products,
      updatedBy: updatedBy,
      paidAmount,
      debtAmount,
      branchId: branchId
    }).intercept('E_UNIQUE', () => {
      return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
    }).intercept({ name: 'UsageError' }, () => {
      exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
    }).fetch();
    let foundProductExports = await ExportCardProduct.find(req, {exportCardId: id });
    let updatedProductExports = [];
    //update product
    if ( products.length > 0 ) {   
      for (let index in products) {
        //cập nhật các sản phẩm cũ
        let oldProduct = await ExportCardProduct.find(req, { where: { productId: products[index].productId.id ? products[index].productId.id : products[index].productId, exportCardId: id } })

        if (oldProduct.length > 0) {
          for (let i in oldProduct) {
            // cập nhật lại giá vốn của sản phẩm cũ
            if (reason === sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER) {
              let updateOldPriceProduct = await sails.helpers.product.updateCostPrice(req, {
                id: products[index].productId.id ? products[index].productId.id : products[index].productId,
                price: oldProduct[i].finalAmount - (foundExportCard.totalAmount ? oldProduct[i].finalAmount*(foundExportCard.discountAmount/foundExportCard.totalAmount): 0),
                quantity: -oldProduct[i].quantity,
                type: sails.config.constant.importReturn,
                branchId: branchId
              });

              if (!updateOldPriceProduct.status) return exits.success(updateOldPriceProduct)  

              //cập nhật lại tồn kho của sản phẩm cũ
              let foundProduct = await sails.helpers.product.updateQuantity(req, {
                id: oldProduct[i].productId,
                stockQuantity: oldProduct[i].quantity,
                branchId: branchId,
                stockId: oldProduct[i].stockId
              });

              if (!foundProduct.status) return exits.success(foundProduct) 
            }
          }
          let exportCardProductArray = await ExportCardProduct.destroy(req, { exportCardId: id, productId: products[index].productId.id ? products[index].productId.id : products[index].productId });
        }
        //cập nhật giá vốn sản phẩm mới
        let updatePriceProduct = await sails.helpers.product.updateCostPrice(req, {
          id: products[index].productId.id ? products[index].productId.id : products[index].productId,
          price: products[index].finalAmount - (totalAmount ? products[index].finalAmount*(discountAmount/totalAmount): 0),
          quantity: products[index].quantity,
          type: sails.config.constant.importReturn,
          branchId: branchId
        });

        if (!updatePriceProduct.status) return exits.success(updatePriceProduct)     

        //cập nhật tồn kho sản phẩm mới
        let foundProduct = await sails.helpers.product.updateQuantity(req, {
          id: products[index].productId.id ? products[index].productId.id : products[index].productId,
          stockQuantity: -products[index].quantity, // Số lượng tồn kho
          branchId: branchId,
          stockId: products[index].stockId,
        });

        if (!foundProduct.status) return exits.success(foundProduct) 
      }

      //xóa các sản phẩm liên quan đến phiếu nhập cũ trong bảng ExportCardProduct
      let exportCardProductArray = await ExportCardProduct.destroy(req, { exportCardId: id });

      //tạo các sản phẩm trong bảng ExportCardProduct
      for (let index in products) {
        let newExportCardProduct = await ExportCardProduct.create(req, {
          productCode: products[index].productCode,
          productName: products[index].productName,
          quantity: products[index].quantity,
          unitPrice: products[index].unitPrice,
          discount: products[index].discount,
          taxAmount: products[index].taxAmount,
          finalAmount: products[index].finalAmount,
          notes: products[index].notes,
          exportCardId: id,
          productId: products[index].productId.id || products[index].productId,
          importProductId: products[index].importProductId,
          createdBy: updatedBy,
          updatedBy: updatedBy,
          stockId: products[index].stockId

        }).intercept({ name: 'UsageError' }, () => {
          exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
        }).fetch();
        updatedProductExports.push(newExportCardProduct)
      }
    }

    if (isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: reason == sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER ? sails.config.constant.ACTION_LOG_TYPE.IMPORT_RETURN 
        : sails.config.constant.ACTION_LOG_TYPE.IMPORT_STOCK,
        action: sails.config.constant.ACTION.UPDATE,
        objectId: id,
        objectContentOld: {...foundExportCard, products: foundProductExports},
        objectContentNew: {...updatedExportCard[0], products: updatedProductExports.length && updatedProductExports || foundProductExports},
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    exits.success({ status: true, updatedExportCard });
  }
}
