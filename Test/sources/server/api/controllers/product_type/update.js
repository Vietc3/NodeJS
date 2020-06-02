module.exports = {

  friendlyName: 'Update Product Type',

  description: 'Update Product Type.',

  inputs: {
    name: {
      required: true,
      type: 'string',
      maxLength: 255,
    },

    notes: {
      type: 'string',
      maxLength: 255,
    },

  },

  fn: async function (inputs) {
    var { name, notes } = inputs;

    let foundProductType = await ProductType.findOne(this.req, { id: this.req.params.id })

    var updateProductType = await ProductType.update(this.req, { id: this.req.params.id })
      .set({ name, notes, updatedBy: this.req.loggedInUser.id })
      .intercept('E_UNIQUE', () => {
        this.res.json({
          status: false,
          error: sails.__('Tên nhóm sản phẩm đã tồn tại')
        });
        return;
      })
      .intercept({ name: 'UsageError' }, () => {
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      }).fetch();

    //tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT_TYPE,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: this.req.params.id,
      objectContentOld: foundProductType,
      objectContentNew: updateProductType[0],
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: updateProductType[0]
    });
  }
};
