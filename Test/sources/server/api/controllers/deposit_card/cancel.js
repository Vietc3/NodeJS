module.exports = {
    friendlyName: "Delete DepositCard",
  
    description: "Delete DepositCard.",
  
    fn: async function() {
      let req = this.req;
      let branchId = this.req.headers['branch-id'];

      let deleteDeposit = await sails.helpers.deposit.cancel(req, {
        id: this.req.params.id,
        updatedBy: this.req.loggedInUser.id, 
        shouldCheckVoucherExist: true,
        branchId
      });

      this.res.json(deleteDeposit);
    }
  };
  