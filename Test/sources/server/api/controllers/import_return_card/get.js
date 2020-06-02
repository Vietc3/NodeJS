module.exports = {

  friendlyName: 'Get Import Return Card',

  description: 'Get import return card',

  fn: async function () {
    let branchId = this.req.headers['branch-id'];

    let result = await sails.helpers.importReturnCard.get(this.req, this.req.params.id, branchId);
    
    return (result);
  }


};
