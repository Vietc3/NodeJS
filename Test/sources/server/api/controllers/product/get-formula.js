module.exports = {

    friendlyName: 'Get manufacturing formula',
  
    description: 'Get manufacturing formula',
  
    fn: async function () {
      let branchId = this.req.headers['branch-id'];
      let result  = sails.helpers.product.getFormula(this.req, {productId: this.req.params.id, branchId})
      
        return (result)
    }
  
  };
  