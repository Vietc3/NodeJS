module.exports = {
  friendlyName: "Get one data DepositCard",

  description: "Get one data DepositCard.",

  inputs: {
    req: {
      type: "ref"
    },
    id: {
      type: "ref",
      required: true
    },
    branchId: {
      type: "number",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let { id, branchId } = inputs;
    let req = inputs.req;

    var onedataDeposit = await DepositCard.findOne(req, _.pickBy({
      where: { id }
    }, value => value != undefined))
      .populate('customerId')
      .intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
      });

    let checkBanch = await sails.helpers.checkBranch(onedataDeposit.branchId, req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }

    let userCreatedBy = await User.findOne(req, _.pickBy({
      where: { id: onedataDeposit.createdBy },
      select: ["id", "fullName"]
    }, value => value != undefined))
      .intercept({ name: 'UsageError' }, () => {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
      });

    if (userCreatedBy) onedataDeposit.userName = userCreatedBy.fullName

    return exits.success({ status: true, data: onedataDeposit });
  }
};
