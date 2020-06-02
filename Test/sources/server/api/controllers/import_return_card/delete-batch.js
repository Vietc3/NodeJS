module.exports = {
  friendlyName: "Delete Multiple Import Return Cards",

  description: "Delete multiple import return cards",

  inputs: {
    ids: {
      type: 'json'
    },
  },

  fn: async function (inputs) {
    let ids = inputs.ids;

    let deletedImportReturnCards = await ImportReturnCard.deleteImportReturnCards(ids, this.req.loggedInUser.id, (error) => {
      if(error){
        this.res.json({
          status: false,
          error: sails.__(error)
        });
        return;
      }
    });

    this.res.json({
      status: true,
      data: deletedImportReturnCards
    });
  }
};
