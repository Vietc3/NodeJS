module.exports = {
  friendlyName: 'Create database',
  description: '',

  fn: async function () {
    console.log(process.env)
    await sails.helpers.database.drop('ohstore');
  }
};

