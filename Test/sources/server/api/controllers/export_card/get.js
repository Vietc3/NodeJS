module.exports = {

  friendlyName: 'Get Export Card',

  description: 'Get export card',

  inputs: {

  },

  fn: async function (inputs) {
    let result = await ExportCard.getExportCard(this.req.params.id, (error) => {
      if(error){
        this.res.json({
          status: false,
          error: sails.__(error)
        });
        return;
      }
    });

    let foundExportCard = result.foundExportCard;
    let exportCardProductArray = result.exportCardProductArray;

    this.res.json({
      status: true,
      data: foundExportCard, exportCardProductArray
    });
  }

};
