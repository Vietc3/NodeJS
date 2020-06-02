module.exports = {


  friendlyName: 'Update manufacturing formula',


  description: 'Update manufacturing formula.',

  inputs: {
    materials: {
      type: 'json'
    },
  },

  fn: async function (inputs) {
    const {
      materials
    } = inputs;
    let foundManufacturingFormula = await ManufacturingFormula.find(this.req, {productId: this.req.params.id});
    await ManufacturingFormula.destroy(this.req, {productId: this.req.params.id});
    let updatedProductFormula = [];
    let updatedProductFormula1 = []
    for( let item of materials){
      let ProductFormula = await ManufacturingFormula.create(this.req, {
        productId: this.req.params.id, 
        materialId: item.productId, 
        quantity: item.stockQuantity}).fetch();
        
      updatedProductFormula.push({ProductFormula})
      updatedProductFormula1.push(ProductFormula)
    }
    if (this.req.params.id ){
          let updatedProduct = await Product.update(this.req, { id: this.req.params.id }).set({
            category: materials.length > 0 ? sails.config.constant.PRODUCT_CATEGORY_TYPE.FINISHED : sails.config.constant.PRODUCT_CATEGORY_TYPE.MATERIAL,
          }).intercept({ name: 'UsageError' }, () => {
            this.res.status(400).json({
              status: false,
              error: sails.__('Thông tin yêu cầu không hợp lệ')
            });
            return;
          }).fetch();
        
    }

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.FORMULA,
      action: sails.config.constant.ACTION.UPDATE,
      objectId: this.req.params.id,
      objectContentOld: foundManufacturingFormula,
      objectContentNew: updatedProductFormula1,
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId: this.req.headers['branch-id']
    })

    this.res.json({
      status: true,
      data: updatedProductFormula,
    });
  }
};
