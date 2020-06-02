module.exports = {
  description: 'list invoice cards',
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
    let { id, branchId, isCheck } = inputs.data;

    let {req} = inputs;
    
    
    let foundInvoice= await Invoice.findOne(req, {
        where: { id: id }
      }).populate("customerId")
        .intercept({ name: 'UsageError' }, () => {
          return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
        })
    if (!foundInvoice) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_INVOICE)});
    }

    if (isCheck) {
      let checkBanch = await sails.helpers.checkBranch(foundInvoice.branchId, req);

      if(!checkBanch){
        return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
      }
    }
    let createdBy = await User.findOne(req, {
      where: { id: foundInvoice.createdBy },
      select: ["id", "fullName"]
    })

    if (createdBy) foundInvoice.createdBy = createdBy;

    let invoiceProductArray = await InvoiceProduct.find(req, { invoiceId: foundInvoice.id }).populate("productId");

    let productStocks = await Promise.all(_.map(invoiceProductArray, item => {
      return ProductStock.findOne(req, {productId: item.productId.id, branchId});
    }))

    const stocks = Object.values(sails.config.constant.STOCK_QUANTITY_LIST);
    for(let index in invoiceProductArray){
      stocks.map(stock => {
        if (productStocks[index]) {
          invoiceProductArray[index].productId[stock] = productStocks[index][stock];
        } else {
          invoiceProductArray[index].productId[stock] = 0;
        }
      })   
    }
    
    //lấy danh sách phiếu thu liên quan tới đơn hàng
    let foundIncomeDetail = await sails.helpers.income.getCardDetail(req, {
      cardId: foundInvoice.id,
      incomeExpenseCardTypeCode: sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE.code
    });

    let incomeCards = [];
    if(foundIncomeDetail.status) {
      incomeCards = foundIncomeDetail.data.incomeExpenseCardDetail
    }
    else {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }

    //lấy danh sách trả hàng liên quan tới đơn hàng
    let invoiceReturns = await sails.helpers.importCard.list(req, { 
      filter: { reference: foundInvoice.code, status: sails.config.constant.IMPORT_CARD_STATUS.FINISHED }, 
      type: sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER 
    })

    if(!invoiceReturns.status) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }
    invoiceReturns = invoiceReturns.data;

    return exits.success({ status: true, data: {foundInvoice, invoiceProductArray, incomeCards, invoiceReturns}});;
  }

}