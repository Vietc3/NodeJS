module.exports = {
  friendlyName: "Delete Image",

  description: "Delete Image.",

  inputs: {
    image: {
      type: "json",
      required: true,
    },
  },

  fn: async function (inputs) {
    let { image } = inputs;

    if (!image || !Array.isArray(image) || !image.length) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }

    let foundImage = await FileStorage.find(this.req, { id: { in: image } })

    let deletedImage = await FileStorage.update(this.req, { id: { in: image } }).set({
      deletedAt: new Date().getTime(),
      updatedBy: this.req.loggedInUser.id
    }).intercept({ name: 'UsageError' }, () => {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }).fetch();

    // tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.IMAGE_PRODUCT,
      action: sails.config.constant.ACTION.DELETE,
      objectId: foundImage[0].productId,
      objectContentOld: foundImage.map(item => { delete item.file; return item }),
      objectContentNew: deletedImage.map(item => { delete item.file; return item }),
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: deletedImage
    })

  }
}    