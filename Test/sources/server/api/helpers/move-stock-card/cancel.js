module.exports = {
  description: 'cancel move stock card',

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
    
    let {req} = inputs

    // Tìm phiếu chuyển hàng
    let foundMoveStockCard = await MoveStockCard.findOne(req, {id, branchId});
    if(!foundMoveStockCard) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_MOVE_STOCK_CARD)});
    }
    let {reason} = foundMoveStockCard;
    let caneledMoveStockCard = {status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_REASON)};
    
    // Kiểm tra lý do
    if(reason === sails.config.constant.MOVE_STOCK_REASON.IMPORT.id) {
      caneledMoveStockCard = await sails.helpers.moveStockCard.import.cancel(req, inputs.data);
    } else if(reason === sails.config.constant.MOVE_STOCK_REASON.EXPORT_FINISHED_PRODUCT.id) {
      caneledMoveStockCard = await sails.helpers.moveStockCard.exportFinishProduct.cancel(req, inputs.data);
    } else if(reason === sails.config.constant.MOVE_STOCK_REASON.EXPORT_RETURN.id){
      caneledMoveStockCard = await sails.helpers.moveStockCard.exportReturn.cancel(req, inputs.data);
    }
    
    return exits.success(caneledMoveStockCard);
  }

}