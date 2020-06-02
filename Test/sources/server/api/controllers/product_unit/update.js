module.exports = {
  friendlyName: "Update Product Unit",

  description: "Update a product unit.",

  inputs: {
    name: {
      required: true,
      type: "string",
    },
  },

  fn: async function (inputs) {
    var {
      name,
    } = inputs;

    let foundProductUnit = await ProductUnit.findOne(this.req, {
      where: { id: this.req.params.id, deletedAt: 0 }
    }).intercept({ name: 'UsageError' }, () => {
      this.res.json({
        status: false,

        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    });

    let foundProductUnits = await ProductUnit.find(this.req, { id: { '!=': foundProductUnit.id }, deletedAt: 0 })

    let index = foundProductUnits.filter(item => item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1)

    if (index.length > 0) {
      this.res.json({
        status: false,
        error: sails.__('Đơn vị tính sản phẩm đã tồn tại')
      });
      return;
    }

    var updatedProductUnit = await ProductUnit.update(this.req, { id: this.req.params.id }).set({
      name: name,
    }).intercept('E_UNIQUE', () => {
      this.res.json({
        status: false,
        error: sails.__('Đơn vị tính sản phẩm đã tồn tại')
      });
      return;
    }).intercept({ name: 'UsageError' }, () => {
      this.res.json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }).fetch();

    //tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT_UNIT,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: this.req.params.id,
      objectContentOld: foundProductUnit,
      objectContentNew: updatedProductUnit[0],
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: updatedProductUnit[0]
    });
  }
};
