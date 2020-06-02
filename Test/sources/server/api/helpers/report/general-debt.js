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
    let { startDate, endDate, type, isCheckDebt, branchId } = inputs.data;
    let { req } = inputs;
    // câu query sql cho thu chi theo khách hàng hoặc ncc
    let SQL_INCOME_EXPENSE = `SELECT SUM(i.amount) as amountIncExp, i.customerId, c.name, c.code
                              FROM incomeexpensecard i
                              LEFT JOIN customer c ON c.id = i.customerId
                              WHERE i.customerId IN (SELECT id FROM customer WHERE type = $3 and branchId = ${branchId}) AND i.incomeExpenseAt BETWEEN $1 AND $2 AND i.type = $4 AND i.customerType = $5 AND i.status = ${sails.config.constant.INCOME_EXPENSE_CARD_STATUS.FINISHED}
                              AND i.branchId = ${branchId}
                              GROUP BY i.customerId
                              ORDER BY i.customerId ASC`;    
             
    let arrData = {};
    // Tính nợ tổng quát theo khách hàng
    if ( type === sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER || type === sails.config.constant.CUSTOMER_TYPE.ALL ) {
      
      //Tổng xuất của từng khách hàng là tổng các phiếu đơn hàng
      let SQL_INVOICE = `SELECT SUM(i.finalAmount) as debtAmout, i.customerId, c.name, c.code
                        FROM invoice i
                        LEFT JOIN customer c ON c.id = i.customerId
                        WHERE i.customerId IN (SELECT id FROM customer where branchId = ${branchId}) AND i.invoiceAt BETWEEN $1 AND $2 AND i.status = ${sails.config.constant.INVOICE_CARD_STATUS.FINISHED} AND i.branchId = ${branchId}
                        GROUP BY i.customerId
                        ORDER BY i.customerId ASC`;
      let debtExport = await sails.sendNativeQuery(req, SQL_INVOICE, [startDate, endDate]);
      
      // Tổng nhập của từng khách hàng là tổng các phiếu trả hàng
      let SQL_INVOICE_RETURN = `SELECT SUM(i.finalAmount) as debtAmout, i.recipientId as customerId, c.name, c.code
                                FROM importcard i
                                LEFT JOIN customer c ON c.id = i.recipientId
                                WHERE i.recipientId IN (SELECT id FROM customer where branchId = ${branchId}) AND i.importedAt BETWEEN $1 AND $2 AND i.status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND reason = ${sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN}
                                AND i.branchId = ${branchId}
                                GROUP BY i.recipientId
                                ORDER BY i.recipientId ASC`;

      let debtImport = await sails.sendNativeQuery(req, SQL_INVOICE_RETURN, [startDate, endDate]);
      
      // Tổng công nợ do user điều chỉnh
      let SQL_CHANGE_DEBT = `SELECT SUM(i.changeValue) as changeAmount, i.customerId, c.name, c.code
                              FROM debt i
                              LEFT JOIN customer c ON c.id = i.customerId
                              WHERE i.customerId IN (SELECT id FROM customer where type = $3 AND branchId = ${branchId}) AND i.createdAt BETWEEN $1 AND $2 AND i.type = ${sails.config.constant.DEBT_TYPES.USER_CREATE}
                              GROUP BY i.customerId
                              ORDER BY i.customerId ASC`;
      let changeDebt = await sails.sendNativeQuery(req, SQL_CHANGE_DEBT, [startDate, endDate, sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER ]);
      
      // Tổng các phiếu thu của từng khách hàng
      let income = await sails.sendNativeQuery(req, SQL_INCOME_EXPENSE, 
        [startDate, endDate, sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER, sails.config.constant.INCOME_EXPENSE_TYPES.INCOME, sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER]);
      
      // Tổng các phiếu chi của từng khách hàng
      let expense = await sails.sendNativeQuery(req, SQL_INCOME_EXPENSE, 
        [startDate, endDate, sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER, sails.config.constant.INCOME_EXPENSE_TYPES.EXPENSE, sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER]);

      // Gộp từng khách hàng vào 1 đối tượng chứa tất cả khách hàng

        // tổng nhập xuất = tổng xuất - tổng nhập
        //tổng xuất
      _.forEach(debtExport.rows, item => {
        arrData[item.customerId] = {
          ...item,
          debtAmout: item.debtAmout,
          amountIncExp: 0,
          midDebt: item.debtAmout // Nợ trong kỳ = Tổng nhập xuất - Tổng thu chi - Tổng nợ điều chỉnh
        }
      })
      //tổng nhập
      _.forEach(debtImport.rows, item => {
        if (arrData[item.customerId]) 
          arrData[item.customerId] = {...arrData[item.customerId], debtAmout: arrData[item.customerId].debtAmout - item.debtAmout, midDebt: arrData[item.customerId].midDebt - item.debtAmout} 
        else arrData[item.customerId] = {...item, amountIncExp: 0, debtAmout: -item.debtAmout, midDebt: -item.debtAmout }
      })

      // Tổng thu chi = tổng thu - tổng chi
      // tổng phiếu thu
      _.forEach(income.rows, item => {
        if (arrData[item.customerId]) 
          arrData[item.customerId] = {...arrData[item.customerId], amountIncExp: item.amountIncExp, midDebt: arrData[item.customerId].midDebt - item.amountIncExp }
        else arrData[item.customerId] = {...item, debtAmout: 0, midDebt: - item.amountIncExp }
      })
      // tổng phiếu chi
      _.forEach(expense.rows, item => {
        if (arrData[item.customerId]) 
          arrData[item.customerId] = {...arrData[item.customerId], amountIncExp: arrData[item.customerId].amountIncExp - item.amountIncExp, midDebt: arrData[item.customerId].midDebt + item.amountIncExp }
        else arrData[item.customerId] = {...item, debtAmout: 0, amountIncExp: -item.amountIncExp, midDebt: item.amountIncExp }
      })
      // tính tổng nợ cuối kỳ có user điều chỉnh nợ
      _.forEach(changeDebt.rows, item => {
        if (arrData[item.customerId]) 
          arrData[item.customerId] = {...arrData[item.customerId], midDebt: arrData[item.customerId].midDebt + item.changeAmount }
        else arrData[item.customerId] = {...item, debtAmout: 0, amountIncExp: 0, midDebt: item.changeAmount }
      })
    }

    // Tính nợ tổng quát theo NCC
    if ( type === sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER || type === sails.config.constant.CUSTOMER_TYPE.ALL ) {
      // Tổng nhập của từng NCC là tổng các phiếu nhập hàng
      let SQL_IMPORT = `SELECT SUM(i.finalAmount) as debtAmout, i.recipientId as customerId, c.name, c.code
                        FROM importcard i
                        LEFT JOIN customer c ON c.id = i.recipientId 
                        WHERE i.recipientId IN (SELECT id FROM customer where branchId = ${branchId}) AND i.importedAt BETWEEN $1 AND $2 AND i.status = ${sails.config.constant.IMPORT_CARD_STATUS.FINISHED} AND reason = ${sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER}
                        AND i.branchId = ${branchId}
                        GROUP BY i.recipientId
                        ORDER BY i.recipientId ASC`;

      let debtImport = await sails.sendNativeQuery(req, SQL_IMPORT, [startDate, endDate]);

      // Tổng xuất của từng NCC là tổng các phiếu trả hàng nhập
      let SQL_IMPORT_RETURN = `SELECT SUM(i.finalAmount) as debtAmout, i.recipientId as customerId, c.name, c.code
                              FROM exportcard i
                              LEFT JOIN customer c ON c.id = i.recipientId
                              WHERE i.recipientId IN (SELECT id FROM customer where branchId = ${branchId}) AND i.exportedAt BETWEEN $1 AND $2 AND i.status = ${sails.config.constant.EXPORT_CARD_STATUS.FINISHED} AND reason = ${sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER}
                              AND i.branchId = ${branchId}
                              GROUP BY i.recipientId
                              ORDER BY i.recipientId ASC`;      

      let debtExport = await sails.sendNativeQuery(req, SQL_IMPORT_RETURN, [startDate, endDate]);
      //Tổng các phiếu thu của từng NCC
      let income = await sails.sendNativeQuery(req, SQL_INCOME_EXPENSE, 
        [startDate, endDate, sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER, sails.config.constant.INCOME_EXPENSE_TYPES.INCOME, sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER]);
      //Tổng các phiếu chi của từng NCC
      let expense = await sails.sendNativeQuery(req, SQL_INCOME_EXPENSE, 
        [startDate, endDate, sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER, sails.config.constant.INCOME_EXPENSE_TYPES.EXPENSE, sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER]);
      // Tổng công nợ do user điều chỉnh
      let SQL_CHANGE_DEBT = `SELECT SUM(i.changeValue) as changeAmount, i.customerId, c.name, c.code
                              FROM debt i
                              LEFT JOIN customer c ON c.id = i.customerId
                              WHERE i.customerId IN (SELECT id FROM customer where type = $3 and branchId = ${branchId}) AND i.createdAt BETWEEN $1 AND $2 AND i.type = ${sails.config.constant.DEBT_TYPES.USER_CREATE}
                              GROUP BY i.customerId
                              ORDER BY i.customerId ASC`;
      let changeDebt = await sails.sendNativeQuery(req, SQL_CHANGE_DEBT, [startDate, endDate, sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER ]);

      // Gộp từng NCC vào 1 đối tượng chứa tất cả NCC
      
      // tổng nhập xuất = tổng nhập - tổng xuất
      // tổng nhập
      _.forEach(debtImport.rows, item => {
        arrData[item.customerId] = {
          ...item,
          debtAmout: item.debtAmout,
          amountIncExp: 0,
          midDebt: item.debtAmout // Nợ trong kỳ = Tổng nhập xuất - Tổng thu chi - Tổng nợ điều chỉnh
        }
      })
      // tổng xuất
      _.forEach(debtExport.rows, item => {
        if (arrData[item.customerId]) 
          arrData[item.customerId] = { ...arrData[item.customerId], debtAmout: arrData[item.customerId].debtAmout - item.debtAmout, midDebt: arrData[item.customerId].midDebt - item.debtAmout }
        else arrData[item.customerId] = { ...item, amountIncExp: 0, debtAmout: -item.debtAmout, midDebt: -item.debtAmout }
      })
      
      // Tổng thu chi = tổng chi - tổng thu
      // Phiếu thu
      _.forEach(income.rows, item => {
        if (arrData[item.customerId]) 
          arrData[item.customerId] = {...arrData[item.customerId], amountIncExp: -item.amountIncExp, midDebt: arrData[item.customerId].midDebt + item.amountIncExp }
        else arrData[item.customerId] = {...item, debtAmout: 0, amountIncExp: -item.amountIncExp, midDebt: item.amountIncExp }
      })
      // Phiếu chi
      _.forEach(expense.rows, item => {
        if (arrData[item.customerId]) 
          arrData[item.customerId] = {...arrData[item.customerId], amountIncExp: arrData[item.customerId].amountIncExp + item.amountIncExp, midDebt: arrData[item.customerId].midDebt - item.amountIncExp }
        else arrData[item.customerId] = {...item, debtAmout: 0, midDebt: -item.amountIncExp }
      })
      
      // tính tổng nợ cuối kỳ có user điều chỉnh nợ
      _.forEach(changeDebt.rows, item => {
        if (arrData[item.customerId]) 
          arrData[item.customerId] = {...arrData[item.customerId], midDebt: arrData[item.customerId].midDebt + item.changeAmount }
        else arrData[item.customerId] = {...item, debtAmout: 0, amountIncExp: 0, midDebt: item.changeAmount }
      })
      
    }
    // Kiếm công nợ cuối cùng của từng khách hàng và NCC trước thời gian trong kỳ
    let arrBeginDebt = await Promise.all(_.map(arrData, async item => {
      let foundDebt = await Debt.find(req, {
        where: { customerId: item.customerId, createdAt: { "<=": startDate } },
        sort: 'createdAt desc',
        limit: 1
      })

      return foundDebt.length > 0 ? foundDebt[0] : { customerId: item.customerId, remainingValue: 0 };
    }))    
    // Tính công nợ cuối kỳ, đầu kỳ của từng khách hàng và NCC
    _.forEach(arrBeginDebt, item => {
      arrData[item.customerId] = {
        ...arrData[item.customerId],
        beginDebt: item.remainingValue,
        lastDebt: item.remainingValue + arrData[item.customerId].midDebt// Nợ cuối kỳ = Nợ đầu kỳ + Nợ trong kỳ
      }
    })    
    // Dư nợ trong kỳ nếu người xem muốn coi
    if (isCheckDebt) {
      _.forEach(arrData, item => {
        if ( item.midDebt <= 0 ) delete arrData[item.customerId];
      })
    }

    exits.success({ status: true, data: Object.values(arrData) })
  }
}