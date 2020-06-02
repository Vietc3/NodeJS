module.exports = {

  friendlyName: 'Get List Action Log',

  description: 'Get list cction log',

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
    select: {
      type: "json"
    },
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select } = inputs;
    
    if (this.req.loggedInUser.id !== sails.config.constant.USER_ADMIN && (this.req.loggedInUser.branchId && _.isJson(this.req.loggedInUser.branchId))) {
      let branch = JSON.parse(this.req.loggedInUser.branchId);

      filter = {...filter, branchId: {in: branch}}
    }

    let foundActionLogs = await sails.helpers.actionLog.list(this.req, { filter, sort, limit, skip, manualFilter, manualSort, select })

    this.res.json(foundActionLogs);
  }
};