module.exports = {

    friendlyName: 'Get List Branch',
  
    description: 'Get list branch',
  
    inputs: {
      filter: {
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
      manualFilter: {
        type: "json"
      },
      manualSort: {
        type: "json"
      },
    },
  
    fn: async function (inputs) {
      let { filter, sort, limit, skip, manualFilter, manualSort } = inputs;
  
        let foundBranch = await sails.helpers.branch.list(this.req, { filter, sort, limit, skip, manualFilter, manualSort }) 
  
        this.res.json(foundBranch);
    }
  };