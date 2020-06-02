module.exports = {
  description: 'update totalDeposit',

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
    let {
      customerId,
      totalDeposit,
      branchId,
      createdBy
    } = inputs.data;
    let req = inputs.req;

    let foundCustomer = await Customer.findOne(req, { id: customerId, branchId })
    
    let updateCustomer = await Customer.update(req, {
      id: customerId,
      branchId: branchId
    }).set({
      totalDeposit
    }).fetch();
    
    return exits.success({status: true, data: updateCustomer});
  }

}