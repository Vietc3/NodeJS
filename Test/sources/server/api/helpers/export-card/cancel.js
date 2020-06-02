module.exports = {
  description: 'cancel export card',

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
    let { id, updatedBy, branchId } = inputs.data;   

    let {req} = inputs;

    let foundExport = await ExportCard.findOne(req, { id: id, branchId })

    if ( !foundExport ) return exits.success({ status: false, message: sails.__("Không tìm thấy phiếu trả hàng nhập")})
    // kiểm tra tồn kho
    let foundExportProduct = await ExportCardProduct.find(req, { exportCardId: id });
    let products = {};
    for ( let item of foundExportProduct ) {
      let foundProduct = await Product.findOne(req, {id: item.productId});
      if ( !foundProduct ) return exits.success({ status: false, message: sails.__("Không tìm thấy sản phẩm")});

      products[item.productId] = foundProduct;

    }

    for ( let item of foundExportProduct ) {
      // cập nhật giá vốn khi nhập hàng (to do)
      if ( foundExport.reason === sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER) {
        
        let updatePriceProduct = await sails.helpers.product.updateCostPrice(req, { 
          id: item.productId,
          price: item.finalAmount - (foundExport.totalAmount ? item.finalAmount*(foundExport.discountAmount/foundExport.totalAmount): 0),
          quantity: -item.quantity,
          type: sails.config.constant.importReturn,
          branchId
        });

        if ( !updatePriceProduct.status ) exits.success(updatePriceProduct)
      }

      let updateQuantityProduct = await sails.helpers.product.updateQuantity(req, {
        id: item.productId, 
        stockQuantity: item.quantity, // Số lượng tồn kho
        manufacturingQuantity: foundExport.reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE ? item.quantity : 0, // Số lượng thành phẩm
        branchId,
        stockId: item.stockId
      });

      if ( !updateQuantityProduct.status ) return exits.success(updateQuantityProduct)
    }

    let cancelExportCard = await ExportCard.update(req, { id: id }).set({
      status: sails.config.constant.EXPORT_CARD_STATUS.CANCELED,
      updatedBy
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__("Thông tin phiếu trả hàng nhập bị thiếu hoặc không hợp lệ")});
    }).fetch();
    
    // tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: foundExport.reason == sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER ? sails.config.constant.ACTION_LOG_TYPE.IMPORT_RETURN 
      : sails.config.constant.ACTION_LOG_TYPE.IMPORT_STOCK,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: id,
      objectContentOld: {...foundExport, products: foundExportProduct},
      objectContentNew: {...cancelExportCard[0], products: foundExportProduct},
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({ status: true, data: cancelExportCard, products: foundExportProduct });
  }
}