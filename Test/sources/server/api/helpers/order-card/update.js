module.exports = {
  description: 'update invoice card',

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
      id,
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
      updatedBy,
      orderAt,
      expectedAt,
      status,
      branchId
    } = inputs.data;

    let {req} = inputs;
        

    // Chuẩn bị dữ liệu
    products = products || [];
    
    // Kiểm tra tồn tại đơn hàng
    let foundOrderCard = await OrderCard.findOne(req, {
      id,
      status: {'!=': sails.config.constant.ORDER_CARD_STATUS.CANCELED},
      branchId: branchId
    }).intercept({ name: 'UsageError' }, ()=>{
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    
    if (!foundOrderCard) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_INVOICE)});
    }

    //kiểm tra mã phiếu có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(foundOrderCard.code !== code && code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.orderCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }
    
    if(!code)
      code = foundOrderCard.code
   
    // Lưu đơn đặt hàng
    let arrUpdatedOrder = await OrderCard.update(req, { id }).set(_.pickBy({
      code,
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      status,
      type,
      orderAt,
      expectedAt,
      deliveryType,
      deliveryAddress,
      updatedBy,
      branchId: branchId
    }, value => value !== null)).intercept('E_UNIQUE', () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.EXIST_ORDER_CODE)});
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    let updatedOrderCard = arrUpdatedOrder[0];
    let foundOrderProducts = await OrderCardProduct.find(req, { orderCardId: id })
    // xóa các sản phẩm liên quan đến đơn hàng cũ trong bảng OrderCardProduct
    let newOrderProducts = [];
    if ( products.length > 0 ) {      
      await OrderCardProduct.destroy(req, {
        orderCardId: id
      });
      //tạo các sản phẩm trong bảng OrderCardProduct      
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
        
        let newOrderCardProduct = await OrderCardProduct.create(req, {
          productCode,
          productName,
          quantity,
          unitPrice,
          discount,
          discountType,
          taxAmount,
          finalAmount,
          notes,
          orderCardId: id,
          productId,
          createdBy: updatedBy,
          updatedBy
        }).intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        }).fetch();

        newOrderProducts.push(newOrderCardProduct);
      }
    }

    //tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: type === sails.config.constant.ORDER_CARD_TYPE.IMPORT ? sails.config.constant.ACTION_LOG_TYPE.ORDER_IMPORT : sails.config.constant.ACTION_LOG_TYPE.ORDER_INVOICE,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: id,
      objectContentOld: {...foundOrderCard, products: foundOrderProducts },
      objectContentNew: {...updatedOrderCard, products: newOrderProducts },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    return exits.success({status: true, data: {updatedOrderCard, newOrderProducts}});
  }

}