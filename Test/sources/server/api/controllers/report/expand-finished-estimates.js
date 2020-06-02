module.exports = {

  friendlyName: 'Get Finished Estimates Report',

  description: 'Get finished estimates data',

  inputs: {
    stockId: { // truyen arr
      type: 'json',
      required: true
    },
    id: {
      type: 'number',
    },
  },

  fn: async function (inputs) {
    let { stockId, id } = inputs;
    let branchId = this.req.headers['branch-id'];
    
    let sumQuantity = '';
    let stockQuantityList = [];

    if (stockId.length) {
      let foundStock = await Stock.find(this.req, { id: { in: stockId }, deletedAt: 0 });

      if (!foundStock) {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
      }

      if (foundStock.length) {
        foundStock.map(stock => {
          stockQuantityList.push(`s.` + sails.config.constant.STOCK_QUANTITY_LIST[stock.stockColumnIndex]);
        })
        sumQuantity = `(` + stockQuantityList.join(` + `) + `) as stockQuantity`;
        sumStockQuantity = `(` + stockQuantityList.join(` + `) + `)`;

      }
    }

    let PRODUCTS_MATERIAL_SQL = `
      SELECT p.name, p.code, m.materialId, m.quantity, s.manufacturingQuantity, u.name as unitName, ${sumQuantity} 
      FROM manufacturingformula m
      LEFT JOIN product p ON m.materialId = p.id
      LEFT JOIN productunit u ON p.unitId = u.id
      LEFT JOIN productstock s ON m.materialId = s.productId && s.branchId= ${branchId}
      WHERE p.deletedAt = 0 AND m.productId IN (${id})`

    let resultMaterial = await sails.sendNativeQuery(this.req, PRODUCTS_MATERIAL_SQL);
    this.res.json({
      status: true,
      data: resultMaterial.rows
    });
  }
};
