module.exports = {

  friendlyName: 'Create Product Unit',

  description: 'Create a new product unit',

  inputs: {
    name: {
      required: true,
      type: "string"
    },
  },

  fn: async function (inputs) {
    let {
      name,
    } = inputs;

    let foundProductUnits = await ProductUnit.find(this.req, { deletedAt: 0 })

    let foundProductUnit = foundProductUnits.filter(item => item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1)

    if (foundProductUnit.length > 0) {
      this.res.json({
        status: false,
        error: sails.__('Đơn vị tính sản phẩm đã tồn tại')
      });
      return;
    }

    var newProductUnitRecord = await ProductUnit.create(this.req, {
      name,
      createdBy: this.req.loggedInUser.id,
      updatedBy: this.req.loggedInUser.id,
    }).intercept({ name: 'UsageError' }, () => {
      this.res.json({
        status: false,
        error: sails.__('Đơn vị tính sản phẩm bị thiếu hoặc không hợp lệ')
      });
      return;
    }).fetch();

    //tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT_UNIT,
      action: sails.config.constant.ACTION.CREATE,
      objectId: newProductUnitRecord.id,
      objectContentNew: newProductUnitRecord,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: newProductUnitRecord
    });
  }
};
