module.exports = {

    friendlyName: 'Get Product Unit',
  
    description: 'Get one product unit',
  
    inputs: {
  
    },
  
    fn: async function (inputs) {
      let foundProductUnit = await ProductUnit.findOne(this.req, {
        where: {id: this.req.params.id}
      }).intercept({ name: 'UsageError' }, ()=>{
        this.res.status(400).json({
          status: false,
          error: sails.__('Đơn vị tính sản phẩm không hợp lệ')
        });
        return;
      });
  
      if (!foundProductUnit) {
        this.res.status(400).json({
          status: false,
          error: sails.__('Đơn vị tính sản phẩm bị thiếu hoặc không hợp lệ')
        });
        return;
      }
      
      this.res.json({
        status: true,
        data: foundProductUnit
      });
    }
  
  };
  