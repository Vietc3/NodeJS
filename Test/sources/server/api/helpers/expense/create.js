module.exports = {
  description: 'create expense card',

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
      incomeExpenseCardTypeId,
      incomeExpenseCardTypeCode,
      paymentDetail, // [{cardId, payAmount}]
      amount,
      depositAmount,
      createdBy,
      branchId,
      isActionLog
    } = inputs.data;
    let req = inputs.req;

    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
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

    // chuẩn bị dữ liệu
    let totalPayAmount = 0;
    amount = parseFloat(amount);
    let totalDepositAmount = parseFloat(depositAmount) || 0;
    paymentDetail = (paymentDetail || []).map(item => {
      item.payAmount = parseFloat(item.payAmount) || 0;
      totalPayAmount += item.payAmount;
      return ({
        ...item,
        payAmount: item.payAmount,
      });
    }).filter(item => item.payAmount > 0);
    // Kiểm tra loại phiếu cần trả (import or invoice return card)
    let getModelByExpenseType = await sails.helpers.expense.getModelByExpenseType(req, {expenseCardTypeId: incomeExpenseCardTypeId, expenseCardTypeCode: incomeExpenseCardTypeCode});
    let {paymentModel, modelHelper, canceledStatus} = getModelByExpenseType.data;
    incomeExpenseCardTypeId = getModelByExpenseType.data.incomeExpenseCardTypeId;

    // Kiểm tra giá trị phiếu chi
    if(!paymentModel || !modelHelper){
      totalPayAmount = amount;
    }else if(!paymentDetail.length) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.DONT_HAVE_PAY_CARD)});
    }
    if(!totalPayAmount) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_EXPENSE_AMOUNT)});
    }

    // Tạo phiếu chi
    let createdExpenseCard = await IncomeExpenseCard.create(req, {
      type: sails.config.constant.INCOME_EXPENSE_TYPES.EXPENSE,
      incomeExpenseAt: incomeExpenseAt || new Date().getTime(),
      notes,
      amount: totalPayAmount,
      depositAmount: totalDepositAmount,
      remainingValue: 0,
      customerId: customerType == sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.OTHER ? undefined : customerId,
      customerType,
      customerName: customerType == sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.OTHER ? customerId : "",
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
    let updatedExpenseCard = createdExpenseCard;
    
    if ( !code ) {
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: sails.config.constant.CARD_TYPE.expense,
        newId: createdExpenseCard.id,
        customerType
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      let arrUpdatedExpenseCard = await IncomeExpenseCard.update(req, {
        id: createdExpenseCard.id,
        branchId: branchId
      }).set({ code: createdCode.data })
        .intercept({ name: "UsageError" }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        }).fetch(); 
      updatedExpenseCard = arrUpdatedExpenseCard[0];
    }
    
    // Lưu chi tiết phiếu chi
    let promises = [];
    for(let payment of paymentDetail) {
      let {cardId, payAmount} = payment;
      
      promises.push(IncomeExpenseCardDetail.create(req, {
        paidAmount: payAmount,
        paidCardId: cardId,
        incomeExpenseCardId: createdExpenseCard.id,
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
      incomeExpenseAt: createdExpenseCard.incomeExpenseAt,
      changeValue: -totalPayAmount,
      branchId: branchId
    });
    if(!updatedRemainingValue.status) {
      return exits.success(updatedRemainingValue);
    }

    if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER || customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER){

      // Kiểm tra phiếu chi có cập nhật công nợ cho khách hàng không
      foundIncomeExpenseCardType = await IncomeExpenseCardType.findOne(req, {
        id: incomeExpenseCardTypeId,
        type: sails.config.constant.INCOME_EXPENSE_TYPES.EXPENSE
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      });
      if(!foundIncomeExpenseCardType) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }
      let shouldUpdateDebt = foundIncomeExpenseCardType.shouldUpdateDebt;
      
      // Kiểm tra phương thức trả có sử dụng tiền cọc không
      let foundCustomer = await Customer.findOne(req, {
        id: customerId,
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      })
      if(totalDepositAmount > 0) {
        // Kiểm tra tiền cọc còn đủ
        if(foundCustomer.totalDeposit < totalDepositAmount) {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_DEPOSIT)});
        }
      }
      // Kiểm tra tồn tại đơn nhập hàng và kiểm tra số tiền cần trả
      let objPaidCard = {};
      if(paymentModel) {
        for(let payment of paymentDetail) {
          let {cardId, payAmount, depositAmount} = payment;
          
          // Kiểm tra tồn tại đơn nhập hàng hoặc trả hàng
          let foundPaidCard = await paymentModel.findOne(req, {
            id: cardId
          }).intercept({ name: 'UsageError' }, () => {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
          });
          if(!foundPaidCard) {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND) + ' ' + cardId});
          }
          
          // Kiểm tra trạng thái phiếu
          if(foundPaidCard.status === canceledStatus) {
            return exits.success({status: false, message: sails.__(sails.config.constant.CANT_PAY_CANCELED_CARD)});
          }
          
          // Kiểm tra số tiền thanh toán có lớn hơn số tiền cần trả không
          if(foundPaidCard.debtAmount < payAmount) {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_ENOUGH_EXPENSE_DEBT)});
          }
          objPaidCard[foundPaidCard.id] = foundPaidCard;
        }
      }
      
      // Cập nhật tiền cọc (giảm) khi có sử dụng tiền cọc để thanh toán
      if(totalDepositAmount > 0) {
        let withdrawDeposit = await sails.helpers.deposit.withdraw(req, {
          customerId,
          amount: totalDepositAmount,
          originalVoucherId: updatedExpenseCard.id,
          originalVoucherCode: updatedExpenseCard.code,
          createdBy,
          branchId: branchId
        });
        
        if(!withdrawDeposit.status) {
          return exits.success(withdrawDeposit);
        }
      }
      
      // Cập nhật công nợ (tăng cho khách hàng, giảm ncc)
      if(shouldUpdateDebt && customerId) {
        let updatedDebt = await sails.helpers.debt.create(req, {
          changeValue: (foundCustomer.type === sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ? 1 : -1) * totalPayAmount,
          originalVoucherId: updatedExpenseCard.id,
          originalVoucherCode: updatedExpenseCard.code,
          type: sails.config.constant.DEBT_TYPES.CREATE_EXPENSE,
          customerId,
          createdBy,
          branchId: branchId
        });
        
        if(!updatedDebt.status){
          return exits.success(updatedDebt);
        }
      }

      if (isActionLog) {
        // tạo nhật ký 
        let createActionLog = await sails.helpers.actionLog.create(req, {
          userId: createdBy,
          functionNumber: sails.config.constant.ACTION_LOG_TYPE.EXPENSE,
          action: sails.config.constant.ACTION.CREATE,
          objectId: updatedExpenseCard.id,
          objectContentNew: {...updatedExpenseCard, paymentDetail: createdRelatedCards},
          deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
          branchId
        })

        if (!createActionLog.status) {
          exits.success(createActionLog)
        }
      }
      
      if(paymentModel && modelHelper) {
        // Cập nhật số tiền đã trả cho phiếu nhập hàng hoặc trả hàng
        let promises = [];
        for(let payment of paymentDetail) {
          let {cardId, payAmount, depositAmount} = payment;

          promises.push(modelHelper.update(req, {
            id: cardId,
            paidAmount: objPaidCard[cardId].paidAmount + payAmount,
            debtAmount: objPaidCard[cardId].debtAmount - payAmount,
            updatedBy: createdBy
          }));
        }
        let updatedPaidAmounts = await Promise.all(promises);
      }
    }
    
    return exits.success({status: true, data: updatedExpenseCard});
  }

}