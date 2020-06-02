module.exports = {

  friendlyName: 'Get Some Product Of Branch',

  description: 'Get some product of branch',

  inputs: {

  },

  fn: async function (inputs) {
    let products = [];
    let userId = this.req.loggedInUser.id;
    let userBranches = await sails.helpers.user.get(this.req, {id: userId});
    let branchIds = [1]; // chi nhánh mặc định

    if(userBranches.status)
      branchIds = JSON.parse(userBranches.data && userBranches.data.branchId).sort();
    let promises = [];
    for(let i in branchIds){
      promises.push(Promise.all([
        sails.helpers.product.get(this.req, { productId: this.req.params.id, branchId: branchIds[i] }),
        sails.helpers.branch.get(this.req, { id: branchIds[i] })
      ]));
    }
    
    let data = await Promise.all(promises);
    for(item of data) {
      let [foundProduct, branch] = item;
      if(branch.status && Object.keys(branch.data).length > 0 && branch.data.status === sails.config.constant.BRANCH_STATUS.FINISHED) {
        foundProduct.data.branchName = branch.data.name;
        foundProduct.data.branchId = branch.data.id;

        products.push(foundProduct.data);
      }    
    }

    return { status: true, data: products };
  }

};