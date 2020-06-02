module.exports = {
  description: 'create new branch',

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
      email,
      name,
      phoneNumber,
      address,
      status,
      createdBy,
      isActionLog
    } = inputs.data;
    let {req} = inputs;
    // chuẩn bị data
    name = name.trim();
    
    // Kiểm tra branch name có hợp lệ không
    if(!(name !== undefined && typeof name === 'string' && name.length > 0)){
      return exits.success({status: false, message: sails.__("Tên chi nhánh không hợp lệ")});
    }
    let foundBranch = await Branch.find(req, {name}).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    if(foundBranch.length){
      return exits.success({
        status: false,
        message: sails.__("Tên chi nhánh đã tồn tại")
      });
    }
    
    // Tạo record new branch
    let createdBranch = await Branch.create(req, {
      email: email || "",
      name,
      status,
      phoneNumber: phoneNumber || "",
      address: address || "",
      createdBy,
      updatedBy: createdBy
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    }).fetch();
    
    let foundProduct = await Product.find(req, { deletedAt: 0 });    
    
    let product = [];

    _.forEach(foundProduct, item => {
      product.push(ProductStock.create(req, {
        branchId: createdBranch.id,
        productId: item.id,
        stockQuantity: 0,
        manufacturingQuantity: 0,
        createdBy,
        updatedBy: createdBy
      }))

      product.push(ProductPrice.create(req, {
        branchId: createdBranch.id,
        productId: item.id,
        costUnitPrice: 0,
        lastImportPrice: 0,
        saleUnitPrice: 0,
        createdBy,
        updatedBy: createdBy
      }))
    })
    
    await Promise.all(product) 

    if (isActionLog) { 
      // tạo nhật ký
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: createdBy,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.BRANCH,
        action: sails.config.constant.ACTION.CREATE,
        objectId: createdBranch.id,
        objectContentNew: createdBranch,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
        branchId: req.headers['branch-id']
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }
       
    let createdNewStock = await sails.helpers.stockList.create(req, {
      name : sails.config.constant.DEFAULT_STOCK_LIST,
      branchId : parseInt(createdBranch.id),
      address:"",
      notes:"",
    });    
    
    return exits.success({
      status: true,
      data: createdBranch
    });
  }

}