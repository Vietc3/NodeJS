module.exports = {
  description: 'get invoice return card',

  inputs: {
    req:{
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
    
    foundImportReturn= await ExportCard.findOne(req, {
        where: { id: id, reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER}
      }).intercept({ name: 'UsageError' }, () => {
          exits.success({ message: sails.__("Thông tin không hợp lệ"), status: false });
      });

    if (!foundImportReturn) {
      exits.success({ message: sails.__("Không tìm thấy phiếu trả hàng nhập"), status: false });
    }

    let checkBanch = await sails.helpers.checkBranch(foundImportReturn.branchId, req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }

    let createdBy = await User.findOne(req, {
      where: { id: foundImportReturn.createdBy },
      select: ["id", "fullName"]
    });

    if (createdBy) foundImportReturn.createdBy = createdBy;

    let customers = await Customer.findOne(req, { where: { id: foundImportReturn.recipientId, type: sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER }})
      
    foundImportReturn.customerId = customers;
    let importReturnProductArray = await ExportCardProduct.find(req, { exportCardId: foundImportReturn.id }).populate("productId");
    let productUnit = await ProductUnit.find(req, { deletedAt: 0 });

    if ( productUnit ) {
      _.forEach(importReturnProductArray, item => {
        _.forEach(productUnit, elem => {
          if ( item.productId.unitId && item.productId.unitId == elem.id ) {
            item.unit = elem.name;
            //item.productId = item.productId.id;
            return;
          }
        });
      });
    }

    await Promise.all(_.map(importReturnProductArray, async item => {
      let stocks = Object.values(sails.config.constant.STOCK_QUANTITY_LIST);
      let productStock = await ProductStock.findOne(req, {productId: item.productId.id, branchId});

      stocks.map(stock => {
        if (productStock) {
          item.productId[stock] = productStock[stock];
        } else {
          item.productId[stock] = 0;
        }
      })      
      let productPrice = await ProductPrice.findOne(req, {productId: item.productId.id, branchId});
      item.productId.lastImportPrice = productPrice.lastImportPrice;
      return item;
    }))

    //lấy danh sách phiếu thu liên quan đến phiếu trả hàng nhập
    let foundIncomeDetail = await sails.helpers.income.getCardDetail(req, {
      cardId: foundImportReturn.id,
      incomeExpenseCardTypeCode: sails.config.constant.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN.code,
    });

    let incomeCards = [];
    if (foundIncomeDetail.status) {
      incomeCards = foundIncomeDetail.data.incomeExpenseCardDetail
    }
    else {
      return exits.success({ status: false, message: sails.config.constant.INTERCEPT.UsageError });
    }

    exits.success({ status: true, data: foundImportReturn, importReturnProductArray, incomeCards });
  }
}