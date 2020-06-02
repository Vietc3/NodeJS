module.exports = {

  friendlyName: 'Get User',

  description: 'Get list of users',

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
    },
    select: {
      type: "json"
    }
  },

  fn: async function (inputs) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select } = inputs;
    
    filter = _.extend(filter || {}, { deletedAt: 0 });

    let foundUsers = await User.find(this.req,
      _.pickBy(
        {
          where: filter,
          select: select || [
            'id',
            'email',
            'fullName',
            'birthday',
            'phoneNumber',
            'gender',
            'address',
            'isActivated',
            'isActive',
            'roleId',
            'branchId',
            'updatedAt',
            'createdAt'],
          sort: sort || 'createdAt DESC',
        }, value => value != undefined &&  value != null))
      .populate('roleId')
      .intercept({ name: 'UsageError' }, () => {
        this.res.json({
          status: false,
          error: sails.__('Thông tin yêu cầu không hợp lệ')
        });
        return;
      });

    foundUsers = sails.helpers.manualSortFilter(foundUsers, manualFilter, manualSort);

    this.res.json({
      status: true,
      data: limit ? foundUsers.slice(skip, limit + skip) : foundUsers,
      count: foundUsers.length
    });
  }
};