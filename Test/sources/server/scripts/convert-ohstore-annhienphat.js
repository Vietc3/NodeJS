const Datasource = require('mutilTenant/datasource');
const path = require('path');
const fs = require('fs-extra')
const directoryPath = path.join("scripts/ohstore-data-annhienphat");

const csv = require('csvtojson');

const createdBy = 1;
const updatedBy = 1;
const createdAt = new Date().getTime();
const updatedAt = new Date().getTime();
const branchId = 1;
const stockId = 1;
const roleId = 1; // role admin
const defaultProductType = 1; // 1 - sản phẩm, 2 - dịch vụ
const defaultProductCategory = 1; // 1 - nguyên vật liệu, 2 - thành phẩm
const defaultProductQuantity = 0;
let defaultCustomerName = "Khác";

let incomeExpenseType_old = {
  income: 1,
  expense: 0,
  1: "income",
  0: "expense"
}
let incomeExpenseType_new = {
  income: 1,
  expense: 2,
  1: "income",
  2: "expense"
}

var oldFixCostTypes = {
  INVOICE: 1,
  IMPORT: 2,
  IMPORT_RETURN: 3,
  INVOICE_RETURN: 4,
  OTHER_INCOME: 5,
  OTHER_EXPENSE: 6
}
var newFixCostTypes = {
  INVOICE: 1, // type: 1 - thu, 2 - chi
  IMPORT_RETURN: 2,
  OTHER_INCOME: 3,
  IMPORT: 4,
  INVOICE_RETURN: 5,
  OTHER_EXPENSE: 6,
}

