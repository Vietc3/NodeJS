module.exports = {

    friendlyName: 'Get DepositCard',
  
    description: 'Get list of depositCard',
  
    inputs: {
      filter: {
        type: "json"
      },
      manualFilter: {
        type: "json"
      },
      manualSort: {
        type: "json"
      },
      sort: {
        type: 'string',
      },
      limit: {
        type: "number"
      },
      skip: {
        type: "number"
      },
      select: {
        type: "json"
      }
    },
  

    fn: async function(inputs) {

      let { filter, sort, limit, skip, manualFilter, manualSort, select } = inputs;
      let branchId = this.req.headers['branch-id'];
      let foundDeposits = await sails.helpers.deposit.list(this.req, {
        filter,
        sort, 
        limit, 
        skip, 
        manualFilter, 
        manualSort, 
        select,
        branchId
      });
      
      this.res.json(foundDeposits);
    }

    
  };