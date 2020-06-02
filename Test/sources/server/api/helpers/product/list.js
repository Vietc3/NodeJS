module.exports = {
  description: 'create product',

  inputs: {
    req: {
      type: "ref"
    },
    data: {
      type: "ref",
      required: true
    }
  },

  fn: async function (inputs, exits) {
    let { filter, sort, limit, skip, manualFilter, manualSort, select, branchId, selectArrayId, groupBy, time } = inputs.data;
    let { req } = inputs;

    // Lấy danh sách kho thuộc branchId
    let stockList = await Stock.find(req, {deletedAt: 0, branchId}).intercept({ name: 'UsageError' }, () => {
      return exits.success({status: false, message: sails.__(sails.config.constant.INTERCEPT.UsageError) });
    });
    if(!stockList.length) {
      return exits.success({
        status: false,
        message: sails.__("Không tìm thấy kho của chi nhánh")
      })
    }
    
    let stockQuantityList = [];
    for (let stock of stockList) {
      stockQuantityList.push("productstock." + sails.config.constant.STOCK_QUANTITY_LIST[stock.stockColumnIndex]);
    }

    if(manualFilter && (manualFilter.quota || manualFilter.status)){
      //Kiểm tra tồn kho tối thiểu
      if(manualFilter.quota === sails.config.constant.LOW_STOCK_STATUS.LOW){
        manualFilter={...manualFilter, ["productstock.stockMin"]: {'>': stockQuantityList.join(" + ")}}
      } else if(manualFilter.quota === sails.config.constant.LOW_STOCK_STATUS.ENOUGH){
        manualFilter={...manualFilter, ["productstock.stockMin"]: {'<=': stockQuantityList.join(" + ")}}
      }
      delete manualFilter.quota;
      
      //kiểm tra trạng thái kinh doanh
      if(manualFilter.status === sails.config.constant.PRODUCT_STOPPED_STATUS.STOPPED){
        manualFilter={...manualFilter, stoppedAt: {'>': 0}}
      } else if(manualFilter.status === sails.config.constant.PRODUCT_STOPPED_STATUS.NONE){
        manualFilter={...manualFilter, stoppedAt: 0}
      }
      delete manualFilter.status;
    }

    filter = _.extend(filter || {}, { deletedAt: 0 });    
        
    let options = {
      select: select || [
        '*',
        'unitId.name', 
        'unitId.id', 
        'productTypeId.id', 
        'productTypeId.name', 
        'customerId.id', 
        'customerId.name',
        'productprice.costUnitPrice',
        'productprice.lastImportPrice',
        'productprice.saleUnitPrice',
        'productstock.manufacturingQuantity',
        '(' + stockQuantityList.join(' + ') + ') as sumQuantity',
        'productstock.stockMin'
      ].concat(Object.values(sails.config.constant.STOCK_QUANTITY_LIST).map(item => 'productstock.' + item)),
      model: Product, 
      filter: {...filter, ...manualFilter, ["productprice.branchId"]: branchId, ["productstock.branchId"]: branchId}, 
      populates: ['unitId', 'productTypeId', 'customerId'],
      customPopulates: `left join productprice on productprice.productId = m.id left join productstock on productstock.productId = m.id`,
      customFilterField: {'sumQuantity': [stockQuantityList.join(' + ')]},
      limit,
      skip,
      sort: sort || 'updatedAt DESC',
      groupBy,
      selectArrayId,
      count: true
    };
    
    let {foundData, count} = await sails.helpers.customSendNativeQuery(req, options);   
         
    foundData.forEach( item => {
      item.costUnitPrice = (item.productprice && item.productprice.costUnitPrice) || 0;
      item.lastImportPrice = (item.productprice && item.productprice.lastImportPrice) || 0;
      item.saleUnitPrice = (item.productprice && item.productprice.saleUnitPrice) || 0;
      item.manufacturingQuantity = (item.productstock && item.productstock.manufacturingQuantity) || 0;
      item.stockMin = (item.productstock && item.productstock.stockMin) || 0;
      
      Object.values(sails.config.constant.STOCK_QUANTITY_LIST).map(stock => {
        item[stock] = (item.productstock && item.productstock[stock]) || 0;
      })
    })
    
    foundProducts = foundData;
    return exits.success({ status: true, data: foundProducts, count, time: time});
  }
}