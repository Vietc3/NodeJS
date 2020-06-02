module.exports = {
  description: 'update stock',

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
      name,
      address,
      notes,
      updatedBy
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
    
    // Kiểm tra kho có tồn tại
    let foundStockList = await Stock.findOne(req, {id}).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });
    if(!foundStockList){
      return exits.success({
        status: false,
        message: sails.__("Không tìm thấy kho cần cập nhật")
      })
    }
    
    // Kiểm tra kho đã bị xóa chưa
    if(foundStockList.deletedAt !== 0){
      return exits.success({
        status: false,
        message: sails.__("Không thể cập nhật kho đã bị xóa")
      })
    }

    //kiểm tra tên kho đã tồn tại chưa
    if(name !== foundStockList.name){
      let foundStockName = await Stock.find(req, {where: {deletedAt: 0, branchId: foundStockList.branchId, name, id: {'!=': id}}});
      if(foundStockName.length){
        return exits.success({
          status: false,
          message: sails.__("Tên kho đã tồn tại")
        })
      }
    }
    
    // update store config
    let updatedStock = await Stock.update(req, {id}).set({
      name,
      address: address || "",
      notes: notes || "",
      updatedBy
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    }).fetch();
    updatedStock = updatedStock[0];

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.STOCK,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: id,
      objectContentOld: foundStockList,
      objectContentNew: updatedStock,
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId: req.headers['branch-id']
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }
    
    return exits.success({
      status: true,
      data: updatedStock
    });
  }

}