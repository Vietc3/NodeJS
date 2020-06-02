module.exports = {
  description: 'update income card',

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
      paymentDetail, // [{cardId, payAmount}]
      amount,
      depositAmount,
      customerId, 
      customerType,
      incomeExpenseAt,
      notes, 
      updatedBy,
      branchId
    } = inputs.data;
    let req = inputs.req;

    // chuẩn bị dữ liệu
    amount = parseFloat(amount);
    let totalPayAmount = 0;
    let totalDepositAmount = parseFloat(depositAmount) || 0;
    paymentDetail = (paymentDetail || []).map(item => {
      item.payAmount = parseFloat(item.payAmount) || 0;
      totalPayAmount += item.payAmount;
      return ({
        ...item,
        payAmount: item.payAmount,
      });
    });
    
    // Lấy thông tin phiếu thu
    let getIncomeCard = await sails.helpers.income.get(req, {id, branchId});
    if(!getIncomeCard.status) {
      return exits.success(getIncomeCard);
    }
    let {foundIncomeExpenseCard, foundIncomeExpenseCardDetail} = getIncomeCard.data;
    
    //kiểm tra mã phiếu có thay đổi không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(foundIncomeExpenseCard.code !== code && code){
      let checkExistPrefixExpense = sails.helpers.common.checkPrefixCode(sails.config.cardcode.expenseFirstCode, code);
      if(!checkExistPrefixExpense.status){
        return exits.success(checkExistPrefixExpense);
      }
      
      let checkExistPrefixIncome = sails.helpers.common.checkPrefixCode(sails.config.cardcode.incomeFirstCode, code);
      if(!checkExistPrefixIncome.status){
        return exits.success(checkExistPrefixIncome);
      }

      let foundIncomeExpense = await IncomeExpenseCard.find(req, {code: code});

      if (foundIncomeExpense.length) {
        return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
      }
    }

    if(code === "")
      code = sails.config.cardcode.incomeFirstCode + id;
    
    if(code === undefined ) code = foundIncomeExpenseCard.code;
    
    // kiểm tra phiếu đã bị hủy chưa
    if(foundIncomeExpenseCard.status === sails.config.constant.INCOME_EXPENSE_CARD_STATUS.CANCELED) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.INCOME_IS_CANCELED)});
    }
    
    // Kiểm tra loại phiếu cần thanh toán (đơn hàng hay import return card)
    let getModelByIncomeType = await sails.helpers.income.getModelByIncomeType(req, {incomeCardTypeId: foundIncomeExpenseCard.incomeExpenseCardTypeId.id});
    let {paymentModel, modelHelper, cardType, canceledStatus} = getModelByIncomeType.data;
    
    // Kiểm tra giá trị phiếu thu
    if(!paymentModel || !modelHelper) {
      totalPayAmount = amount
    }
    if(!totalPayAmount) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_INCOME_AMOUNT)});
    }
    
    let objIncomeExpenseCardDetail = {};
    let changeValueDepositAmount = totalDepositAmount - foundIncomeExpenseCard.depositAmount;
    let changeValuePayAmount = totalPayAmount - foundIncomeExpenseCard.amount;
    
    foundIncomeExpenseCardDetail.map(item => objIncomeExpenseCardDetail[item.paidCardId.id] = item)

    // Cập nhật phiếu thu
    let arrUpdatedIncomeCard = await IncomeExpenseCard.update(req, {
      id
    }).set({
      code,
      amount: totalPayAmount,
      incomeExpenseAt: incomeExpenseAt,
      depositAmount: totalDepositAmount,
      remainingValue: foundIncomeExpenseCard.remainingValue + changeValuePayAmount,
      notes,
      updatedBy,
      branchId: branchId
    }).intercept('E_UNIQUE', () => {
      return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
    let updatedIncomeCard = arrUpdatedIncomeCard[0];
    
    // Cập nhật chi tiết phiếu thu
    let promises = [];
    for(let payment of paymentDetail) {
      let {cardId, payAmount} = payment;
      promises.push(IncomeExpenseCardDetail.update(req, {id: objIncomeExpenseCardDetail[cardId].id}).set({
        paidAmount: payAmount,
        updatedBy
      }).intercept({ name: "UsageError" }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch());
    }
    let updatedRelatedCards = await Promise.all(promises);
    
    // Lưu sổ quỹ
    let updatedRemainingValue = await sails.helpers.cashbook.updateRemainingValue(req, {
      incomeExpenseAt: foundIncomeExpenseCard.incomeExpenseAt,
      changeValue: changeValuePayAmount,
      branchId: branchId
    });
    if(!updatedRemainingValue.status) {
      return exits.success(updatedRemainingValue);
    }

    if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER || customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER){
    
      // Kiểm tra phiếu thu có cập nhật công nợ cho khách hàng không
      foundIncomeExpenseCardType = await IncomeExpenseCardType.findOne(req, {
        id: foundIncomeExpenseCard.incomeExpenseCardTypeId.id
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
      let shouldUpdateDebt = foundIncomeExpenseCardType.shouldUpdateDebt;

      // Kiểm tra phương thức thanh toán có sử dụng tiền cọc không
      if(changeValueDepositAmount > 0) {
        // Kiểm tra tiền cọc còn đủ
        let foundCustomer = await Customer.findOne(req, {
          id: customerId,
          branchId: branchId
        }).intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        })

        if(foundCustomer.totalDeposit < changeValueDepositAmount) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_DEPOSIT)});
        }
      }
      
      let objPaidCard = {};
      if(paymentModel) {
        // Kiểm tra tồn tại đơn hàng và kiểm tra số tiền cần trả
        for(let payment of paymentDetail) {
          let {cardId, payAmount} = payment;
          
          // Kiểm tra tồn tại đơn hàng hoặc trả hàng nhập
          let foundPaidCard = await paymentModel.findOne(req, {
            id: cardId,
          }).intercept({ name: 'UsageError' }, () => {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
          });
          
          if(!foundPaidCard) {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND) + sails.__(sails.config.constant[cardType])});
          }
          
          // Kiểm tra trạng thái phiếu
          if(foundPaidCard.status === canceledStatus) {
            return exits.success({status: false, message: sails.__(sails.config.constant.CANT_PAY_CANCELED_CARD)});
          }
          
          // Kiểm tra số tiền thanh toán có lớn hơn số tiền cần trả không
          if(foundPaidCard.debtAmount + objIncomeExpenseCardDetail[cardId].paidAmount < payAmount) {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_INCOME_DEBT)});
          }
          objPaidCard[foundPaidCard.id] = foundPaidCard;
        }
      }
      
      // Cập nhật tiền cọc khi có sử dụng tiền cọc để thanh toán
      if(changeValueDepositAmount > 0) {
        let withdrawDeposit = await sails.helpers.deposit.withdraw(req, {
          customerId,
          amount: (totalDepositAmount - foundIncomeExpenseCard.depositAmount),
          originalVoucherId: updatedIncomeCard.id,
          originalVoucherCode: updatedIncomeCard.code,
          createdBy: updatedBy,
          branchId: branchId,
          notes: sails.config.constant.autoWithdrawUpdateDeposit + updatedIncomeCard.code,
        });
        
        if(!withdrawDeposit.status) {
          return exits.success(withdrawDeposit);
        }
      } else if(changeValueDepositAmount < 0) {
        let addDeposit = await sails.helpers.deposit.add(req, {
          customerId,
          amount: -changeValueDepositAmount,
          originalVoucherId: updatedIncomeCard.id,
          originalVoucherCode: updatedIncomeCard.code,
          createdBy: updatedBy,
          branchId: branchId,
          notes: sails.config.constant.autoAppUpdateDeposit + updatedIncomeCard.code,
        });
        
        if(!addDeposit.status) {
          return exits.success(addDeposit);
        }
      }
      // Cập nhật công nợ (giảm nợ khách hàng tăng ncc)
      if(shouldUpdateDebt) {
        let updatedDebt = await sails.helpers.debt.create(req, {
          changeValue:(customerType === sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? -1 : 1) * changeValuePayAmount,
          originalVoucherId: updatedIncomeCard.id,
          originalVoucherCode: updatedIncomeCard.code,
          type: sails.config.constant.DEBT_TYPES.UPDATE_INCOME,
          notes: sails.config.constant.autoDeptCardCreate + updatedIncomeCard.code,
          customerId,
          createdBy: updatedBy,
        });
      }

      //Tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: updatedBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.INCOME,
        action: sails.config.constant.ACTION.UPDATE,
        objectId: id,
        objectContentOld: {...foundIncomeExpenseCard, paymentDetail: foundIncomeExpenseCardDetail, createdBy: foundIncomeExpenseCard.createdBy.id},
        objectContentNew: {...updatedIncomeCard, paymentDetail: updatedRelatedCards},
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
      
      // Cập nhật số tiền đã trả cho đơn hàng hoặc trả hàng nhập
      if(paymentModel) {
        let promises = [];
        for(let payment of paymentDetail) {
          let {cardId, payAmount, depositAmount} = payment;

          if(payAmount - objIncomeExpenseCardDetail[cardId].paidAmount !== 0) {
            promises.push(paymentModel.update(req, {id: cardId}).set({
              paidAmount: objPaidCard[cardId].paidAmount + (payAmount - objIncomeExpenseCardDetail[cardId].paidAmount),
              debtAmount: objPaidCard[cardId].debtAmount - (payAmount - objIncomeExpenseCardDetail[cardId].paidAmount),
              updatedBy
            }));
          }
        }
        let updatedPaidAmounts = await Promise.all(promises);
      }
    }
    return exits.success({status: true, data: updatedIncomeCard});
  }

}