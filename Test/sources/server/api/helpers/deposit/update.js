module.exports = {
  description: 'update deposit',

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
      code,
      customerId,
      amount,
      originalVoucherId,
      updatedBy,
      shouldCheckVoucherExist, // (true: call from api)
      status,
      notes,
      branchId
    } = inputs.data;
    let { req } = inputs;

    let foundCustomer = await Customer.findOne(req, {
      id: customerId,
      branchId : branchId
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    // Kiểm tra tham chiếu phiếu thu
    // Chỉ apply phần kiểm tra này cho API để không cho user sửa hay hủy trực tiếp phiếu rút cọc có liên kết đến một phiếu thu khác
    let foundDepositCard = await DepositCard.findOne(req, {
      id,
      branchId
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    
    //kiểm tra mã phiếu có thay đổi không,nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(foundDepositCard.code !== code && code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.depositFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }

      let foundDeposit = await DepositCard.find(req, {code: code});

      if (foundDeposit.length) {
        return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
      }
    }

    if(!code)
      code = foundDepositCard.code

    if(shouldCheckVoucherExist) {     
      if(!foundDepositCard || foundDepositCard.originalVoucherId > 0) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_DEPOSIT)});
      }
      if(foundDepositCard.originalVoucherId > 0) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.CANT_UPDATE)});
      }
    }
    //Kiểm tra số dư tiền cọc
    let changedTotalDeposit = (foundDepositCard.type === sails.config.constant.DEPOSIT_TYPES.ADD ? 1 : -1) * (foundDepositCard.amount - amount);
    if(foundCustomer.totalDeposit < changedTotalDeposit) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_DEPOSIT)});
    }
    
    // Sửa phiếu thu tiền cọc
    let createdDepositCard = await DepositCard.update(req, {id}).set({
      code,
      amount,
      originalVoucherId,
      customerId,
      updatedBy,
      status,
      notes,
      branchId: branchId
    }).intercept('E_UNIQUE', () => {
      return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    // tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: foundDepositCard.type === sails.config.constant.DEPOSIT_TYPES.ADD ? sails.config.constant.ACTION_LOG_TYPE.COLLECTING_DEPOSIT : sails.config.constant.ACTION_LOG_TYPE.WITHDRAW_DEPOSIT,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: createdDepositCard[0].id,
      objectContentOld: foundDepositCard,
      objectContentNew: createdDepositCard[0],
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }
    
    // cập nhật số dư tiền cọc
    let updateTotalDeposit = await sails.helpers.deposit.updateTotalDeposit(req, {
      customerId,
      totalDeposit: foundCustomer.totalDeposit - changedTotalDeposit,
      branchId,
      createdBy: updatedBy
    });
    
    return exits.success({status: true, data: createdDepositCard});
  }

}