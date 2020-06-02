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
      id,
      updatedBy,
      notes,
      movedBy,
      reference,
      branchId,
      products // [{productId, quantity}]
    } = inputs.data;
    let {req } = inputs
    // Tìm phiếu chuyển hàng
    let foundMoveStockCard = await MoveStockCard.findOne(req, {id, branchId});
    if(!foundMoveStockCard) {
      return exits.success({status: false, message: sails.config.constant.INTERCEPT.NOT_FOUND_MOVE_STOCK_CARD});
    }
    let {reason} = foundMoveStockCard;
    
    let updatedMoveStockCard = {status: false, message: sails.config.constant.INTERCEPT.NOT_FOUND_REASON};
    
    // Kiểm tra lý do
    if(reason === sails.config.constant.MOVE_STOCK_REASON.IMPORT.id) {      
      updatedMoveStockCard = await sails.helpers.moveStockCard.import.update(req, inputs.data);
    } else if(reason === sails.config.constant.MOVE_STOCK_REASON.EXPORT_FINISHED_PRODUCT.id) {
      updatedMoveStockCard = await sails.helpers.moveStockCard.exportFinishProduct.update(req, inputs.data);
    } else if(reason === sails.config.constant.MOVE_STOCK_REASON.EXPORT_RETURN.id){
      updatedMoveStockCard = await sails.helpers.moveStockCard.exportReturn.update(req, inputs.data);
    }
    
    return exits.success(updatedMoveStockCard);
  }

}