module.exports = {
  friendlyName: "Delete Multiple Export Cards",

  description: "Delete multiple export cards",

  inputs: {
    ids: {
      type: 'json'
    },
  },

  fn: async function (inputs) {

    let deletedExportCards = await ExportCard.deleteExportCards(ids, this.req.loggedInUser.id, (error) =>{
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
      data: deletedExportCards
    });
  }
};
