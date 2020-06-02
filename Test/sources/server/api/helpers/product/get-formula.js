module.exports = {
    description: 'get manufacturing formula',
    inputs: {
        req: {
          type: "ref"
        },
        data: {
          type: "ref",
          required: true
        }
      },
      fn: async function (inputs, exits) {

        let { productId, branchId } = inputs.data;

        let { req } = inputs;

        let checkBanch = await sails.helpers.checkBranch(branchId, req);

        if(!checkBanch){
          return exits.success({status: false, message: sails.__('Không có quyền thực hiện thao tác này')});
        }

        let foundProduct = await ManufacturingFormula.find(req, { productId: productId }).populate('materialId').intercept({ name: 'UsageError' }, ()=>{
        return exits.success({
          status: false,
          error: sails.__('Không tìm thấy định mức sản xuất sản xuất')
        });
      });
      if (foundProduct) {
        let arr = []
        _.forEach( foundProduct, item => {
          if (item.materialId && item.materialId.deletedAt === 0 ) {
            arr.push(item)
          }
        })

        foundProduct = await Promise.all(_.map(arr, async item => {
          let productStock = await ProductStock.findOne(req, {productId: item.materialId.id, branchId})

          if (productStock) item.materialId = {...item.materialId, manufacturingQuantity: productStock.manufacturingQuantity}
          else item.materialId = {...item.materialId, manufacturingQuantity: 0}

          return item;
        }))
        }
        return exits.success({status: true, data: foundProduct});
      }
}