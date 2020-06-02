module.exports = {
  friendlyName: "Delete Invoice",

  description: "Delete an invoice.",

  fn: async function () {

    var updateInvoice = await Invoice.deleteInvoice(this.req.params.id, this.req.loggedInUser.id, (error) =>{
      if(error){
        this.res.json({
          status: false,
          error: sails.__(error)
        });
        return;
      }
    })
    
    this.res.json({
      status: true,
      data: updateInvoice
    });
  }
};
