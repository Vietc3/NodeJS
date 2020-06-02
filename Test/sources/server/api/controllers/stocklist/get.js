module.exports = {

    friendlyName: 'Get stock Info',
  
    description: 'Get stock info',
  
    fn: async function () {
  
      let branchId = this.req.headers['branch-id'];

      let result = await sails.helpers.stockList.get(this.req, {id: this.req.params.id, branchId});
      
      return (result)
    }
  
  };