module.exports = {
  description: 'get import card',
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
    let { id , branchId} = inputs.data;

    let {req} = inputs;

    let foundImportCard = await ImportCard.findOne(req, {
      where: { id: id }
    }).populate("recipientId")
      .intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
      })
    if (!foundImportCard) {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_IMPORT_CARD) });
    }

    let checkBanch = await sails.helpers.checkBranch(foundImportCard.branchId, req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }

    let createdBy = await User.findOne(req, {
      where: { id: foundImportCard.createdBy },
      select: ["id", "fullName"]
    })

    if (createdBy) foundImportCard.createdBy = createdBy;
    let importProductArray = await ImportCardProduct.find(req, { importCardId: foundImportCard.id }).populate("productId");

    let productStocks = await Promise.all(_.map(importProductArray, item => {
      return ProductStock.findOne(req, {productId: item.productId.id, branchId});
    }))

    const stocks = Object.values(sails.config.constant.STOCK_QUANTITY_LIST);
    for(let index in importProductArray){
      stocks.map(stock => {
        if (productStocks[index]) {
          importProductArray[index].productId[stock] = productStocks[index][stock];
        } else {
          importProductArray[index].productId[stock] = 0;
        }
      })   
    }

    await Promise.all(_.map(importProductArray, async item => {
        let foundUnit = await ProductUnit.findOne(req, {id: item.productId.unitId});
        if(foundUnit)
          item.unit = foundUnit.name;
    }))
    
    //lấy danh sách phiếu chi liên quan đến phiếu nhập
    let foundExpenseDetail = await sails.helpers.income.getCardDetail(req, {
      cardId: foundImportCard.id,
      incomeExpenseCardTypeCode: sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT.code,
    });

    let expenseCards = [];
    if (foundExpenseDetail.status) {
      expenseCards = foundExpenseDetail.data.incomeExpenseCardDetail
    }
    else {
      return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    }

    // lấy danh sách phiếu trả hàng nhập liên quan đến phiếu nhập
    let importReturns = await sails.helpers.exportCard.list(req, { 
      filter: { reference: foundImportCard.code, status: sails.config.constant.EXPORT_CARD_STATUS.FINISHED }, 
      type: sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER
    })

    if(!importReturns.status) {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }
    importReturns = importReturns.data;    

    return exits.success({ status: true, data: foundImportCard, importProductArray, expenseCards, importReturns });
  }

}