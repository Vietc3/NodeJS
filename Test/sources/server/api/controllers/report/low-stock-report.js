module.exports = {

  friendlyName: 'Get Low Stock Report',

  description: 'Get low stock data',

  inputs: {
    type: {
      type: 'json',
      required: true
    },
    filter: {
      type: 'json',
    },
    stockId: { // truyen arr
      type: 'json',
      required: true 
    },
  },

  fn: async function (inputs) {
    let { type, filter, stockId } = inputs;
    let branchId = this.req.headers['branch-id'];

    if (type.length == 0) {
      let dataType = await ProductType.find(this.req, { deletedAt: 0 })

      if (!dataType.length) {
        return this.res.json({
                  status: true,
                  data: []
                });
      }
      
      let arrType = [];

      _.forEach(dataType, item => {
        arrType.push(item.id)
      })

      type = arrType
    }
    
    if(Object.keys(filter).length > 0){
      filter = inputs.filter.or[0].code.contains;
    } else {
      filter = "";
    }

    let sumQuantity = '';
    let stockQuantityList = [];

    if (stockId.length){
      let foundStock = await Stock.find(this.req, { id: {in: stockId }, deletedAt: 0 });

      if (!foundStock) {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
      }  
      
      if (foundStock.length){
        foundStock.map( stock =>{
          stockQuantityList.push(`s.`+ sails.config.constant.STOCK_QUANTITY_LIST[stock.stockColumnIndex]);
        })
        sumQuantity = `(` +  stockQuantityList.join(` + ` ) + `) as stockQuantity`;
        sumStockQuantity = `(` +  stockQuantityList.join(` + ` ) + `)`;

      }
    }

    let PRODUCTS_LOW_STOCK_SQL = `
        SELECT p.id, p.name, p.code, ${sumQuantity}, s.stockMin, (s.stockMin - ${sumStockQuantity}) as quantityNeed
        FROM product p
        LEFT JOIN productstock s ON p.id = s.productId && s.branchId= ${branchId}
        WHERE p.deletedAt = 0 AND p.stoppedAt = 0 AND ${sumStockQuantity} < s.stockMin AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
        AND p.productTypeId in ($1) AND ( p.code LIKE '%${filter}%' OR p.name LIKE '%${filter}%' )`

    let resultProduct = await sails.sendNativeQuery(this.req, PRODUCTS_LOW_STOCK_SQL, [type])

    this.res.json({
      status: true,
      data: resultProduct.rows
    });
  }
};
