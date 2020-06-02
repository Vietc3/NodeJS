var DBMigrate = require(`db-migrate`);
const Datasource = require('mutilTenant/datasource');

module.exports = {
  description: 'create new store',

  inputs: {
    req: {
      type: "ref"
    },
    configs: {
      type: "ref",
      required: true
    },
    isActionLog: {
      type: "ref"
    }
  },

  fn: async function (inputs, exits) {
    let {req, configs, isActionLog} = inputs;
    let foundConfigs = [];
    let ObjectContentNew = [];
    for(let t in configs){
      let foundConfig = await StoreConfig.find(req, {
        where: {
          type: t,
        }
      });
      
      if (foundConfig.length == 0) {
        var newConfigRecord = await StoreConfig.create(req, {
          type: t,
          value: configs[t],
          createdBy: req.loggedInUser ? req.loggedInUser.id : undefined,
          updatedBy: req.loggedInUser ? req.loggedInUser.id : undefined
        }).intercept({ name: 'UsageError' }, () => {
          return exits.success({
            status: false,
            error: sails.__('Thông tin không hợp lệ')
          });
        }).fetch();
        ObjectContentNew.push(newConfigRecord)
      }
      else{
        foundConfigs.push(foundConfig[0])
        var updatedConfig = await StoreConfig.update(req, { type: t}).set({
          type: t,
          value: configs[t],
          updatedBy: req.loggedInUser ? req.loggedInUser.id : undefined
        }).intercept({ name: 'UsageError' }, ()=>{
          return exits.success({
            status: false,
            error: sails.__('Thông tin yêu cầu không hợp lệ')
          });
        }).fetch();
        ObjectContentNew.push(updatedConfig[0])
      }
    }

    if (isActionLog) {
      let createActionLog = await sails.helpers.actionLog.create(req, {
        userId: req.loggedInUser.id,
        functionNumber: sails.config.constant.ACTION_LOG_TYPE.SETUP,
        action: sails.config.constant.ACTION.UPDATE,
        objectContentOld: foundConfigs,
        objectContentNew: ObjectContentNew,
        deviceInfo: { ip: req.ip, userAgent: req.headers['user-agent'] || "" },
        branchId: req.headers['branch-id']
      })

      if (!createActionLog.status) {
        exits.success(createActionLog)
      }
    }
    
    return exits.success({status: true})
  }

}