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
        where: { type: 'store_logo' }
      });
      
      if (!foundConfig.length) {
        return ({
          status: false,
          message: sails.__('Không tìm thấy logo cửa hàng')
        });
      }
  
      return ({
        status: true,
        data: foundConfig[0].value,
      });
    }
  };
  
