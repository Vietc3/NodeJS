module.exports = {
  friendlyName: "Check BranchId User",

  description: "Check branchId user",

  inputs: {
    branchId: {
      type: 'number'
    },
    req: {
      type: 'ref',
    }
  },

  fn: function (inputs) {
    var {
        branchId,
        req
    } = inputs;
    
    if (branchId) {
        if (req.loggedInUser.id === sails.config.constant.USER_ADMIN ){
          return true;
        } else {
        
          if ( req.loggedInUser.branchId && _.isJson(req.loggedInUser.branchId)) {      
            let branch = JSON.parse(req.loggedInUser.branchId);            
            let checkBanch = _.includes(branch, branchId);

            return checkBanch;
          }

        }    
    }
    else
      return false;
  }
};
  