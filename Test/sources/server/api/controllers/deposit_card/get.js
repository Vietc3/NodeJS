module.exports = {
    friendlyName: "Get one data DepositCard",
  
    description: "Get one data DepositCard.",
  
    exits: {
      success: {
        description: "Get one data DepositCard successfully."
      }
    },
  
    fn: async function() {
      let branchId = this.req.headers['branch-id'];

      let onedataDeposit = await sails.helpers.deposit.get(this.req, this.req.params.id, branchId);

      return (onedataDeposit);
    }
  };
  