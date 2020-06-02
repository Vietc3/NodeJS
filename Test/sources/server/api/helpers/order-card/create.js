module.exports = {
  description: 'create a order card',

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
      type,
      totalAmount,
      finalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      notes,
      deliveryAddress,
      customerId,
      products,
      payType,
      deliveryType,
      paidAmount,
      depositAmount,
      createdBy,
      orderAt,
      expectedAt,
      status,
      branchId,
      isActionLog
    } = inputs.data;

    let {req} = inputs;
     
    
    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.orderCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }
    
    // XỬ LÝ ĐẶT HÀNG    

    // Tạo Đặt hàng
    let newOrder = await OrderCard.create(req, _.pickBy({
      code,
      type,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      expectedAt: expectedAt || new Date().getTime(),
      notes,
      deliveryAddress,
      customerId: customerId || undefined,
      status: status || sails.config.constant.ORDER_CARD_STATUS.ORDERER,
      deliveryType,
      debtAmount: finalAmount,
      paidAmount: 0,
      orderAt: orderAt || new Date().getTime(),
      createdBy,
      updatedBy: createdBy,
      branchId: branchId
    }, value => value != null)).intercept('E_UNIQUE', () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.EXIST_ORDER_CODE)});
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    
    if (!code) {
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: type == sails.config.constant.ORDER_CARD_TYPE.INVOICE ? sails.config.constant.CARD_TYPE.invoiceOrderCard : sails.config.constant.CARD_TYPE.importOrderCard,
        newId: newOrder.id,
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      let arrUpdateCodeOrder = await OrderCard.update(req, { id: newOrder.id }).set({
        code: createdCode.data
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      newOrder = arrUpdateCodeOrder[0];
    }
    
    //tạo các sản phẩm trong bảng OrderCardProduct
    let newOrderProducts = [];
    for (let index in products) {
      let {
        productCode,
        productName,
        quantity,
        unitPrice,
        discount,
        discountType,
        taxAmount,
        finalAmount,
        notes,
        productId,
      } = products[index];
      
      let newOrderProduct = await OrderCardProduct.create(req, {
        productCode,
        productName,
        quantity,
        unitPrice,
        discount,
        discountType,
        taxAmount,
        finalAmount,
        notes,
        orderCardId: newOrder.id,
        productId,
        createdBy,
        updatedBy: createdBy
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      
      newOrderProducts.push(newOrderProduct);
    }

    //tạo nhật kí
    if (isActionLog) {
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: type === sails.config.constant.ORDER_CARD_TYPE.IMPORT ? sails.config.constant.ACTION_LOG_TYPE.ORDER_IMPORT : sails.config.constant.ACTION_LOG_TYPE.ORDER_INVOICE,
        action: sails.config.constant.ACTION.CREATE,
        objectId: newOrder.id,
        objectContentNew: {...newOrder, products: newOrderProducts },
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }
     
    return exits.success({status: true, data: {newOrder, newOrderProducts}});
  }

}