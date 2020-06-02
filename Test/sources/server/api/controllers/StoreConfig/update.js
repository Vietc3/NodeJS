module.exports = {
  friendlyName: "Update Store",

  description: "Update a Store.",

  inputs: {
      configs: {
        type: "json"
      }
  },

  fn: async function(inputs) {
    var { 
      configs
    } = inputs;

    let updatedStoreConfig = await sails.helpers.storeConfig.update(this.req, configs, true);
    
    return (updatedStoreConfig);
  }
};
