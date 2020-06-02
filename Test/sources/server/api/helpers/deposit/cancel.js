module.exports = {
  description: 'update deposit',

  inputs: {
    req: {
      type: 'ref'
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
      shouldCheckVoucherExist, // (true: call from api)
      branchId
    } = inputs.data;  
    let {req, } = inputs;

    // Kiểm tra tham chiếu phiếu thu (apply cho api)
    let foundDepositCard = await DepositCard.findOne(req, {
      id, branchId
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });

    let foundCustomer = await Customer.findOne(req, {
      id: foundDepositCard.customerId, branchId
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });

    if(shouldCheckVoucherExist) {      
      if(!foundDepositCard || foundDepositCard.originalVoucherId > 0) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_DEPOSIT)});
      }
      if(foundDepositCard.originalVoucherId > 0) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_UPDATE)});
      }
    }
    
    //Kiểm tra số dư tiền cọc
    let changedTotalDeposit = (foundDepositCard.type === sails.config.constant.DEPOSIT_TYPES.ADD ? 1 : -1) * (foundDepositCard.amount);
    if(foundCustomer.totalDeposit < changedTotalDeposit) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_DEPOSIT)});
    }
    
    // Sửa phiếu thu tiền cọc
    let createdDepositCard = await DepositCard.update(req, {id, branchId}).set({
      status: sails.config.constant.DEPOSIT_CARD_STATUS.CANCELED,
      updatedBy
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    // tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: foundDepositCard.type === sails.config.constant.DEPOSIT_TYPES.ADD ? sails.config.constant.ACTION_LOG_TYPE.COLLECTING_DEPOSIT : sails.config.constant.ACTION_LOG_TYPE.WITHDRAW_DEPOSIT,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: createdDepositCard[0].id,
      objectContentOld: foundDepositCard,
      objectContentNew: createdDepositCard[0],
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })
    
    // cập nhật số dư tiền cọc
    let updateTotalDeposit = await sails.helpers.deposit.updateTotalDeposit(req, {
      customerId: foundDepositCard.customerId,
      totalDeposit: foundCustomer.totalDeposit - changedTotalDeposit,
      branchId,
      createdBy: updatedBy
    });

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }
    
    return exits.success({status: true, data: createdDepositCard});
  }

}