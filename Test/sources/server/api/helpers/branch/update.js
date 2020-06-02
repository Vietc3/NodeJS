module.exports = {
  description: 'update branch',

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
      email,
      name,
      phoneNumber,
      address,
      status,
      updatedBy,
      isActionLog
    } = inputs.data;
    let {req} = inputs;
    // chuẩn bị data
    
    // Kiểm tra branch id có tồn tại không
    let foundBranch = await Branch.findOne(req, {
      id,
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    if(!foundBranch) {
      return exits.success({
        status: false,
        message: sails.__("Chi nhánh không tồn tại trong hệ thống")
      });
    }
    
    // Kiểm tra chi nhánh đã bị xóa chưa
    if(foundBranch.deletedAt !== 0) {
      return exits.success({
        status: false,
        message: sails.__("Không thể cập nhật chi nhánh đã xóa")
      });
    }
    
    // Kiểm tra branch name có hợp lệ không nếu có thay đổi tên chi nhánh
    if(name !== undefined && name !== foundBranch.name) {
      if(!(typeof name === 'string' && name.length > 0)){
        return exits.success({status: false, message: sails.__("Tên chi nhánh không hợp lệ")});
      }
      let foundNewBranch = await Branch.find(req, {name}).intercept({ name: "UsageError" }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
      if(foundNewBranch.length){
        return exits.success({
          status: false,
          message: sails.__("Tên chi nhánh đã tồn tại")
        });
      }
    }
    
    // cập nhật record new branch
    let updatedBranch = await Branch.update(req, {id}).set({
      email: email ? email : "",
      name,
      phoneNumber: phoneNumber ? phoneNumber : "",
      address: address ? address : "",
      status,
      updatedBy
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    if(isActionLog) {
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.BRANCH,
        action: sails.config.constant.ACTION.UPDATE,
        objectId: updatedBranch[0].id,
        objectContentOld: foundBranch,
        objectContentNew: updatedBranch[0],
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
        branchId: req.headers['branch-id']
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }
    
    return exits.success({
      status: true,
      data: updatedBranch[0]
    });
  }

}