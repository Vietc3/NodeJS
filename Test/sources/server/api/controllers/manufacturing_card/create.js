module.exports = {

  friendlyName: 'Create Manufacturing Card',

  description: 'Create a new manufacturing card',

  inputs: {
    code: {
      type: 'string',
    },
    createdAt: {
      type: 'number',
      required: true
    },
    notes: {
      type: 'string',
    },
    status: {
      type: 'string',
      required: true,
    },
    finishedProducts: {
      type: 'json',
      required: true,
    },
    materials: {
      type: 'json',
      required: true,
    },
  },

  fn: async function (inputs) {
    let {
      code,
      createdAt,
      notes,
      status,
      finishedProducts,
      materials
    } = inputs;
    let branchId = this.req.headers['branch-id']
    let createManufacturingCard = await sails.helpers.manufacturingCard.create(this.req, {
      code,
      createdAt,
      notes,
      finishedProducts,
      materials, 
      branchId,
      createdBy: this.req.loggedInUser.id,
    });
      
    this.res.json(createManufacturingCard);
  }
};
