module.exports = {
    friendlyName: "Delete Import Return",
  
    description: "Delete an import return.",
    
    fn: async function () {
      let branchId = this.req.headers['branch-id'];

      let cancelImportCardReturn = await sails.helpers.importReturnCard.cancel(this.req, {id: this.req.params.id, updatedBy: this.req.loggedInUser.id, branchId });

      this.res.json(cancelImportCardReturn);
    }
  };
  