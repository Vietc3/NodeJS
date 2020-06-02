module.exports = {
  description: 'get move stock card info',

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
    let { id, branchId } = inputs.data;
    let {req} = inputs

    // lấy thông tin phiếu
    let foundMoveStockCard = await MoveStockCard.findOne(req, {
      where: { id: id}
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
      })
      
    if (!foundMoveStockCard) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_MOVE_STOCK_CARD) });
    }

    let checkBanch = await sails.helpers.checkBranch(foundMoveStockCard.branchId, req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }
    let createdBy = await User.findOne(req, {
      where: { id: foundMoveStockCard.createdBy },
      select: ["id", "fullName"]
    })
    let movedBy = await User.findOne(req, {
      where: { id: foundMoveStockCard.movedBy },
      select: ["id", "fullName"]
    })

    if (createdBy) foundMoveStockCard.createdBy = createdBy;
    if (movedBy) foundMoveStockCard.movedBy = movedBy;
    
    // Lấy sản phẩm của phiếu
    let foundMoveStockCardProducts = await MoveStockCardProduct.find(req, { moveStockCardId: foundMoveStockCard.id }).populate("productId");

    let foundProductStocks = await Promise.all(_.map(foundMoveStockCardProducts, item => {
      let productStock = ProductStock.findOne(req, {productId: item.productId.id, branchId});
      return productStock;
    }));

    for (let index in foundMoveStockCardProducts) {
      let stocks = Object.values(sails.config.constant.STOCK_QUANTITY_LIST);
      
      stocks.map(stock => {
        if (foundProductStocks[index]) {
          foundMoveStockCardProducts[index].productId[stock] = foundProductStocks[index][stock];
        } else {
          foundMoveStockCardProducts[index].productId[stock] = 0;
        }
      }) 
      
      if (foundProductStocks[index]) {
        foundMoveStockCardProducts[index].productId.manufacturingQuantity = foundProductStocks[index].manufacturingQuantity;
      } else {
        foundMoveStockCardProducts[index].productId.manufacturingQuantity = 0;
      } 
    }
    
    exits.success({ status: true, data: {foundMoveStockCard, foundMoveStockCardProducts} });
  }

}