module.exports = {

  friendlyName: 'Get Import Card',

  description: 'Get import card',

  inputs: {

  },

  fn: async function (inputs) {
    let branchId = this.req.headers['branch-id'];

    let result = await sails.helpers.import.get(this.req, {id: this.req.params.id, branchId });    
      
    return result;   
  }

};
