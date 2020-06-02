module.exports = {

  friendlyName: 'delete branch',

  description: 'delete branch',

  fn: async function (inputs) {
    let deletedBranch = await sails.helpers.branch.deleteBranch(this.req, {
      id: this.req.params.id,
      updatedBy: this.req.loggedInUser.id
    });
    
    return deletedBranch;
  }
};
