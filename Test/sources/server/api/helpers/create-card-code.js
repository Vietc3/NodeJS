
const defaultDateTimeFormat = 'DDMMYYYY';
function formatDateTime (cardCode, time) {
  if(cardCode.includes("{datetime}")) {
    return cardCode.replace(new RegExp(`{datetime}`, 'g'), _.moment(time).format(defaultDateTimeFormat));
  } else if(cardCode.includes("{datetime:")){
    let dateTimeFormat = cardCode.substring(
      cardCode.indexOf("{datetime:") + "{datetime:".length, 
      cardCode.indexOf("}", cardCode.indexOf("{datetime:"))
    );
    
    return cardCode.replace(new RegExp(`{datetime:${dateTimeFormat}}`, 'g'), _.moment(time).format(dateTimeFormat.length ? dateTimeFormat : defaultDateTimeFormat));
  }
  
  return cardCode;
}
function formatCustomerCounter (cardCode, count) {
  let defaultPad = 2; 
  if(cardCode.includes('{customer_counter}')) {
    return cardCode.replace(new RegExp("{customer_counter}", 'g'), _.pad(count, defaultPad));
  } else if(cardCode.includes('{customer_counter:')) {
    let format = cardCode.substring(
      cardCode.indexOf("{customer_counter:") + "{customer_counter:".length, 
      cardCode.indexOf("}", cardCode.indexOf("{customer_counter:"))
    );
    return cardCode.replace(new RegExp("{customer_counter:"+format+"}", 'g'), _.pad(count, format.length ? format : defaultPad));
  }

  return cardCode;
}
function formatCustomerCounterDay (cardCode, count, pad) {
  let paramStr = "{customer_counter_by:";
  if(cardCode.includes(paramStr)) {
    let format = cardCode.substring(
      cardCode.indexOf(paramStr), 
      cardCode.indexOf("}", cardCode.indexOf(paramStr)) + 1
    );
    return cardCode.replace(new RegExp(format, 'g'), _.pad(count, pad));
  }

  return cardCode;
}
function splitCustomerCounterBy(cardCode) {
  let defaultPad = 2; 
  let paramStr = "{customer_counter_by";
  let params = cardCode.substring(
    cardCode.indexOf(paramStr) + paramStr.length, 
    cardCode.indexOf("}", cardCode.indexOf(paramStr))
  );
  params = params.replace(/\:/g, '') ;
  params = params.split(',');
  let period = params[0];
  let format = params[1] || defaultPad;
  return {period, format};
}

