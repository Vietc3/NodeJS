module.exports = {
  description: 'create import card',

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
      importedAt,
      notes,
      noteIncomeExpense,
      reason,
      recipientId,
      reference,
      createdBy,
      paidAmount,
      debtAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      branchId
    } = inputs.data;
    
    let {req} = inputs;
    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.importCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }
    
    let createImportCard = await ImportCard.create(req, _.pickBy({
      id, //for data-seeding
      createdAt, // for data-seeding
      code: code || new Date().getTime(), //for data-seeding
      finalAmount,
      totalAmount,
      importedAt,
      notes,
      recipientId,
      reason,
      reference,
      status: sails.config.constant.IMPORT_CARD_STATUS.FINISHED,
      createdBy,
      updatedBy: createdBy,      
      paidAmount,
      debtAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      branchId: branchId
    }, value => value != null)).intercept('E_UNIQUE', () => {
      return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
    }).fetch();

    if ( !code ) {
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: reason === sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN ? sails.config.constant.CARD_TYPE.invoiceReturn : sails.config.constant.CARD_TYPE.importCard,
        newId: createImportCard.id,
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      updateImportCard = await ImportCard.update(req, { id: createImportCard.id, branchId: branchId }).set({
        code: createdCode.data
      }).fetch()
      createImportCard = updateImportCard[0];
    }

    let importCardProducts = [];

    for ( let product of products ) {
      let {productCode, productName, quantity, unitPrice, discount, taxAmount, finalAmount, costUnitPrice, notes, productId, invoiceProductId, stockId, type} = product;
      let importCardProduct = await ImportCardProduct.create(req, {
        productCode: product.productCode,
        productName: product.productName,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        discount: product.discount,
        taxAmount: product.taxAmount,
        finalAmount: product.finalAmount,
        costUnitPrice: product.costUnitPrice,
        notes: product.notes,
        importCardId: createImportCard.id,
        productId: product.productId,
        invoiceProductId: product.invoiceProductId,
        createdBy: createdBy,
        updatedBy: createdBy,
        stockId: product.stockId
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      }).fetch();
      
      importCardProducts.push(importCardProduct);
            
      // cập nhật giá vốn khi nhập hàng
      if ( reason === sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER ) {
        let updatePriceProduct = await sails.helpers.product.updateCostPrice(req, {
          id: product.productId,
          price: product.finalAmount - (totalAmount ? product.finalAmount*(discountAmount/totalAmount) : 0),
          quantity: product.quantity,
          type: sails.config.constant.import,
          branchId: branchId,
          createdBy
        });

        if ( !updatePriceProduct.status ) return exits.success(updatePriceProduct)
      } 

      if((product.type && product.type == sails.config.constant.PRODUCT_TYPES.merchandise) || reason === sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER){
        let updateStockQuantity = await sails.helpers.product.updateQuantity(req, {
          id: product.productId, 
          stockQuantity: Number(product.quantity), // cập nhật tồn kho
          manufacturingQuantity: reason == sails.config.constant.IMPORT_CARD_REASON.FINISHED_PRODUCT ? -Number(product.quantity) : 0, // cập nhật SL thành phẩm
          branchId: branchId,
          stockId: product.stockId,
          createdBy
        })
        if (!updateStockQuantity.status) return exits.success(updateStockQuantity);
      }    
    }

    return exits.success({ status: true, data: createImportCard, products: importCardProducts})
  }
}