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
    where: { type: 'store_info' }
    });
    
    if (!foundConfig.length) {
    return ({
      status: false,
      message: sails.__('Không tìm thấy thông tin cửa hàng')
    });
    }

    let expirydate = JSON.parse(foundConfig[0].value).expirydate;
  
    return ({
    status: true,
    data: expirydate,
    });
  }
  };
  
