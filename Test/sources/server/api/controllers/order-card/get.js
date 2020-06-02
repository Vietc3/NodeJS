module.exports = {

  friendlyName: 'Get Order Info',

  description: 'Get Order info',

  fn: async function () {
    let branchId = this.req.headers['branch-id'];

    let result = await sails.helpers.orderCard.get(this.req, {id: this.req.params.id, branchId: branchId});
    
    return (result)
  }

};
