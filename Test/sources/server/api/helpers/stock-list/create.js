module.exports = {
  description: 'create new branch',

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
      name,
      branchId,
      address,
      notes,
      createdBy,
      isActionLog
    } = inputs.data;
    let {req} = inputs;
    
    // chuẩn bị data
    name = (name || '').trim();
    if(name === ''){
      return exits.success({
        status: false,
        message: sails.__("Tên kho không hợp lệ")
      })
    }

    //kiểm tra tên kho đã tồn tại chưa
    let foundStockName = await Stock.find(req, {where: {deletedAt: 0, branchId, name}});
    if(foundStockName.length){
      return exits.success({
        status: false,
        message: sails.__("Tên kho đã tồn tại")
      })
    }
    
    // chọn stockColumnIndex để create
    let foundStockList = await Stock.find(req, {where: {deletedAt: 0, branchId}, sort: [{stockColumnIndex: 'asc'}]});
    let stockColumnIndex = foundStockList.length + 1;
    if(stockColumnIndex > Object.keys(sails.config.constant.STOCK_QUANTITY_LIST).length){
      return exits.success({
        status: false,
        message: sails.__("Số lượng kho khả dụng của chi nhánh đã hết")
      })
    }
    
    for(let index in foundStockList){
      index = parseInt(index);
      if(foundStockList[index].stockColumnIndex !== (index + 1)) {
        stockColumnIndex = index + 1;
        break;
      }
    }
    
    // tạo kho mới
    let createdStock = await Stock.create(req, {
      name,
      stockColumnIndex,
      branchId,
      address: address || "",
      notes: notes || "",
      createdBy,
      updatedBy: createdBy,
    }).fetch();
    // tạo nhật kí
    if (isActionLog) {
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.STOCK,
        action: sails.config.constant.ACTION.CREATE,
        objectId: createdStock.id,
        objectContentNew: createdStock,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }
    
    return exits.success({
      status: true,
      data: createdStock
    });
  }

}