module.exports = {
  description: "tạo mã tự sinh các phiếu",

  inputs: {
    req: {
      type: 'ref',
      required: true
    },
    data: {
      type: 'json'
    },
  },

  fn: async function (inputs, exits) {
    let {
      req,
      data
    } = inputs;
    let {cardType, newId, customerType} = data;
    let defaultPrefix = sails.config.cardcode[cardType + "FirstCode"]; 
    
    let foundCardCodeConfig = await StoreConfig.findOne(req, {type: "card_code"});
    if(!foundCardCodeConfig) {
      return exits.success({status: false, message: sails.__("Không thể sinh mã tự động")});
    }
    
    let cardCodeFormat = (_.isJson(foundCardCodeConfig.value) ? JSON.parse(foundCardCodeConfig.value) : {})[cardType] || ("{prefix:" + defaultPrefix + "}{ID}");
    
    let prefix = defaultPrefix;
    if(cardCodeFormat.includes('{prefix}')) {
      cardCodeFormat = cardCodeFormat.replace(new RegExp("{prefix}", 'g'), prefix);
    } else if(cardCodeFormat.includes('{prefix:')) {
      prefix = cardCodeFormat.substring(
        cardCodeFormat.indexOf("{prefix:") + "{prefix:".length, 
        cardCodeFormat.indexOf("}", cardCodeFormat.indexOf("{prefix:"))
      );
      if(!prefix.length) prefix = defaultPrefix
      cardCodeFormat = cardCodeFormat.replace(new RegExp("{prefix:"+prefix+"}", 'g'), prefix);
    }
    
    let foundCounter = await sails.sendNativeQuery(
      req, 
      `select id, value from counter where code = '${cardType}_${prefix}'`
    );
    foundCounter.rows[0] = foundCounter.rows[0] || {};
    counterId = foundCounter.rows[0].id;
    foundCounter = foundCounter.rows[0].value;
    foundCounter = _.isJson(foundCounter) ? JSON.parse(foundCounter) : {};
    foundCounter.id = foundCounter.id ? parseFloat(foundCounter.id) : 0;
    
    if(cardCodeFormat.includes("{id}")) {
      foundCounter.id += 1;
      cardCodeFormat = cardCodeFormat.replace(new RegExp("{id}", 'g'), foundCounter.id)
    }
    if(cardCodeFormat.includes("{ID}")) {
      cardCodeFormat = cardCodeFormat.replace(new RegExp("{ID}", 'g'), newId)
    }
    
    // invoice
    if(cardType === sails.config.constant.CARD_TYPE.invoice) {
      let foundCard = await Invoice.findOne(req, {id: newId});
      let invoiceAt = foundCard.invoiceAt;
      if(cardCodeFormat.includes("{customer_counter")) {
        let count = await Invoice.count(req, {customerId: foundCard.customerId, deletedAt: 0})
        cardCodeFormat = formatCustomerCounter(cardCodeFormat, count);
      }
      if(cardCodeFormat.includes("{customer_counter_by:")) {
        let {format, period} = splitCustomerCounterBy(cardCodeFormat);
        let countDay = await Invoice.count(req, {id: {nin: [newId]}, customerId: foundCard.customerId, deletedAt: 0, invoiceAt: { "<=": _.moment(invoiceAt).endOf(period).valueOf(), ">=": _.moment(invoiceAt).startOf(period).valueOf()}});
        cardCodeFormat = formatCustomerCounterDay(cardCodeFormat, countDay + 1, format);
      }
      if(cardCodeFormat.includes("{customer_code}")) {
        let foundCustomer = await Customer.findOne(req, {id: foundCard.customerId})
        cardCodeFormat = cardCodeFormat.replace(new RegExp("{customer_code}", 'g'), foundCustomer.code);
      }
      
      cardCodeFormat = formatDateTime(cardCodeFormat, invoiceAt);
    }
    
    // import
    if(cardType === sails.config.constant.CARD_TYPE.importCard) {
      let foundCard = await ImportCard.findOne(req, {id: newId, reason: sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu nhập")});
      }
      let importedAt = foundCard.importedAt;
      if(cardCodeFormat.includes("{customer_counter")) {
        let count = await ImportCard.count(req, {recipientId: foundCard.customerId, reason: sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER, deletedAt: 0});
        cardCodeFormat = formatCustomerCounter(cardCodeFormat, count);
      }
      if(cardCodeFormat.includes("{customer_counter_day")) {
        let countDay = await ImportCard.count(req, {id: {nin: [newId]}, recipientId: foundCard.customerId, reason: sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER, deletedAt: 0, importedAt: { "<=": _.moment(importedAt).endOf('day').valueOf(), ">=": _.moment(importedAt).startOf('day').valueOf()}});
        cardCodeFormat = formatCustomerCounterDay(cardCodeFormat, countDay);
      }
      if(cardCodeFormat.includes("{customer_code}")) {
        let foundCustomer = await Customer.findOne(req, {id: foundCard.recipientId})
        cardCodeFormat = cardCodeFormat.replace(new RegExp("{customer_code}", 'g'), foundCustomer.code);
      }
      
      cardCodeFormat = formatDateTime(cardCodeFormat, importedAt);
    }
    
    // invoice return
    if(cardType === sails.config.constant.CARD_TYPE.invoiceReturn) {
      let foundCard = await ImportCard.findOne(req, {id: newId, reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu nhập")});
      }
      let importedAt = foundCard.importedAt;
      
      if(cardCodeFormat.includes("{customer_counter")) {
        let count = await ImportCard.count(req, {recipientId: foundCard.customerId, reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN, deletedAt: 0});
        cardCodeFormat = formatCustomerCounter(cardCodeFormat, count);
      }
      if(cardCodeFormat.includes("{customer_counter_day")) {
        let countDay = await ImportCard.count(req, {id: {nin: [newId]}, recipientId: foundCard.customerId, reason: sails.config.constant.IMPORT_CARD_REASON.INVOICE_RETURN, deletedAt: 0, importedAt: { "<=": _.moment(importedAt).endOf('day').valueOf(), ">=": _.moment(importedAt).startOf('day').valueOf()}});
        cardCodeFormat = formatCustomerCounterDay(cardCodeFormat, countDay);
      }
      if(cardCodeFormat.includes("{customer_code}")) {
        let foundCustomer = await Customer.findOne(req, {id: foundCard.recipientId})
        cardCodeFormat = cardCodeFormat.replace(new RegExp("{customer_code}", 'g'), foundCustomer.code);
      }
      cardCodeFormat = formatDateTime(cardCodeFormat, importedAt);
    }
    
    // import return
    if(cardType === sails.config.constant.CARD_TYPE.importReturn) {
      let foundCard = await ExportCard.findOne(req, {id: newId, reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu trả hàng nhập")});
      }
      let exportedAt = foundCard.exportedAt;
      
      if(cardCodeFormat.includes("{customer_counter")) {
        let count = await ExportCard.count(req, {recipientId: foundCard.customerId, reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER, deletedAt: 0});
        cardCodeFormat = formatCustomerCounter(cardCodeFormat, count);
      }
      if(cardCodeFormat.includes("{customer_counter_day")) {
        let countDay = await ExportCard.count(req, {id: {nin: [newId]}, recipientId: foundCard.customerId, reason: sails.config.constant.EXPORT_CARD_REASON.RETURN_PROVIDER, deletedAt: 0, exportedAt: { "<=": _.moment(exportedAt).endOf('day').valueOf(), ">=": _.moment(exportedAt).startOf('day').valueOf()}});
        cardCodeFormat = formatCustomerCounterDay(cardCodeFormat, countDay);
      }
      if(cardCodeFormat.includes("{customer_code}")) {
        let foundCustomer = await Customer.findOne(req, {id: foundCard.recipientId})
        cardCodeFormat = cardCodeFormat.replace(new RegExp("{customer_code}", 'g'), foundCustomer.code);
      }
      
      cardCodeFormat = formatDateTime(cardCodeFormat, exportedAt);
    }
    
    // invoice order card
    if(cardType === sails.config.constant.CARD_TYPE.invoiceOrderCard) {
      let foundCard = await OrderCard.findOne(req, {id: newId, type: sails.config.constant.ORDER_CARD_TYPE.INVOICE});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu đặt hàng")});
      }
      let orderAt = foundCard.orderAt;
      
      if(cardCodeFormat.includes("{customer_counter")) {
        let count = await OrderCard.count(req, {customerId: foundCard.customerId, type: sails.config.constant.ORDER_CARD_TYPE.INVOICE, deletedAt: 0});
        cardCodeFormat = formatCustomerCounter(cardCodeFormat, count);
      }
      if(cardCodeFormat.includes("{customer_counter_day")) {
        let countDay = await OrderCard.count(req, {id: {nin: [newId]}, customerId: foundCard.customerId, type: sails.config.constant.ORDER_CARD_TYPE.INVOICE, deletedAt: 0, orderAt: { "<=": _.moment(orderAt).endOf('day').valueOf(), ">=": _.moment(orderAt).startOf('day').valueOf()}});
        cardCodeFormat = formatCustomerCounterDay(cardCodeFormat, countDay + 1);
      }
      if(cardCodeFormat.includes("{customer_code}")) {
        let foundCustomer = await Customer.findOne(req, {id: foundCard.customerId})
        cardCodeFormat = cardCodeFormat.replace(new RegExp("{customer_code}", 'g'), foundCustomer.code);
      }
      
      cardCodeFormat = formatDateTime(cardCodeFormat, orderAt);
    }
    
    // import order card
    if(cardType === sails.config.constant.CARD_TYPE.importOrderCard) {
      let foundCard = await OrderCard.findOne(req, {id: newId, type: sails.config.constant.ORDER_CARD_TYPE.IMPORT});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu đặt hàng nhập")});
      }
      let orderAt = foundCard.orderAt;
      
      if(cardCodeFormat.includes("{customer_counter")) {
        let count = await OrderCard.count(req, {customerId: foundCard.customerId, type: sails.config.constant.ORDER_CARD_TYPE.IMPORT, deletedAt: 0});
        cardCodeFormat = formatCustomerCounter(cardCodeFormat, count);
      }
      if(cardCodeFormat.includes("{customer_counter_day")) {
        let countDay = await OrderCard.count(req, {id: {nin: [newId]}, customerId: foundCard.customerId, type: sails.config.constant.ORDER_CARD_TYPE.IMPORT, deletedAt: 0, orderAt: { "<=": _.moment(orderAt).endOf('day').valueOf(), ">=": _.moment(orderAt).startOf('day').valueOf()}});
        cardCodeFormat = formatCustomerCounterDay(cardCodeFormat, countDay);
      }
      if(cardCodeFormat.includes("{customer_code}")) {
        let foundCustomer = await Customer.findOne(req, {id: foundCard.customerId})
        cardCodeFormat = cardCodeFormat.replace(new RegExp("{customer_code}", 'g'), foundCustomer.code);
      }
      
      cardCodeFormat = formatDateTime(cardCodeFormat, orderAt);
    }
    
    // move stock card
    if(cardType === sails.config.constant.CARD_TYPE.moveStock) {
      let foundCard = await MoveStockCard.findOne(req, {id: newId});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu chuyên kho")});
      }
      let movedAt = foundCard.movedAt;

      cardCodeFormat = formatDateTime(cardCodeFormat, movedAt);
    }
    
    // manufacturing card
    if(cardType === sails.config.constant.CARD_TYPE.manufacturingCard) {
      let foundCard = await ManufacturingCard.findOne(req, {id: newId});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu sản xuất")});
      }
      
      cardCodeFormat = formatDateTime(cardCodeFormat, foundCard.createdAt);
    }
    
    // stock check card
    if(cardType === sails.config.constant.CARD_TYPE.stockCheckCard) {
      let foundCard = await StockCheckCard.findOne(req, {id: newId});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu kiểm kho")});
      }
      let checkedAt = foundCard.checkedAt;
      
      cardCodeFormat = formatDateTime(cardCodeFormat, checkedAt);
    }
    
    // income card
    if(cardType === sails.config.constant.CARD_TYPE.income) {
      let foundCard = await IncomeExpenseCard.findOne(req, {id: newId});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu thu")});
      }
      let incomeExpenseAt = foundCard.incomeExpenseAt;
      
      if(cardCodeFormat.includes("{customer_counter")) {
        let count = await IncomeExpenseCard.count(req, {customerId: foundCard.customerId, customerType, deletedAt: 0});
        cardCodeFormat = formatCustomerCounter(cardCodeFormat, count);
      }
      if(cardCodeFormat.includes("{customer_counter_day")) {
        let countDay = await IncomeExpenseCard.count(req, {id: {nin: [newId]}, customerId: foundCard.customerId, customerType, deletedAt: 0, incomeExpenseAt: { "<=": _.moment(incomeExpenseAt).endOf('day').valueOf(), ">=": _.moment(incomeExpenseAt).startOf('day').valueOf()}});
        cardCodeFormat = formatCustomerCounterDay(cardCodeFormat, countDay);
      }
      if(cardCodeFormat.includes("{customer_code}")) {
        let customerCode = "";
        if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER || customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER) {
          let foundCustomer = await Customer.findOne(req, {id: foundCard.customerId});
          customerCode = foundCustomer.code;
        }
        if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.STAFF) {
          customerCode = 'USER';
        }
        if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.OTHER) {
          customerCode = 'OTHER';
        }
        
        cardCodeFormat = cardCodeFormat.replace(new RegExp("{customer_code}", 'g'), customerCode);
      }
      
      cardCodeFormat = formatDateTime(cardCodeFormat, incomeExpenseAt);
    }
    
    // expense card
    if(cardType === sails.config.constant.CARD_TYPE.expense) {
      let foundCard = await IncomeExpenseCard.findOne(req, {id: newId});
      if(!foundCard) {
        return exits.success({status: false, message: sails.__("Không tìm thấy phiếu chi")});
      }
      let incomeExpenseAt = foundCard.incomeExpenseAt;
      
      if(cardCodeFormat.includes("{customer_counter")) {
        let count = await IncomeExpenseCard.count(req, {customerId: foundCard.customerId, customerType, deletedAt: 0});
        cardCodeFormat = formatCustomerCounter(cardCodeFormat, count);
      }
      if(cardCodeFormat.includes("{customer_counter_day")) {
        let countDay = await IncomeExpenseCard.count(req, {id: {nin: [newId]}, customerId: foundCard.customerId, customerType, deletedAt: 0, incomeExpenseAt: { "<=": _.moment(incomeExpenseAt).endOf('day').valueOf(), ">=": _.moment(incomeExpenseAt).startOf('day').valueOf()}});
        cardCodeFormat = formatCustomerCounterDay(cardCodeFormat, countDay);
      }
      if(cardCodeFormat.includes("{customer_code}")) {
        let customerCode = "";
        if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER || customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER) {
          let foundCustomer = await Customer.findOne(req, {id: foundCard.customerId});
          customerCode = foundCustomer.code;
        }
        if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.STAFF) {
          customerCode = 'USER';
        }
        if(customerType === sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.OTHER) {
          customerCode = 'OTHER';
        }
        
        cardCodeFormat = cardCodeFormat.replace(new RegExp("{customer_code}", 'g'), customerCode);
      }
      
      cardCodeFormat = formatDateTime(cardCodeFormat, incomeExpenseAt);
    }
    
    let updatedCounter = await sails.sendNativeQuery(
      req, 
      counterId ? `update counter set value = '${JSON.stringify(foundCounter)}' where id = ${counterId}`
      : `insert into counter (code, value) values ('${cardType}_${prefix}', '${JSON.stringify(foundCounter)}')`);
    
    return exits.success({status: true, data: cardCodeFormat})
  }
};
  