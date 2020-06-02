module.exports = {

  friendlyName: 'Create new store',

  description: 'Create new store',

  inputs: {
    fullName: {
      type: 'string',
    },
    mobile: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    storeName: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    isCreatedDataTemplate: {
      type: 'boolean',
    },
    field: {
      type: 'string',
    },
    recaptchaToken: {
      type: 'string',
    },
    databaseName: {
      type: 'string',
    },
  },


  fn: async function (inputs) {
    
    let createdNewStore = await sails.helpers.store.create(inputs);
    
    return createdNewStore;
  }
};
