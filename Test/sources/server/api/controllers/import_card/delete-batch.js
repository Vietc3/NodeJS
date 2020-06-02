module.exports = {
  friendlyName: "Delete Multiple Import Cards",

  description: "Delete multiple import cards",

  inputs: {
    ids: {
      type: 'json'
    },
  },

  fn: async function (inputs) {
    let ids = inputs.ids;

    let deletedImportCards = await ImportCard.deleteImportCards(ids, this.req.loggedInUser.id, (error) =>{
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
      data: deletedImportCards
    });
  }
};
