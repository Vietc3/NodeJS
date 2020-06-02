module.exports = {

    friendlyName: 'Get Config',
  
    description: 'Get store config.',
  
    inputs: {
      types: {
        type: 'ref'
      }
    },
  
    fn: async function (inputs) {
      let { types } = inputs
      
      let foundConfig = await StoreConfig.find(this.req, {
        where: { type: { in: types } }
      }).intercept({ name: 'UsageError' }, () => {
        this.res.json({
          status: false,
          error: sails.__('Thông tin không tồn tại trong hệ thống')
        });
        return;
      });
      if (!foundConfig) {
        this.res.status(400).json({
          status: false,
          error: sails.__('Thông tin không tồn tại trong hệ thống')
        });
        return;
      }
      
      let data = {}
      
      foundConfig.forEach(item => {
        data[item.type] = item.value;
      })
  
      this.res.json({
        status: true,
        data: data,
      });
    }
  };
  
