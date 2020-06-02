module.exports = {
  description: 'cancel income card',

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
    let {req} = inputs;

    let updatedAt = new Date().getTime();
    
    // Lấy thông tin phiếu thu
    let getIncomeCard = await sails.helpers.income.get(req, {id, branchId});
    if(!getIncomeCard.status) {
      return exits.success(getIncomeCard);
    }
    let {foundIncomeExpenseCard, foundIncomeExpenseCardDetail} = getIncomeCard.data;
    
    // Kiểm tra loại phiếu cần thanh toán (đơn hàng hay import return card)
    let getModelByIncomeType = await sails.helpers.income.getModelByIncomeType(req, {incomeCardTypeId: foundIncomeExpenseCard.incomeExpenseCardTypeId.id});
    let {paymentModel, modelHelper} = getModelByIncomeType.data;
    
    // Kiểm tra trạng thái phiếu
    if(foundIncomeExpenseCard.status === sails.config.constant.INCOME_EXPENSE_CARD_STATUS.CANCELED) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INCOME_IS_CANCELED)});
    }
    
    // Kiểm tra phiếu thu có cập nhật công nợ cho khách hàng không
    foundIncomeExpenseCardType = await IncomeExpenseCardType.findOne(req, {
      id: foundIncomeExpenseCard.incomeExpenseCardTypeId.id
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    let shouldUpdateDebt = foundIncomeExpenseCardType.shouldUpdateDebt;
    
    // Cập nhật trạng thái phiếu thu
    let arrUpdatedIncomeCard = await IncomeExpenseCard.update(req, {
      id, branchId
    }).set({
      status: sails.config.constant.INCOME_EXPENSE_CARD_STATUS.CANCELED,
      updatedBy,
      updatedAt,
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
    let updatedIncomeCard = arrUpdatedIncomeCard[0];
    
    // Lưu sổ quỹ
    let updatedRemainingValue = await sails.helpers.cashbook.updateRemainingValue(req, {
      incomeExpenseAt: foundIncomeExpenseCard.incomeExpenseAt,
      changeValue: -foundIncomeExpenseCard.amount,
      branchId: branchId
    });
    if(!updatedRemainingValue.status) {
      return exits.success(updatedRemainingValue);
    }
    
    // Cập nhật tiền cọc khi đã sử dụng tiền cọc để thanh toán
    if(foundIncomeExpenseCard.depositAmount > 0) {
      let addDeposit = await sails.helpers.deposit.add(req, {
        customerId: foundIncomeExpenseCard.customerId,
        amount: foundIncomeExpenseCard.depositAmount,
        originalVoucherId: updatedIncomeCard.id,
        originalVoucherCode: updatedIncomeCard.code,
        createdBy: updatedBy,
        branchId,
        notes: sails.config.constant.autoAppCancelDeposit + updatedIncomeCard.code,

      });
      
      if(!addDeposit.status) {
        return exits.success(addDeposit);
      }
    }    
    
    // Cập nhật công nợ (tăng cho khách hàng giảm ncc)
    if(shouldUpdateDebt && foundIncomeExpenseCard.customerId) {
      let updatedDebt = await sails.helpers.debt.create(req, {
        changeValue: (foundIncomeExpenseCard.customerType === sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? 1 : -1) * foundIncomeExpenseCard.amount,
        originalVoucherId: updatedIncomeCard.id,
        originalVoucherCode: updatedIncomeCard.code,
        type: sails.config.constant.DEBT_TYPES.DELETE_INCOME,
        customerId: foundIncomeExpenseCard.customerId,
        createdBy: updatedBy,
      });
    }

    //Tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.INCOME,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: id,
      objectContentOld: {...foundIncomeExpenseCard, paymentDetail: foundIncomeExpenseCardDetail, createdBy: foundIncomeExpenseCard.createdBy.id},
      objectContentNew: {...updatedIncomeCard, paymentDetail: foundIncomeExpenseCardDetail},
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
      branchId
    })

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }
    
    // Cập nhật số tiền đã trả cho đơn hàng hoặc trả hàng nhập
    if(paymentModel && modelHelper && foundIncomeExpenseCardDetail.length) {
      let promises = [];

      for(let item of foundIncomeExpenseCardDetail) {
        let {paidCardId, paidAmount} = item;

        promises.push(paymentModel.update(req, {id: paidCardId.id}).set({
          paidAmount: paidCardId.paidAmount - paidAmount,
          debtAmount: paidCardId.debtAmount + paidAmount,
          updatedBy,
          updatedAt,
        }));
      }
      let updatedPaidAmounts = await Promise.all(promises);
    }
    
    return exits.success({status: true, data: updatedIncomeCard});
  }

}