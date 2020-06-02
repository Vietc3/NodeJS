module.exports = {
  description: 'create income card',

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
      code, 
      notes, 
      customerId, 
      customerType,
      incomeExpenseAt,
      incomeExpenseCardTypeCode,
      incomeExpenseCardTypeId,
      paymentDetail, // [{cardId, payAmount}]
      amount,
      depositAmount,
      createdBy,
      branchId,
      isActionLog
    } = inputs.data;
    let req = inputs.req;

    // chuẩn bị dữ liệu
    customerType = parseFloat(customerType);

    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefixExpense = await sails.helpers.common.checkPrefixCode(sails.config.cardcode.expenseFirstCode, code);
      if(!checkExistPrefixExpense.status){
        return exits.success(checkExistPrefixExpense);
      }

      let checkExistPrefixIncome = await sails.helpers.common.checkPrefixCode(sails.config.cardcode.incomeFirstCode, code);
      if(!checkExistPrefixIncome.status){
        return exits.success(checkExistPrefixIncome);
      }

      let foundIncomeExpense = await IncomeExpenseCard.find(req, {code: code});

      if (foundIncomeExpense.length) {
        return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
      }
    }
    
    // chuẩn bị dữ liệu
    let totalPayAmount = 0;
    amount = parseFloat(amount) || 0;
    let totalDepositAmount = parseFloat(depositAmount) || 0;
    paymentDetail = (paymentDetail || []).map(item => {
      item.payAmount = parseFloat(item.payAmount) || 0;
      totalPayAmount += item.payAmount;
      return ({
        ...item,
        payAmount: item.payAmount,
      });
    }).filter(item => item.payAmount > 0);

    // Kiểm tra loại phiếu cần thanh toán (đơn hàng hay import return card)
    let getModelByIncomeType = await sails.helpers.income.getModelByIncomeType(req, {incomeCardTypeId: incomeExpenseCardTypeId, incomeCardTypeCode: incomeExpenseCardTypeCode});
    let {paymentModel, modelHelper, cardType, canceledStatus} = getModelByIncomeType.data;
    incomeExpenseCardTypeId = getModelByIncomeType.data.incomeExpenseCardTypeId;
    // Kiểm tra giá trị phiếu thu
    if(!paymentModel || !modelHelper) {
      totalPayAmount = amount
    } else if(!paymentDetail.length) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.DONT_HAVE_PAY_CARD)});
    }
    
    if(!totalPayAmount) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_INCOME_AMOUNT)});
    }    
    // Tạo phiếu thu
    let createdIncomeCard = await IncomeExpenseCard.create(req, {
      type: sails.config.constant.INCOME_EXPENSE_TYPES.INCOME,
      incomeExpenseAt: incomeExpenseAt || new Date().getTime(),
      notes,
      amount: totalPayAmount,
      depositAmount: totalDepositAmount,
      remainingValue: 0,
      customerId: customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.OTHER ? undefined : customerId,
      customerType,
      customerName: customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.OTHER ? customerId : '',
      incomeExpenseCardTypeId,
      status: sails.config.constant.INCOME_EXPENSE_CARD_STATUS.FINISHED,
      createdBy,
      updatedBy: createdBy,
      branchId: branchId
    }).intercept('E_UNIQUE', () => {
      return exits.success({ message: sails.__("Mã phiếu đã tồn tại"), status: false });
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    let updatedIncomeCard = createdIncomeCard;
    
    if ( !code ) {
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: sails.config.constant.CARD_TYPE.income,
        newId: updatedIncomeCard.id,
        customerType
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      let arrUpdatedIncomeCard = await IncomeExpenseCard.update(req, {
        id: createdIncomeCard.id
      }).set({ code: createdCode.data })
        .intercept({ name: "UsageError" }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        }).fetch(); 
      updatedIncomeCard = arrUpdatedIncomeCard[0];
    }

    // Lưu chi tiết phiếu thu
    let promises = [];
    for(let payment of paymentDetail) {
      let {cardId, payAmount} = payment;
      
      promises.push(IncomeExpenseCardDetail.create(req, {
        paidAmount: payAmount,
        paidCardId: cardId,
        incomeExpenseCardId: createdIncomeCard.id,
        incomeExpenseCardTypeId,
        createdBy,
        updatedBy: createdBy
      }).intercept({ name: "UsageError" }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch());
    }
    let createdRelatedCards = await Promise.all(promises);
    
    // Lưu sổ quỹ
    
    let updatedRemainingValue = await sails.helpers.cashbook.updateRemainingValue(req, {
      incomeExpenseAt: createdIncomeCard.incomeExpenseAt,
      changeValue: totalPayAmount,
      branchId: branchId
    });
    if(!updatedRemainingValue.status) {
      return exits.success(updatedRemainingValue);
    }
    
    if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER || customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER)
    {
      // Kiểm tra phiếu thu có cập nhật công nợ cho khách hàng không
      foundIncomeExpenseCardType = await IncomeExpenseCardType.findOne(req, {
        id: incomeExpenseCardTypeId,
        type: sails.config.constant.INCOME_EXPENSE_TYPES.INCOME
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
      if(!foundIncomeExpenseCardType) {
        return exits.success({status: false, message: sails.__("Không tìm thấy loại thu chi")});
      }
      let shouldUpdateDebt = foundIncomeExpenseCardType.shouldUpdateDebt;
      
      // Kiểm tra phương thức thanh toán có sử dụng tiền cọc không
      let foundCustomer = await Customer.findOne(req, {
        id: customerId
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      })
      if(totalDepositAmount > 0) {
        // Kiểm tra tiền cọc còn đủ
        if(foundCustomer.totalDeposit < totalDepositAmount) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_DEPOSIT)});
        }
      }

      let objPaidCard = {};
      if(paymentModel) {
        // Kiểm tra tồn tại đơn hàng và kiểm tra số tiền cần trả
        for(let payment of paymentDetail) {
          let {cardId, payAmount, depositAmount} = payment;
          
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
          if(foundPaidCard.debtAmount < payAmount) {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_INCOME_DEBT)});
          }
          objPaidCard[foundPaidCard.id] = foundPaidCard;
        }
      }
      
      // Cập nhật tiền cọc (giảm) khi có sử dụng tiền cọc để thanh toán
      if(totalDepositAmount > 0) {
        let withdrawDeposit = await sails.helpers.deposit.withdraw(req, {
          customerId,
          amount: totalDepositAmount,
          originalVoucherId: updatedIncomeCard.id,
          originalVoucherCode: updatedIncomeCard.code,
          createdBy,
          branchId: branchId
        });
        
        if(!withdrawDeposit.status) {
          return exits.success(withdrawDeposit);
        }
      }
      // Cập nhật công nợ (giảm cho khách hàng)
      if(shouldUpdateDebt && customerId) {
        let updatedDebt = await sails.helpers.debt.create(req, {
          changeValue: (foundCustomer.type === sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? -1 : 1) * totalPayAmount,
          originalVoucherId: updatedIncomeCard.id,
          originalVoucherCode: updatedIncomeCard.code,
          type: sails.config.constant.DEBT_TYPES.CREATE_INCOME,
          customerId,
          createdBy,
        });
        
        if(!updatedDebt.status){
          return exits.success(updatedDebt);
        }
      }

      if (isActionLog) {
        // tạo nhật ký 
        let createActionLog = await sails.helpers.actionLog.create(req, {
          userId: createdBy,
          functionNumber: sails.config.constant.ACTION_LOG_TYPE.INCOME,
          action: sails.config.constant.ACTION.CREATE,
          objectId: updatedIncomeCard.id,
          objectContentNew: {...updatedIncomeCard, paymentDetail: createdRelatedCards},
          deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
          branchId
        })

        if (!createActionLog.status) {
          exits.success(createActionLog)
        }
      }
      
      if(paymentModel) {
        // Cập nhật số tiền đã trả cho đơn hàng hoặc trả hàng nhập
        let promises = [];
        for(let payment of paymentDetail) {
          let {cardId, payAmount, depositAmount} = payment;

          promises.push(paymentModel.update(req, {id: cardId}).set({
            paidAmount: objPaidCard[cardId].paidAmount + payAmount,
            debtAmount: objPaidCard[cardId].debtAmount - payAmount,
            updatedBy: createdBy
          }).intercept({ name: "UsageError" }, () => {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
          }).fetch());
        }
        let updatedPaidAmounts = await Promise.all(promises);
      }
    }
    return exits.success({status: true, data: updatedIncomeCard});
  }

}