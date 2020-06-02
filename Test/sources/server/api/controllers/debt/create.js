module.exports = {

    friendlyName: 'Create Debt',
  
    description: 'Create a new debt',
  
    inputs: {
      createdAt: {
        type: 'number',
        required: true
      },
      changeValue: {
        type: 'number'
      },
      originalVoucherId: {
        type: 'number'
      },
      type: {
        type: 'number'
      },
      notes: {
        type: 'string',
        maxLength: 250,
      },
      customerId: {
        type: 'number',
        required: true,
      },
    },
  
    fn: async function (inputs) {
      let {
        createdAt,
        changeValue,
        originalVoucherId,
        type,
        notes,
        customerId,
      } = inputs;
      
      let createdDebt = await sails.helpers.debt.create(this.req, {
        createdAt,
        changeValue,
        originalVoucherId,
        type,
        notes,
        customerId,
        createdBy: this.req.loggedInUser.id,
        isActionLog: true
      });
      
      
      return (createdDebt);
    }
  };
  