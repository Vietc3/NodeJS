module.exports = {
  description: 'cancel a order card',

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
      updatedBy,
      branchId
    } = inputs.data;

    let {req} = inputs;
        
   
    let foundOrderCard = await OrderCard.findOne(req, { id, branchId })

    if (!foundOrderCard) {
      return exits.success({status: false, message: sails.__("Phiếu đặt hàng không tồn tại")});
    }
    let foundOrderProducts = await OrderCardProduct.find(req, { orderCardId: id })
    // cập nhật trạng thái hủy
    let canceledOrderCard = await OrderCard.update(req, { id, branchId }).set(_.pickBy({
      status: sails.config.constant.ORDER_CARD_STATUS.CANCELED,
      updatedBy
    }, value => value !== null)).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    //tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: foundOrderCard.type === sails.config.constant.ORDER_CARD_TYPE.IMPORT ? sails.config.constant.ACTION_LOG_TYPE.ORDER_IMPORT : sails.config.constant.ACTION_LOG_TYPE.ORDER_INVOICE,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: id,
      objectContentOld: {...foundOrderCard, products: foundOrderProducts },
      objectContentNew: {...canceledOrderCard[0], products: foundOrderProducts },
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }
   
    return exits.success({status: true, data: canceledOrderCard[0] });
  }

}