module.exports = {
  description: 'list branch',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let { filter, sort, limit, skip, manualFilter, manualSort } = inputs.data;

    let {req} = inputs;
    
    filter = _.extend(filter || {}, { deletedAt: 0 });

    let foundBranches = await Branch.find(req, {
      where: filter,
      sort: sort || 'createdAt DESC',
    }).intercept({ name: 'UsageError' }, () => {
        return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
      });
  

      foundBranches = sails.helpers.manualSortFilter(foundBranches, manualFilter, manualSort);

    return exits.success({status: true, data: limit ? foundBranches.slice(skip, limit + skip) : foundBranches, count: foundBranches.length});
  }

}