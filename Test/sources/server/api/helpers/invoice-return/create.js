module.exports = {
  description: 'create invoice return card',

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
      id, //for data-seeding
      createdAt, // for data-seeding
      products, // [{productCode, productName, quantity, unitPrice, discount, taxAmount, finalAmount, productId, invoiceProductId //tương ứng với id của invoice product},]
      finalAmount,
      code,
      notes,
      noteIncomeExpense,
      invoiceId,
      createdBy,
      customerId,
      totalAmount,
      discountAmount,
      payAmount,
      incomeExpenseAt,
      importedAt,
      branchId,
      isActionLog
    } = inputs.data;

    let {req} = inputs;
    
    //kiểm tra mã phiếu có được nhập không, nếu có thì kiểm tra có chứa tiền tố tự sinh không
    if(code){
      let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.importCardFirstCode, code);
      if(!checkExistPrefix.status){
        return exits.success(checkExistPrefix);
      }
    }
    
    let invoice = {};
    if(invoiceId) {
      invoice = await Invoice.findOne(req, { id: invoiceId, branchId });

      if (!invoice) {
        return exits.success({ message: sails.__("Phiếu đơn hàng không tồn tại"), status: false });
      }

      let invoiceProducts = await InvoiceProduct.find(req, { invoiceId: invoiceId })    
      let count = 0; 
      let countReturn = 0; 

      for (let product of products) {
        for (let elem of invoiceProducts) {
          if (elem.id === product.invoiceProductId && ((Number(product.quantity) + elem.returnQuantity) > elem.quantity)) {
            return exits.success({ status: false, message: sails.__("Số lượng sản phẩm trả hàng lớn hơn số lượng sản phẩm đơn hàng") })
          }
          if (elem.id === product.invoiceProductId && ((elem.quantity - elem.returnQuantity) === 0 )) {
            count += 1;
          }        
        }
        if (parseFloat(product.quantity) === 0 ) {
          countReturn += 1;
        }
      }

      if ( count === products.length ) {
        return exits.success({ status: false, message: sails.__("Không có sản phẩm để trả") })
      }

      if ( countReturn === products.length ) {
        return exits.success({ status: false, message: sails.__("Phải trả ít nhất 1 sản phẩm") })
      }

      // cập nhật số lượng trả hàng Invoice   
      for (let product of products) {
        for (let elem of invoiceProducts) {
          if (elem.id == product.invoiceProductId) {
            let invoiceReturnProduct = await InvoiceProduct.update(req, { id: elem.id }).set({
              returnQuantity: Number(product.quantity) + elem.returnQuantity,
              updatedBy: createdBy
            }).intercept({ name: 'UsageError' }, () => {
              return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
            }).fetch();
            break;
          }
        }

      }
    }

    // tạo phiếu import
    let invoiceReturn = await sails.helpers.importCard.create(req, {
      id, //for data-seeding
      createdAt, // for data-seeding
      products,
      code,
      notes,
      createdBy,
      recipientId: customerId,
      totalAmount,
      finalAmount,
      discountAmount,
      reference: invoice.code,
      branchId,
      importedAt,
      reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN,
      debtAmount: finalAmount,
    });

    if (!invoiceReturn.status) return exits.success(invoiceReturn)
    let objectContentNew = {...invoiceReturn.data, products: invoiceReturn.products }
    if ( finalAmount > 0 ) {
      //Tạo công nợ khách hàng
      if(customerId) {
        let createDebt = await sails.helpers.debt.create(req, {
          changeValue: -finalAmount,
          originalVoucherId: invoiceReturn.data.id,
          originalVoucherCode: invoiceReturn.data.code,
          type: sails.config.constant.DEBT_TYPES.CREATE_INVOICE_RETURN,
          customerId,
          createdBy,
        });
        if(!createDebt.status) {
          return exits.success(createDebt);
        }
      }
    
      if(payAmount > 0){
        // tạo phiếu chi  
      
        let foundCustomer = await Customer.findOne(req, {id: customerId, branchId});

        let createExpense = await sails.helpers.expense.create(req, {
          notes: noteIncomeExpense || sails.config.constant.autoExpenseCreate + sails.config.constant.invoiceReturn,
          customerId,
          customerType: foundCustomer.type,
          incomeExpenseCardTypeCode: sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN.code,
          createdBy,
          paymentDetail: [{ cardId: invoiceReturn.data.id, payAmount: payAmount }],
          incomeExpenseAt,
          branchId
        })

        if (!createExpense.status) return exits.success(createExpense)

        objectContentNew.incomeExpense = createExpense.data
      }
    }

    if(isActionLog) {
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.INVOICE_RETURN,
        action: sails.config.constant.ACTION.CREATE,
        objectId: invoiceReturn.data.id,
        objectContentNew: objectContentNew,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || ""},
        branchId
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }

    return exits.success({ status: true, data: invoiceReturn })
  }
}