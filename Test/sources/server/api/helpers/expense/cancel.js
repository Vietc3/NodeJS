module.exports = {
  description: 'cancel expense card',

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
    
    // Lấy thông tin phiếu chi
    let getExpenseCard = await sails.helpers.expense.get(req, {id, branchId});
    if(!getExpenseCard.status) {
      return exits.success(getExpenseCard);
    }
    let {foundIncomeExpenseCard, foundIncomeExpenseCardDetail} = getExpenseCard.data;
    
    // Kiểm tra loại phiếu cần thanh toán (import or invoice return card)
    let getModelByExpenseType = await sails.helpers.expense.getModelByExpenseType(req, {expenseCardTypeId: foundIncomeExpenseCard.incomeExpenseCardTypeId.id});
    let {paymentModel, modelHelper} = getModelByExpenseType.data;
    
    // Kiểm tra trạng thái phiếu
    if(foundIncomeExpenseCard.status === sails.config.constant.INCOME_EXPENSE_CARD_STATUS.CANCELED) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.EXPENSE_IS_CANCELED)});
    }
    
    // Kiểm tra phiếu chi có cập nhật công nợ cho khách hàng không
    foundIncomeExpenseCardType = await IncomeExpenseCardType.findOne(req, {
      id: foundIncomeExpenseCard.incomeExpenseCardTypeId.id
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    let shouldUpdateDebt = foundIncomeExpenseCardType.shouldUpdateDebt;

    // Cập nhật trạng thái phiếu chi
    let arrUpdatedExpenseCard = await IncomeExpenseCard.update(req, {
      id, branchId
    }).set({
      status: sails.config.constant.INCOME_EXPENSE_CARD_STATUS.CANCELED,
      updatedBy,
      updatedAt
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
    let updatedExpenseCard = arrUpdatedExpenseCard[0];
    
    // Lưu sổ quỹ
    let updatedRemainingValue = await sails.helpers.cashbook.updateRemainingValue(req, {
      incomeExpenseAt: foundIncomeExpenseCard.incomeExpenseAt,
      changeValue: foundIncomeExpenseCard.amount,
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
        originalVoucherId: updatedExpenseCard.id,
        originalVoucherCode: updatedExpenseCard.code,
        createdBy: updatedBy,
        branchId,
        notes: sails.config.constant.autoAppCancelDeposit + updatedExpenseCard.code,
      });
      
      if(!addDeposit.status) {
        return exits.success(addDeposit);
      }
    } 
    
    // Cập nhật công nợ
    if(shouldUpdateDebt) {
      let updatedDebt = await sails.helpers.debt.create(req, {
        changeValue: (foundIncomeExpenseCard.customerType === sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? -1 : 1) * foundIncomeExpenseCard.amount,
        originalVoucherId: updatedExpenseCard.id,
        originalVoucherCode: updatedExpenseCard.code,
        type: sails.config.constant.DEBT_TYPES.DELETE_EXPENSE,
        customerId: foundIncomeExpenseCard.customerId,
        createdBy: updatedBy,
      });
    }

    //Tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.EXPENSE,
      action: sails.config.constant.ACTION.CANCEL,
      objectId: id,
      objectContentOld: {...foundIncomeExpenseCard, paymentDetail: foundIncomeExpenseCardDetail, createdBy: foundIncomeExpenseCard.createdBy.id},
      objectContentNew: {...updatedExpenseCard, paymentDetail: foundIncomeExpenseCardDetail},
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

        promises.push(modelHelper.update(req, {
          id: paidCardId.id,
          paidAmount: paidCardId.paidAmount - paidAmount,
          debtAmount: paidCardId.debtAmount + paidAmount,
          updatedBy,
          updatedAt
        }));
      }
      let updatedPaidAmounts = await Promise.all(promises);
    }
    
    return exits.success({status: true, data: updatedExpenseCard});
  }

}