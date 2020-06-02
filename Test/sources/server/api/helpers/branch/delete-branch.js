module.exports = {
  description: 'cancel branch',

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
      id,
      updatedBy,
    } = inputs.data;
    let {req} = inputs;
    // chuẩn bị data
    
    let stockQuantityList = Object.values(sails.config.constant.STOCK_QUANTITY_LIST) 
    let sumQuantity = '';
    let ids = [];
   
    sumQuantity = `sum(` +  stockQuantityList.join(` + ` ) + `) as sumQuantity`;
    
    let SQL_STOCK = `SELECT ${sumQuantity}
                FROM productstock ps 
                WHERE ps.branchId= ${id}
                GROUP BY ps.branchId`;

    let foundProductStock = await sails.sendNativeQuery(req, SQL_STOCK);    

    if(foundProductStock.rows[0].sumQuantity > 0) {
      return exits.success({
        status: false,
        message: sails.__("Chi nhánh không thể xóa do vẫn còn tồn kho")
      });
    }

    // Kiểm tra branch id có tồn tại không
    let foundBranch = await Branch.findOne(req, {
      id,
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    if(!foundBranch) {
      return exits.success({
        status: false,
        message: sails.__("Chi nhánh không tồn tại trong hệ thống")
      });
    } 
    
    // kiểm tra chi nhánh đã bị xóa chưa
    if(foundBranch.deletedAt !== 0) {
      return exits.success({
        status: false,
        message: sails.__("Chi nhánh đã bị xóa")
      });
    }
    
    // Kiểm tra chi nhánh có giao dịch chưa
    let countList = await Promise.all([
      Invoice.count(req, {branchId: id}),
      ImportCard.count(req, {branchId: id}),
      ExportCard.count(req, {branchId: id}),
      IncomeExpenseCard.count(req, {branchId: id}),
      MoveStockCard.count(req, {branchId: id}),
      ManufacturingCard.count(req, {branchId: id}),
      DepositCard.count(req, {branchId: id}),
    ]);
    
    if(_.sum(countList) > 0) {
      return exits.success({
        status: false,
        message: sails.__("Chi nhánh không thể xóa do đã phát sinh giao dịch")
      });
    }

    let USER_SQL = `SELECT * from user where JSON_CONTAINS(branchId, '${id}')`

    let foundUser = await sails.sendNativeQuery(req, USER_SQL);

    if (foundUser.rows.length) {
      return exits.success({
        status: false,
        message: sails.__("Chi nhánh không thể xóa do có tài khoản vẫn nằm trong chi nhánh này")
      });
    }
    
    let stockList = await Stock.find(req, {deletedAt: 0, branchId: id}).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });
    if(!stockList.length) {
      return exits.success({
        status: false,
        message: sails.__("Không tìm thấy kho của chi nhánh")
      })
    }
    
    for (let stock of stockList) {
      ids.push(stock.id)
    }
    // cập nhật record new branch
    let deletedBranch = await Branch.update(req, {id}).set({
      name: foundBranch.name + ` ${new Date().getTime()}`,
      deletedAt: new Date().getTime(),
      updatedBy
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();

    // tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(req, {
      userId: updatedBy,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.BRANCH,
      action: sails.config.constant.ACTION.DELETE,
      objectId: deletedBranch[0].id,
      objectContentOld: foundBranch,
      objectContentNew: deletedBranch[0],
      deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
      branchId: req.headers['branch-id']
    }) 

    if (!createActionLog.status) {
      exits.success(createActionLog)
    }

    // cập nhật record new stock
    let deletedStocks = await Promise.all (ids.map(item => sails.helpers.stockList.deleteStock(req, {id: item, updatedBy: updatedBy})));

    return exits.success({
      status: true,
      data: deletedBranch[0]
    });
  }

}