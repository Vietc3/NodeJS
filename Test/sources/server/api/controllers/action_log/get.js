module.exports = {

  friendlyName: 'Get List Action Log',

  description: 'Get a cction log',

  fn: async function (inputs) {

    let foundActionLog = await sails.helpers.actionLog.get(this.req, { id: this.req.params.id })

    return foundActionLog;
  }
};