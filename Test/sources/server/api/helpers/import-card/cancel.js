module.exports = {
  description: 'cancel import card',

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

    let foundImport = await ImportCard.findOne(req, { id, branchId })

    if ( !foundImport ) return exits.success({ status: false, message: sails.__("Không tìm thấy phiếu nhập")})
    // kiểm tra tồn kho
    let foundImportProduct = await ImportCardProduct.find(req, { importCardId: id }).populate("productId");
    let changedProductQuantity = {};
    
    foundImportProduct.map(item => {
      if(item.productId && item.productId.type == sails.config.constant.PRODUCT_TYPES.merchandise){
        let {productId, quantity, stockId} = item;
        changedProductQuantity[stockId] = changedProductQuantity[stockId] || {};
        changedProductQuantity[stockId][productId.id] = (changedProductQuantity[stockId][productId.id] || 0) + quantity;
      }
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
    for ( let item of foundImportProduct ) {
      // cập nhật giá vốn khi nhập hàng
      if (foundImport.reason === sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER) {
        let updatePriceProduct = await sails.helpers.product.updateCostPrice(req, {
          id: item.productId.id,
          price: item.finalAmount - (foundImport.totalAmount ? item.finalAmount*(foundImport.discountAmount/foundImport.totalAmount): 0),
          quantity: -item.quantity,
          type: sails.config.constant.import,
          branchId
        });

        if (!updatePriceProduct.status) return exits.success(updatePriceProduct)
      }      

      if((item.productId && item.productId.type && item.productId.type == sails.config.constant.PRODUCT_TYPES.merchandise) || foundImport.reason == sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER){
        let updateQuantityProduct = await sails.helpers.product.updateQuantity(req, {
          id: item.productId.id, 
          stockQuantity: -item.quantity, // Số lượng tồn kho
          manufacturingQuantity: foundImport.reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ? item.quantity : 0, // Số lượng thành phẩm
          branchId,
          stockId: item.stockId
        });

        if ( !updateQuantityProduct.status ) return exits.success(updateQuantityProduct)
      }
    }

    let cancelImportCard = await ImportCard.update(req, { id: id }).set({
      status: sails.config.constant.IMPORT_CARD_STATUS.CANCELED,
      updatedBy
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ status: false, message: sails.__("Thông tin phiếu nhập bị thiếu hoặc không hợp lệ")});
    }).fetch();

    // tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: foundImport.reason == sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER ? sails.config.constant.ACTION_LOG_TYPE.IMPORT 
      : foundImport.reason == sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN ? sails.config.constant.ACTION_LOG_TYPE.INVOICE_RETURN : sails.config.constant.ACTION_LOG_TYPE.EXPORT_FINISHED_PRODUCT,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: id,
      objectContentOld: {...foundImport, products: foundImportProduct},
      objectContentNew: {...cancelImportCard[0], products: foundImportProduct},
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }
    
    return exits.success({ status: true, data: cancelImportCard, products: foundImportProduct });
  }
}