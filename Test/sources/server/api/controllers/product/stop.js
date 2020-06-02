module.exports = {
  friendlyName: "Stop/UnStop Product",

  description: "Stop/UnStop a product.",

  inputs: {
    isStop: {
      type: "boolean",
    },
  },

  fn: async function(inputs) {
    let { isStop } = inputs;
    let foundProduct = await Product.findOne(this.req, { id: this.req.params.id });

    var updateProduct = await Product.update(this.req, { id: this.req.params.id }).set({
      stoppedAt: isStop ? new Date().getTime() : 0,
      updatedBy: this.req.loggedInUser.id
    }).intercept({ name: 'UsageError' }, ()=>{
      this.res.status(400).json({
        status: false,
        error: sails.__('Sản phẩm không tồn tại trong hệ thống')
      });
      return;
    }).fetch();

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT,
      action: isStop ? sails.config.constant.ACTION.STOP : sails.config.constant.ACTION.ACTIVE,
      objectId: this.req.params.id,
      objectContentOld: foundProduct,
      objectContentNew: updateProduct[0],
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: updateProduct[0]
    });
  }
};
