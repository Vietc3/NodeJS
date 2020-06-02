module.exports = {
  friendlyName: "Delete Role",

  description: "Delete a Role.",

  inputs: {

  },
  fn: async function (inputs) {

    var updateRole = await Role.update(this.req, {
      id: this.req.params.id
    }).set({
      deletedAt: new Date().getTime(),
      updatedBy: this.req.loggedInUser.id
    }).intercept({
      name: 'UsageError'
    }, () => {
      this.res.json({
        status: false,
        error: sails.__('Quyền không tồn tại trong hệ thống')
      });
      return;
    }).fetch();

    this.res.json({
      status: true,
      data: updateRole[0]
    });
  }
};
