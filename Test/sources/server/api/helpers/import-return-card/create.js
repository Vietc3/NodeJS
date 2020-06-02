module.exports = {
  description: 'create import return card',

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
      id, //for data-seeding
      createdAt, // for data-seeding
      products, // [{productCode, productName, quantity, unitPrice, discount, taxAmount, finalAmount, productId, importProductId},]
      finalAmount,
      code,
      notes,
      noteIncomeExpense,
      createdBy,
      customerId,
      totalAmount,
      discountAmount,
      paidAmount,
      exportedAt,
      branchId,
      isActionLog
    } = inputs.data;
    
    let {req} = inputs;
        
    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.exportCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }

    let foundCustomer = await Customer.findOne(req, {id: customerId });
    
    if(!foundCustomer) {
      return exits.success({status: false, message: sails.__("Mã nhà cung cấp không tồn tại")});
    }

    // tạo phiếu export
    let importReturn = await sails.helpers.exportCard.create(req, {
      id, //for data-seeding
      createdAt, // for data-seeding
      products,
      code,
      notes,
      createdBy,
      recipientId: customerId,
      totalAmount,
      finalAmount,
      paidAmount: 0,
      discountAmount,
      reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER,
      exportedAt,
      debtAmount: finalAmount,
      branchId: branchId 
    });

    if (!importReturn.status) return exits.success(importReturn)
    let objectContentNew = {...importReturn.data, products: importReturn.products }
    if (Number(finalAmount) > 0 ) {
      //Tạo công nợ nhà cung cấp
      if(customerId) {
        let createDebt = await sails.helpers.debt.create(req, {
          changeValue: -finalAmount,
          originalVoucherId: importReturn.data.id,
          originalVoucherCode: importReturn.data.code,
          type: sails.config.constant.DEBT_TYPES.CREATE_IMPORT_RETURN,
          customerId,
          createdBy,
        });
        if(!createDebt.status) {
          return exits.success(createDebt);
        }
      }

      if(Number(paidAmount) > 0){
        // tạo phiếu thu
        let createExpense = await sails.helpers.income.create(req, {
          notes: noteIncomeExpense || sails.config.constant.autoIncomeCreate + sails.config.constant.importReturn,
          customerType: foundCustomer.type,
          customerId,
          incomeExpenseCardTypeCode: sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN.code,
          createdBy,
          paymentDetail: [{ cardId: importReturn.data.id, payAmount: Number(paidAmount) }],
          incomeExpenseAt: exportedAt,
          branchId: branchId
        })

        if (!createExpense.status) return exits.success(createExpense)

        objectContentNew.incomeExpense = createExpense.data
      }
    }

    if(isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.IMPORT_RETURN,
        action: sails.config.constant.ACTION.CREATE,
        objectId: importReturn.data.id,
        objectContentNew: objectContentNew,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

      return exits.success({ status: true , data: importReturn.data })
    }
  }