module.exports = {
  description: 'create move stock card',

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
      branchId,
      reason,// [{productId, quantity }]
    } = inputs.data;
    let { req } = inputs
    let createdMoveStockCard = {status: false, message: sails.__('Không tìm thấy lý do tạo phiếu chuyển hàng')};
    
    if(reason === sails.config.constant.MOVE_STOCK_REASON.IMPORT.id) {
      createdMoveStockCard = await sails.helpers.moveStockCard.import.create(req, inputs.data);
    } else if(reason === sails.config.constant.MOVE_STOCK_REASON.EXPORT_FINISHED_PRODUCT.id) {
      createdMoveStockCard = await sails.helpers.moveStockCard.exportFinishProduct.create(req, inputs.data);
    } else if(reason === sails.config.constant.MOVE_STOCK_REASON.EXPORT_RETURN.id){
      createdMoveStockCard = await sails.helpers.moveStockCard.exportReturn.create(req, inputs.data);
    }  
    
    return exits.success(createdMoveStockCard);
  }

}