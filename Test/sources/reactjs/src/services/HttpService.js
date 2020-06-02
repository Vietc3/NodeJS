import React from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import store from "store/Store";
import userAction from "store/actions/UserAction";
import Actions from "store/actions/";
import Constants from "variables/Constants/";
import i18n from "i18n";
import _ from "lodash";
import { notification } from "antd";
import ManualSortFilter from "MyFunction/ManualSortFilter";
import crypto from "crypto";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || (window.location.protocol + '//' + window.location.hostname + ':1337/api/v1'); 
setLanguage(Constants.DEFAULT_LANGUAGE);

axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    Actions.loading.on();
    return config;
  },
  error => {
    Actions.loading.off();
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  res => {
    Actions.loading.off();
    return res.data;
  },
  async error => {
    let status = error.response ? error.response.status : null;

    if (status && status === 403) {
      notifyError(error.response.data.message);
      localStorage.setItem("token", "");
      store.dispatch(userAction.updateUserInfo({}));
    }

    if (status && status === 500) {
      notifyError("Không có phản hồi");
    }
		
    Actions.loading.off();
    return Promise.reject(error);
  }
);

setJwt(localStorage.getItem("token"));

function setJwt(jwt) {
  if (jwt) {
    localStorage.setItem("token", jwt);
    axios.defaults.headers.common["Authorization"] = "JWT " + jwt;
  } else {
    setUser({});
  }
}