module.exports = {
  friendlyName: 'convert old ohstore to new one',
  description: '',

  fn: async function (inputs, exits) {
    
    let datasource;
    try {
      datasource = await sails.config.multitenancy(process.env.DB_IDENTITY);
    } catch(err) {
      return exits.success(err);
    }
    
    const files = await fs.readdir(directoryPath);
    let currentTime = new Date().getTime();
    let data = {};
    (await Promise.all(files.map(item => csv().fromFile(directoryPath + '/' + item)))).map((item, index) => {
      data[files[index].split('.').slice(0, -1).join('.')] = item.map(i => _.pickBy(i, value => value !== 'NULL'));
    })
    
    console.log("// Tạo account cho sale");
    let sale_old_new = {};
    let crearedSales = await Promise.all(data.Sale.map(item => {
      let {ID,Name,Phone} = item;
      return sails.helpers.user.create(datasource, {
        email: _.removeSign(Name.toLowerCase()).trim().split(' ').join('') + '@ohstore.vn',
        fullName: Name,
        password: '123456',
        phoneNumber: Phone,
        isActivated: 1,
        isActive: 1,
        roleId,
        branchId: JSON.stringify([branchId]),
        createdBy,
      })
    }))
    crearedSales.forEach((item, index) => {
      if(item) {
        if(!item.status) {
          return exits.success(item)
        }
        sale_old_new[data.Sale[index].ID] = item.data;
      }
    });

    console.log("// convert CostType to IncomeExpenseCardType");
    let fixIncomeExpenseCardTypes = await IncomeExpenseCardType.find(datasource, {code: {">": 0}});
    let codeIds = {};
    fixIncomeExpenseCardTypes.forEach(item => codeIds[item.code] = item);
    for(key in newFixCostTypes) {
      newFixCostTypes[key] = codeIds[newFixCostTypes[key]]
    }
    
    let createdIncomeExpenseCardTypes = await IncomeExpenseCardType.createEach(datasource, data.CostType.filter(item => item.Fix != 1).map(item => ({
      id: parseFloat(item.ID),
      name: item.Name,
      type: incomeExpenseType_new[incomeExpenseType_old[item.Type]],
      code: 0,
      createdBy,
      updatedBy,
    }))).intercept({ name: "UsageError" }, () => {
      return exits({
        status: false,
        error: sails.__("Thông tin yêu cầu không hợp lệ")
      });
    }).fetch();
    
    if(createdIncomeExpenseCardTypes.length !== data.CostType.filter(item => item.Fix != 1).length) {
      return exits.success({
        status: false,
        error: sails.__("Convert CostType fails")
      });
    }
    let foundIncomeExpenseCardTypes = await IncomeExpenseCardType.find(datasource, {});
    createdIncomeExpenseCardTypes = {}
    foundIncomeExpenseCardTypes.forEach(item => createdIncomeExpenseCardTypes[item.id] = item);
    
    console.log("// convert customer");
    let filterCustomer = data.Customer.filter(item => item.Fix != 1);
    let createdCustomers = await Promise.all(filterCustomer.map(item => {
      let {ID,Code,Name,Address,Tel,Fax,RepName,Mobile,Notes,Type,QtyIn,QtyOut,QtyOutstanding,Fix,DebtCeiling,MaxDebtDay,TaxCode,QtyDeposit,QtyInit} = item;
      // Chuyển đổi type customer
      let type = Type == 2 ? 1 : 2;
      return sails.helpers.customer.create(datasource, {
        name: Name,
        code: Code,
        address: Address,
        tel: Tel,
        mobile: Mobile,
        type,
        notes: Notes,
        maxDeptAmount: parseFloat(DebtCeiling),
        maxDeptDays: parseFloat(MaxDebtDay),
        taxCode: TaxCode,
        branchId,
        createdBy,
        updatedBy,
      });
    }));
    let customers = {};
    createdCustomers.forEach((item, index) => {
      if(item){
        if(!item.status) {
          return exits.success(item)
        }
        customers[filterCustomer[index].ID] = item.data;
      }
      
    });
    createdCustomers = customers;
    
    console.log("// Khởi tạo công nợ ban đầu cho KH, NCC");
    let initDebts = await Promise.all(data.Customer.map(item => {
      let {ID,Code,Name,Address,Tel,Fax,RepName,Mobile,Notes,Type,QtyIn,QtyOut,QtyOutstanding,Fix,DebtCeiling,MaxDebtDay,TaxCode,QtyDeposit,QtyInit} = item;
      let changeValue = parseFloat(QtyInit);
      if(Fix != 1 && changeValue > 0) {
        // Chuyển đổi type customer
        let type = Type == 2 ? 1 : 2;
        return sails.helpers.debt.create(datasource, {
          changeValue,
          customerId: ID,
          createdBy,
        });
      }
    }))
    initDebts.forEach(item => {
      if(item && !item.status) {
        return exits.success(item)
      }
    });
    
    console.log("// Tạo đon vị tính")
    let productUnits = {};
    let productTypes = {};
    data.Product.forEach(item => {
      productUnits[item.ProductUnit] = item.ProductUnit;
      productTypes[item.ProductType] = item.ProductType;
    })
    let createdProductUnits = await Promise.all(Object.keys(productUnits).map(item => {
      return sails.helpers.productUnit.create(datasource, {
        name: item,
        createdBy
      })
    }));
    createdProductUnits.forEach(item => {
      if(item) {
        if(item && !item.status) {
          return exits.success(item)
        }
        productUnits[item.data.name] = item.data;
      }
    });
    createdProductUnits = productUnits;
    
    console.log("// tạo nhóm sản phẩm")
    let createdProductTypes = await Promise.all(Object.keys(productTypes).map((item, index) => {
      return sails.helpers.productType.create(datasource, {
        name: item,
        createdBy
      })
    }));
    createdProductTypes.forEach(item => {
      if(item){
        if(!item.status) {
          return exits.success(item)
        }
        productTypes[item.data.name] = item.data;
      }
    });
    createdProductTypes = productTypes;
    
    console.log("// Tạo sản phẩm")
    let createdProducts = await Promise.all(data.Product.map(item => {
      let {ID,Name,Code,CustomerID,ProductUnit,ProductType,Notes,FixPrice,ProjectID,DiscountMax} = item;
      return sails.helpers.product.create(datasource, {
        name: Name,
        costUnitPrice: FixPrice,
        unitId: createdProductUnits[ProductUnit].id,
        code: Code,
        saleUnitPrice: FixPrice,
        productTypeId: createdProductTypes[ProductType].id,
        customerId: createdCustomers[CustomerID].id,
        quantity: defaultProductQuantity,
        maxDiscount: DiscountMax,
        createdBy,
        branchId,
        stockId,
        type: 1
      })
    }))
    let products = {};
    createdProducts.forEach((item, index) => {
      if(item) {
        if(!item.status) {
          return exits.success(item)
        }
        products[data.Product[index].ID] = item.data;
      }
    });
    createdProducts = products;
    
    console.log("// lấy export product theo đơn hàng")
    let exportCardProducts = {};
    data.ExportProduct.forEach(item => {
      exportCardProducts[item.ExportCardID] = exportCardProducts[item.ExportCardID] || [];
      exportCardProducts[item.ExportCardID].push(item);
    });
    console.log("// lấy import product theo phiếu nhập hàng")
    let importCardProducts = {};
    data.ImportProduct.forEach(item => {
      importCardProducts[item.ImportCardID] = importCardProducts[item.ImportCardID] || [];
      importCardProducts[item.ImportCardID].push(item);
    });
    
    
    console.log("// lấy chi tiết phiếu thu chi")
    let incomeExpenseDetails = {};
    data.IncomeExpenseIECard.forEach(item => {
      incomeExpenseDetails[item.IncomeExpenseID] = incomeExpenseDetails[item.IncomeExpenseID] || [];
      incomeExpenseDetails[item.IncomeExpenseID].push(item);
    })
    
    let processPromises = {};
    
    console.log("// Tạo phiếu nhập hàng")
    data.ImportCard.map(item => {
      let {ID,Code,CustomerID,Time,Amount,Notes,QtyIn,QtyOutstanding,IsReturn,BillID} = item; 
      if(IsReturn == 0) {
        let totalAmount = 0;
        let products = [];
       
        importCardProducts[ID].forEach(product => {
          let {ID,ImportCardID,ProductID,Code,Qty,OriginPrice,Discount,BuyPrice,Amount,Notes,IsPromoted} = product;
          let {code, name, id, type} = createdProducts[ProductID];
          if(parseFloat(Qty) > 0) {
            let discountAmount = parseFloat(BuyPrice) * parseFloat(Discount) / 100;
            let finalAmount =  parseFloat(BuyPrice) - discountAmount;
            let amount = parseFloat(Qty) * finalAmount;
            
            if(IsPromoted == 1) totalAmount = 0
            else totalAmount += amount
            
            products.push({
              productCode: code, 
              productName: name, 
              quantity: parseFloat(Qty), 
              unitPrice: parseFloat(OriginPrice), 
              discount: discountAmount, 
              finalAmount, 
              costUnitPrice: 0, 
              notes: Notes, 
              productId: id, 
              invoiceProductId: 0, 
              stockId, 
              type
            })
          }
        })
        let finalAmount = parseFloat(Amount);
        let source = {
          id: ID, //for data-seeding
          createdAt: _.moment(Time).valueOf(), // for data-seeding
          code: Code,
          products,
          finalAmount,
          totalAmount,
          importedAt: _.moment(Time).valueOf(),
          notes: Notes,
          reason: sails.config.constant.IMPORT_CARD_REASON.IMPORT_PROVIDER,
          recipientId: createdCustomers[CustomerID].id,
          createdBy,
          paidAmount: 0,
          discountAmount: 0,
          taxAmount: 0,
          deliveryAmount: 0,
          depositAmount: 0,
          incomeExpenseAt: 0,
          branchId,
        };
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.import.create(datasource, source),
          source
        }
      }
    })
    
    let processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.import.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    console.log("// Tạo thanh toán phiếu nhập hàng")
    data.IncomeExpense.filter(item => item.CostTypeID == oldFixCostTypes.IMPORT).map(item => {
      let {ID,Type,CustomerID,Time,Notes,Amount,CostTypeName,CostTypeFix,CostTypeID,Code} = item;
      let source = {
        code: Code, 
        notes: Notes, 
        customerId: createdCustomers[CustomerID].id, 
        customerType: sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER,
        incomeExpenseAt: _.moment(Time).valueOf(),
        incomeExpenseCardTypeId: createdIncomeExpenseCardTypes[newFixCostTypes.IMPORT.id].id,
        incomeExpenseCardTypeCode: createdIncomeExpenseCardTypes[newFixCostTypes.IMPORT.id].code,
        paymentDetail: incomeExpenseDetails[ID].map(detail => ({
          cardId: detail.ImportCardID,
          payAmount: parseFloat(detail.Amount)
        })), // [{cardId, payAmount}]
        amount: parseFloat(Amount),
        depositAmount: 0,
        createdBy,
        branchId,
      };
      if(source.paymentDetail.filter(item => item.payAmount > 0).length > 0) {
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.expense.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.expense.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    console.log("// Tạo phiếu trả hàng")
    data.ImportCard.map(item => {
      let {ID,Code,CustomerID,Time,Amount,Notes,QtyIn,QtyOutstanding,IsReturn,BillID} = item; 
      if(IsReturn == 1) {
        let totalAmount = 0;
        let products = [];
       
        importCardProducts[ID].forEach(product => {
          let {ID,ImportCardID,ProductID,Code,Qty,OriginPrice,Discount,BuyPrice,Amount,Notes,IsPromoted} = product;
          let {code, name, id, type} = createdProducts[ProductID];
          
          let discountAmount = parseFloat(BuyPrice) * parseFloat(Discount) / 100;
          let finalAmount =  parseFloat(BuyPrice) - discountAmount;
          let amount = parseFloat(Qty) * finalAmount;
          
          if(IsPromoted == 1) totalAmount = 0
          else totalAmount += amount
          
          products.push({
            productCode: code, 
            productName: name, 
            quantity: parseFloat(Qty), 
            unitPrice: parseFloat(OriginPrice), 
            discount: discountAmount, 
            taxAmount: 0, 
            finalAmount, 
            costUnitPrice: 0, 
            notes: Notes, 
            productId: id, 
            // invoiceProductId: createdInvoices[ImportCardID][id].id, 
            stockId, 
            type
          })
        })
        let finalAmount = parseFloat(Amount);
        let source = {
          id: ID, //for data-seeding
          createdAt: _.moment(Code.substr(Code.length - 8), 'DDMMYYYY').valueOf(), // for data-seeding
          products, // [{productCode, productName, quantity, unitPrice, discount, taxAmount, finalAmount, productId, invoiceProductId //tương ứng với id của invoice product},]
          finalAmount: parseFloat(Amount),
          code: Code,
          notes: Notes,
          // invoiceId,
          createdBy,
          customerId: createdCustomers[CustomerID].id,
          totalAmount,
          discountAmount: 0,
          payAmount: 0,
          incomeExpenseAt: 0,
          branchId,
        };
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.invoiceReturn.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.invoiceReturn.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    console.log("// Tạo thanh toán phiếu trả hàng")
    data.IncomeExpense.filter(item => item.CostTypeID == oldFixCostTypes.INVOICE_RETURN).map(item => {
      let {ID,Type,CustomerID,Time,Notes,Amount,CostTypeName,CostTypeFix,CostTypeID,Code} = item;
      let source = {
        code: Code, 
        notes: Notes, 
        customerId: createdCustomers[CustomerID].id, 
        customerType: sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER,
        incomeExpenseAt: _.moment(Time).valueOf(),
        incomeExpenseCardTypeId: createdIncomeExpenseCardTypes[newFixCostTypes.INVOICE_RETURN.id].id,
        incomeExpenseCardTypeCode: createdIncomeExpenseCardTypes[newFixCostTypes.INVOICE_RETURN.id].code,
        paymentDetail: incomeExpenseDetails[ID].map(detail => ({
          cardId: detail.ImportCardID,
          payAmount: parseFloat(detail.Amount)
        })), // [{cardId, payAmount}]
        amount: parseFloat(Amount),
        depositAmount: 0,
        createdBy,
        branchId,
      };
      if(source.paymentDetail.filter(item => item.payAmount > 0).length > 0) {
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.expense.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.expense.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    console.log("// Tạo đơn hàng")
    data.ExportCard.map(item => {
      let {ID,Code,CustomerID,SaleID,Time,Amount,Notes,QtyIn,QtyOutstanding,BillID,IsReturn} = item; 
      if(IsReturn == 0) {
        let totalAmount = 0;
        let products = [];
       
        exportCardProducts[ID].forEach(product => {
          let {ID,ExportCardID,ProductID,Code,Qty,OriginPrice,Discount,SalePrice,Amount,Notes,QtyInvCurr,CostPrice,IsPromoted} = product;
          let {code, name, id, type} = createdProducts[ProductID];
          
          let discountAmount = parseFloat(SalePrice) * parseFloat(Discount) / 100;
          let finalAmount =  parseFloat(SalePrice) - discountAmount;
          let amount = parseFloat(Qty) * finalAmount;
          if(IsPromoted == 1) totalAmount = 0
          else totalAmount += amount
          
          products.push({
            productCode: code,
            productName: name,
            quantity: parseFloat(Qty),
            unitPrice: parseFloat(OriginPrice),
            discount: discountAmount,
            finalAmount,
            notes: Notes,
            costUnitPrice: 0,
            productId: id,
            stockId,
            type
          })
        })
        let finalAmount = parseFloat(Amount);
        let source = {
          id: ID, // for data-seeding
          createdAt: _.moment(Time).valueOf(), // for data-seeding
          code: Code,
          totalAmount,
          finalAmount,
          discountAmount: 0,
          taxAmount: 0,
          deliveryAmount: 0,
          deliveryAddress: customers[CustomerID].address,
          customerId: createdCustomers[CustomerID].id,
          products,
          payType: 1,
          deliveryType: 1,
          paidAmount: 0,
          depositAmount: 0,
          createdBy: SaleID ? sale_old_new[SaleID].id : createdBy,
          invoiceAt: _.moment(Time).valueOf(),
          branchId,
        };
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.invoice.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.invoice.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    console.log("// Tạo thanh toán đơn hàng")
    data.IncomeExpense.filter(item => item.CostTypeID == oldFixCostTypes.INVOICE).map(item => {
      let {ID,Type,CustomerID,Time,Notes,Amount,CostTypeName,CostTypeFix,CostTypeID,Code} = item;
      let source = {
        code: Code, 
        notes: Notes, 
        customerId: createdCustomers[CustomerID].id, 
        customerType: sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.CUSTOMER, // khach hang
        incomeExpenseAt: _.moment(Time).valueOf(),
        incomeExpenseCardTypeCode: createdIncomeExpenseCardTypes[newFixCostTypes.INVOICE.id].code,
        incomeExpenseCardTypeId: createdIncomeExpenseCardTypes[newFixCostTypes.INVOICE.id].id,
        paymentDetail: incomeExpenseDetails[ID].map(detail => ({
          cardId: detail.ExportCardID,
          payAmount: parseFloat(detail.Amount)
        })), // [{cardId, payAmount}]
        amount: parseFloat(Amount),
        depositAmount: 0,
        createdBy,
        branchId,
      };
      if(source.paymentDetail.filter(item => item.payAmount > 0).length > 0) {
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.income.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.income.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    console.log("// Tạo phiếu trả hàng nhập")
    data.ExportCard.map(item => {
      let {ID,Code,CustomerID,SaleID,Time,Amount,Notes,QtyIn,QtyOutstanding,BillID,IsReturn} = item; 
      if(IsReturn == 1) {
        let totalAmount = 0;
        let products = [];
       
        exportCardProducts[ID].forEach(product => {
          let {ID,ExportCardID,ProductID,Code,Qty,OriginPrice,Discount,SalePrice,Amount,Notes,QtyInvCurr,CostPrice,IsPromoted} = product;
          let {code, name, id, type} = createdProducts[ProductID];
          
          let discountAmount = parseFloat(SalePrice) * parseFloat(Discount) / 100;
          let finalAmount =  parseFloat(SalePrice) - discountAmount;
          let amount = parseFloat(Qty) * finalAmount;
          
          if(IsPromoted == 1) totalAmount = 0
          else totalAmount += amount
          
          products.push({
            productCode: code, 
            productName: name, 
            quantity: parseFloat(Qty), 
            unitPrice: parseFloat(OriginPrice),
            discount: discountAmount, 
            taxAmount: 0, 
            finalAmount, 
            notes: Notes, 
            productId: id, 
            // importProductId, 
            stockId,
            type
          })
        })
        let finalAmount = parseFloat(Amount);
        let source = {
          id: ID, //for data-seeding
          createdAt: _.moment(Time).valueOf(), // for data-seeding
          products, // [{productCode, productName, quantity, unitPrice, discount, taxAmount, finalAmount, productId, importProductId},]
          finalAmount,
          code: Code,
          notes: Notes,
          createdBy,
          customerId: createdCustomers[CustomerID].id,
          totalAmount,
          discountAmount: 0,
          paidAmount: 0,
          exportedAt: _.moment(Time).valueOf(),
          branchId,
        }
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.importReturnCard.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.importReturnCard.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    console.log("// Tạo thanh toán trả hàng nhập")
    data.IncomeExpense.filter(item => item.CostTypeID == oldFixCostTypes.IMPORT_RETURN).map(item => {
      let {ID,Type,CustomerID,Time,Notes,Amount,CostTypeName,CostTypeFix,CostTypeID,Code} = item;
      let source = {
        code: Code, 
        notes: Notes, 
        customerId: createdCustomers[CustomerID].id, 
        customerType: sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.SUPPLIER, // ncc
        incomeExpenseAt: _.moment(Time).valueOf(),
        incomeExpenseCardTypeCode: createdIncomeExpenseCardTypes[newFixCostTypes.IMPORT_RETURN.id].code,
        incomeExpenseCardTypeId: createdIncomeExpenseCardTypes[newFixCostTypes.IMPORT_RETURN.id].id,
        paymentDetail: incomeExpenseDetails[ID].map(detail => ({
          cardId: detail.ExportCardID,
          payAmount: parseFloat(detail.Amount)
        })), // [{cardId, payAmount}]
        amount: parseFloat(Amount),
        depositAmount: 0,
        createdBy,
        branchId,
      }
      if(source.paymentDetail.filter(item => item.payAmount > 0).length > 0) {
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.income.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.income.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};

    console.log("// tạo các phiếu thu khác");
    data.IncomeExpense.filter(item => !Object.values(oldFixCostTypes).includes(parseFloat(item.CostTypeID)) && item.Type == incomeExpenseType_old.income).map(item => {
      let {ID,Type,CustomerID,Time,Notes,Amount,CostTypeName,CostTypeFix,CostTypeID,Code} = item;
      let source = {
        notes: Notes, 
        customerId: defaultCustomerName, 
        customerType: sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.OTHER,
        incomeExpenseAt: _.moment(Time).valueOf(),
        incomeExpenseCardTypeCode: createdIncomeExpenseCardTypes[CostTypeID].code,
        incomeExpenseCardTypeId: createdIncomeExpenseCardTypes[CostTypeID].id,
        amount: parseFloat(Amount),
        createdBy,
        branchId,
      };
      if(source.amount > 0) {
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.income.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.income.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    console.log("// tạo các phiếu chi khác");
    data.IncomeExpense.filter(item => !Object.values(oldFixCostTypes).includes(parseFloat(item.CostTypeID)) && item.Type == incomeExpenseType_old.expense).map(item => {
      let {ID,Type,CustomerID,Time,Notes,Amount,CostTypeName,CostTypeFix,CostTypeID,Code} = item;
      let source = {
        notes: Notes, 
        customerId: defaultCustomerName, 
        customerType: sails.config.constant.INCOME_EXPENSE_CUSTOMER_TYPES.OTHER,
        incomeExpenseAt: _.moment(Time).valueOf(),
        incomeExpenseCardTypeId: createdIncomeExpenseCardTypes[CostTypeID].id,
        incomeExpenseCardTypeCode: createdIncomeExpenseCardTypes[CostTypeID].code,
        amount: parseFloat(Amount),
        createdBy,
        branchId,
      };
      if(source.amount > 0) {
        processPromises[_.moment(Time).valueOf()] = {
          // action: sails.helpers.expense.create(datasource, source),
          source
        }
      }
    })
    
    processTime = Object.keys(processPromises).sort();
    for (let i = 0; i < processTime.length; i++) {
      let result = await sails.helpers.expense.create(datasource, processPromises[processTime[i]].source);
      if(!result.status) {
        console.log(processPromises[processTime[i]].source);
        return exits.success(result)
      }
    }
    processPromises = {};
    
    // Tìm số lượng các product
    let foundProductStocks = await ProductStock.find(datasource, {});
    let _foundProductStocks = {};
    foundProductStocks.forEach(item => {
      _foundProductStocks[item.productId] = item;
    })
    foundProductStocks = _foundProductStocks;
    
    console.log("// tạo phiếu kiểm kho");
    let createdStockCheck = await sails.helpers.stockCheckCard.create(datasource, {
      createdBy,
      products: data.Store.map(item => {
        let {ID,ProductID,Qty,BillQty,BillCardQty} = item;
        let {code, name, id, type} = createdProducts[ProductID];
        return ({id, differenceQuantity: parseFloat(Qty) - parseFloat(foundProductStocks[id].stockQuantity), reason: sails.config.constant.STOCK_CHECK_CARD_REASON.OTHER})
      }), //[{id, differenceQuantity, reason}]
      checkedAt: createdAt,
      branchId,
      stockId,
    })
    
    console.log("// điều chỉnh giá vốn");
    let updatedCostPrice = await Promise.all(data.Product.map(item => {
      let {ID,Name,Code,CustomerID,ProductUnit,ProductType,Notes,FixPrice,ProjectID,DiscountMax} = item;
      let {code, name, id, type} = createdProducts[ID];
      
      return ProductPrice.update(datasource, {productId: id}).set({
        costUnitPrice: FixPrice ? parseFloat(FixPrice) : undefined,
      })
    }))
    
    console.log("// Điều chỉnh công nợ");
    let foundDebts = await Debt.find(datasource, {});
    let _foundDebts = {};
    foundDebts.forEach(item => {
      _foundDebts[item.customerId] = item;
    })
    let updatedDebts = await Promise.all(data.Customer.map(item => {
      let {ID,Code,Name,Address,Tel,Fax,RepName,Mobile,Notes,Type,QtyIn,QtyOut,QtyOutstanding,Fix,DebtCeiling,MaxDebtDay,TaxCode,QtyDeposit,QtyInit} = item;
      let {id} = createdCustomers[ID] || {};

      return id ? sails.helpers.debt.create(datasource, {
        changeValue: parseFloat(QtyOutstanding) - ((_foundDebts[id] || {}).remainingValue || 0),
        customerId: id,
        createdBy,
      }) : null;
    }))
    
    return exits.success({
      status: true
    });
  }
};

