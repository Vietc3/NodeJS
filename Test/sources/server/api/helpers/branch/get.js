module.exports = {
    description: 'get branch',
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
      let { id } = inputs.data;
  
      let {req} = inputs;
  
      let foundBranch = await Branch.findOne(req, {
          where: { id: id, deletedAt: 0 }
        }).intercept({ name: 'UsageError' }, () => {
            return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError)});
          });
      
      if (!foundBranch) {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_BRANCH) });
      }

          return exits.success({ status: true, data: foundBranch});;
    }
  
  }