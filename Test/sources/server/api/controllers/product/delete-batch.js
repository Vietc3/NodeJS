module.exports = {
  friendlyName: "Delete Products",

  description: "Delete multiple products",

  inputs: {
    ids: {
      type: 'json'
    },
    isCheckAll: {
      type: 'ref'
    },
    typeId: {
      type: "number",
    }
  },

  fn: async function(inputs) {
    let { ids, isCheckAll, typeId } = inputs;
    let foundProductLists = {};
    let allId = [];

    if (isCheckAll) {
      let filter = _.extend({deletedAt: 0}, typeId ? {productTypeId: typeId } : {})
      foundProductLists = await Product.find(this.req, filter );      
      _.forEach(foundProductLists, item =>{
        allId.push(item.id);
      })
      ids = allId;
    }
    
    if (!ids || !Array.isArray(ids) || !ids.length) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }

    let foundProducts = await Product.find(this.req, { id: { in: ids }})

    let deletedProducts = await Product.update(this.req, { id: { in: ids }}).set({
      deletedAt: new Date().getTime(),
      updatedBy: this.req.loggedInUser.id
    }).intercept({ name: 'UsageError' }, ()=>{
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }).fetch();

    deletedProducts = await Promise.all(_.map(deletedProducts,item => {
      let updateProduct = Product.update(this.req, {id: item.id}).set({
        code: item.code + ` ${new Date().getTime()}`,
      }).fetch();

      return updateProduct;
    }))

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT,
      action: sails.config.constant.ACTION.DELETE,
      objectContentOld: foundProducts,
      objectContentNew: deletedProducts.map(item => item[0]),
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: deletedProducts
    });
  }
};
