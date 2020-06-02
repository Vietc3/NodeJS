module.exports = {
    friendlyName: "Delete Import Return Card",
  
    description: "Delete an import return card.",
  
    inputs: {
  
    },
  
    fn: async function (inputs) {
  
      let updateImportReturnCard = await ImportReturnCard.deleteImportReturnCard(this.req.params.id, this.req.loggedInUser.id, (error) =>{
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
        data: updateImportReturnCard
      });
    }
  };
  