module.exports = {

  friendlyName: 'Cancel Import Card',

  description: 'Cancel an import card',

  fn: async function () {
    let branchId = this.req.headers['branch-id'];
    let canceledImportCard = await sails.helpers.import.cancel(this.req, {
      id: this.req.params.id,
      updatedBy: this.req.loggedInUser.id,
      branchId
    });

    this.res.json(canceledImportCard);
  }
};
