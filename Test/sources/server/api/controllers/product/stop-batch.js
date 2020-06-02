module.exports = {
  friendlyName: "Stop Products",

  description: "Stop multiple products",

  inputs: {
    ids: {
      type: 'json'
    },
    isStop: {
      type: "boolean",
    },
    isCheckAll: {
      type: 'ref'
    },
    typeId: {
      type: "number",
    }
  },

  fn: async function(inputs) {
    let {ids, isStop, isCheckAll, typeId} = inputs;
    let foundProductLists = {};
    let allId = [];

    if (isCheckAll) {
      let filter = _.extend({deletedAt: 0}, typeId ? { productTypeId: typeId } : {})
      foundProductLists = await Product.find(this.req, filter);      
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

    let stoppedProducts = await Product.update(this.req, { id: { in: ids }}).set({
      stoppedAt: isStop ? new Date().getTime() : 0,
      updatedBy: this.req.loggedInUser.id
    }).intercept({ name: 'UsageError' }, ()=>{
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }).fetch();

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT,
      action: isStop ? sails.config.constant.ACTION.STOP : sails.config.constant.ACTION.ACTIVE,
      objectContentOld: foundProducts,
      objectContentNew: stoppedProducts,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: stoppedProducts
    });
  }
};
