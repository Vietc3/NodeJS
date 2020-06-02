module.exports = {
  description: 'add deposit',

  inputs: {
    req:{
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let {
      code,
      customerId,
      amount,
      originalVoucherId,
      originalVoucherCode,
      createdBy,
      depositDate,
      notes,
      branchId,
      isActionLog
    } = inputs.data;
    let req = inputs.req;

    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.depositFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }

      let foundDeposit = await DepositCard.find(req, {code: code});

      if (foundDeposit.length) {
        return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
      }
    }
    
    let foundCustomer = await Customer.findOne(req, {
      id: customerId
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    
    // Tạo phiếu thu tiền cọc 
           
    let createdDepositCard = await DepositCard.create(req, _.pickBy({
      code,
      type: sails.config.constant.DEPOSIT_TYPES.ADD,
      status: sails.config.constant.DEPOSIT_CARD_STATUS.FINISHED,
      amount,
      originalVoucherId,
      originalVoucherCode,
      customerId,
      createdBy,
      depositDate : depositDate === 0 || depositDate === undefined ? new Date().getTime() : depositDate ,
      updatedBy: createdBy,
      notes: notes || (originalVoucherCode ? (sails.config.constant.autoAppDeposit + originalVoucherCode) : ""),
      branchId: branchId
    },value => value !== null)).intercept('E_UNIQUE', () => {
      return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    if (!code){
      let updateDeposit = await DepositCard.update(req, {id: createdDepositCard.id}).set({
        code: sails.config.cardcode.depositFirstCode + createdDepositCard.id
      }).fetch()

      createdDepositCard = updateDeposit[0];
    }
    
    if (isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.COLLECTING_DEPOSIT,
        action: sails.config.constant.ACTION.CREATE,
        objectId: createdDepositCard.id,
        objectContentNew: createdDepositCard,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    // cập nhật số dư tiền cọc
    let updateTotalDeposit = await sails.helpers.deposit.updateTotalDeposit(req, {
      customerId,
      totalDeposit: foundCustomer.totalDeposit + amount,
      branchId,
      createdBy
    }); 

    return exits.success({status: true, data: createdDepositCard});
  }

}