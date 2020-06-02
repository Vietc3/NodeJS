module.exports = {
    friendlyName: "Delete Import Card",
  
    description: "Delete an import card.",
  
    fn: async function (inputs) {
  
      let updateImportCard = await ImportCard.deleteImportCard(this.req.params.id, this.req.loggedInUser.id, (error) =>{
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
        data: updateImportCard
      });
    }
  };
  