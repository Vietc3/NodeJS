module.exports = {
  friendlyName: "Delete Product",

  description: "Delete a product.",

  inputs: {

  },

  fn: async function(inputs) {

    // Kiểm tra product id có tồn tại không
    let foundProduct = await Product.findOne(this.req, {
      id: this.req.params.id,
    }).intercept({ name: "UsageError" }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
    });
    if(!foundProduct) {
      return exits.success({
        status: false,
        message: sails.__("Sản phẩm không tồn tại trong hệ thống")
      });
    } 

    var updateProduct = await Product.update(this.req, { id: this.req.params.id }).set({
      code: foundProduct.code + ` ${new Date().getTime()}`,
      deletedAt: new Date().getTime(),
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
      action: sails.config.constant.ACTION.DELETE,
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
