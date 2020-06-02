module.exports = {

  friendlyName: 'Import  products',

  description: 'Import products',

  inputs: {
    products: {
      type: "json"
    },
    formula: {
      type: "json"
    },
    stopOnCodeDuplicateError: {
      type: "number"
    },
  },

  fn: async function (inputs) {
    let {
      formula,
      products,
      stopOnCodeDuplicateError,
    } = inputs;
    
    products = JSON.parse(products);

    if (formula) {
      formula = JSON.parse(formula);
    }

    let createdProducts = [];
    let createAndUpdateProducts = [];
    let createdFormulas = [];
    let failProducts = [];
    let failedFormulas = [];
    let arrCode = [];
    let error = [];
    let branchId = this.req.headers['branch-id'];
    let foundProducts = [];
    let addFormulas = [];
    let stockList = await sails.helpers.stockList.list(this.req, {filter: {branchId: branchId}});
    if(stockList.status){
      products.forEach(item => {
        stockList.data.forEach((ele, index) => {
          if(ele.name.toLowerCase() === item.stock.toLowerCase() || item.stock === "")
            item.stockId = item.stock === "" ? 1 : ele.id;
        })
        if(item.stockId === undefined) error.push({ code: item.code, name: item.name, reason: sails.__("Chi nhánh hiện tại không thuộc kho") + ` \"${item.stock}\"` })
      })
    }

    if (!stopOnCodeDuplicateError) {

      products.map(item => {
        arrCode.push(item.code)
  
        if(item.code){
          let checkExistPrefix = sails.helpers.common.checkPrefixCode(sails.config.cardcode.product, item.code);
          if(!checkExistPrefix.status){
            error.push({ code: item.code, name: item.name, reason: checkExistPrefix.message });
          }
        }
      });

      failProducts = await Product.find(this.req, { where: { code: arrCode, deletedAt: 0 } });

      if(failProducts.length > 0 || error.length > 0)
        failProducts.map(item => {if(!error.some(ele => ele.code === item.code)) error.push({ code: item.code, name: item.name, reason: sails.__("Trùng mã") })})
    }

    if(error.length > 0){
      this.res.json({
        status: false,
        error: error
      });
      return;
    }

    for (let product of products) {
      let type = product['type'].toLowerCase() === sails.config.constant.PRODUCT_TYPES_NAME.merchandise ? sails.config.constant.PRODUCT_TYPES.merchandise : sails.config.constant.PRODUCT_TYPES.service;
      let foundUnitId = await createProductUnit(this.req, product, this.req.loggedInUser.id);
      let foundProductType = await createProductType(this.req, product, this.req.loggedInUser.id);
      let foundSupplier = await createProductSupplier(this.req, product, this.req.loggedInUser.id, branchId);
      let foundProduct = await Product.findOne(this.req, { code: product['code'] });
      let description = product['description'] || ""

      if (description) {        
        let description_copy = description;
        description = description_copy.replace(/\n/g, "<br/>");
      }

      if (foundProduct) {

        let foundProductStock = await sails.helpers.product.getQuantity(this.req, {productId: foundProduct.id, branchId: branchId});
        let foundProductPrice = await sails.helpers.product.getPrice(this.req, {productId: foundProduct.id, branchId: branchId});
        let foundStock = await Stock.findOne(this.req, { id: product.stockId });

        foundProducts.push({
          ...foundProduct, 
          costUnitPrice: foundProductPrice.costUnitPrice,
          saleUnitPrice: foundProductPrice.saleUnitPrice,
          stockQuantity: foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[product.stockId]],
          branchId: branchId,
          stockId: product.stockId
        })

        foundProduct = await sails.helpers.product.update(this.req, {
          id: foundProduct.id,
          name: product['name'],
          code: product['code'].toUpperCase(),
          costUnitPrice: product['costUnitPrice'] === "" ? foundProductPrice.costUnitPrice : product['costUnitPrice'],
          unitId: foundUnitId.id,
          saleUnitPrice: product['saleUnitPrice'] === "" ? foundProductPrice.saleUnitPrice : product['saleUnitPrice'],
          productTypeId: foundProductType.id,
          customerId: (foundSupplier && foundSupplier.id) ? foundSupplier.id : null,
          quantity: product['stockQuantity'] === "" ? foundProductStock[sails.config.constant.STOCK_QUANTITY_LIST[foundStock.stockColumnIndex]] : Number(product['stockQuantity']),
          createdBy: this.req.loggedInUser.id,
          updatedBy: this.req.loggedInUser.id,
          description: description,
          branchId: branchId,
          stockId: product.stockId,
          type: type
        });

        if(!foundProduct.status){
          foundProduct.data = {name: product['name'], code: product['code'], reason: foundProduct.message}
        }
        
      } else {

        foundProduct = await sails.helpers.product.create(this.req, {
          name: product['name'],
          code: product['code'],
          costUnitPrice: product['costUnitPrice'] || 0,
          unitId: foundUnitId.id || "",
          saleUnitPrice: product['saleUnitPrice'] || 0,
          productTypeId: foundProductType.id || "",
          customerId: (foundSupplier && foundSupplier.id) ? foundSupplier.id : null,
          quantity: Number(product['stockQuantity']) || 0,
          createdBy: this.req.loggedInUser.id,
          updatedBy: this.req.loggedInUser.id,
          description: description,
          branchId: branchId,
          stockId: product.stockId,
          type: type
        });

        if(!foundProduct.status){
          foundProduct.data = {name: product['name'], code: product['code'], reason: foundProduct.message}
        }
      }

      createdProducts.push({...foundProduct, data:{...foundProduct.data, productTypeName: foundProductType.name || "" }})
      if(foundProduct.data && !foundProduct.data.reason) createAndUpdateProducts.push({...foundProduct.data, productTypeName: foundProductType.name || "" })
    }

    if (formula) {

      failedFormulas = await checkFormulaProduct(this.req, formula, this.req.loggedInUser.id );
      
      if(failedFormulas.length > 0) {
        // tạo nhật kí
        let createActionLog = await sails.helpers.actionLog.create(this.req, {
          userId: this.req.loggedInUser.id,
          functionNumber: sails.config.constant.ACTION_LOG_TYPE.IMPORT_PRODUCT,
          action: sails.config.constant.ACTION.IMPORT,
          objectContentOld: foundProducts.length && foundProducts || undefined,
          objectContentNew: {productImport: createAndUpdateProducts },
          deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
          branchId
        })

        if (!createActionLog.status) {
          return createActionLog
        }

        this.res.json({
          status: false,
          failedFormulas: failedFormulas,
          data: createdProducts
        });
        return;
      }

      let Formulas = [];

      for (let item of formula) {

        Formulas[item.productId] = {
          ...Formulas[item.productId],
          [item.materialId]: item.quantity
        }
      }

      let ProductFormula = [];

      for (let index in Formulas) {
        ProductFormula.push({ [index]: Formulas[index] })
      }

      for (let item of ProductFormula){
        let createFormula = await sails.helpers.product.updateFormula(this.req, { productCode: Object.keys(item)[0], data: Object.values(item)[0], loggedInUser: this.req.loggedInUser.id });
        createdFormulas.push(createFormula)
        addFormulas.push(createFormula.data)
      }
    }    

    createdProducts.map( item => {
      if(!item.status && item.data){
        error.push(item.data);
      }
    })

    // tạo nhật kí
    let createActionLog = await sails.helpers.actionLog.create(this.req, {
      userId: this.req.loggedInUser.id,
      functionNumber: sails.config.constant.ACTION_LOG_TYPE.IMPORT_PRODUCT,
      action: sails.config.constant.ACTION.IMPORT,
      objectContentOld: foundProducts.length && foundProducts || undefined,
      objectContentNew: {productImport: createAndUpdateProducts, formulas: addFormulas },
      deviceInfo: { ip: this.req.ip, userAgent: this.req.headers['user-agent'] || "" },
      branchId
    })

    if (!createActionLog.status) {
      return createActionLog
    }

    this.res.json({
      status: true,
      data: [createdProducts, createdFormulas],
      error: error
    });
  }
};
async function createProductUnit(req, product) {
  
  let foundUnitId = await ProductUnit.findOne(req, { name: product['unitId'], deletedAt: 0 });

  if (!foundUnitId) {
    foundUnitId = await sails.helpers.productUnit.create(req, { name: product['unitId'], createdBy: req.loggedInUser.id});
    if(foundUnitId.status)
      foundUnitId = foundUnitId.data
  }

  return foundUnitId;
}

