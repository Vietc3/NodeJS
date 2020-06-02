module.exports = {
  description: 'create export card',

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
      id, //for data-seeding
      createdAt, // for data-seeding
      code,
      products,
      finalAmount,
      totalAmount,
      discountAmount,
      exportedAt,
      notes,
      reason,
      recipientId,
      paidAmount,
      debtAmount,
      reference,
      createdBy,
      branchId
    } = inputs.data;
    
    let {req} = inputs;

    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.exportCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    let changedProductQuantity = {};
    
    products.map(item => {
      let {productId, quantity, stockId} = item;
      changedProductQuantity[stockId] = changedProductQuantity[stockId] || {};
      changedProductQuantity[stockId][productId] = (changedProductQuantity[stockId][productId] || 0) + quantity;
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
      return exits.success(check);
    }

    let createExportCard = await ExportCard.create(req, {
      id, //for data-seeding
      createdAt, // for data-seeding
      code: code || new Date().getTime(), //for data-seeding
      finalAmount,
      totalAmount,
      discountAmount,
      exportedAt,
      notes,
      recipientId,
      paidAmount,
      debtAmount,
      reason,
      reference,
      status: sails.config.constant.EXPORT_CARD_STATUS.FINISHED,
      createdBy,
      updatedBy: createdBy,
      branchId: branchId
    }).intercept('E_UNIQUE', () => {
      return exits.success({ message: sails.__("Phiếu xuất đã tồn tại"), status: false });
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
    }).fetch();

    let updateExportCard;

    if ( !code ) {
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: sails.config.constant.CARD_TYPE.importReturn,
        newId: createExportCard.id,
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      updateExportCard = await ExportCard.update(req, { id: createExportCard.id, branchId: branchId }).set({
        code: createdCode.data,
      }).fetch()
      createExportCard = updateExportCard[0];
    }
    let exportProducts = [];
    for ( let product of products ) {   
      // let {productCode, productName, quantity, unitPrice, discount, taxAmount, finalAmount, notes, productId, importProductId, stockId} = product;
      let exportCardProduct = await ExportCardProduct.create(req, {
        productCode: product.productCode,
        productName: product.productName,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        discount: product.discount,
        taxAmount: product.taxAmount,
        finalAmount: product.finalAmount,
        notes: product.notes,
        exportCardId: createExportCard.id,
        productId: product.productId,
        importProductId: product.importProductId,
        createdBy: createdBy,
        updatedBy: createdBy,
        stockId: product.stockId

      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      }).fetch();
      exportProducts.push(exportCardProduct)
       // cập nhật giá vốn khi nhập hàng
       if ( reason === sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER ) {
        let updatePriceProduct = await sails.helpers.product.updateCostPrice(req, {
          id: product.productId,
          price: product.finalAmount - (totalAmount ? product.finalAmount*(discountAmount/totalAmount) : 0),
          quantity: product.quantity,
          type: sails.config.constant.importReturn,
          branchId: branchId
        });

        if ( !updatePriceProduct.status ) return exits.success(updatePriceProduct)
      } 

      let updateStockQuantity = await sails.helpers.product.updateQuantity(req, {
        id: product.productId, 
        stockQuantity: -product.quantity, // cập nhật tồn kho
        manufacturingQuantity: reason == sails.config.constant.EXPORT_CARD_REASON.MANUFACTURE ? product.quantity : 0, // cập nhật SL thành phẩm
        branchId: branchId,
        stockId: product.stockId
      })

      if (!updateStockQuantity.status) return exits.success(updateStockQuantity)
     
    }    

    exits.success({status: true, data: createExportCard, products: exportProducts })
  }
}