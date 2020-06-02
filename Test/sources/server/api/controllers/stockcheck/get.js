module.exports = {
  friendlyName: "Get StockCheckCard",

  description: "Get one stockcheck card",

  fn: async function(inputs) {
    let branchId = this.req.headers['branch-id'];

    let stockCheckCard = await StockCheckCard.findOne(this.req, {
      where: { id: this.req.params.id }
    })
      .populate("stockCheckCardProducts")
      .intercept({ name: "UsageError" }, () => {
        this.res.status(400).json({
          status: false,
          error: sails.__("Thông tin không hợp lệ")
        });
        return;
      });
    
    let checkBanch = await sails.helpers.checkBranch(stockCheckCard.branchId, this.req);

    if(!checkBanch){
      return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
    }
      let createdBy = await User.findOne(this.req, {
        where: { id: stockCheckCard.createdBy },
        select: ["id", "fullName"]
      })
  
      if (createdBy) stockCheckCard.createdBy = createdBy;

    for (let i = 0; i < stockCheckCard.stockCheckCardProducts.length; i++) {
      let foundProduct = await sails.helpers.product.get(this.req, {
        productId: stockCheckCard.stockCheckCardProducts[i].productId,
        branchId
      })
      if(!foundProduct.status){
        return foundProduct;
      }

      stockCheckCard.stockCheckCardProducts[i].product = foundProduct.data;
    }

    let productUnit = await ProductUnit.find(this.req, { deletedAt: 0 })

    if ( productUnit ) {
      _.forEach(stockCheckCard.stockCheckCardProducts, item => {
        _.forEach(productUnit, elem => {
          if ( item.product.unitId && item.product.unitId == elem.id ) {
            item.product.unitId = elem;
            return;
          }
        })
      })
    }


    this.res.json({
      status: true,
      data: stockCheckCard
    });
  }
};