async function getData() {
  let pageFirst = {
    filter: {},
    limit: 10,
    skip: 0,
    sort: undefined,
    manualFilter: {},
    manualSort: {}    
  }

  let pageSecond = {
    filter: {},
    limit: 10,
    skip: 10,
    sort: undefined,
    manualFilter: {},
    manualSort: {}    
  }

  let page = {
    filter: {},
    limit: 20,
    skip: 0,
    sort: undefined,
    manualFilter: {},
    manualSort: {} 
  }

  let hashPageFirst = crypto.createHash("md5").update(JSON.stringify(pageFirst)).digest('hex');
  let hashPageSecond = crypto.createHash("md5").update(JSON.stringify(pageSecond)).digest('hex');

  let [
    products, 
    productTypes, 
    productUnits, 
    customers, 
    suppliers, 
    invoices, 
    invoiceReturns, 
    imports, 
    importReturns, 
    incomeExpenses, 
    deposits, 
    incomeExpenseType, 
    users, 
    roles,
    saleOrders,
    importOrders,
    stockChecks,
    importStocks,
    exportStocks
  ] = await Promise.all([
    axios.post(`${"/product"}/list`,{}), 
    axios.post(`${"/product_types"}/list`,{}), 
    axios.post(`${"/product_unit"}/list`,{}),
    axios.post(`${"/customer"}/${Constants.CUSTOMER_TYPE.TYPE_CUSTOMER}/list`,{}),
    axios.post(`${"/customer"}/${Constants.CUSTOMER_TYPE.TYPE_SUPPLIER}/list`,{ isBranch: true }),
    axios.post(`${"/invoice"}/list`, page),
    axios.post(`${"/invoice_return"}/list`, page),
    axios.post(`${"/import_card"}/list`, page),
    axios.post(`${"/import_return_card"}/list`, page),
    axios.post(`${"/income_expense"}/list`, page),
    axios.post(`${"/deposit_card"}/list`, page),
    axios.post(`${"/income_expense_type"}/list`,{}),
    axios.post(`${"/users"}/list`,{}),
    axios.post(`${"/role"}/list`,{}),
    axios.post(`${"/order-card"}/list`, {...page, filter: { type: Constants.ORDER_CARD_TYPE.EXPORT }}),
    axios.post(`${"/order-card"}/list`, {...page, filter: { type: Constants.ORDER_CARD_TYPE.IMPORT }}),
    axios.post(`${"/stockcheck"}/list`, page),
    axios.post(`${"/move_stock_card"}/list`, { ...page, reason: Constants.MOVE_STOCK_REASON.id.IMPORT }),
    axios.post(`${"/move_stock_card"}/list`, { ...page, reason: {'in': [Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT, Constants.MOVE_STOCK_REASON.id.EXPORT_RETURN]} }),
  ]);

  if (products.status) {
    store.dispatch(Actions.changeProductList(ManualSortFilter.sortArrayObject(products.data, "name", "asc")))
  }

  if (productTypes.status) {
    store.dispatch(Actions.changeProductTypeList(ManualSortFilter.sortArrayObject(productTypes.data, "name", "asc")))
  }

  if (productUnits.status) {
    store.dispatch(Actions.changeProductUnitList(ManualSortFilter.sortArrayObject(productUnits.data, "name", "asc")))
  }

  if (customers.status) {
    store.dispatch(Actions.changeCustomerList(ManualSortFilter.sortArrayObject(customers.data, "name", "asc")))
  }

  if (suppliers.status) {
    store.dispatch(Actions.changeSupplierList(ManualSortFilter.sortArrayObject(suppliers.data, "name", "asc")))
  }

  if (invoices.status) {
    let obj = {};
    obj[hashPageFirst] = { data: invoices.data.slice(0, 10), count: invoices.count };

    if(invoices.data.length > 10) 
      obj[hashPageSecond] =  { data: invoices.data.slice(10, 20), count: invoices.count };

    store.dispatch(Actions.changeInvoice(obj))
  }

  if (invoiceReturns.status) {
    let obj = {};
    obj[hashPageFirst] = { data: invoiceReturns.data.slice(0, 10), count: invoiceReturns.count };

    if(invoiceReturns.data.length > 10) 
      obj[hashPageSecond] =  { data: invoiceReturns.data.slice(10, 20), count: invoiceReturns.count };

    store.dispatch(Actions.changeInvoiceReturn(obj))
  }

  if (imports.status) {
    let obj = {};
    obj[hashPageFirst] = { data: imports.data.slice(0, 10), count: imports.count };

    if(imports.data.length > 10) 
      obj[hashPageSecond] =  { data: imports.data.slice(10, 20), count: imports.count };

    store.dispatch(Actions.changeImport(obj))
  }

  if (importReturns.status) {
    let obj = {};
    obj[hashPageFirst] = { data: importReturns.data.slice(0, 10), count: importReturns.count };

    if(importReturns.data.length > 10) 
      obj[hashPageSecond] =  { data: importReturns.data.slice(10, 20), count: importReturns.count };

    store.dispatch(Actions.changeImportReturn(obj))
  }

  if (incomeExpenses.status) {
    let obj = {};
    obj[hashPageFirst] = { data: incomeExpenses.data.slice(0, 10), count: incomeExpenses.count };

    if(incomeExpenses.data.length > 10) 
      obj[hashPageSecond] =  { data: incomeExpenses.data.slice(10, 20), count: incomeExpenses.count };

    store.dispatch(Actions.changeIncomeExpense(obj))
  }

  if (deposits.status) {
    let obj = {};
    obj[hashPageFirst] = { data: deposits.data.slice(0, 10), count: deposits.count };

    if(deposits.data.length > 10) 
      obj[hashPageSecond] =  { data: deposits.data.slice(10, 20), count: deposits.count };

    store.dispatch(Actions.changeDepositList(obj))
  }

  if (incomeExpenseType.status) {
    store.dispatch(Actions.changeIncomeExpenseType(ManualSortFilter.sortArrayObject(incomeExpenseType.data, "name", "asc")))
  }

  if (users.status) {
    store.dispatch(Actions.changeUserList(ManualSortFilter.sortArrayObject(users.data, "fullName", "asc")))
  }

  if (roles.status) {
    store.dispatch(Actions.changeRoleList(ManualSortFilter.sortArrayObject(roles.data, "name", "asc")))
  }

  if (saleOrders.status) {
    let obj = {};
    let hashPageFirstSaleOrder = crypto.createHash("md5").update(JSON.stringify({...pageFirst, filter: { type: Constants.ORDER_CARD_TYPE.EXPORT } })).digest('hex');

    obj[hashPageFirstSaleOrder] = { data: saleOrders.data.slice(0, 10), count: saleOrders.count };

    if(saleOrders.data.length > 10) {
      let hashPageSecondSaleOrder = crypto.createHash("md5").update(JSON.stringify({...pageSecond, filter: { type: Constants.ORDER_CARD_TYPE.EXPORT } })).digest('hex');
      obj[hashPageSecondSaleOrder] =  { data: saleOrders.data.slice(10, 20), count: saleOrders.count };
    }

    store.dispatch(Actions.changeSaleOrder(obj))
  }

  if (importOrders.status) {
    let obj = {};
    let hashPageFirstSaleOrder = crypto.createHash("md5").update(JSON.stringify({...pageFirst, filter: { type: Constants.ORDER_CARD_TYPE.IMPORT } })).digest('hex');

    obj[hashPageFirstSaleOrder] = { data: importOrders.data.slice(0, 10), count: importOrders.count };

    if(importOrders.data.length > 10) {
      let hashPageSecondSaleOrder = crypto.createHash("md5").update(JSON.stringify({...pageSecond, filter: { type: Constants.ORDER_CARD_TYPE.IMPORT } })).digest('hex');
      obj[hashPageSecondSaleOrder] =  { data: importOrders.data.slice(10, 20), count: importOrders.count };
    }

    store.dispatch(Actions.changeImportOrder(obj))
  }

  if (stockChecks.status) {
    let obj = {};
    obj[hashPageFirst] = { data: stockChecks.data.slice(0, 10), count: stockChecks.count };

    if(stockChecks.data.length > 10) 
      obj[hashPageSecond] =  { data: stockChecks.data.slice(10, 20), count: stockChecks.count };

    store.dispatch(Actions.changeStockCheck(obj))
  }

  if (importStocks.status) {
    let obj = {};
    let hashPageFirstSaleOrder = crypto.createHash("md5").update(JSON.stringify({...pageFirst, filter: { reason: Constants.MOVE_STOCK_REASON.id.IMPORT } })).digest('hex');

    obj[hashPageFirstSaleOrder] = { data: importStocks.data.slice(0, 10), count: importStocks.count };

    if(importStocks.data.length > 10) {
      let hashPageSecondSaleOrder = crypto.createHash("md5").update(JSON.stringify({...pageSecond, filter: { reason: Constants.MOVE_STOCK_REASON.id.IMPORT } })).digest('hex');
      obj[hashPageSecondSaleOrder] =  { data: importStocks.data.slice(10, 20), count: importStocks.count };
    }

    store.dispatch(Actions.changeImportStockList(obj))
  }

  if (exportStocks.status) {
    let obj = {};
    let hashPageFirstSaleOrder = crypto.createHash("md5").update(JSON.stringify({...pageFirst, filter: { reason: {'in': [Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT, Constants.MOVE_STOCK_REASON.id.EXPORT_RETURN]} } })).digest('hex');

    obj[hashPageFirstSaleOrder] = { data: exportStocks.data.slice(0, 10), count: exportStocks.count };

    if(exportStocks.data.length > 10) {
      let hashPageSecondSaleOrder = crypto.createHash("md5").update(JSON.stringify({...pageSecond, filter: { reason: {'in': [Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT, Constants.MOVE_STOCK_REASON.id.EXPORT_RETURN]} } })).digest('hex');
      obj[hashPageSecondSaleOrder] =  { data: exportStocks.data.slice(10, 20), count: exportStocks.count };
    }

    store.dispatch(Actions.changeExportStockList(obj))
  }
}

