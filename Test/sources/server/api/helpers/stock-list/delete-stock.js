module.exports = {
  description: 'cancel stock',

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
      moveTo,
      isActionLog
    } = inputs.data;
    let {req} = inputs;
    
    // Kiểm tra kho cần xóa có tồn tại
    let foundStock = await Stock.findOne(req, {id}).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });
    if(!foundStock){
      return exits.success({
        status: false,
        message: sails.__("Không tìm thấy kho cần xóa")
      })
    }
    
    // Kiểm tra kho cần chuyển đến có tồn tại
    let foundNewStock = {};

    if (moveTo) {
      foundNewStock = await Stock.findOne(req, {id: moveTo}).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
      });
      if(!foundNewStock || foundStock.branchId !== foundNewStock.branchId || foundStock.stockColumnIndex === foundNewStock.stockColumnIndex){
        return exits.success({
          status: false,
          message: sails.__("Không tìm thấy kho cần chuyển đến")
        })
      }
    
    
    
    // Kiểm tra kho đã bị xóa chưa
    if(foundStock.deletedAt !== 0) {
      return exits.success({
        status: false,
        message: sails.__("Kho đã bị xóa")
      })
    }
    
    // kiểm tra có phải kho duy nhất của chi nhánh
    let foundStockList = await Stock.find(req, {deletedAt: 0, branchId: foundStock.branchId}).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });
    if(foundStockList.length <= 1){
      return exits.success({
        status: false,
        message: sails.__("Không thể xóa kho duy nhất của chi nhánh")
      })
    }
    
    // chuyển tồn kho sang kho mới
      let newStockQuantity = sails.config.constant.STOCK_QUANTITY_LIST[foundNewStock.stockColumnIndex];
      let stockQuantity = sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex];
      let branchId =  parseInt(foundStock.branchId); 
      let stockQuantityNew = newStockQuantity + ' + '+ stockQuantity;    

      let SQL_UPDATE_QUANTITY = ` update productstock set ${newStockQuantity} = ${stockQuantityNew}
                                  where branchId = ${branchId}`;
      let SQL_DELETE_QUANTITY = ` update productstock set ${stockQuantity} = ${0}
                                  where branchId = ${branchId}`;

      let updatedQuantity = await sails.sendNativeQuery(req, SQL_UPDATE_QUANTITY)
      let deletedQuantity = await sails.sendNativeQuery(req, SQL_DELETE_QUANTITY)

    }
    // xóa kho
    let deletedStock = await Stock.update(req, {id}).set({
      deletedAt: _.moment().format('x'),
      updatedBy
    }).fetch();
    deletedStock = deletedStock[0]

    if (isActionLog) {
      //tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.STOCK,
        action: sails.config.constant.ACTION.DELETE,
        objectId: id,
        objectContentOld: foundStock,
        objectContentNew: {...deletedStock, moveStockId: moveTo},
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId: req.headers['branch-id']
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }
    
    return exits.success({
      status: true,
      data: deletedStock
    });
  }

}