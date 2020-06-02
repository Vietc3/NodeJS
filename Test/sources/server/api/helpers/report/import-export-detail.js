module.exports = {
  description: 'get import export detail report',

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
    let { startDate, endDate, type, id, branchId, stockId } = inputs.data;
    let { req } = inputs;
    let arrData = [];
    let customerType;

    let listStockIdExport = '';
    let listStockId = '';
    let listMovStock = '';
    let listCheckStock = '';

    if (stockId.length) {

      listStockId =` AND ( ip.stockId IN (${stockId.join(',')}))`;
      listStockIdExport =` AND ( ep.stockId IN (${stockId.join(',')}))`;
      listMovStock =` AND ( mp.stockId IN (${stockId.join(',')}))`;
      listCheckStock = ` AND ( s.stockId IN (${stockId.join(',')}))`;
    }    
    
    //lấy danh sách đơn hàng và phiếu trả hàng (đối với chọn báo cáo theo khách hàng)
    if(type == sails.config.constant.SELECT_GROUP_IMPORT_EXPORT_REPORT.CUSTOMER){
      customerType = sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER;
      let INVOICE_SQL = 
        `SELECT i.id, i.code, i.finalAmount, i.createdAt, c.name, c.id as customerId, c.code as customerCode
        FROM invoice i
        LEFT JOIN customer c ON i.customerId = c.id
        WHERE i.customerId = $1
        AND i.createdAt BETWEEN $2 AND $3 AND i.branchId= ${branchId}`;
        
      let invoices = await sails.sendNativeQuery(req, INVOICE_SQL, [ id, startDate, endDate]); 

      let INVOICE_RETURN_SQL = 
        `SELECT i.id, i.code, i.finalAmount, i.createdAt, c.name, c.id as customerId, c.code as customerCode
        FROM importcard i
        LEFT JOIN customer c ON i.recipientId = c.id
        WHERE i.recipientId = $1
        AND i.createdAt BETWEEN $2 AND $3
        AND i.reason = $4 AND i.branchId= ${branchId}`;
        
      let invoiceReturns = await sails.sendNativeQuery(req, INVOICE_RETURN_SQL, [ id, startDate, endDate, sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN]); 

      //gộp dữ liệu hai bảng vào chung
      _.forEach(invoices.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.INVOICE_CUSTOMER;
        arrData.push(item);
      })

      _.forEach(invoiceReturns.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.INVOICE_RETURN_CUSTOMER;
        arrData.push(item);
      })
    }

    //lấy danh sách phiếu nhập hàng và phiếu trả hàng nhập (đối với chọn báo cáo theo nhà cung cấp)
    else if(type == sails.config.constant.SELECT_GROUP_IMPORT_EXPORT_REPORT.SUPPLIER){
      customerType = sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER;
      let IMPORT_SQL = 
        `SELECT i.id, i.code, i.finalAmount, i.createdAt, c.name, c.id as customerId, c.code as customerCode
        FROM importcard i
        LEFT JOIN customer c ON i.recipientId = c.id
        WHERE i.recipientId = $1
        AND i.createdAt BETWEEN $2 AND $3
        AND i.reason = $4 AND i.branchId= ${branchId}`;
        
      let imports = await sails.sendNativeQuery(req, IMPORT_SQL, [id, startDate, endDate, sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER]); 

      let IMPORT_RETURN_SQL = 
        `SELECT e.id, e.code, e.finalAmount, e.createdAt, c.name, c.id as customerId, c.code as customerCode
        FROM exportcard e
        LEFT JOIN customer c ON e.recipientId = c.id
        WHERE e.recipientId = $1
        AND e.createdAt BETWEEN $2 AND $3
        AND e.reason = $4 AND e.branchId= ${branchId}`;
        
      let importReturns = await sails.sendNativeQuery(req, IMPORT_RETURN_SQL, [id, startDate, endDate, sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER]); 

      //gộp dữ liệu hai bảng vào chung
      _.forEach(imports.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.IMPORT_CUSTOMER;
        arrData.push(item);
      })

      _.forEach(importReturns.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.IMPORT_RETURN_CUSTOMER;
        arrData.push(item);
      })
    }

    else {
      let INVOICE_SQL = 
        `SELECT i.id, i.code, i.createdAt, p.name as productName, pt.id as productTypeId, pt.name as productTypeName, sum(ip.quantity)as quantity, sum(ip.finalAmount) as finalAmount
        FROM invoice i
        LEFT JOIN invoiceproduct ip ON i.id = ip.invoiceId
        LEFT JOIN product p ON p.id = ip.productId
        LEFT JOIN producttype pt ON p.productTypeId = pt.id
        WHERE p.id = $1
          AND i.createdAt BETWEEN $2 AND $3 AND i.branchId= ${branchId} ${listStockId}
        GROUP BY i.id `;
        
      let invoices = await sails.sendNativeQuery(req, INVOICE_SQL, [ id, startDate, endDate]); 

      let INVOICE_RETURN_SQL = 
        `SELECT i.id, i.code, i.createdAt, p.name as productName, pt.id as productTypeId, pt.name as productTypeName, sum(ip.quantity)as quantity, sum(ip.finalAmount * ip.quantity) as finalAmount
        FROM importcard i
        LEFT JOIN importcardproduct ip ON i.id = ip.importCardId
        LEFT JOIN product p ON p.id = ip.productId
        LEFT JOIN producttype pt ON p.productTypeId = pt.id
        WHERE p.id = $1
          AND i.createdAt BETWEEN $2 AND $3
          AND i.reason = $4 AND i.branchId= ${branchId} ${listStockId}
        GROUP BY i.id `;

        
      let invoiceReturns = await sails.sendNativeQuery(req, INVOICE_RETURN_SQL, [ id, startDate, endDate, sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN]); 

      let IMPORT_SQL = 
        `SELECT i.id, i.code, i.createdAt, p.name as productName, pt.id as productTypeId, pt.name as productTypeName, sum(ip.quantity)as quantity, sum(ip.finalAmount * ip.quantity) as finalAmount
        FROM importcard i
        LEFT JOIN importcardproduct ip ON i.id = ip.importCardId
        LEFT JOIN product p ON p.id = ip.productId
        LEFT JOIN producttype pt ON p.productTypeId = pt.id
        WHERE p.id = $1
          AND i.createdAt BETWEEN $2 AND $3
          AND i.reason = $4 AND i.branchId= ${branchId} ${listStockId}
        GROUP BY i.id  `;
        
      let imports = await sails.sendNativeQuery(req, IMPORT_SQL, [ id, startDate, endDate, sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER]); 

      let IMPORT_RETURN_SQL = 
        `SELECT e.id, e.code, e.createdAt, p.name as productName, pt.id as productTypeId, pt.name as productTypeName, sum(ep.quantity) as quantity, sum(ep.finalAmount * ep.quantity) as finalAmount
        FROM exportcard e
        LEFT JOIN exportcardproduct ep ON e.id = ep.exportCardId
        LEFT JOIN product p ON p.id = ep.productId
        LEFT JOIN producttype pt ON p.productTypeId = pt.id
        WHERE p.id = $1
          AND e.createdAt BETWEEN $2 AND $3
          AND e.reason = $4 AND e.branchId= ${branchId}${listStockIdExport}
        GROUP BY e.id`;

      let importReturns = await sails.sendNativeQuery(req, IMPORT_RETURN_SQL, [ id, startDate, endDate, sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER]);

      let STOCK_CHECK_SQL = 
        `SELECT s.id, s.code, s.createdAt, p.name as productName, pt.id as productTypeId, pt.name as productTypeName, sum(sp.differenceQuantity) as quantity, sum(sp.differenceAmount) as finalAmount
        FROM stockcheckcard s
        LEFT JOIN stockcheckcardproduct sp ON s.id = sp.stockCheckCardId
        LEFT JOIN product p ON p.id = sp.productId
        LEFT JOIN producttype pt ON p.productTypeId = pt.id
        WHERE p.id = $1
          AND s.createdAt BETWEEN $2 AND $3 AND branchId= ${branchId} ${listCheckStock}
        GROUP BY s.id`;
      let stockChecks = await sails.sendNativeQuery(req, STOCK_CHECK_SQL, [ id, startDate, endDate]);

      let MOVE_STOCK_SQL = 
        `SELECT m.id, m.code, m.createdAt, p.name as productName, pt.id as productTypeId, pt.name as productTypeName, sum(mp.quantity)as quantity, sum(mp.quantity * pp.costUnitPrice)as finalAmount, m.reason
        FROM movestockcard m
        LEFT JOIN movestockcardproduct mp ON m.id = mp.moveStockCardId
        LEFT JOIN product p ON p.id = mp.productId
        LEFT JOIN productprice pp ON mp.productId = pp.productId
        LEFT JOIN producttype pt ON p.productTypeId = pt.id
        WHERE p.id = $1
          AND m.createdAt BETWEEN $2 AND $3 AND m.branchId= ${branchId} AND pp.branchId= ${branchId} ${listMovStock} 
        GROUP BY m.id`;
        
      let moveStocks = await sails.sendNativeQuery(req, MOVE_STOCK_SQL, [ id, startDate, endDate]);

      //gộp dữ liệu hai bảng vào chung

      _.forEach(invoices.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.INVOICE_PRODUCT;
        arrData.push(item);
      })

      _.forEach(invoiceReturns.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.INVOICE_RETURN_PRODUCT;
        arrData.push(item);
      })

      _.forEach(imports.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.IMPORT_PRODUCT;
        arrData.push(item);
      })

      _.forEach(importReturns.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.IMPORT_RETURN_PRODUCT;
        arrData.push(item);
      })

      _.forEach(stockChecks.rows, item => {
        item.type = sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.STOCK_CHECK;
        arrData.push(item);
      })

      _.forEach(moveStocks.rows, item => {
        item.type = item.reason === sails.config.constant.MOVE_STOCK_REASON.IMPORT.id ?
                      sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.IMPORT_STOCK
                    : sails.config.constant.TYPE_CARD_IMPORT_EXPORT_REPORT.EXPORT_STOCK;
        arrData.push(item);
      })
    }

    //sắp xếp theo thứ tự ngày tạo tăng dần
    arrData.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });    

    return exits.success({ status: true, data: arrData })
  }
}