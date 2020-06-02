module.exports = {

  friendlyName: 'Get Inventory Report data',

  description: 'Get Inventory data',

  inputs: {
    type: {
      type: 'json',
      required: true
    },
    stockId: { // truyen arr
      type: 'json',
      required: true 
    },
    startDate: {
      type: "number"
    },
    endDate: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let { type, stockId, startDate, endDate } = inputs;
    let branchId = this.req.headers['branch-id'];

    if ( type.length == 0 ) {
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

    let sumQuantity = '';
    let sumStockQuantity = '';
    let stockQuantityList = [];

    if (stockId.length){
      let foundStock = await Stock.find(this.req, { id: {in: stockId }, deletedAt: 0 });

      if (!foundStock) {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
      }  

      if (foundStock.length){
        foundStock.map( stock =>{
          stockQuantityList.push(`ps.`+ sails.config.constant.STOCK_QUANTITY_LIST[stock.stockColumnIndex]);
        })
        sumQuantity = `(` +  stockQuantityList.join(` + ` ) + `) as stockQuantity`;
        sumStockQuantity = `(` +  stockQuantityList.join(` + ` ) + `)`;

      }   
    }

    let PRODUCT_SQL = `SELECT i.id as productId, i.name, i.unitId, pu.name as unitName, i.code, pp.costUnitPrice, pp.saleUnitPrice, ${sumQuantity}, (pp.costUnitPrice * ${sumStockQuantity}) as total
                        FROM product i
                        LEFT JOIN productunit pu ON pu.id = i.unitId
                        LEFT JOIN productprice pp ON pp.productId = i.id
                        LEFT JOIN productstock ps ON ps.productId = i.id
                        WHERE i.deletedAt = 0 AND ( i.productTypeId IN (${type.join(',')})) AND pp.branchId= ${branchId} AND ps.branchId= ${branchId} 
                          AND i.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}         
                        GROUP BY i.id
                        ORDER BY i.createdAt DESC`;

    let products = await sails.sendNativeQuery(this.req, PRODUCT_SQL);
    
    let PRODUCT_IN_INVOICEPRODUCT_SQL = `
        SELECT i.productId, SUM(i.quantity) as quantityInvoice, p.name, p.code, pp.costUnitPrice, ${sumQuantity}, (pp.costUnitPrice * ${sumStockQuantity}) as total
        FROM invoiceproduct i
        LEFT JOIN product p ON i.productId = p.id
        LEFT JOIN productprice pp ON pp.productId = i.productId
        LEFT JOIN productstock ps ON ps.productId = i.productId
        WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND createdAt BETWEEN $1 AND $2 AND branchId= ${branchId}) AND p.productTypeId IN ($3)
        AND pp.branchId= ${branchId} AND ps.branchId= ${branchId} AND i.stockId IN (${stockId.join(',')})
        AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
        AND p.deletedAt = 0
        GROUP BY p.name
        ORDER BY p.name ASC`;
    
    let invoiceProducts = await sails.sendNativeQuery(this.req, PRODUCT_IN_INVOICEPRODUCT_SQL, [startDate, endDate, type]);

    let PRODUCT_IN_INVOICERETURNPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityInvoiceReturn, p.name, p.code, pp.costUnitPrice, ${sumQuantity}, (pp.costUnitPrice * ${sumStockQuantity}) as total
      FROM importcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      LEFT JOIN productprice pp ON pp.productId = i.productId
      LEFT JOIN productstock ps ON ps.productId = i.productId
      WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND importedAt BETWEEN $1 AND $2 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND branchId= ${branchId}) 
      AND p.productTypeId IN ($3) AND pp.branchId= ${branchId} AND ps.branchId= ${branchId} AND i.stockId IN (${stockId.join(',')})
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      AND p.deletedAt = 0
      GROUP BY p.name
      ORDER BY p.name ASC
      `;

    let invoiceReturnProduct = await sails.sendNativeQuery(this.req, PRODUCT_IN_INVOICERETURNPRODUCT_SQL, [startDate, endDate, type]);

    let PRODUCT_IN_IMPORTPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityImport, p.name, p.code, pp.costUnitPrice, ${sumQuantity}, (pp.costUnitPrice * ${sumStockQuantity}) as total
      FROM importcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      LEFT JOIN productprice pp ON pp.productId = i.productId
      LEFT JOIN productstock ps ON ps.productId = i.productId
      WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND importedAt BETWEEN $1 AND $2 AND branchId= ${branchId}) 
      AND p.productTypeId IN ($3) AND pp.branchId= ${branchId} AND ps.branchId= ${branchId} AND i.stockId IN (${stockId.join(',')})
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      AND p.deletedAt = 0
      GROUP BY p.name
      ORDER BY p.name ASC
      `;
    let importProducts = await sails.sendNativeQuery(this.req, PRODUCT_IN_IMPORTPRODUCT_SQL, [startDate, endDate, type]);

    let PRODUCT_IN_IMPORTRETURNPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityImportReturn, p.name, p.code, pp.costUnitPrice, ${sumQuantity}, (pp.costUnitPrice * ${sumStockQuantity}) as total
      FROM exportcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      LEFT JOIN productprice pp ON pp.productId = i.productId
      LEFT JOIN productstock ps ON ps.productId = i.productId
      WHERE i.exportCardId IN (SELECT id FROM exportcard WHERE status = ${sails.config.constant.EXPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND exportedAt BETWEEN $1 AND $2 AND reason = ${sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER} AND branchId= ${branchId}) 
      AND p.productTypeId in ($3) AND pp.branchId= ${branchId} AND ps.branchId= ${branchId} AND i.stockId IN (${stockId.join(',')})
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      AND p.deletedAt = 0
      GROUP BY p.name
      ORDER BY p.name ASC`;
    let importReturnProduct = await sails.sendNativeQuery(this.req, PRODUCT_IN_IMPORTRETURNPRODUCT_SQL, [startDate, endDate, type]);

    let PRODUCT_IN_STOCKCHECKPLUSPRODUCT_SQL = `
      SELECT i.productId, SUM(i.differenceQuantity) as quantityStockCheckIncrease, p.name, p.code, pp.costUnitPrice, (pp.costUnitPrice * ${sumStockQuantity}) as total, ${sumQuantity}
      FROM stockcheckcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      LEFT JOIN productprice pp ON pp.productId = i.productId
      LEFT JOIN productstock ps ON ps.productId = i.productId
      WHERE i.stockCheckCardId IN (SELECT id FROM stockcheckcard WHERE status = ${sails.config.constant.STOCK_CHECK_CARD_STATUS.FINISHED} AND deletedAt = 0 AND checkedAt BETWEEN $1 AND $2 AND branchId= ${branchId} AND stockId IN (${stockId.join(',')}))
      AND p.productTypeId in ($3) AND i.differenceQuantity >= 0 AND pp.branchId= ${branchId} AND ps.branchId= ${branchId}
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      AND p.deletedAt = 0
      GROUP BY p.name
      ORDER BY p.name ASC`;
    let stockcheckPlusProduct = await sails.sendNativeQuery(this.req, PRODUCT_IN_STOCKCHECKPLUSPRODUCT_SQL, [startDate, endDate, type]);

    let PRODUCT_IN_STOCKCHECKNEGAPRODUCT_SQL = `
      SELECT i.productId, SUM(i.differenceQuantity) as quantityStockCheckDecrease, p.name, p.code, pp.costUnitPrice, (pp.costUnitPrice * ${sumStockQuantity}) as total, ${sumQuantity}
      FROM stockcheckcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      LEFT JOIN productprice pp ON pp.productId = i.productId
      LEFT JOIN productstock ps ON ps.productId = i.productId
      WHERE i.stockCheckCardId IN (SELECT id FROM stockcheckcard WHERE status = ${sails.config.constant.STOCK_CHECK_CARD_STATUS.FINISHED} AND deletedAt = 0 AND checkedAt BETWEEN $1 AND $2 AND branchId= ${branchId} AND stockId IN (${stockId.join(',')})) 
      AND p.productTypeId in ($3) AND i.differenceQuantity < 0 AND pp.branchId= ${branchId} AND ps.branchId= ${branchId}
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      AND p.deletedAt = 0
      GROUP BY p.name
      ORDER BY p.name ASC`;
    let stockcheckNegaProduct = await sails.sendNativeQuery(this.req, PRODUCT_IN_STOCKCHECKNEGAPRODUCT_SQL, [startDate, endDate, type])

    let PRODUCT_IN_MOVESTOCKTPPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityImport, p.name, p.code, pp.costUnitPrice, (pp.costUnitPrice * ${sumStockQuantity}) as total, ${sumQuantity}
      FROM movestockcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      LEFT JOIN productprice pp ON pp.productId = i.productId
      LEFT JOIN productstock ps ON ps.productId = i.productId
      WHERE i.moveStockCardId IN (SELECT id FROM movestockcard WHERE status = ${sails.config.constant.MOVE_STOCK_STATUS.FINISHED} AND deletedAt = 0 AND movedAt BETWEEN $1 AND $2 AND 
      reason IN (${sails.config.constant.MOVE_STOCK_REASON.EXPORT_FINISHED_PRODUCT.id}, ${sails.config.constant.MOVE_STOCK_REASON.EXPORT_RETURN.id}) AND branchId= ${branchId}) 
      AND p.productTypeId in ($3) AND pp.branchId= ${branchId} AND ps.branchId= ${branchId} AND i.stockId IN (${stockId.join(',')})
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      AND p.deletedAt = 0
      GROUP BY p.name
      ORDER BY p.name ASC` //tăng

    let moveStockProductMid = await sails.sendNativeQuery(this.req, PRODUCT_IN_MOVESTOCKTPPRODUCT_SQL, [startDate, endDate, type]);
    
    let arrData = {};

    _.forEach(products.rows, item => {
      arrData[item.productId] = { ...item, quantityInvoice: 0, quantityInvoiceReturn: 0, quantityImport: 0, quantityStockCheckIncrease: 0, quantityStockCheckDecrease: 0, quantityImportReturn: 0  }
    })

    _.forEach(invoiceProducts.rows, item => {
      if (arrData[item.productId]) {
        arrData[item.productId] = { ...arrData[item.productId], ...item }
      }
      else arrData[item.productId] = { ...item, quantityInvoiceReturn: 0, quantityImport: 0, quantityStockCheckIncrease: 0, quantityStockCheckDecrease: 0, quantityImportReturn: 0  }
    })

    _.forEach(importProducts.rows, item => {
      if (arrData[item.productId]) {
        arrData[item.productId] = { ...arrData[item.productId], ...item }
      }
      else arrData[item.productId] = { ...item, quantityInvoice: 0, quantityInvoiceReturn: 0, quantityStockCheckIncrease: 0, quantityStockCheckDecrease: 0, quantityImportReturn: 0    }
    })

    _.forEach(invoiceReturnProduct.rows, item => {
      if (arrData[item.productId]) {
        arrData[item.productId] = { ...arrData[item.productId], ...item}
      }
      else arrData[item.productId] = { ...item, quantityInvoice: 0, quantityquantityImport: 0, quantityStockCheckIncrease: 0, quantityStockCheckDecrease: 0, quantityImportReturn: 0    }
    })

    _.forEach(stockcheckPlusProduct.rows, item => {
      if (arrData[item.productId]) {
        arrData[item.productId] = { ...arrData[item.productId], ...item}
      }
      else arrData[item.productId] = { ...item, quantityInvoice: 0, quantityInvoiceReturn: 0,  quantityImport: 0, quantityStockCheckDecrease: 0, quantityImportReturn: 0  }
    })

    _.forEach(stockcheckNegaProduct.rows, item => {
      if (arrData[item.productId]) {
        arrData[item.productId] = { ...arrData[item.productId], ...item}
      }
      else arrData[item.productId] = { ...item, quantityInvoice: 0, quantityInvoiceReturn: 0,  quantityImport: 0, quantityStockCheckIncrease: 0, quantityImportReturn: 0  }
    })

    _.forEach(importReturnProduct.rows, item => {
      if (arrData[item.productId]) {
        arrData[item.productId] = { ...arrData[item.productId], ...item}
      }
      else arrData[item.productId] = { ...item, quantityInvoice: 0, quantityInvoiceReturn: 0,  quantityImport: 0, quantityStockCheckIncrease: 0, quantityStockCheckDecrease: 0   }
    })

    _.forEach(moveStockProductMid.rows, item => {
      if (arrData[item.productId]) {
        arrData[item.productId] = { ...arrData[item.productId], quantityImport: arrData[item.productId].quantityImport + item.quantityImport }
      }
      else arrData[item.productId] = { ...item, quantityInvoice: 0, quantityInvoiceReturn: 0, quantityStockCheckIncrease: 0, quantityStockCheckDecrease: 0, quantityImportReturn: 0    }
    })

    let totalAmount = _.reduce(Object.values(arrData), (total, item) => total += item.total, 0)

    this.res.json({
      status: true,
      data: Object.values(arrData),
      totalAmount: totalAmount ? totalAmount : 0
    });
  }
};
