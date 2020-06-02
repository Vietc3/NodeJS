module.exports = {
  friendlyName: "Upload Image",

  description: "Upload Image.",

  inputs: {
    image: {
      type: "json"
    },
    productId: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let { image, productId } = inputs;

    let foundImage = await FileStorage.find(this.req, {productId, deletedAt: 0})

    await Promise.all(_.map(image, (item) => {
      if (item.thumbUrl) {
        let uploadImage = FileStorage.create(this.req, {
          file: item.thumbUrl,
          extension: item.type,
          productId,
          createdBy: this.req.loggedInUser.id,
          updatedBy: this.req.loggedInUser.id
        }).intercept({ name: 'UsageError' }, () => {
          this.res.status(400).json({
            status: false,
            error: sails.__('Thông tin yêu cầu không hợp lệ')
          });
          return;
        }).fetch();

        return uploadImage;
      }
      else return;
    }))

    let foundImageAfter = await FileStorage.find(this.req, {productId, deletedAt: 0});

    // tạo nhật ký
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.IMAGE_PRODUCT,
      action: foundImage.length ? sails.config.constant.ACTION.UPDATE : sails.config.constant.ACTION.CREATE,
      objectId: productId,
      objectContentOld: foundImage.length ? foundImage.map(item => { delete item.file; return item}) : undefined,
      objectContentNew: foundImageAfter.map(item => { delete item.file; return item}),
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    if (!createActionLog.status) {
      return createActionLog
    }
  }
}    