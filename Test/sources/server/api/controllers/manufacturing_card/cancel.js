module.exports = {
  friendlyName: "Cancel Manufacturing Card",

  description: "Cancel an manufacturing card.",

  fn: async function (inputs) {
    let branchId = this.req.headers['branch-id']
    let cancelManufacturingCard = await sails.helpers.manufacturingCard.cancel(this.req, {
      id: this.req.params.id, 
      deletedBy: this.req.loggedInUser.id,      
      branchId
    })
    
    this.res.json(cancelManufacturingCard);
  }
};
  