async function setUser (data){
  let dataSales = localStorage.getItem("sales-counter") || "";
  let branchId = localStorage.getItem("branchId") || "";
  let currentUser = localStorage.getItem("currentUser") || "";
  let nameBranch = localStorage.getItem("nameBranch") || "";  

  if (data && data.user)
    localStorage.setItem("currentUser",data.user.id);

  if(store.getState().reducer_user.Language_Product >= Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY) 
    setLanguage((data.user || {}).language);

  let isJson = JSON.isJson(dataSales);  

  if (isJson && JSON.parse(dataSales) && currentUser){
    if (data.user && data.user.id !== parseInt(currentUser)){
      localStorage.removeItem("sales-counter");
    } 
  }

  if (branchId && currentUser && data.user && data.user.branchId) {
    if (data.user && data.user.id !== parseInt(currentUser)){
      localStorage.removeItem("branchId"); 
      localStorage.removeItem("nameBranch"); 
      localStorage.removeItem("checkview"); 

      if (data.user.branchId) {
        getBranch(data.user.branchId)
      }
    }
    else  {
      if (data.user && data.user.branchId){
        let branch = JSON.parse(data.user.branchId)
        let responds = await axios.post(`${"/branch"}/list`,{ filter: {status: Constants.BRANCH_STATUS_OPTIONS[0].value, id: {in: branch}}, sort:"createdAt ASC" } );

        if(!responds.status) {
          notifyError(responds.error)
        }
        else {
            let index = responds.data.findIndex(elem => elem.id === Number(branchId));

            if( index > -1){
              setBranch(branchId, false, nameBranch);
            } else {
              setBranch(responds.data[0].id, false, responds.data[0].name)
            }      
        }
      } else setBranch(branchId, false, nameBranch);
    }

    store.dispatch(userAction.updateUserInfo(_.pick(data, ['user', 'role', 'permissions'])));
  }

  if ( !branchId && data.user && data.user.branchId ) {
    let branch = JSON.parse(data.user.branchId)
    let responds = await axios.post(`${"/branch"}/list`,{ filter: {status: Constants.BRANCH_STATUS_OPTIONS[0].value, id: {in: branch}} } );

    if(!responds.status) {
      notifyError(responds.error)
    }
    else setBranch(responds.data[0].id, false, responds.data[0].name)
  }
  
  store.dispatch(userAction.updateUserInfo(_.pick(data, ['user', 'role', 'permissions'])));
}

