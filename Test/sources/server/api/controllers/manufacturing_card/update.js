module.exports = {

  friendlyName: 'Update Manufacturing Card',

  description: 'Update a manufacturing card',

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
      finishedProducts,
      materials
    } = inputs;
    let branchId = this.req.headers['branch-id']
    let updateManufacturingCard = await sails.helpers.manufacturingCard.update(this.req, {
      id: this.req.params.id,
      code,
      createdAt,
      notes,
      finishedProducts,
      materials,
      branchId,
      updatedBy: this.req.loggedInUser.id,
    });
      
    this.res.json(updateManufacturingCard);
  }
};
