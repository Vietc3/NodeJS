module.exports = {
  friendlyName: "Delete multiple Product Type",

  description: "Delete multiple data Product Type.",

  inputs: {
    arrId: {
      required: true,
      type: "json"
    }
  },

  fn: async function(inputs) {
    let arrId = inputs.arrId;
    if (! arrId || !Array.isArray(arrId) || !arrId.length) {
      this.res.status(400).json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    }

    let foundProducts = await Product.find(this.req, { productTypeId: { in: arrId }, deletedAt: 0})

    if ( !foundProducts ) {
      this.res.json({
        status: false,
        error: sails.__('Không thể xóa vì nhóm sản phẩm đang được sử dụng')
      });
      return;
    }

    if ( foundProducts.length > 0 ) {
      this.res.json({
        status: false,
        error: sails.__('Không thể xóa vì nhóm sản phẩm đang được sử dụng')
      });
      return;
    } else {
      let foundProductTypes = await ProductType.find(this.req, { id: { in: arrId }})
      let deletedProductType = await ProductType.update(this.req, { id: { in: arrId }}).set({
        deletedAt: new Date().getTime(),
        updatedBy: this.req.loggedInUser.id
      }).intercept({ name: 'UsageError'}, () => {
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return
      }).fetch();

      let updateProductTypes = await Promise.all(_.map(deletedProductType, item => {
        let updateProductType = ProductType.update(this.req, {id: item.id}).set({
          name: item.name + item.deletedAt,
          updatedBy: this.req.loggedInUser.id
        }).intercept({ name: 'UsageError'}, () => {
          this.res.json({
            status: false,
            error: sails.__('Thông tin yêu cầu không hợp lệ')
          });
          return
        }).fetch();

        return updateProductType;
      }))

      //tạo nhật kí
      let createActionLog = await sails.helpers.actionLog.create(this.req, {
        userId: this.req.loggedInUser.id,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT_TYPE,
        action: sails.config.constant.ACTION.DELETE,
        objectContentOld: foundProductTypes,
        objectContentNew: updateProductTypes.map(item => item[0]),
        deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
        branchId: this.req.headers['branch-id']
      })

      if (!createActionLog.status) {
        return createActionLog
      }

      this.res.json({
        status: true,
        data: deletedProductType
      })
    }

    
  }
};