function getBranch(branchId) {
  let branch = JSON.parse(branchId)

  branch = branch.sort((a, b) => a - b)

  setBranch(branch[0], false, "")
}

function setLanguage(lang) {
  if(lang) {
    axios.defaults.headers.common['Accept-Language'] = lang;
    store.dispatch(Actions.changeLanguage(lang));
    i18n.changeLanguage(lang);
  }
}

async function setBranch(branchId, isGetBranch, nameBranch) {
  if(branchId) {
    axios.defaults.headers.common['branch-id'] = branchId;
    let responds = await axios.post(`${"/stocklist"}/list`,{ filter: {deletedAt: { ">=": 0}, branchId} } );
    if(!responds.status) {
      notifyError(responds.error)
    } else {
      let stockList = {};
      responds.data.map(item => stockList[item.id] = {...item, stockColumnName: Constants.STOCK_QUANTITY_LIST[item.stockColumnIndex]});
      setStockList(stockList);
    }
    
    store.dispatch(Actions.changeBranch(branchId, isGetBranch ? isGetBranch : false, nameBranch ? nameBranch : Constants.DEFAULT_BRANCH_NAME ));
  }
}

function setStockList(stockList, fullStockList) {
  store.dispatch(Actions.changeStockList(stockList, fullStockList));
}

function notifyError(message){
  notification.error({
    message: <span className={`notification-error-character`}>{message}</span>,
    duration: 2,
    placement: "bottomRight",
    className: `notification-error-style`,
  });
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  setUser,
  setLanguage,
  setBranch,
  setStockList,
  getData
};
