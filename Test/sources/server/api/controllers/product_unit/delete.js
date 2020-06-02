module.exports = {
    friendlyName: "Delete Product Unit",
  
    description: "Delete a product unit.",
  
    inputs: {
      
    },
  
    fn: async function(inputs) {

      let foundProductUnit = await ProductUnit.findOne({
        where: {id: this.req.params.id, deletedAt: 0}
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });
  
      if (!foundProductUnit) {
        this.res.status(400).json({
          status: false,
         
          error: sails.__('Đơn vị tính sản phẩm đã bị xóa hoặc không có trong hệ thống')
        });
        return;
      }

      var updatedProductUnit = await ProductUnit.update(this.req, { id: this.req.params.id }).set({
        deletedAt: new Date().getTime(),
        updatedBy: this.req.loggedInUser.id
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Đơn vị tính sản phẩm không hợp lệ')
        });
        return;
      }).fetch();
  
      this.res.json({
        status: true,
        data: updatedProductUnit[0]
      });
    }
  };
  