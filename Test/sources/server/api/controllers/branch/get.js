module.exports = {

    friendlyName: 'Get Branch Info',
  
    description: 'Get Branch info',
  
    fn: async function () {
  
      let result = await sails.helpers.branch.get(this.req, {id: this.req.params.id});
      
      return (result)
    }
  
  };