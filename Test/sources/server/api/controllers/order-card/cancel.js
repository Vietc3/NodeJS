module.exports = {

    friendlyName: 'Cancel Order Card',
  
    description: 'Cancel an Order Card',
  
    fn: async function () {
      let branchId = this.req.headers['branch-id'];

      let canceledOrderCard = await sails.helpers.orderCard.cancel(this.req, {
        id: this.req.params.id,
        updatedBy: this.req.loggedInUser.id,
        branchId
      });

      this.res.json(canceledOrderCard);      
    }
  };
  