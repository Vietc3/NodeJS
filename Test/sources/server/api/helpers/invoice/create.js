module.exports = {
  description: 'create a invoice card',

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
      id, // for data-seeding
      createdAt, // for data-seeding
      code,
      totalAmount,
      finalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      notes,
      noteIncomeExpense,
      deliveryAddress,
      customerId,
      products,
      payType,
      deliveryType,
      paidAmount,
      depositAmount,
      createdBy,
      invoiceAt,
      branchId,
      incomeExpenseAt,
      isActionLog
    } = inputs.data;

    let {req} = inputs;
    
    
    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.invoiceFirstCode, code);      
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }
    
    // XỬ LÝ ĐƠN HÀNG
    //Kiểm tra tồn kho

    let changedProductQuantity = {};
    
    products.map(item => {
      if(item.type == sails.config.constant.PRODUCT_TYPES.merchandise){
        let {productId, quantity, stockId} = item;
        changedProductQuantity[stockId] = changedProductQuantity[stockId] || {};
        changedProductQuantity[stockId][productId] = (changedProductQuantity[stockId][productId] || 0) + quantity;
      }
    })

    let check = await sails.helpers.product.checkStockQuantity(
      req, 
      Object.keys(changedProductQuantity).map(item => ({
        stockId: item, 
        products: Object.keys(changedProductQuantity[item]).map(product => ({
          productId: product,
          quantity: changedProductQuantity[item][product]
        }))
      })), 
      branchId);
    if(!check.status) {
      return exits.success(check);
    }
    
    // Tạo đơn hàng
    let newInvoice = await Invoice.create(req, _.pickBy({
      id, // for data-seeding
      createdAt, // for data-seeding
      code: code || new Date().getTime(), // for data-seeding
      totalAmount,
      discountAmount,
      taxAmount,
      deliveryAmount,
      finalAmount,
      notes,
      deliveryAddress,
      customerId: customerId || undefined,
      status: sails.config.constant.INVOICE_CARD_STATUS.FINISHED,
      deliveryType,
      debtAmount: finalAmount,
      paidAmount: 0,
      invoiceAt: invoiceAt || new Date().getTime(),
      createdBy,
      branchId,
      updatedBy: createdBy
    }, value => value != null)).intercept('E_UNIQUE', () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.EXIST_INVOICE_CODE)});
    }).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    if (!code) {
      let createdCode = await sails.helpers.createCardCode(req, {
        cardType: sails.config.constant.CARD_TYPE.invoice,
        newId: newInvoice.id,
      });
      if(!createdCode.status) {
        return exits.success(createdCode)
      }
      let arrUpdateCodeInvoice = await Invoice.update(req, { id: newInvoice.id, branchId }).set({
        code: createdCode.data
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      newInvoice = arrUpdateCodeInvoice[0];
    }
    
    //tạo các sản phẩm trong bảng InvoiceProduct
    let newInvoiceProducts = [];
    for (let index in products) {
      let {
        productCode,
        productName,
        quantity,
        unitPrice,
        discount,
        discountType,
        taxAmount,
        finalAmount,
        notes,
        costUnitPrice,
        productId,
        stockId
      } = products[index];
      
      let newInvoiceProduct = await InvoiceProduct.create(req, {
        productCode,
        productName,
        quantity,
        unitPrice,
        discount,
        discountType,
        taxAmount,
        finalAmount,
        notes,
        costUnitPrice,
        invoiceId: newInvoice.id,
        productId,
        createdBy,
        updatedBy: createdBy,
        stockId
      }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }).fetch();
      
      newInvoiceProducts.push(newInvoiceProduct);
    }
    
    //Tạo công nợ khách hàng
    if(customerId && finalAmount > 0) {
      let createDebt = await sails.helpers.debt.create(req, {
        changeValue: finalAmount,
        originalVoucherId: newInvoice.id,
        originalVoucherCode: newInvoice.code,
        type: sails.config.constant.DEBT_TYPES.CREATE_INVOICE,
        customerId,
        branchId,
        createdBy,
      });
      if(!createDebt.status) {
        return exits.success(createDebt);
      }
    }
    
    // CẬP NHẬT TỒN KHO

    for(let stockId in changedProductQuantity) {
      for(let productId in changedProductQuantity[stockId]){
        let updateQuantity = await sails.helpers.product.updateQuantity(req, {
          id: productId, 
          branchId,
          stockQuantity: -changedProductQuantity[stockId][productId],
          stockId: stockId
        })
        if(!updateQuantity.status) {
          return exits.success(updateQuantity);
        }
      }
    }
      
    // XỬ LÝ THANH TOÁN
    
    let foundCustomer = await Customer.findOne(req, {id: customerId, branchId});
    
    if(!foundCustomer) {
      return exits.success({status: false, message: sails.__("Tạo phiếu thu từ đơn hàng thất bại")});
    }

    let objectContentNew = {...newInvoice, products: newInvoiceProducts };

    if(paidAmount) {
      let createIncome = await sails.helpers.income.create(req, {
        customerId, 
        customerType: foundCustomer.type,
        originalInvoiceId: newInvoice.id, 
        incomeExpenseCardTypeCode: sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE.code,
        paymentDetail: [{cardId: newInvoice.id, payAmount: paidAmount}],
        notes: noteIncomeExpense || '',
        depositAmount,
        incomeExpenseAt,
        createdBy,
        branchId
      })
      
      if(!createIncome.status) {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
      }
      objectContentNew.incomeExpense = createIncome.data
    }

    if (isActionLog) {
      //tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.INVOICE,
        action: sails.config.constant.ACTION.CREATE,
        objectId: newInvoice.id,
        objectContentNew: objectContentNew,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({status: true, data: {newInvoice, newInvoiceProducts}});
  }

}