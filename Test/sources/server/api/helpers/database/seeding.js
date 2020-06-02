const Datasource = require('mutilTenant/datasource');
const path = require('path');
const fs = require('fs');
const directoryPath = path.join("data");
const https = require('https');

module.exports = {
  friendlyName: 'Seed Database',
  description: 'Seed sample data',
  inputs: {
    identity: {
      type: 'string'
    },
    business_type: { // loại hình kinh doanh cần tạo dữ liệu mẫu
      type: 'string'
    }
  },
  exits: {
    success: {},
  },
  fn: async function (inputs, exits) {
    let {identity, business_type} = inputs;
    let {DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_IDENTITY, MULTI_TENANT} = process.env;
    
    // Kiểm tra tồn loại loại hình kinh doanh
    let files = fs.readdirSync(directoryPath);
    if( !files.includes(business_type + '.xlsx')) {
      return exits.success({
        status: false,
        message: sails.__("Không tìm thấy dữ liệu mẫu cho ngành nghề kinh doanh này")
      });
    }
    
    let datasource;
    try {
      datasource = await sails.config.multitenancy(identity);
    } catch(err) {
      return exits.success(err);
    }
    
    // gọi user admin
    let [user_admin, permissions] = await Promise.all([
      User.findOne(datasource, {
        where: { isAdmin: true }
      }).intercept({ name: "UsageError" }, () => {
        return exits.success({
          status: false,
          message: sails.__("Nhóm sản phẩm không tồn tại trong hệ thống")
        });
      }),
      Permission.find(datasource)
    ])
    
    // tạo role Quản lý kho
    await Promise.all([
      Role.create(datasource, {
        name: "Quản lý kho",
        createdBy: user_admin.id,
        updatedBy: user_admin.id
      }).fetch(),
      Role.create(datasource, {
        name: "Bán hàng",
        createdBy: user_admin.id,
        updatedBy: user_admin.id
      }).fetch(),
      Role.create(datasource, {
        name: "Quản lý cửa hàng",
        createdBy: user_admin.id,
        updatedBy: user_admin.id
      }).fetch()
    ])

    var convertImage = (uri, callback) =>{
      https.get(uri, function(res){
        res.setEncoding('base64');
        let body = "data:" + res.headers["content-type"] + ";base64,";
        res.on('data', (data) => { body += data});
        
        res.on('end', () => {
          callback({thumbUrl: body, type: res.headers["content-type"]})
        })
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
    }

    const path = require('path');
    let dataFilePath = path.join("data", business_type+ ".xlsx");

    let Excel = require('exceljs');
    let workbook = new Excel.Workbook();
    let products = [], customers = [], suppliers = [], productStocks = [], productPrices= [];
    let productType = {}, productUnits = {};
    let [productCount, customerCount] = await Promise.all([
      Product.count(datasource),
      Customer.count(datasource)
    ])
    
    await workbook.xlsx.readFile(dataFilePath).then( async function () {
      let workSheet = workbook.getWorksheet("sanpham");
      workSheet.eachRow({
        includeEmpty: false
      }, async function (row, rowNumber) {

        currRow = workSheet.getRow(rowNumber);

        if (rowNumber > 1) {
          let foundUnit;
          productUnits[currRow.getCell(6).value] = productUnits[currRow.getCell(6).value] || (Object.keys(productUnits).length + 1);

          if ( !productType[currRow.getCell(3).value] ) {
            productType[currRow.getCell(3).value] = currRow.getCell(3).value
          }
          productCount += 1;
          products.push({
            id: productCount,
            name: currRow.getCell(2).value,
            unitId: productUnits[currRow.getCell(6).value],
            code: sails.config.cardcode.product + productCount,
            productTypeName: currRow.getCell(3).value,
            description: currRow.getCell(4).value,
            category: sails.config.constant.PRODUCT_CATEGORY_TYPE.MATERIAL,
            createdBy: user_admin.id,
            updatedBy: user_admin.id,
            notes: "",
            type: currRow.getCell(11).value.toLowerCase() === sails.config.constant.PRODUCT_TYPES_NAME.merchandise ? sails.config.constant.PRODUCT_TYPES.merchandise : sails.config.constant.PRODUCT_TYPES.service,
            url: currRow.getCell(7).value
          })

          productPrices.push({
            branchId: sails.config.constant.BRANCH_DEFAULT,
            costUnitPrice: Number(currRow.getCell(9).value).toFixed(0),
            saleUnitPrice: Number(currRow.getCell(10).value).toFixed(0),
            lastImportPrice: currRow.getCell(9).value,
            productId: productCount,
            createdBy: user_admin.id,
            updatedBy: user_admin.id,
          })

          productStocks.push({
            branchId: sails.config.constant.BRANCH_DEFAULT,
            stockQuantity: currRow.getCell(8).value,
            productId: productCount,
            createdBy: user_admin.id,
            updatedBy: user_admin.id,
          })
        }
      });

      let productTypes = await Promise.all(_.map(Object.keys(productType), item => {
        let createProductType = ProductType.create(datasource, {
          name: item,
          createdBy: user_admin.id,
          updatedBy: user_admin.id,
        }).fetch();

        return createProductType;
      }));
      productTypes = _.keyBy(productTypes, 'name')

      // tạo data khách hàng
      let customerWorkSheet = workbook.getWorksheet("khachhang");
      let supplierWorkSheet = workbook.getWorksheet("ncc");

      customerWorkSheet.eachRow({
        includeEmpty: false
      }, async function (row, rowNumber) {

        currRow = customerWorkSheet.getRow(rowNumber);
        if (rowNumber > 1) {
          customerCount += 1;
          customers.push({
            id: customerCount,
            name: currRow.getCell(1).value?currRow.getCell(1).value.trim():"unknown",
            code: sails.config.cardcode.customerFirstCode + customerCount, 
            email: currRow.getCell(9).value?currRow.getCell(9).value:"",
            mobile: currRow.getCell(8).value?currRow.getCell(8).value:"",
            tel: currRow.getCell(8).value?currRow.getCell(8).value:"",
            address: currRow.getCell(7).value?currRow.getCell(7).value:"",
            gender: currRow.getCell(10).value?currRow.getCell(10).value:"",
            type: sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER,
            branchId: sails.config.constant.BRANCH_DEFAULT,
            createdBy: user_admin.id,
            updatedBy: user_admin.id
          })
        }
      });

      // tạo data nhà cung cấp
      supplierWorkSheet.eachRow({
        includeEmpty: false
      }, async function (row, rowNumber) {
        currRow = supplierWorkSheet.getRow(rowNumber);
        if (rowNumber > 1) {
          customerCount += 1;
          suppliers.push({
            id: customerCount,
            name: currRow.getCell(1).value?currRow.getCell(1).value.trim():"unknown",
            code: sails.config.cardcode.providerFirstCode + customerCount,
            mobile: currRow.getCell(4).value?currRow.getCell(4).value:"",
            tel: currRow.getCell(4).value?currRow.getCell(4).value:"",
            address: currRow.getCell(3).value?currRow.getCell(3).value:"",
            type: sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER,
            branchId: sails.config.constant.BRANCH_DEFAULT,
            createdBy: user_admin.id,
            updatedBy: user_admin.id
          })
        }
      });
      products.forEach(item => {
        item.productTypeId = productTypes[item.productTypeName].id;
        item.customerId =  suppliers[(Math.floor(Math.random() * (suppliers.length - 1)))].id
      });
      await Promise.all([
        Promise.all(Object.keys(productUnits).map(item => {
          return ProductUnit.create(datasource, {
            id: productUnits[item],
            name: item,
            createdBy: user_admin.id,
            updatedBy: user_admin.id
          })
        })),
        Promise.all(products.map(item => {
          return Product.create(datasource, item);
        })),
        Promise.all(products.map(item => {
          convertImage(item.url, async function(img){
            await FileStorage.create(datasource, {
              file: img.thumbUrl,
              extension: img.type,
              productId: item.id,
              createdBy: user_admin.id,
              updatedBy: user_admin.id
            });
          })
          return;
        })),
        Promise.all(productStocks.map(item => {
          return ProductStock.create(datasource, item);
        })),
        Promise.all(productPrices.map(item => {
          return ProductPrice.create(datasource, item);
        })),
        Promise.all(customers.map(item => {
          return Customer.create(datasource, item);
        })),
        Promise.all(suppliers.map(item => {
          return Customer.create(datasource, item);
        }))
      ])
      return;
    });
    
    let endDate = new Date().getTime();
    let startDate = endDate - (1000 * 3600 * 24 * 30); // 30 ngày
    let [totalCustomers, totalSuppliers, totalProducts, totalInvoices, totalImportCards, totalExportCards] = await Promise.all([
      Customer.count(datasource, {type: sails.config.constant.CUSTOMER_TYPE.TYPE_CUSTOMER}),
      Customer.count(datasource, {type: sails.config.constant.CUSTOMER_TYPE.TYPE_SUPPLIER}),
      Product.count(datasource),
      Invoice.count(datasource),
      ImportCard.count(datasource, {reason: sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER}),
      ExportCard.count(datasource, {reason: sails.config.constant.EXPORT_CARD_REASON.SALE}),
    ]);
    
    let dateCreateInvoice = startDate;
    let dateCreateImportCard = startDate;
    let dateCreateImportReturnCard = startDate;
    let dateCreateInvoiceReturn = startDate;

    //tạo 2 đơn hàng / 1 tuần
    await Promise.all([
      Counter.create(datasource, { code: `${sails.config.constant.CARD_TYPE.invoice}_${sails.config.cardcode.invoiceFirstCode}`, value: JSON.stringify({id: 0}), createdBy: user_admin.id, updatedBy: user_admin.id }),
      Counter.create(datasource, { code: `${sails.config.constant.CARD_TYPE.importCard}_${sails.config.cardcode.importCardFirstCode}`, value: JSON.stringify({id: 0}), createdBy: user_admin.id, updatedBy: user_admin.id }),
      Counter.create(datasource, { code: `${sails.config.constant.CARD_TYPE.invoiceReturn}_${sails.config.cardcode.invoiceReturnFirstCode}`, value: JSON.stringify({id: 0}), createdBy: user_admin.id, updatedBy: user_admin.id }),
      Counter.create(datasource, { code: `${sails.config.constant.CARD_TYPE.importReturn}_${sails.config.cardcode.importReturnFirstCode}`, value: JSON.stringify({id: 0}), createdBy: user_admin.id, updatedBy: user_admin.id }),
      Counter.create(datasource, { code: `${sails.config.constant.CARD_TYPE.income}_${sails.config.cardcode.incomeFirstCode}`, value: JSON.stringify({id: 0}), createdBy: user_admin.id, updatedBy: user_admin.id }),
      Counter.create(datasource, { code: `${sails.config.constant.CARD_TYPE.expense}_${sails.config.cardcode.expenseFirstCode}`, value: JSON.stringify({id: 0}), createdBy: user_admin.id, updatedBy: user_admin.id }),
    ]);
    let promises = [];
    while (dateCreateInvoice <= endDate) {
      for (let i = 0; i < 2; i++) {
        let randomIdCustomer = Math.floor(Math.random() * (totalCustomers -1)) +1 ;
        let randomIdProduct = Math.floor(Math.random() * (totalProducts -1)) +1;
        
        let [randomCustomer, randomProduct, randomProductPrice] = await Promise.all([
          Customer.find(datasource, { id: {'>=': randomIdCustomer}, branchId: sails.config.constant.BRANCH_DEFAULT }).limit(1),
          Product.findOne(datasource, {id: randomIdProduct}),
          ProductPrice.find(datasource, { productId: randomIdProduct, branchId: sails.config.constant.BRANCH_DEFAULT }).limit(1)
        ])
        randomCustomer = randomCustomer[0];
        randomProductPrice = randomProductPrice[0];

        let products = [{
          ...randomProduct,
          quantity: 1,
          productId: randomProduct.id,
          productCode: randomProduct.code,
          productName: randomProduct.name,
          unitPrice: randomProductPrice.saleUnitPrice,
          finalAmount: randomProductPrice.saleUnitPrice,
          costUnitPrice: randomProductPrice.costUnitPrice,
          stockId: 1
        }]
        
        totalInvoices += 1;
        let createInvoice = sails.helpers.invoice.create(datasource, {
          id: totalInvoices,
          createdAt: dateCreateInvoice + i,
          totalAmount: products[0].finalAmount * products[0].quantity,
          discountAmount: 0,
          taxAmount: 0,
          deliveryAmount: 0,
          finalAmount: products[0].finalAmount * products[0].quantity,
          notes: "",
          products: products,
          deliveryAddress: randomCustomer.address,
          customerId: randomCustomer.id,
          status: sails.config.constant.INVOICE_CARD_STATUS.FINISHED,
          deliveryType: 1,
          debtAmount: 0,
          paidAmount: products[0].finalAmount * products[0].quantity,
          invoiceAt: dateCreateInvoice,
          createdBy: user_admin.id,
          updatedBy: user_admin.id,
          branchId: sails.config.constant.BRANCH_DEFAULT,
          incomeExpenseAt: dateCreateInvoice + i
        });

        promises.push(createInvoice);
      }
      dateCreateInvoice += 1000 * 3600 * 24 * 7;
    }
    
    // tạo 1 phiếu nhập hàng / 2 tuần
    while (dateCreateImportCard <= endDate) {
      let  randomIdCustomer = Math.floor(Math.random() * (totalSuppliers -1)) + totalCustomers +1;
      let randomIdProduct = Math.floor(Math.random() * (totalProducts -1)) +1;
      
      let [randomCustomer, randomProduct, randomProductPrice] = await Promise.all([
        Customer.find(datasource, { id: {'>=': randomIdCustomer}, branchId: sails.config.constant.BRANCH_DEFAULT }).limit(1),
        Product.findOne(datasource, {id: randomIdProduct}),
        ProductPrice.find(datasource, { productId: randomIdProduct, branchId: sails.config.constant.BRANCH_DEFAULT }).limit(1)
      ]);
      randomCustomer = randomCustomer[0];
      randomProductPrice = randomProductPrice[0];

      let products = [{
        ...randomProduct,
        quantity: 1,
        productId: randomProduct.id,
        productCode: randomProduct.code,
        productName: randomProduct.name,
        unitPrice: randomProductPrice.costUnitPrice,
        finalAmount: randomProductPrice.costUnitPrice,
        stockId: 1
      }]
      
      totalImportCards += 1;
      let createImportCard = sails.helpers.import.create(datasource, {
        id: totalImportCards,
        createdAt: dateCreateImportCard,
        products: products,
        finalAmount: products[0].finalAmount * products[0].quantity,
        totalAmount: products[0].finalAmount * products[0].quantity,
        importedAt: dateCreateImportCard,
        notes: "",
        recipientId: randomCustomer.id,
        createdBy: user_admin.id,
        reason: sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER,
        paidAmount: products[0].finalAmount * products[0].quantity,
        discountAmount: 0,
        taxAmount: 0,
        deliveryAmount: 0,
        depositAmount: 0,
        branchId: sails.config.constant.BRANCH_DEFAULT
      });
      dateCreateImportCard += 1000 * 3600 * 24 * 7 * 2;
      promises.push(createImportCard)
    }
    await Promise.all(promises);
    
    // tạo 1 phiếu trả hàng nhập / 2 tuần
    promises = [];
    while (dateCreateImportReturnCard <= endDate) {
      let randomIdCustomer = Math.floor(Math.random() * (totalSuppliers -1)) + totalCustomers +1;
      let randomIdProduct = Math.floor(Math.random() * (totalProducts -1)) +1;

      let [randomCustomer, randomProduct, randomProductPrice] = await Promise.all([
        Customer.find(datasource, { id: {'>=': randomIdCustomer}, branchId: sails.config.constant.BRANCH_DEFAULT }).limit(1),
        Product.findOne(datasource, {id: randomIdProduct}),
        ProductPrice.find(datasource, { productId: randomIdProduct, branchId: sails.config.constant.BRANCH_DEFAULT }).limit(1)
      ]);
      randomCustomer = randomCustomer[0];
      randomProductPrice = randomProductPrice[0];

      let products = [{
        ...randomProduct,
        quantity: 1,
        productId: randomProduct.id,
        productCode: randomProduct.code,
        productName: randomProduct.name,
        unitPrice: randomProductPrice.lastImportPrice,
        finalAmount: randomProductPrice.lastImportPrice,
        stockId: 1
      }]
        
      totalExportCards += 1;
      let createImportReturnCard = sails.helpers.importReturnCard.create(datasource, {
        id: totalExportCards,
        createdAt: dateCreateImportReturnCard,
        exportedAt: dateCreateImportReturnCard,
        products: products,
        finalAmount: products[0].finalAmount,
        totalAmount: products[0].finalAmount,
        createdBy: user_admin.id,
        customerId: randomCustomer.id,
        totalAmount: products[0].finalAmount,
        discountAmount: 0,
        paidAmount: products[0].finalAmount,
        branchId: sails.config.constant.BRANCH_DEFAULT
      });
      dateCreateImportReturnCard += 1000 * 3600 * 24 * 14;
      promises.push(createImportReturnCard);
    }

    // tạo 1 phiếu trả hàng / 2 tuần
    while (dateCreateInvoiceReturn <= endDate) {
      let randomIdInvoice = Math.floor(Math.random() * (totalInvoices -1)) +1;
      let randomInvoice = await sails.helpers.invoice.get(datasource, {id: randomIdInvoice, branchId: sails.config.constant.BRANCH_DEFAULT});
      
      if(randomInvoice.status){
        let foundInvoice = randomInvoice.data.foundInvoice;
        let invoiceProductArray = randomInvoice.data.invoiceProductArray;
        
        for (let product of invoiceProductArray) {
          product.invoiceProductId = product.id;
          product.finalAmount = product.finalAmount;
          product.unitPrice = product.finalAmount;
          product.productId = product.productId.id;
        }
        
        totalImportCards += 1;
        let createInvoiceReturn = sails.helpers.invoiceReturn.create(datasource, {
          id: totalImportCards,
          createdAt: dateCreateInvoiceReturn,
          products: invoiceProductArray,
          finalAmount: foundInvoice.finalAmount,
          invoiceId: foundInvoice.id,
          createdBy: user_admin.id,
          customerId: foundInvoice.customerId.id,
          totalAmount: foundInvoice.totalAmount,
          discountAmount: foundInvoice.discountAmount,
          branchId: sails.config.constant.BRANCH_DEFAULT

        });
        dateCreateInvoiceReturn += 1000 * 3600 * 24 * 7 * 2;
        promises.push(createInvoiceReturn);
      }
    }

    
    await Promise.all(promises);
    
    return exits.success({
      status: true
    });
  }
};
