module.exports = {
  friendlyName: "Delete Export Card",

  description: "Delete an export card.",

  fn: async function () {

    var updateExportCard = await ExportCard.deleteExportCard(this.req.params.id, this.req.loggedInUser.id, (error) =>{
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
      data: updateExportCard
    });
  }
};
