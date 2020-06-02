module.exports = {
    friendlyName: "Delete Product Units",
  
    description: "Delete multiple product units",
  
    inputs: {
      ids: {
        type: 'json'
      },
    },
  
    fn: async function(inputs) {
      let ids = inputs.ids;
  
      if (!ids || !Array.isArray(ids) || !ids.length) {
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      }

      let foundProducts = await Product.find(this.req, { unitId: { in: ids }, deletedAt: 0 })

      if ( !foundProducts ) {
        this.res.json({
          status: false,
          error: sails.__('Không thể xóa vì đơn vị tính đang được sử dụng')
        });
        return; 
      }
      
      if ( foundProducts.length > 0 ) {
        this.res.json({
          status: false,
          error: sails.__('Không thể xóa vì đơn vị tính đang được sử dụng')
        });
        return;        
      } else {
        let foundProductUnits = await ProductUnit.find(this.req, { id: { in: ids }})
        let deletedProductUnits = await ProductUnit.update(this.req, { id: { in: ids }}).set({
          deletedAt: new Date().getTime(),
          updatedBy: this.req.loggedInUser.id
        }).intercept({ name: 'UsageError' }, ()=>{
          this.res.status(400).json({
            status: false,
            error: sails.__('Thông tin yêu cầu không hợp lệ')
          });
          return;
        }).fetch();

        let updateProductUnits = await Promise.all(_.map(deletedProductUnits, item => {
          let updateProductUnit = ProductUnit.update(this.req, {id: item.id}).set({
            name: item.name + item.deletedAt,
            updatedBy: this.req.loggedInUser.id
          }).intercept({ name: 'UsageError'}, () => {
            this.res.json({
              status: false,
              error: sails.__('Thông tin yêu cầu không hợp lệ')
            });
            return
          }).fetch();
          return updateProductUnit;
        }))
        
        //tạo nhật kí
        let createActionLog = await sails.helpers.actionLog.create(this.req, {
          userId: this.req.loggedInUser.id,
          functionNumber: sails.config.constant.ACTION_LOG_TYPE.PRODUCT_UNIT,
          action: sails.config.constant.ACTION.DELETE,
          objectContentOld: foundProductUnits,
          objectContentNew: updateProductUnits.map(item => item[0]),
          deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
          branchId: this.req.headers['branch-id']
        })

        if (!createActionLog.status) {
          return createActionLog
        }

        this.res.json({
          status: true,
          data: deletedProductUnits
        });
      }     
    }
  };
  