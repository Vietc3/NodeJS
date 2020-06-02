const moment = require("moment");

const OPTIONS = {
  HOUR: 1, // theo giờ
  DAY: 2, // theo ngày
  MONTH: 3, // theo tháng
  YEAR: 4, // theo năm
  PRODUCT: 5, // theo sản phẩm
  USER: 6, //theo nhân viên
  CUSTOMER: 7 // theo khách hàng
}

module.exports = {

  description: 'get sale report',

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
    let { filter, startDate, endDate, options, branchId } = inputs.data;
    let { req } = inputs;
    let formatDate;

    switch (options) {

      case OPTIONS.HOUR: {

        if (options == OPTIONS.HOUR) formatDate = sails.config.constant.formatHour

      }

      case OPTIONS.DAY: {

        if (options == OPTIONS.DAY) formatDate = sails.config.constant.formatDay

      }

      case OPTIONS.MONTH: {

        if (options == OPTIONS.MONTH) formatDate = sails.config.constant.formatMonth

      }

      case OPTIONS.YEAR: {

        if (options == OPTIONS.YEAR) formatDate = sails.config.constant.formatYear

        if (!filter) {
          filter = {};
        }

        filter = _.extend(filter, {
          deletedAt: 0
        });

        let invoices = await Invoice.find(req, {
          where: _.extend(filter, { status: sails.config.constant.INVOICE_CARD_STATUS.FINISHED, branchId }),
          select: ['createdAt', 'finalAmount', "taxAmount", "discountAmount", "totalAmount", "deliveryAmount", "invoiceAt"],
          sort: "createdAt ASC"
        }).intercept({
          name: 'UsageError'
        }, () => {
          return exits.success({
            status: false,
            error: sails.__('Thông tin yêu cầu không hợp lệ')
          });
        });

        let invoiceReturn = await ImportCard.find(req, {
          where: _.extend(filter, { reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN, status: sails.config.constant.IMPORT_CARD_STATUS.FINISHED, branchId }),
          select: ['createdAt', 'finalAmount', "importedAt"],
          sort: "createdAt ASC"
        }).intercept({
          name: 'UsageError'
        }, () => {
          return exits.success({
            status: false,
            error: sails.__('Thông tin yêu cầu không hợp lệ')
          });
        });

        let PRODUCT_IN_INVOICEPRODUCT_SQL =
          `SELECT SUM(i.finalAmount - (i.quantity * i.costUnitPrice) - ((n.discountAmount/n.totalAmount)*i.finalAmount)) as profitAmount, n.invoiceAt, i.productId
          FROM invoiceproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN invoice n ON n.id = i.invoiceId
          WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount > 0 AND invoiceAt BETWEEN $1 AND $2 AND branchId = ${branchId}) 
          AND i.productId IN (SELECT id FROM product)
          GROUP BY n.invoiceAt
          ORDER BY n.invoiceAt ASC`;

        let products = await sails.sendNativeQuery(req, PRODUCT_IN_INVOICEPRODUCT_SQL, [startDate, endDate]);
        
        let PRODUCT_IN_INVOICEPRODUCT_NOTOTAL_SQL =
          `SELECT SUM(i.finalAmount - (i.quantity * i.costUnitPrice)) as profitAmount, n.invoiceAt, i.productId
          FROM invoiceproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN invoice n ON n.id = i.invoiceId
          WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount = 0 AND invoiceAt BETWEEN $1 AND $2 AND branchId = ${branchId}) 
          AND i.productId IN (SELECT id FROM product)
          GROUP BY n.invoiceAt
          ORDER BY n.invoiceAt ASC`;

        let productsNoTotal = await sails.sendNativeQuery(req, PRODUCT_IN_INVOICEPRODUCT_NOTOTAL_SQL, [startDate, endDate]);
        
        let PRODUCT_IN_INVOICERETURNPRODUCT_SQL =
          `SELECT SUM((i.finalAmount - i.costUnitPrice) * i.quantity - ((n.discountAmount / n.totalAmount)*(i.finalAmount * i.quantity))) as profitAmount, n.importedAt
          FROM importcardproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN importcard n ON n.id = i.importCardId
          WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount > 0 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND importedAt BETWEEN $1 AND $2 AND branchId = ${branchId} )
          AND i.productId IN (SELECT id FROM product)
          GROUP BY n.importedAt
          ORDER BY n.importedAt ASC`;

        let returnProducts = await sails.sendNativeQuery(req, PRODUCT_IN_INVOICERETURNPRODUCT_SQL, [startDate, endDate]);

        let PRODUCT_IN_INVOICERETURNPRODUCT_NOTOTAL_SQL =
          `SELECT SUM((i.finalAmount - i.costUnitPrice) * i.quantity ) as profitAmount, n.importedAt
          FROM importcardproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN importcard n ON n.id = i.importCardId
          WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount = 0 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND importedAt BETWEEN $1 AND $2 AND branchId = ${branchId} )
          AND i.productId IN (SELECT id FROM product)
          GROUP BY n.importedAt
          ORDER BY n.importedAt ASC`;
        
        let returnProductsNototal = await sails.sendNativeQuery(req, PRODUCT_IN_INVOICERETURNPRODUCT_NOTOTAL_SQL, [startDate, endDate]);

        let data = {};
        let amount = {
          totalAmount: 0,
          taxAmount: 0,
          discountAmount: 0,
          returnAmount: 0,
          deliveryAmount: 0,
          profitAmount: 0
        }
        let id = 0;

        for (let item of invoices) {
          amount = data[moment(item.invoiceAt).format(formatDate)] ?
            {
              ...data[moment(item.invoiceAt).format(formatDate)],
              totalAmount: data[moment(item.invoiceAt).format(formatDate)].totalAmount += item.totalAmount,
              taxAmount: data[moment(item.invoiceAt).format(formatDate)].taxAmount += item.taxAmount,
              discountAmount: data[moment(item.invoiceAt).format(formatDate)].discountAmount += item.discountAmount,
              deliveryAmount: data[moment(item.invoiceAt).format(formatDate)].deliveryAmount += item.deliveryAmount,
              count: data[moment(item.invoiceAt).format(formatDate)].count += 1
            } : {
              id: id += 1,
              count: 1,
              totalAmount: item.totalAmount,
              taxAmount: item.taxAmount,
              discountAmount: item.discountAmount,
              deliveryAmount: item.deliveryAmount,
              returnAmount: 0,
              profitAmount: 0,
              time: moment(item.invoiceAt).format(formatDate),
            }

          data[moment(item.invoiceAt).format(formatDate)] = data[moment(item.invoiceAt).format(formatDate)] || {}
          data[moment(item.invoiceAt).format(formatDate)] = amount

        }

        for (let item of invoiceReturn) {
          amount = data[moment(item.importedAt).format(formatDate)] ?
            {
              ...data[moment(item.importedAt).format(formatDate)],
              returnAmount: data[moment(item.importedAt).format(formatDate)].returnAmount += (item.finalAmount),
            } : {
              id: id += 1,
              totalAmount: 0,
              taxAmount: 0,
              discountAmount: 0,
              deliveryAmount: 0,
              count: 0,
              returnAmount: item.finalAmount || 0,
              profitAmount: 0,
              time: moment(item.importedAt).format(formatDate)
            }

          data[moment(item.importedAt).format(formatDate)] = data[moment(item.importedAt).format(formatDate)] || {}
          data[moment(item.importedAt).format(formatDate)] = amount

        }

        for (let item of products.rows) {
          
          amount = data[moment(item.invoiceAt).format(formatDate)] ?
            {
              ...data[moment(item.invoiceAt).format(formatDate)],
              profitAmount: data[moment(item.invoiceAt).format(formatDate)].profitAmount += (item.profitAmount),
            } : {
              id: id += 1,
              totalAmount: 0,
              taxAmount: 0,
              discountAmount: 0,
              deliveryAmount: 0,
              count: 0,
              returnAmount: 0,
              profitAmount: item.profitAmount || 0,
              time: moment(item.invoiceAt).format(formatDate)
            }

          data[moment(item.invoiceAt).format(formatDate)] = data[moment(item.invoiceAt).format(formatDate)] || {}
          data[moment(item.invoiceAt).format(formatDate)] = amount
        }

        for (let item of productsNoTotal.rows) {
          amount = data[moment(item.invoiceAt).format(formatDate)] ?
            {
              ...data[moment(item.invoiceAt).format(formatDate)],
              profitAmount: data[moment(item.invoiceAt).format(formatDate)].profitAmount += (item.profitAmount),
            } : {
              id: id += 1,
              totalAmount: 0,
              taxAmount: 0,
              discountAmount: 0,
              deliveryAmount: 0,
              count: 0,
              returnAmount: 0,
              profitAmount: item.profitAmount || 0,
              time: moment(item.invoiceAt).format(formatDate)
            }

          data[moment(item.invoiceAt).format(formatDate)] = data[moment(item.invoiceAt).format(formatDate)] || {}
          data[moment(item.invoiceAt).format(formatDate)] = amount
        }

        for (let item of returnProducts.rows) {
          amount = data[moment(item.importedAt).format(formatDate)] ?
            {
              ...data[moment(item.importedAt).format(formatDate)],
              profitAmount: data[moment(item.importedAt).format(formatDate)].profitAmount -= (item.profitAmount),
            } : {
              id: id += 1,
              totalAmount: 0,
              taxAmount: 0,
              discountAmount: 0,
              deliveryAmount: 0,
              count: 0,
              returnAmount: 0,
              profitAmount: -item.profitAmount || 0,
              time: moment(item.importedAt).format(formatDate)
            }

          data[moment(item.importedAt).format(formatDate)] = data[moment(item.importedAt).format(formatDate)] || {}
          data[moment(item.importedAt).format(formatDate)] = amount
        }

        for (let item of returnProductsNototal.rows) {
          amount = data[moment(item.importedAt).format(formatDate)] ?
            {
              ...data[moment(item.importedAt).format(formatDate)],
              profitAmount: data[moment(item.importedAt).format(formatDate)].profitAmount -= (item.profitAmount),
            } : {
              id: id += 1,
              totalAmount: 0,
              taxAmount: 0,
              discountAmount: 0,
              deliveryAmount: 0,
              count: 0,
              returnAmount: 0,
              profitAmount: -item.profitAmount || 0,
              time: moment(item.importedAt).format(formatDate)
            }

          data[moment(item.importedAt).format(formatDate)] = data[moment(item.importedAt).format(formatDate)] || {}
          data[moment(item.importedAt).format(formatDate)] = amount
        }

        return exits.success({
          status: true,
          data: Object.values(data)
        })

      }

      case OPTIONS.PRODUCT: {

        let PRODUCT_IN_INVOICEPRODUCT_SQL =
          `SELECT i.productId, p.name as productName, SUM(i.quantity) as quantity, SUM(i.unitPrice * i.quantity) as totalAmount, SUM((i.discount * i.quantity) + ((iv.discountAmount/iv.totalAmount)*i.finalAmount) ) as discountAmount, 
          SUM((i.taxAmount * i.quantity) + ((iv.taxAmount/iv.totalAmount)*i.finalAmount)) as taxAmount, SUM(i.finalAmount - (i.quantity * i.costUnitPrice) - ((iv.discountAmount/iv.totalAmount)*i.finalAmount)) as profitAmount
          FROM invoiceproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN invoice iv ON iv.id = i.invoiceId
          WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND invoiceAt BETWEEN $1 AND $2 AND totalAmount > 0 AND branchId = ${branchId}) 
          AND i.productId IN (SELECT id FROM product)
          GROUP BY i.productId
          ORDER BY i.productId ASC`;

        let products = await sails.sendNativeQuery(req, PRODUCT_IN_INVOICEPRODUCT_SQL, [startDate, endDate]);

        let PRODUCT_IN_INVOICEPRODUCT_NOTOTAL_SQL =
          `SELECT i.productId, p.name as productName, SUM(i.quantity) as quantity, SUM(i.unitPrice * i.quantity) as totalAmount, SUM(i.discount * i.quantity) as discountAmount, 
          SUM(i.taxAmount * i.quantity) as taxAmount, SUM(i.finalAmount - (i.quantity * i.costUnitPrice)) as profitAmount
          FROM invoiceproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN invoice iv ON iv.id = i.invoiceId
          WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND invoiceAt BETWEEN $1 AND $2 AND totalAmount = 0 AND branchId = ${branchId}) 
          AND i.productId IN (SELECT id FROM product)
          GROUP BY i.productId
          ORDER BY i.productId ASC`;

        let productsNoTotal = await sails.sendNativeQuery(req, PRODUCT_IN_INVOICEPRODUCT_NOTOTAL_SQL, [startDate, endDate]);

        let PRODUCT_IN_INVOICERETURNPRODUCT_SQL =
          `SELECT i.productId, p.name as productName, SUM(i.quantity) as returnQuantity, SUM((i.finalAmount * i.quantity) - ((iv.discountAmount / iv.totalAmount)*(i.finalAmount * i.quantity))) as returnAmount, 
          SUM((i.finalAmount - i.costUnitPrice) * i.quantity - ((iv.discountAmount / iv.totalAmount)*(i.finalAmount * i.quantity))) as profitAmount
          FROM importcardproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN importcard iv ON iv.id = i.importCardId
          WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND importedAt BETWEEN $1 AND $2 AND totalAmount > 0 AND branchId = ${branchId})
          AND i.productId IN (SELECT id FROM product)
          GROUP BY i.productId
          ORDER BY i.productId ASC`;

        let returnProducts = await sails.sendNativeQuery(req, PRODUCT_IN_INVOICERETURNPRODUCT_SQL, [startDate, endDate]);

        let PRODUCT_IN_INVOICERETURNPRODUCT_NOTOTAL_SQL =
          `SELECT i.productId, p.name as productName, SUM(i.quantity) as returnQuantity, SUM(i.finalAmount * i.quantity) as returnAmount, SUM((i.finalAmount - i.costUnitPrice) * i.quantity ) as profitAmount
          FROM importcardproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN importcard iv ON iv.id = i.importCardId
          WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND importedAt BETWEEN $1 AND $2 AND totalAmount = 0 AND branchId = ${branchId})
          AND i.productId IN (SELECT id FROM product)
          GROUP BY i.productId
          ORDER BY i.productId ASC`;

        let returnProductsNoTotal = await sails.sendNativeQuery(req, PRODUCT_IN_INVOICERETURNPRODUCT_NOTOTAL_SQL, [startDate, endDate]);

        let arrProducts = {};

        _.forEach(products.rows, item => {
          arrProducts[item.productId] = { ...item, returnAmount: 0, returnQuantity: 0, deliveryAmount: 0 }
        })

        _.forEach(productsNoTotal.rows, item => {
          if (arrProducts[item.productId]) {
            let elem = arrProducts[item.productId];
            arrProducts[item.productId] = { ...elem, quantity: elem.quantity + item.quantity, totalAmount: elem.totalAmount + item.totalAmount, discountAmount: elem.discountAmount + item.discountAmount, taxAmount: elem.taxAmount + item.taxAmount, profitAmount: elem.profitAmount + item.profitAmount }
          }
          else arrProducts[item.productId] = { ...item, returnAmount: 0, returnQuantity: 0, deliveryAmount: 0 }
        })

        _.forEach(returnProducts.rows, item => {
          if (arrProducts[item.productId]) {
            arrProducts[item.productId] = { ...arrProducts[item.productId], ...item, profitAmount: arrProducts[item.productId].profitAmount - item.profitAmount }
          } else
            arrProducts[item.productId] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, profitAmount: -item.profitAmount }
        })

        _.forEach(returnProductsNoTotal.rows, item => {
          if (arrProducts[item.productId]) {
            arrProducts[item.productId] = { ...arrProducts[item.productId], ...item, profitAmount: arrProducts[item.productId].profitAmount - item.profitAmount, returnQuantity: arrProducts[item.productId].returnQuantity + item.returnQuantity, returnAmount: arrProducts[item.productId].returnAmount + item.returnAmount }
          } else
            arrProducts[item.productId] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, profitAmount: -item.profitAmount }
        })

        return exits.success({
          status: true,
          data: Object.values(arrProducts)
        })
      }

      case OPTIONS.USER: {

        let USER_IN_INVOICE_SQL =
          `SELECT SUM(i.totalAmount) as totalAmount, SUM(i.discountAmount) as discountAmount, SUM(i.taxAmount) as taxAmount, SUM(i.deliveryAmount) as deliveryAmount,
          COUNT(i.id) as count, u.fullName as name, u.id
          FROM invoice i
          LEFT JOIN user u ON u.id = i.createdBy
          WHERE i.createdBy IN (SELECT id FROM user) AND i.status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND i.deletedAt = 0 AND i.invoiceAt BETWEEN $1 AND $2 AND i.branchId = ${branchId}         
          GROUP BY i.createdBy
          ORDER BY i.createdBy ASC`;

        let invoice = await sails.sendNativeQuery(req, USER_IN_INVOICE_SQL, [startDate, endDate]);

        let USER_IN_INVOICERETURN_SQL =
          `SELECT SUM(i.finalAmount) as returnAmount, COUNT(i.id) as countReturn, u.fullName as name, u.id
          FROM importcard i
          LEFT JOIN invoice iv ON iv.code = i.reference
          LEFT JOIN user u ON u.id = iv.createdBy
          WHERE iv.createdBy IN (SELECT id FROM user) AND i.status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND i.deletedAt = 0 AND i.importedAt BETWEEN $1 AND $2 AND i.reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND i.branchId = ${branchId}        
          GROUP BY iv.createdBy
          ORDER BY iv.createdBy ASC`;

        let invoiceReturn = await sails.sendNativeQuery(req, USER_IN_INVOICERETURN_SQL, [startDate, endDate]);

        let USER_IN_COST_INVOICE_SQL =
          `SELECT SUM(i.finalAmount - (i.costUnitPrice * i.quantity) - ((n.discountAmount/n.totalAmount)*i.finalAmount)) as profitAmount, u.fullName as name, u.id
          FROM invoiceproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN invoice n ON n.id = i.invoiceId
          LEFT JOIN user u ON u.id = n.createdBy
          WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount > 0 AND invoiceAt BETWEEN $1 AND $2 AND branchId = ${branchId}) AND n.createdBy IN (SELECT id FROM user)
          AND i.productId IN (SELECT id FROM product)
          GROUP BY u.id
          ORDER BY u.id ASC`;

        let costInvoice = await sails.sendNativeQuery(req, USER_IN_COST_INVOICE_SQL, [startDate, endDate]);
        
        let USER_IN_COST_INVOICE_NOTOTAL_SQL =
          `SELECT SUM(i.finalAmount - (i.costUnitPrice * i.quantity)) as profitAmount, u.fullName as name, u.id
          FROM invoiceproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN invoice n ON n.id = i.invoiceId
          LEFT JOIN user u ON u.id = n.createdBy
          WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount = 0 AND invoiceAt BETWEEN $1 AND $2 AND branchId = ${branchId}) AND n.createdBy IN (SELECT id FROM user)
          AND i.productId IN (SELECT id FROM product)
          GROUP BY u.id
          ORDER BY u.id ASC`;

        let costInvoiceNoTotal = await sails.sendNativeQuery(req, USER_IN_COST_INVOICE_NOTOTAL_SQL, [startDate, endDate]);

        let USER_IN_COST_INVOICERETURN_SQL =
          `SELECT SUM((i.finalAmount - i.costUnitPrice) * i.quantity - ((n.discountAmount / n.totalAmount)*(i.finalAmount * i.quantity))) as profitAmount, u.fullName as name, u.id
          FROM importcardproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN importcard n ON n.id = i.importCardId
          LEFT JOIN invoice iv ON iv.code = n.reference
          LEFT JOIN user u ON u.id = iv.createdBy
          WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount > 0 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND importedAt BETWEEN $1 AND $2 AND branchId = ${branchId})
          AND iv.createdBy IN (SELECT id FROM user) 
          AND i.productId IN (SELECT id FROM product)
          GROUP BY u.id
          ORDER BY u.id ASC`;

        let costInvoiceReturn = await sails.sendNativeQuery(req, USER_IN_COST_INVOICERETURN_SQL, [startDate, endDate]);
        
        let USER_IN_COST_INVOICERETURN_NOTOTAL_SQL =
          `SELECT SUM((i.finalAmount - i.costUnitPrice) * i.quantity) as profitAmount, u.fullName as name, u.id
          FROM importcardproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN importcard n ON n.id = i.importCardId
          LEFT JOIN invoice iv ON iv.code = n.reference
          LEFT JOIN user u ON u.id = iv.createdBy
          WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount = 0 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND importedAt BETWEEN $1 AND $2 AND branchId = ${branchId})
          AND iv.createdBy IN (SELECT id FROM user) 
          AND i.productId IN (SELECT id FROM product)
          GROUP BY u.id
          ORDER BY u.id ASC`;

        let costInvoiceReturnNoTotal = await sails.sendNativeQuery(req, USER_IN_COST_INVOICERETURN_NOTOTAL_SQL, [startDate, endDate]);

        let arrUsers = {};

        _.forEach(invoice.rows, item => {
          arrUsers[item.id] = { ...item, returnAmount: 0, returnQuantity: 0, profitAmount: 0 }
        })

        _.forEach(invoiceReturn.rows, item => {
          if (arrUsers[item.id]) {
            arrUsers[item.id] = { ...arrUsers[item.id], ...item }
          } else
            arrUsers[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, profitAmount: 0 }
        })

        _.forEach(costInvoice.rows, item => {
          if (arrUsers[item.id]) {
            arrUsers[item.id] = { ...arrUsers[item.id], ...item }
          } else
            arrUsers[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, returnAmount: 0, returnQuantity: 0 }
        })

        _.forEach(costInvoiceNoTotal.rows, item => {
          if (arrUsers[item.id]) {
            arrUsers[item.id] = { ...arrUsers[item.id], ...item, profitAmount: arrUsers[item.id].profitAmount + item.profitAmount }
          } else
            arrUsers[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, returnAmount: 0, returnQuantity: 0 }
        })

        _.forEach(costInvoiceReturn.rows, item => {
          if (arrUsers[item.id]) {
            arrUsers[item.id] = { ...arrUsers[item.id], ...item, profitAmount: arrUsers[item.id].profitAmount - item.profitAmount }
          } else
            arrUsers[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, returnAmount: 0, returnQuantity: 0, profitAmount: - item.profitAmount }
        })

        _.forEach(costInvoiceReturnNoTotal.rows, item => {
          if (arrUsers[item.id]) {
            arrUsers[item.id] = { ...arrUsers[item.id], ...item, profitAmount: arrUsers[item.id].profitAmount - item.profitAmount }
          } else
            arrUsers[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, returnAmount: 0, returnQuantity: 0, profitAmount: - item.profitAmount }
        })

        return exits.success({
          status: true,
          data: Object.values(arrUsers)
        })
      }

      case OPTIONS.CUSTOMER: {

        let CUSTOMER_IN_INVOICE_SQL =
          `SELECT SUM(i.totalAmount) as totalAmount, SUM(i.discountAmount) as discountAmount, SUM(i.taxAmount) as taxAmount, SUM(i.deliveryAmount) as deliveryAmount,
          COUNT(i.id) as count , u.name, u.id
          FROM invoice i
          LEFT JOIN customer u ON u.id = i.customerId
          WHERE i.customerId IN (SELECT id FROM customer where type = 1) AND i.status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND i.deletedAt = 0 AND i.invoiceAt BETWEEN $1 AND $2 AND i.branchId = ${branchId}         
          GROUP BY i.customerId
          ORDER BY i.customerId ASC`;

        let invoice = await sails.sendNativeQuery(req, CUSTOMER_IN_INVOICE_SQL, [startDate, endDate]);

        let CUSTOMER_IN_INVOICERETURN_SQL =
          `SELECT SUM(r.finalAmount) as returnAmount, COUNT(r.id) as countReturn, u.name, u.id
          FROM importcard r
          LEFT JOIN invoice i ON i.code = r.reference
          LEFT JOIN customer u ON u.id = i.customerId
          WHERE r.reference IN (SELECT code FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0) AND
          i.customerId IN (SELECT id FROM customer where type = 1) AND r.branchId = ${branchId}
          AND r.status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND r.deletedAt = 0 AND r.importedAt BETWEEN $1 AND $2 AND r.reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN}          
          GROUP BY u.name
          ORDER BY u.name ASC`;

        let invoiceReturn = await sails.sendNativeQuery(req, CUSTOMER_IN_INVOICERETURN_SQL, [startDate, endDate]);

        let USER_IN_COST_INVOICE_SQL =
          `SELECT SUM(i.finalAmount - (i.costUnitPrice * i.quantity) - ((n.discountAmount/n.totalAmount)*i.finalAmount)) as profitAmount, u.name, u.id
          FROM invoiceproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN invoice n ON n.id = i.invoiceId
          LEFT JOIN customer u ON u.id = n.customerId
          WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount > 0 AND invoiceAt BETWEEN $1 AND $2 AND branchId = ${branchId}) AND n.customerId IN (SELECT id FROM customer)
          AND i.productId IN (SELECT id FROM product)
          GROUP BY u.id
          ORDER BY u.id ASC`;

        let costInvoice = await sails.sendNativeQuery(req, USER_IN_COST_INVOICE_SQL, [startDate, endDate]);

        let USER_IN_COST_INVOICE_NOTOTAL_SQL =
          `SELECT SUM(i.finalAmount - (i.costUnitPrice * i.quantity)) as profitAmount, u.name, u.id
          FROM invoiceproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN invoice n ON n.id = i.invoiceId
          LEFT JOIN customer u ON u.id = n.customerId
          WHERE i.invoiceId IN (SELECT id FROM invoice WHERE status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount = 0 AND invoiceAt BETWEEN $1 AND $2 AND branchId = ${branchId}) AND n.customerId IN (SELECT id FROM customer)
          AND i.productId IN (SELECT id FROM product)
          GROUP BY u.id
          ORDER BY u.id ASC`;

        let costInvoiceNoTotal = await sails.sendNativeQuery(req, USER_IN_COST_INVOICE_NOTOTAL_SQL, [startDate, endDate]);

        let USER_IN_COST_INVOICERETURN_SQL =
          `SELECT SUM((i.finalAmount - i.costUnitPrice) * i.quantity - ((n.discountAmount / n.totalAmount)*(i.finalAmount * i.quantity))) as profitAmount, u.name, u.id
          FROM importcardproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN importcard n ON n.id = i.importCardId
          LEFT JOIN customer u ON u.id = n.recipientId
          WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount > 0 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND importedAt BETWEEN $1 AND $2 AND branchId = ${branchId}) 
          AND n.recipientId IN (SELECT id FROM customer)
          AND i.productId IN (SELECT id FROM product)
          GROUP BY u.id
          ORDER BY u.id ASC`;

        let costInvoiceReturn = await sails.sendNativeQuery(req, USER_IN_COST_INVOICERETURN_SQL, [startDate, endDate]);
        
        let USER_IN_COST_INVOICERETURN_NOTOTAL_SQL =
          `SELECT SUM((i.finalAmount - i.costUnitPrice) * i.quantity ) as profitAmount, u.name, u.id
          FROM importcardproduct i
          LEFT JOIN product p ON p.id = i.productId
          LEFT JOIN importcard n ON n.id = i.importCardId
          LEFT JOIN customer u ON u.id = n.recipientId
          WHERE i.importCardId IN (SELECT id FROM importcard WHERE status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND deletedAt = 0 AND totalAmount = 0 AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN} AND importedAt BETWEEN $1 AND $2 AND branchId = ${branchId}) 
          AND n.recipientId IN (SELECT id FROM customer)
          AND i.productId IN (SELECT id FROM product)
          GROUP BY u.id
          ORDER BY u.id ASC`;

        let costInvoiceReturnNototal = await sails.sendNativeQuery(req, USER_IN_COST_INVOICERETURN_NOTOTAL_SQL, [startDate, endDate]);

        let arrCustomer = {};

        _.forEach(invoice.rows, item => {
          arrCustomer[item.id] = { ...item, returnAmount: 0, returnQuantity: 0, profitAmount: 0 }
        })

        _.forEach(invoiceReturn.rows, item => {
          if (arrCustomer[item.id]) {
            arrCustomer[item.id] = { ...arrCustomer[item.id], ...item }
          } else
            arrCustomer[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, profitAmount: 0 }
        })

        _.forEach(costInvoice.rows, item => {
          if (arrCustomer[item.id]) {
            arrCustomer[item.id] = { ...arrCustomer[item.id], ...item }
          } else
            arrCustomer[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, returnAmount: 0, returnQuantity: 0 }
        })

        _.forEach(costInvoiceNoTotal.rows, item => {
          if (arrCustomer[item.id]) {
            arrCustomer[item.id] = { ...arrCustomer[item.id], ...item, profitAmount: arrCustomer[item.id].profitAmount + item.profitAmount }
          } else
            arrCustomer[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, returnAmount: 0, returnQuantity: 0 }
        })

        _.forEach(costInvoiceReturn.rows, item => {
          if (arrCustomer[item.id]) {
            arrCustomer[item.id] = { ...arrCustomer[item.id], ...item, profitAmount: arrCustomer[item.id].profitAmount - item.profitAmount }
          } else
            arrCustomer[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, returnAmount: 0, returnQuantity: 0, profitAmount: - item.profitAmount }
        })

        _.forEach(costInvoiceReturnNototal.rows, item => {
          if (arrCustomer[item.id]) {
            arrCustomer[item.id] = { ...arrCustomer[item.id], ...item, profitAmount: arrCustomer[item.id].profitAmount - item.profitAmount }
          } else
            arrCustomer[item.id] = { ...item, totalAmount: 0, discountAmount: 0, quantity: 0, taxAmount: 0, deliveryAmount: 0, returnAmount: 0, returnQuantity: 0, profitAmount: - item.profitAmount }
        })

        return exits.success({
          status: true,
          data: Object.values(arrCustomer)
        })
      }

    }

  }
};
