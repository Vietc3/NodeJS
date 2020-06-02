module.exports = {
  friendlyName: 'Seed data',
  description: '',

  fn: async function () {
    await sails.helpers.database.seeding(process.env.DB_IDENTITY, 'dienlanh');
  }
};

