module.exports = {

  friendlyName: 'Get Finished Estimates Report',

  description: 'Get finished estimates data',

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
    let arrData = {};
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

    let PRODUCTS_FINISHED_ESTIMATES_SQL = `
        SELECT p.id, p.name, p.code, ${sumQuantity}, s.stockMin, u.name as unitName, s.manufacturingQuantity
        FROM manufacturingformula m
        LEFT JOIN product p ON p.id = m.productId
        LEFT JOIN productstock s ON p.id = s.productId AND s.branchId= ${branchId} 
        LEFT JOIN productunit u ON p.unitId = u.id
        WHERE p.deletedAt = 0 AND p.productTypeId in ($1) AND ( p.code LIKE '%${filter}%' OR p.name LIKE '%${filter}%' )
        AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
        GROUP BY m.productId`

    let resultProduct = await sails.sendNativeQuery(this.req, PRODUCTS_FINISHED_ESTIMATES_SQL, [type]);    

    _.forEach(resultProduct.rows, item => {      
      arrData[item.id] = {...item, productionMay: 0 };
    });

    if (resultProduct.rows.length) {

      let arrId = [];
      resultProduct.rows.forEach(item => arrId.push(item.id));

      let PRODUCTS_MATERIAL_SQL = `
        SELECT p.name, p.code, m.productId, m.quantity, MIN((${sumStockQuantity} + s.manufacturingQuantity)/m.quantity) as productionMay
        FROM manufacturingformula m
        LEFT JOIN product p ON m.materialId = p.id
        LEFT JOIN productstock s ON m.materialId = s.productId && s.branchId= ${branchId}
        WHERE p.deletedAt = 0 AND m.productId IN (${arrId.join(",")})
        AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
        GROUP BY m.productId`
      let resultMaterial = await sails.sendNativeQuery(this.req, PRODUCTS_MATERIAL_SQL);
      
      _.forEach(resultMaterial.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], productionMay: item.productionMay }        
      })

    }  
    
    this.res.json({
      status: true,
      data: Object.values(arrData)
    });
  }
};
