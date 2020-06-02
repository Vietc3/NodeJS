module.exports = {

  friendlyName: 'Get Roles',

  description: 'Get list of roles',

  inputs: {
    filter: {
      type: "json"
    },
    manualFilter: {
      type: "json"
    },
    manualSort: {
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
    }
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort } = inputs;
    
    filter = _.extend(filter, { deletedAt: 0 });

    let foundUser = await User.findOne(this.req, { id: this.req.loggedInUser.id });

    if (!foundUser.isAdmin) {
      filter = _.extend(filter, { id: { "!=": 1 } });
    }

    let foundRoles = await Role.find(this.req,
      _.pickBy(
        {
          where: filter,
          sort: sort || 'id DESC',
        }, value => value != null && value != undefined ))
      .intercept({ name: 'UsageError' }, () => {
        this.res.json({
          status: false,
          message: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });

    foundRoles = sails.helpers.manualSortFilter(foundRoles, manualFilter, manualSort);
    
    this.res.json({
      status: true,
      data: limit ? foundRoles.slice(skip, limit + skip) : foundRoles,
      count: foundRoles.length
    });
  }
};
