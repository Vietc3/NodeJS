module.exports = {

  friendlyName: 'Get User Role',

  description: 'Get user role',

  inputs: {

  },

  fn: async function (inputs) {
    let userRole = await sails.helpers.user.getUserRole(this.req, {id: this.req.params.id});

    return (userRole)
  }

};
