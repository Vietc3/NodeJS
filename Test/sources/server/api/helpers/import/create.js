module.exports = {
  description: 'create a import card',

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
      code,
      products,
      finalAmount,
      totalAmount,
      importedAt,
      notes,
      noteIncomeExpense,
      reason,
      recipientId,
      reference,
      createdBy,
      paidAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      depositAmount,
      incomeExpenseAt,
      branchId,
      isActionLog,
    } = inputs.data;

    let {req} = inputs;
    
    
    // Tạo phiếu nhập
    let newImportCard = await sails.helpers.importCard.create(req, {
      id, //for data-seeding
      createdAt, // for data-seeding
      code,
      products,
      finalAmount,
      totalAmount,
      importedAt,
      notes,
      reason,
      recipientId,
      reference,
      createdBy,
      paidAmount: 0,
      debtAmount: finalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      branchId,
    })
    if (!newImportCard.status) return exits.success(newImportCard)

    let objectContentNew = {...newImportCard.data, products: newImportCard.products }
    
    if(reason== sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER){
      //Tạo công nợ khách hàng
      if(recipientId && finalAmount > 0) {
        let createDebt = await sails.helpers.debt.create(req, {
          changeValue: finalAmount,
          originalVoucherId: newImportCard.data.id,
          originalVoucherCode: newImportCard.data.code,
          type: sails.config.constant.DEBT_TYPES.CREATE_IMPORT,
          customerId: recipientId,
          createdBy,
        });
        if(!createDebt.status) {
          return exits.success(createDebt);
        }
      }
      
      //tạo phiếu chi đối với phiếu nhập hàng từ nhà cung cấp
      if(paidAmount > 0){
        
        let foundCustomer = await Customer.findOne(req, { id: recipientId });

        if(!foundCustomer) {
          return exits.success({status: false, message: sails.__("Tạo phiếu chi từ phiếu nhập thất bại")});
        }
        if (reason === sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER) {
          let createExpense = await sails.helpers.expense.create(req, {
            incomeExpenseAt: incomeExpenseAt || new Date().getTime(),
            notes: noteIncomeExpense || sails.config.constant.autoExpenseCreate + sails.config.constant.import,
            customerType: foundCustomer.type,
            customerId: recipientId,
            incomeExpenseCardTypeCode: sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT.code,
            createdBy,
            paymentDetail: [{ cardId: newImportCard.data.id, payAmount: paidAmount }],
            depositAmount,
            branchId: branchId
          })
          if (!createExpense.status) return exits.success(createExpense)

          objectContentNew.incomeExpense = createExpense.data
        }
      }
    }

    if (isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: reason == sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER ? sails.config.constant.ACTION_LOG_TYPE.IMPORT 
        : reason == sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN ? sails.config.constant.ACTION_LOG_TYPE.INVOICE_RETURN : sails.config.constant.ACTION_LOG_TYPE.EXPORT_FINISHED_PRODUCT,
        action: sails.config.constant.ACTION.CREATE,
        objectId: newImportCard.data.id,
        objectContentNew: objectContentNew,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({ status: true, data: { newImportCard } });
  }

}