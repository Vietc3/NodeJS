module.exports = {
  friendlyName: "Create Product Type",

  description: "Create Product Type.",

  inputs: {
    name: {
      required: true,
      type: "string",
      maxLength: 255
    },

    notes: {
      type: "string",
      maxLength: 255
    }
  },

  fn: async function(inputs) {
    let { name, notes } = inputs;

    let productType = await ProductType.findOne(this.req, {
      name
    });
    if (productType) {
      this.res.json({
        status: false,
        error: sails.__('Tên nhóm sản phẩm đã tồn tại')
      });
      return;
    } else {
      let createProductType = await ProductType.create(this.req, {
        name,
        notes,
        createdBy: this.req.loggedInUser.id,
        updatedBy: this.req.loggedInUser.id,
      })
        .intercept({ name: "UsageError" }, "invalid")
        .fetch();
      
      //tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(this.req, {
        userId: this.req.loggedInUser.id,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT_TYPE,
        action: sails.config.constant.ACTION.CREATE,
        objectId: createProductType.id,
        objectContentNew: createProductType,
        deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
        branchId: this.req.headers['branch-id']
      })

      if (!createActionLog.status) {
        return createActionLog
      }

      return { status: true, data: createProductType };
    }
  }
};