async function createProductType(req, product) {

  let foundProductType = await ProductType.findOne(req, { name: product['productTypeId'], deletedAt: 0 });

  if (!foundProductType) {
    foundProductType = await sails.helpers.productType.create(req, { name: product['productTypeId'], createdBy: req.loggedInUser.id});
    if(foundProductType.status)
      foundProductType = foundProductType.data;
  }

  return foundProductType;
}

async function createProductSupplier(req, product, branchId) {

  if (!product['customerId']) {
    return;
  }

  let foundSupplier = await Customer.find(req, { name: product['customerId'], deletedAt: 0, branchId });
  foundSupplier = foundSupplier[0]

  if (!foundSupplier) {
    foundSupplier = await sails.helpers.customer.create(req, { name: product['customerId'], type: sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER, branchId, createdBy: req.loggedInUser.id, updatedBy: req.loggedInUser.id});
    if(foundSupplier.status)
      foundSupplier = foundSupplier.data;
  }

  return foundSupplier;
}

async function checkFormulaProduct(req, formula, loggedInUser) {

  let Formulas = {};
  let failedFormulas = [];

  for (let item of formula) {

    Formulas[item.productId] = {
      ...Formulas[item.productId],
      [item.materialId]: item.quantity
    }
  }

  let ProductFormula = [];

  for (let index in Formulas) {
    ProductFormula.push({ [index]: Formulas[index] })
  }

  let checkedFormulas = [];

  for (let item of ProductFormula){
    let createFormula = await sails.helpers.product.checkFormulaProduct(req, { productCode: Object.keys(item)[0], data: Object.values(item)[0], loggedInUser: loggedInUser });
    checkedFormulas.push(createFormula)
  }

  checkedFormulas.map( item => {
      item.errProducts.map( product => {
        if(!failedFormulas.some(e => (e.code === product.code && e.reason === product.reason)))
          failedFormulas.push(product)
      })
  })

  return failedFormulas;
}