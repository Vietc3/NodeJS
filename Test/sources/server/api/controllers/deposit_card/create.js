module.exports = {

    friendlyName: 'Create DepositCard',
  
    description: 'Create a new depositCard',
  
    inputs: {
      code: {
        type: 'string',
      },
      amount: {
        type: 'number'
      },
      type: {
        type: 'number'
      },
      depositDate: {
        type: "number"
      },
      notes: {
        type: 'string',
      },
      customerId: {
        type: 'number',
        required: true,
      },
      status: {
        type: 'number',
        required: true,
      },
      originalVoucherId: {
        type: 'number'
      },
      
    },
  
    fn: async function (inputs) {
      let {
        code,
        amount,
        type,
        notes,
        customerId,
        status,
        originalVoucherId,
        depositDate,
      } = inputs;
      let req = this.req;
      let createDeposit;
      let branchId = this.req.headers['branch-id'];
      
      if ( type === sails.config.constant.DEPOSIT_TYPES.ADD ) 
        createDeposit = await sails.helpers.deposit.add(req, {
          code, 
          customerId, 
          amount,
          originalVoucherId: null, 
          createdBy: this.req.loggedInUser.id, 
          notes, status, depositDate,
          branchId,
          isActionLog: true
        })
      else 
        createDeposit = await sails.helpers.deposit.withdraw(req, {
          code, 
          customerId, 
          amount, 
          originalVoucherId: null, 
          createdBy: this.req.loggedInUser.id, 
          notes, status, depositDate,
          branchId,
          isActionLog: true
        })     
  
      this.res.json(createDeposit);
    }
  };
  