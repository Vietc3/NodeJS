module.exports = {

  description: 'get sales counter',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    },    
  },

  fn: async function (inputs, exits) {
    let { filter, startDate, endDate, objData, branchId, stockId } = inputs.data;
    let { req } = inputs;
    if (!filter) {
      filter = {};
    }

    let productType = objData ? objData.productType : []
    let topProduct = objData ? objData.topProduct : 1
    let productRecently = objData ? objData.productRecently : 1
    let dataFilter = objData ? objData.dataFilter : []
    
    let checkAllProductType = dataFilter.includes('product-type');

    let productSales = []
    let productSalesTop;
    let productSalesRecenly;
    let productSalesType;
    let productSalesTypeAll;

    let selectStockQuantity = '';
    let sumQuantity = '';
    let stockList = [];
    let stockQuantityList = [];
    let stocks = Object.values(sails.config.constant.STOCK_QUANTITY_LIST);

    stocks.map(item=>{
      stockList.push(`ps.`+ item);      
    })
    selectStockQuantity = stockList.join(` , ` );  

    if (stockId.length){
      let foundStock = await Stock.find(req, { id: {in: stockId }, deletedAt: 0 });

      if (!foundStock) {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
      }  

      if (foundStock.length){
        foundStock.map(stock=>{
          stockQuantityList.push(sails.config.constant.STOCK_QUANTITY_LIST[stock.stockColumnIndex]);
        })
      }
    }
    
    if (topProduct === 0 &&  productRecently === 0 && !productType.length && !dataFilter.length){
   
      productSales = [];
      
      return exits.success({
          status: true,
          data: productSales
        })
    }

    if (topProduct === 1){
      let PRODUCT_SALES_IN_INVOICEPRODUCT_SQL_TOP = `
              SELECT i.productId, p.name, p.code, quantity, SUM(quantity), p.maxDiscount, pu.name as unit, p.type
              FROM invoiceproduct i
              LEFT JOIN product p ON i.productId = p.id
              LEFT JOIN productunit pu ON p.unitId = pu.id
              WHERE p.stoppedAt = 0 AND p.deletedAt = 0 AND ( i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND createdAt BETWEEN $1 AND $2 AND branchId= ${branchId}))
              GROUP BY productId
              ORDER BY SUM(quantity) DESC
              LIMIT 10`;

      productSalesTop = await sails.sendNativeQuery(req, PRODUCT_SALES_IN_INVOICEPRODUCT_SQL_TOP, [startDate, endDate])
      productSales = [
        ...productSales,
        ...productSalesTop.rows]
    }

    if (productRecently === 1){
      let PRODUCT_SALES_IN_INVOICEPRODUCT_SQL_RECENLY = `
              SELECT i.productId, p.name, p.code, quantity, SUM(quantity), p.maxDiscount, p.type, pu.name as unit
              FROM invoiceproduct i
              LEFT JOIN product p ON i.productId = p.id
              LEFT JOIN invoice k ON i.invoiceId = k.id
              LEFT JOIN productunit pu ON p.unitId = pu.id
              WHERE p.stoppedAt = 0 AND p.deletedAt = 0 AND ( k.status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND k.branchId= ${branchId})
              GROUP BY productId
              ORDER BY k.invoiceAt DESC
              LIMIT 10`;
      
      productSalesRecenly = await sails.sendNativeQuery(req, PRODUCT_SALES_IN_INVOICEPRODUCT_SQL_RECENLY, [startDate, endDate])
      productSales = [
        ...productSales,
        ...productSalesRecenly.rows
      ]
    }

    if (checkAllProductType){
      
      let PRODUCT_SALES_IN_INVOICEPRODUCT_SQL_TYPE_ALL = `
              SELECT i.id as productId, i.name, i.code, i.maxDiscount, i.type, pu.name as unit
              FROM product i
              LEFT JOIN productunit pu ON i.unitId = pu.id
              WHERE i.stoppedAt = 0 AND i.deletedAt = 0          
              GROUP BY i.id
              ORDER BY i.createdAt DESC`;

        productSalesTypeAll = await sails.sendNativeQuery(req, PRODUCT_SALES_IN_INVOICEPRODUCT_SQL_TYPE_ALL, [startDate, endDate])
        
        productSales = [
          ...productSales,
          ...productSalesTypeAll.rows
        ]
    } else {
      if (productType.length > 0 ){ 
        
        let PRODUCT_SALES_IN_INVOICEPRODUCT_SQL_TYPE = `
                SELECT i.id as productId, i.name, i.code, i.type, pu.name as unit, i.maxDiscount
                FROM product i
                LEFT JOIN productunit pu ON i.unitId = pu.id
                WHERE i.stoppedAt = 0 AND i.deletedAt = 0 AND ( i.productTypeId IN (${productType.join(',')}))           
                GROUP BY i.id
                ORDER BY i.createdAt DESC`;
  
          productSalesType = await sails.sendNativeQuery(req, PRODUCT_SALES_IN_INVOICEPRODUCT_SQL_TYPE, [startDate, endDate])
          productSales = [
            ...productSales,
            ...productSalesType.rows
          ]
      }
    }
    
    productSales = _.uniqBy(productSales, 'productId');

    let arrId = [];
    let objProduct = {};

    _.forEach(productSales, item => {
      arrId.push(item.productId);
      objProduct[item.productId] = item;
    })

    if (arrId.length) {
      let [productPrices, productStocks]  = await Promise.all([ProductPrice.find(req, { productId: {in: arrId}, branchId }), ProductStock.find(req, { productId: {in: arrId}, branchId })])

      _.forEach(productPrices, item => {
        if (objProduct[item.productId]) {
          objProduct[item.productId] = { ...objProduct[item.productId], costUnitPrice: item.costUnitPrice, saleUnitPrice: item.saleUnitPrice }
        }
      })

      _.forEach(productStocks, item => {
        if (objProduct[item.productId]) {
          let objStockQuantity = {};
          let sumQuantity = stockQuantityList.reduce((total, elem) => {
            objStockQuantity[elem] = item[elem];          
            total += item[elem];
            return total;
          }, 0);

          objProduct[item.productId] = { ...objProduct[item.productId], stockMin: item.stockMin, sumQuantity: sumQuantity, ...objStockQuantity }
        }
      })
    }
    
    return exits.success({
      status: true,
      data: Object.values(objProduct)
    })
  }
};
