module.exports = {

  friendlyName: 'Get Dash board data',

  description: 'Get dash board data',

  inputs: {
    filter: {
      type: 'json',
    },
    startDate: {
      type: "number"
    },
    endDate: {
      type: "number"
    }
  },

  fn: async function (inputs) {
    let { filter,startDate, endDate } = inputs;
    let branchId = this.req.headers['branch-id'];

    if (!filter) filter = {};

    filter = _.extend(filter, {
      deletedAt: 0,
      branchId
    });

    let invoices = await Invoice.find(this.req, {
      where: _.extend(filter, { status: sails.config.constant.INVOICE_CARD_STATUS.FINISHED }),
      select: ['createdAt', 'finalAmount']
    }).intercept({
      name: 'UsageError'
    }, () => {
      this.res.json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    });

    let invoiceReturn = await ImportCard.find(this.req, {
      where: _.extend(filter, { reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN, status: sails.config.constant.IMPORT_CARD_STATUS.FINISHED }),
      select: ['createdAt', 'finalAmount']
    }).intercept({
      name: 'UsageError'
    }, () => {
      this.res.json({
        status: false,
        error: sails.__('Thông tin yêu cầu không hợp lệ')
      });
      return;
    });
    let PRODUCT_IN_INVOICEPRODUCT_SQL = `
      SELECT i.productId, p.name, quantity, SUM(quantity), finalAmount
      FROM invoiceproduct i
      LEFT JOIN product p ON i.productId = p.id
      WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND createdAt BETWEEN $1 AND $2 AND branchId= ${branchId})
      GROUP BY productId
      ORDER BY SUM(quantity) DESC
      LIMIT 10`;

    let TopProducts = await sails.sendNativeQuery(this.req, PRODUCT_IN_INVOICEPRODUCT_SQL, [startDate, endDate]);

    let sumQuantity = [];

    for (let item in Object.keys(sails.config.constant.STOCK_QUANTITY_LIST)) {
      if (sails.config.constant.STOCK_QUANTITY_LIST[item])
        sumQuantity.push(`s.${sails.config.constant.STOCK_QUANTITY_LIST[item]}`)
    }

    let SUM_TOTAL_AND_AMOUNT_STOCK_SQL = `
      SELECT SUM(${sumQuantity.join("+")}) AS totalStock, SUM((${sumQuantity.join("+")}) * i.costUnitPrice) AS amountStock 
      FROM product p
      LEFT JOIN productstock s ON p.id = s.productId
      LEFT JOIN productprice i ON p.id = i.productId
      WHERE p.deletedAt = 0 AND s.branchId = ${branchId} AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise}
      AND i.branchId = ${branchId}`
    
    let QUOTA_LOW_SQL = `
      SELECT *
      FROM product p
      LEFT JOIN productstock s ON p.id = s.productId AND s.branchId = ${branchId}
      WHERE p.deletedAt = 0 AND (${sumQuantity.join("+")}) < s.stockMin AND p.type = ${sails.config.constant.PRODUCT_TYPES.merchandise};`

    let resultSumStock = await sails.sendNativeQuery(this.req, SUM_TOTAL_AND_AMOUNT_STOCK_SQL);
    let resultStockQuantityLow = await sails.sendNativeQuery(this.req, QUOTA_LOW_SQL);
    let countInvoiceReturn = invoiceReturn.length
    let countInvoice = invoices.length
    let totalStock = resultSumStock.rows[0]['totalStock']
    let amountStock = resultSumStock.rows[0]['amountStock']
    let productsStockQuantityLow = resultStockQuantityLow.rows
    let countStockQuantityLow = resultStockQuantityLow.rows.length
    let amountSale = 0
    invoices.map(item => amountSale += item.finalAmount)
    invoiceReturn.map(item => amountSale -= item.finalAmount)
    
    this.res.json({
      status: true,
      countInvoiceReturn: countInvoiceReturn,
      countInvoice: countInvoice,
      countStockQuantityLow: countStockQuantityLow,
      productsStockQuantityLow: productsStockQuantityLow,
      amountSale: amountSale,
      amountStock: amountStock,
      totalStock: totalStock,
      invoices: invoices,
      invoiceReturn: invoiceReturn,
      TopProducts: TopProducts,
    });
  }
};
