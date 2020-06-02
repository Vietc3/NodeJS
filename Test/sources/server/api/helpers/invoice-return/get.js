module.exports = {
  description: 'get invoice return card',

  inputs: {
    req: {
      type: "ref"
    },
    id: {
      type: "number"
    },
    branchId: {
      type: "number"
    },
  },

  fn: async function (inputs, exits) {
    let { req, id , branchId} = inputs;
    
    foundInvoiceReturn= await ImportCard.findOne(req, {
        where: { id: id, reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN}
      }).intercept({ name: 'UsageError' }, () => {
          return exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
        });
    
    let checkBanch = await sails.helpers.checkBranch(foundInvoiceReturn.branchId, req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }

    let foundInvoiceCard = (await Invoice.findOne(req, {
      where: {
        code: foundInvoiceReturn.reference,
      }
    }) 
    .populate('customerId')
    .populate('invoiceProducts')) || {};
    
    // lấy thông tin khách hàng
    if(!foundInvoiceCard.customerId) {
      let foundCustomer = await Customer.findOne(req, {id: foundInvoiceReturn.recipientId});
      
      foundInvoiceCard.customerId = foundCustomer;
    }
    
    foundInvoiceReturn.invoice = foundInvoiceCard;

    let createdBy = await User.findOne(req, {
      where: { id: foundInvoiceReturn.createdBy },
      select: ["id", "fullName"]
    });

    if (createdBy) foundInvoiceReturn.createdBy = createdBy;

    let invoiceReturnProductArray = await ImportCardProduct.find(req, { importCardId: foundInvoiceReturn.id }).populate("productId");

    let productUnit = {};
    (await ProductUnit.find(req, { deletedAt: 0 })).forEach(item => productUnit[item.id] = item);
    let productStock = {};
    (await ProductStock.find(req, { productId: {in: _.uniq(invoiceReturnProductArray.map(item => item.productId.id))} })).forEach(item => productStock[item.productId] = item);

    if ( productUnit ) {
      _.forEach(invoiceReturnProductArray, item => {
        item.type = item.productId.type;
        item.unit = productUnit[item.productId.unitId].name;
        item.productId = item.productId.id;
        item.productStock = productStock[item.productId];
      });
    }

    //lấy danh sách phiếu chi liên quan đến phiếu trả hàng
    let foundExpenseDetail = await sails.helpers.income.getCardDetail(req, {
      cardId: foundInvoiceReturn.id,
      incomeExpenseCardTypeCode: sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN.code
    });

    let expenseCards = [];
    if (foundExpenseDetail.status) {
      expenseCards = foundExpenseDetail.data.incomeExpenseCardDetail
    }
    else {
      return exits.success({ status: false, message: sails.config.constant.INTERCEPT.UsageError });
    }

    exits.success({ status: true, data: foundInvoiceReturn, invoiceReturnProductArray, expenseCards });
  }
}