module.exports = {

  friendlyName: 'Get Manufacturing Card',

  description: 'Get manufacturing card',

  fn: async function () {
    let branchId = this.req.headers['branch-id']
    
    let manufacturingCard = await ManufacturingCard.getManufacturingCard(this.req, branchId, this.req.params.id, (error) => {
      if(error){
        this.res.json({
          status: false,
          error: sails.__(error)
        });
        return;
      }
    });
    
    let checkBanch = await sails.helpers.checkBranch(manufacturingCard.manufacturingCard.branchId, this.req);

    if(!checkBanch){
      this.res.json({status: false, error: sails.__('Không có quyền thực hiện thao tác này')});
    }

    if ( manufacturingCard )
      this.res.json({
        status: true,
        data: manufacturingCard
      });
  }

};
