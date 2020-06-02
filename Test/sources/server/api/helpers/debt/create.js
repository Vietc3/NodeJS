module.exports = {
  description: 'create debt',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    },
    
  },

  fn: async function (inputs, exits) {
    let {
      changeValue,
      originalVoucherId,
      originalVoucherCode,
      type,
      notes,
      customerId,
      createdBy,
      isActionLog
    } = inputs.data;
    let req = inputs.req;

    // Chuẩn bị dữ liệu
    changeValue = parseFloat(changeValue) || 0;
    type = type ? type : sails.config.constant.DEBT_TYPES.USER_CREATE;
    
    if(changeValue === 0){
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_UPDATE_DEBT)});
    }
    
    let foundCustomer = await Customer.findOne(req, {id: customerId});
    if(!foundCustomer) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }
    
    let newTotalOutstanding = (foundCustomer.totalOutstanding || 0) + changeValue;
    
    // Tạo record bảng công nợ
    let newDebtCardRecord = await Debt.create(req, {
      changeValue,
      remainingValue: newTotalOutstanding,
      originalVoucherId,
      originalVoucherCode,
      type,
      notes: notes || sails.config.constant.autoDeptCardCreate + originalVoucherCode,
      customerId,
      createdBy,
      updatedBy: createdBy
    }).intercept('E_UNIQUE', () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.EXIST_DEBT_CODE)});
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    if (isActionLog) {
      // tạo nhật ký công nợ
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.DEBT,
        action: sails.config.constant.ACTION.ADD,
        objectId: newDebtCardRecord.id,
        objectContentNew: newDebtCardRecord,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
        branchId: req.headers['branch-id']
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }
    
    // Cập nhật công nợ khách hàng
    let updateCustomer = await Customer.update(req, {
      id: customerId
    }).set({
      totalOutstanding: newTotalOutstanding
    }).fetch();
      
    return exits.success({status: true, data: newDebtCardRecord});
  }

}