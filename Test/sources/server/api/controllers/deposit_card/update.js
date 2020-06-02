module.exports = {

  friendlyName: 'Update DepositCard',

  description: 'Update DepositCard.',

  inputs: {
    code: {
      type: 'string',
    },
    amount: {
      type: 'number',
    },
    notes: {
      type: 'string',
      maxLength: 255,
    },
    originalVoucherId: {
      type: 'number'
    },
    customerId: {
      type: 'number'
    },
    status: {
      type: 'number'
    },
  },

  fn: async function (inputs) {
    let { code, amount, notes, originalVoucherId, customerId, status } = inputs;
    let branchId = this.req.headers['branch-id'];

    let updateDeposit = await sails.helpers.deposit.update(this.req, { 
      id: this.req.params.id,
      code,
      customerId, 
      amount, 
      originalVoucherId: originalVoucherId, 
      updatedBy: this.req.loggedInUser.id, 
      notes, 
      shouldCheckVoucherExist: true,
      status,
      branchId
    })

    this.res.json(updateDeposit);
  }
};
