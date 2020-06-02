module.exports = {
  description: 'get import export report',

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
    let { startDate, endDate, type, branchId, stockId, selectProduct } = inputs.data;
    let { req } = inputs;
    
    let sumQuantity = '';
    let stockQuantityList = [];
    let selectProducts = '';
    
    if (selectProduct.length >  0){
      selectProducts = ` AND ( p.id IN (${selectProduct.join(',')}))` 
    }


    if (stockId.length){
      let foundStock = await Stock.find(req, { id: {in: stockId }, deletedAt: 0 });

      if (!foundStock) {
        return exits.success({ status: false, message: sails.__(sails.config.constant.INTERCEPT.NOT_FOUND_STOCK) });
      }  
      
      if (foundStock.length){
        foundStock.map( stock => {        
          stockQuantityList.push(`ps.`+ sails.config.constant.STOCK_QUANTITY_LIST[stock.stockColumnIndex]);
        })
        sumQuantity = `(` +  stockQuantityList.join(` + ` ) + `) as stockQuantity`;
      }
    }
        
    let PRODUCT_SQL = `SELECT p.id as productId, p.name, p.unitId, p.code, pp.costUnitPrice, pp.saleUnitPrice, ${sumQuantity}
                        FROM product p
                        LEFT JOIN productprice pp ON pp.productId = p.id
                        LEFT JOIN productstock ps ON ps.productId = p.id
                        WHERE p.deletedAt = 0 AND ( p.productTypeId IN (${type.join(',')})) AND pp.branchId= ${branchId} AND ps.branchId= ${branchId}
                          AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise} ${selectProducts}        
                        GROUP BY p.id
                        ORDER BY p.createdAt DESC`;

    let PRODUCT_IN_INVOICEPRODUCT_SQL = `
        SELECT i.productId, SUM(i.quantity) as quantityInvoice, p.name, p.code, p.unitId
        FROM invoiceproduct i
        LEFT JOIN product p ON i.productId = p.id
        WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND createdAt BETWEEN $1 AND $2 AND branchId= ${branchId}) AND p.productTypeId IN ($3)
        AND i.stockId IN (${stockId.join(',')}) ${selectProducts} 
        AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
        GROUP BY p.name
        ORDER BY p.name ASC`; // giảm
                          
    let PRODUCT_IN_INVOICERETURNPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityInvoiceReturn, p.name, p.code, p.unitId
      FROM importcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND importedAt BETWEEN $1 AND $2 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND branchId= ${branchId})
      AND p.productTypeId IN ($3) AND i.stockId IN (${stockId.join(',')}) ${selectProducts}  
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      GROUP BY p.name
      ORDER BY p.name ASC` // tăng
    
    let PRODUCT_IN_IMPORTPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityImport, p.name, p.code, p.unitId
      FROM importcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND importedAt BETWEEN $1 AND $2 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER} AND branchId= ${branchId})
      AND p.productTypeId IN ($3) AND i.stockId IN (${stockId.join(',')}) ${selectProducts} 
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      GROUP BY p.name
      ORDER BY p.name ASC` //tăng

    let PRODUCT_IN_IMPORTRETURNPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityImportReturn, p.name, p.code, p.unitId
      FROM exportcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      LEFT JOIN productprice pp ON pp.productId = i.productId
      LEFT JOIN productstock ps ON ps.productId = i.productId
      WHERE i.exportCardId IN (SELECT id FROM exportcard WHERE status = ${sails.config.constant.EXPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND exportedAt BETWEEN $1 AND $2 AND reason = ${sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER} AND branchId= ${branchId}) 
      AND p.productTypeId in ($3) AND i.stockId IN (${stockId.join(',')}) ${selectProducts}  
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      GROUP BY p.name
      ORDER BY p.name ASC` //giảm

    let PRODUCT_IN_STOCKCHECKPLUSPRODUCT_SQL = `
      SELECT i.productId, SUM(i.differenceQuantity) as quantityStockCheckIncrease, p.name, p.code, p.unitId
      FROM stockcheckcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      WHERE i.stockCheckCardId IN (SELECT id FROM stockcheckcard WHERE status = ${sails.config.constant.STOCK_CHECK_CARD_STATUS.FINISHED} AND deletedAt = 0 AND checkedAt BETWEEN $1 AND $2 AND branchId= ${branchId} AND stockId IN (${stockId.join(',')}))
      AND p.productTypeId in ($3) AND i.differenceQuantity >= 0 ${selectProducts} 
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      GROUP BY p.name
      ORDER BY p.name ASC` //tăng

    let PRODUCT_IN_STOCKCHECKNEGAPRODUCT_SQL = `
      SELECT i.productId, SUM(i.differenceQuantity) as quantityStockCheckDecrease, p.name, p.code, p.unitId
      FROM stockcheckcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      WHERE i.stockCheckCardId IN (SELECT id FROM stockcheckcard WHERE status = ${sails.config.constant.STOCK_CHECK_CARD_STATUS.FINISHED} AND deletedAt = 0 AND checkedAt BETWEEN $1 AND $2 AND branchId= ${branchId} AND stockId IN (${stockId.join(',')}))
      AND p.productTypeId in ($3) AND i.differenceQuantity < 0 ${selectProducts}  
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      GROUP BY p.name
      ORDER BY p.name ASC`//giảm

    let PRODUCT_IN_MOVESTOCKNVLPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityMoveStockNVL, p.name, p.code, p.unitId
      FROM movestockcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      WHERE i.moveStockCardId IN (SELECT id FROM movestockcard WHERE status = ${sails.config.constant.MOVE_STOCK_STATUS.FINISHED} AND deletedAt = 0 AND movedAt BETWEEN $1 AND $2 AND reason = ${sails.config.constant.MOVE_STOCK_REASON.IMPORT.id} AND branchId= ${branchId}) 
      AND p.productTypeId in ($3) AND i.stockId IN (${stockId.join(',')}) ${selectProducts} 
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      GROUP BY p.name
      ORDER BY p.name ASC` //giảm

    let PRODUCT_IN_MOVESTOCKTPPRODUCT_SQL = `
      SELECT i.productId, SUM(i.quantity) as quantityMoveStock, p.name, p.code, p.unitId
      FROM movestockcardproduct i
      LEFT JOIN product p ON i.productId = p.id
      WHERE i.moveStockCardId IN (SELECT id FROM movestockcard WHERE status = ${sails.config.constant.MOVE_STOCK_STATUS.FINISHED} AND deletedAt = 0 AND movedAt BETWEEN $1 AND $2 AND 
      reason IN (${sails.config.constant.MOVE_STOCK_REASON.EXPORT_FINISHED_PRODUCT.id}, ${sails.config.constant.MOVE_STOCK_REASON.EXPORT_RETURN.id}) AND branchId= ${branchId}) 
      AND p.productTypeId in ($3) AND i.stockId IN (${stockId.join(',')}) ${selectProducts}  
      AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      GROUP BY p.name
      ORDER BY p.name ASC` //tăng
    
    let [products, invoiceProductMid, invoiceReturnProductMid, importProductMid, importReturnProductMid, stockcheckPlusProductMid, stockcheckNegaProductMid, moveStockNVLProductMid, moveStockProductMid] =
        await Promise.all([sails.sendNativeQuery(req, PRODUCT_SQL),
          sails.sendNativeQuery(req, PRODUCT_IN_INVOICEPRODUCT_SQL, [startDate, endDate, type]),
          sails.sendNativeQuery(req, PRODUCT_IN_INVOICERETURNPRODUCT_SQL, [startDate, endDate, type]),
          sails.sendNativeQuery(req, PRODUCT_IN_IMPORTPRODUCT_SQL, [startDate, endDate, type]),
          sails.sendNativeQuery(req, PRODUCT_IN_IMPORTRETURNPRODUCT_SQL, [startDate, endDate, type]),
          sails.sendNativeQuery(req, PRODUCT_IN_STOCKCHECKPLUSPRODUCT_SQL, [startDate, endDate, type]),
          sails.sendNativeQuery(req, PRODUCT_IN_STOCKCHECKNEGAPRODUCT_SQL, [startDate, endDate, type]),
          sails.sendNativeQuery(req, PRODUCT_IN_MOVESTOCKNVLPRODUCT_SQL, [startDate, endDate, type]),
          sails.sendNativeQuery(req, PRODUCT_IN_MOVESTOCKTPPRODUCT_SQL, [startDate, endDate, type])
        ])
    
    let arrData = {};

    _.forEach(products.rows, item => {
      item = {
        ...item,
        total: item.costUnitPrice * item.stockQuantity,
        importQuantity: 0,
        exportQuantity: 0,
        lastQuantity: item.stockQuantity,
        beginQuantity: 0
      };

      arrData[item.productId] = item;
    });

    // tính nhập giữa kì
    _.forEach(importProductMid.rows, item => {
      if (arrData[item.productId])
        arrData[item.productId] = { ...arrData[item.productId], importQuantity: arrData[item.productId].importQuantity + item.quantityImport }
      else arrData[item.productId] = {...item, importQuantity: item.quantityImport, exportQuantity: 0, lastQuantity: 0, beginQuantity: 0, id: item.productId, total: 0 }
    })

    _.forEach(invoiceReturnProductMid.rows, item => {
      if (arrData[item.productId])
        arrData[item.productId] = { ...arrData[item.productId], importQuantity: arrData[item.productId].importQuantity + item.quantityInvoiceReturn }
      else arrData[item.productId] = {...item, importQuantity: item.quantityInvoiceReturn, exportQuantity: 0, lastQuantity: 0, beginQuantity: 0, id: item.productId, total: 0 }
    })

    _.forEach(stockcheckPlusProductMid.rows, item => {
      if (arrData[item.productId])
        arrData[item.productId] = { ...arrData[item.productId], importQuantity: arrData[item.productId].importQuantity + item.quantityStockCheckIncrease }
      else arrData[item.productId] = {...item, importQuantity: item.quantityStockCheckIncrease, exportQuantity: 0, lastQuantity: 0, beginQuantity: 0, id: item.productId, total: 0 }
    })

    _.forEach(moveStockProductMid.rows, item => {
      if (arrData[item.productId])
        arrData[item.productId] = { ...arrData[item.productId], importQuantity: arrData[item.productId].importQuantity + item.quantityMoveStock }
      else arrData[item.productId] = {...item, importQuantity: item.quantityMoveStock, exportQuantity: 0, lastQuantity: 0, beginQuantity: 0, id: item.productId, total: 0 }
    })

    // tính xuất giữa kì
    _.forEach(invoiceProductMid.rows, item => {
      if (arrData[item.productId])
        arrData[item.productId] = { ...arrData[item.productId], exportQuantity: arrData[item.productId].exportQuantity + item.quantityInvoice }
      else arrData[item.productId] = { ...item, exportQuantity: item.quantityInvoice, importQuantity: 0, lastQuantity: 0, beginQuantity: 0, id: item.productId, total: 0 }
    })

    _.forEach(importReturnProductMid.rows, item => {
      if (arrData[item.productId])
        arrData[item.productId] = { ...arrData[item.productId], exportQuantity: arrData[item.productId].exportQuantity + item.quantityImportReturn }
      else arrData[item.productId] = { ...item, exportQuantity: item.quantityImportReturn, importQuantity: 0, lastQuantity: 0, beginQuantity: 0, id: item.productId, total: 0 }
    })

    _.forEach(stockcheckNegaProductMid.rows, item => {
      if (arrData[item.productId])
        arrData[item.productId] = { ...arrData[item.productId], exportQuantity: arrData[item.productId].exportQuantity + Math.abs(item.quantityStockCheckDecrease) }
      else arrData[item.productId] = { ...item, exportQuantity: Math.abs(item.quantityStockCheckDecrease), importQuantity: 0, lastQuantity: 0, beginQuantity: 0, id: item.productId, total: 0 }
    })

    _.forEach(moveStockNVLProductMid.rows, item => {
      if (arrData[item.productId])
        arrData[item.productId] = { ...arrData[item.productId], exportQuantity: arrData[item.productId].exportQuantity + item.quantityMoveStockNVL }
      else arrData[item.productId] = { ...item, exportQuantity: item.quantityMoveStockNVL, importQuantity: 0, lastQuantity: 0, beginQuantity: 0, id: item.productId, total: 0 }
    })
    // tính tồn kho xuất nhập từ cuối kỳ đến hiện tại
    let timerCurrent = new Date().getTime();

    if (timerCurrent > Number(endDate)) {
      let [invoiceProductLast, invoiceReturnProductLast, importProductLast, importReturnProductLast, 
        stockcheckPlusProductLast, stockcheckNegaProductLast, moveStockNVLProductLast, moveStockProductLast]
            = await Promise.all([
              sails.sendNativeQuery(req, PRODUCT_IN_INVOICEPRODUCT_SQL, [endDate, timerCurrent, type]), //giảm
              sails.sendNativeQuery(req, PRODUCT_IN_INVOICERETURNPRODUCT_SQL, [endDate, timerCurrent, type]),//tăng
              sails.sendNativeQuery(req, PRODUCT_IN_IMPORTPRODUCT_SQL, [endDate, timerCurrent, type]), //tăng
              sails.sendNativeQuery(req, PRODUCT_IN_IMPORTRETURNPRODUCT_SQL, [endDate, timerCurrent, type]), //giảm
              sails.sendNativeQuery(req, PRODUCT_IN_STOCKCHECKPLUSPRODUCT_SQL, [endDate, timerCurrent, type]), //tăng
              sails.sendNativeQuery(req, PRODUCT_IN_STOCKCHECKNEGAPRODUCT_SQL, [endDate, timerCurrent, type]), //giảm
              sails.sendNativeQuery(req, PRODUCT_IN_MOVESTOCKNVLPRODUCT_SQL, [endDate, timerCurrent, type]), //giảm
              sails.sendNativeQuery(req, PRODUCT_IN_MOVESTOCKTPPRODUCT_SQL, [endDate, timerCurrent, type])//tăng
            ])
      // tính cuối kỳ tới hiện tại
      _.forEach(importProductLast.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: arrData[item.productId].lastQuantity - item.quantityImport }
        else arrData[item.productId] = { ...item, importQuantity: 0, exportQuantity: 0, lastQuantity:- item.quantityImport, beginQuantity: 0, id: item.productId, total: 0 }
      })
      
      _.forEach(invoiceReturnProductLast.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: arrData[item.productId].lastQuantity - item.quantityInvoiceReturn }
        else arrData[item.productId] = { ...item, importQuantity: 0, exportQuantity: 0, lastQuantity:- item.quantityInvoiceReturn, beginQuantity: 0, id: item.productId, total: 0 }
      })

      _.forEach(stockcheckPlusProductLast.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: arrData[item.productId].lastQuantity - item.quantityStockCheckIncrease }
        else arrData[item.productId] = { ...item, importQuantity: 0, exportQuantity: 0, lastQuantity: - item.quantityStockCheckIncrease, beginQuantity: 0, id: item.productId, total: 0 }
      })

      _.forEach(moveStockProductLast.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: arrData[item.productId].lastQuantity - item.quantityMoveStock }
        else arrData[item.productId] = { ...item, importQuantity: 0, exportQuantity: 0, lastQuantity: - item.quantityMoveStock, beginQuantity: 0, id: item.productId, total: 0 }
      })

      _.forEach(invoiceProductLast.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: arrData[item.productId].lastQuantity + item.quantityInvoice }
        else arrData[item.productId] = { ...item, importQuantity: 0, exportQuantity: 0, lastQuantity: + item.quantityInvoice, beginQuantity: 0, id: item.productId, total: 0 }
      })

      _.forEach(importReturnProductLast.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: arrData[item.productId].lastQuantity + item.quantityImportReturn }
        else arrData[item.productId] = { ...item, importQuantity: 0, exportQuantity: 0, lastQuantity: item.quantityImportReturn, beginQuantity: 0, id: item.productId, total: 0 }
      })

      _.forEach(stockcheckNegaProductLast.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: arrData[item.productId].lastQuantity + Math.abs(item.quantityStockCheckDecrease) }
        else arrData[item.productId] = { ...item, importQuantity: 0, exportQuantity: 0, lastQuantity: Math.abs(item.quantityStockCheckDecrease), beginQuantity: 0, id: item.productId, total: 0 }
      })

      _.forEach(moveStockNVLProductLast.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: arrData[item.productId].lastQuantity + item.quantityMoveStockNVL }
        else arrData[item.productId] = { ...item, importQuantity: 0, exportQuantity: 0, lastQuantity: item.quantityMoveStockNVL, beginQuantity: 0, id: item.productId, total: 0 }
      })
    }
    else {
      _.forEach(products.rows, item => {
        if (arrData[item.productId])
          arrData[item.productId] = { ...arrData[item.productId], lastQuantity: item.stockQuantity }
        else arrData[item.productId] = {...item, lastQuantity: 0, exportQuantity: 0, importQuantity: 0, beginQuantity: 0 }
      })
    }

    let foundUnit = await ProductUnit.find(req, { deletedAt: 0 })

    _.forEach(arrData, item => {
      if (!item.lastQuantity) item.lastQuantity = 0;
      item.beginQuantity = item.lastQuantity - item.importQuantity + item.exportQuantity;
      if ( item.unitId ) {
        _.forEach(foundUnit, elem => {
          if (elem.id === item.unitId) {
            item.unitName = elem.name
          }
        })
      }
    })

    let arrLastImportProduct = await Promise.all(_.map(arrData, async item => {
      let SQL_IMPORT_LAST = `SELECT * FROM importcardproduct i
                            WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND importedAt <= $1 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER} AND branchId= ${branchId}) 
                            AND i.stockId IN (${stockId.join(',')}) AND i.productId = ${item.productId}
                            ORDER BY i.createdAt ASC
                            LIMIT 1`
      
      let foundImportProduct = await sails.sendNativeQuery(SQL_IMPORT_LAST, endDate)
      
      return foundImportProduct.rows.length > 0 ? foundImportProduct.rows[0] : {productId: item.productId};
    }))

    if (arrLastImportProduct.length > 0) {
      _.forEach(arrLastImportProduct, item => {
        if (Object.keys(item).length > 1) {
          arrData[item.productId] = { 
            ...arrData[item.productId], 
            beginAmount: item.finalAmount * arrData[item.productId].beginQuantity, 
            lastAmount: item.finalAmount * arrData[item.productId].lastQuantity,
            importAmount: item.finalAmount * arrData[item.productId].importQuantity,
            exportAmount: item.finalAmount * arrData[item.productId].exportQuantity
          }
        }
        else 
          arrData[item.productId] = { 
            ...arrData[item.productId], 
            beginAmount: arrData[item.productId].costUnitPrice * arrData[item.productId].beginQuantity, 
            lastAmount: arrData[item.productId].costUnitPrice * arrData[item.productId].lastQuantity,
            importAmount: arrData[item.productId].costUnitPrice * arrData[item.productId].importQuantity,
            exportAmount: arrData[item.productId].costUnitPrice * arrData[item.productId].exportQuantity
          }
      })
    }

    exits.success({ status: true, data: Object.values(arrData) })
  }
}