/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */
// const checkPermission = require('sails').checkPermission

const { constant } = require("./constant");
const checkPermission = require("../api/policies/check-permission");
const changeLanguage = require("../api/policies/change-language");
const checkBranch = require("../api/policies/check-branch")

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/
  '*': [changeLanguage(), 'jwt-auth'],

  // Bypass the `is-logged-in` policy for:
  'store/create': [changeLanguage()],
  'user/login': [changeLanguage()],
  'user/forgot-password': [changeLanguage()],
  'user/reset-password': [changeLanguage()],
  
  // 'user/list': ['jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  "role/create": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_ALL)],
  "role/get": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  "role/update": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_ALL)],
  "role/delete": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_ALL)],
  "role/list": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  "role/delete-batch": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_ALL)],

  "permission/create": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_ALL)],
  "permission/update": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_USER, constant.PERMISSION_TYPE.TYPE_ALL)],
  
  // BRANCHES
  "branch/create": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_BRANCH, constant.PERMISSION_TYPE.TYPE_ALL)],
  "branch/update": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_BRANCH, constant.PERMISSION_TYPE.TYPE_ALL)],
  "branch/delete": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_BRANCH, constant.PERMISSION_TYPE.TYPE_ALL)],
  "branch/get": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_BRANCH, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  // "branch/list": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STORE, constant.PERMISSION_TYPE.TYPE_ALL)],
  //STOCK
  "stocklist/create": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STOCK, constant.PERMISSION_TYPE.TYPE_ALL)],
  "stocklist/update": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STOCK, constant.PERMISSION_TYPE.TYPE_ALL)],
  "stocklist/delete": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STOCK, constant.PERMISSION_TYPE.TYPE_ALL)],
  "stocklist/get": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STOCK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  //ACTION-LOG
  "actionlog/list": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_ACTION_LOG, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  "actionlog/get": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_ACTION_LOG, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  // STORE-CONFIG
  // "StoreConfig/print-template": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STORE, constant.PERMISSION_TYPE.TYPE_ALL)],
  // "StoreConfig/get": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STORE, constant.PERMISSION_TYPE.TYPE_ALL)],
  "StoreConfig/update": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STORE, constant.PERMISSION_TYPE.TYPE_ALL)],
  "StoreConfig/get-print-template": [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_SETUP_STORE, constant.PERMISSION_TYPE.TYPE_ALL)],
  "StoreConfig/get-logo": [changeLanguage()],
  "StoreConfig/get-expired": [changeLanguage()],

  'product/list': [changeLanguage(), 'jwt-auth', checkBranch()],
  'product/create': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/get': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'product/update': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/delete': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/stop': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/update-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/delete-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/stop-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/update-price': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANAGEMENT_PRICE, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/list-formula': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],

  'filestorage/upload': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'filestorage/delete': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_PRODUCT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'product/get-image-product': [changeLanguage(), 'jwt-auth'],

  'stockcheck/list': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_STOCK_CKECK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'stockcheck/create': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_STOCK_CKECK, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'stockcheck/get': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_STOCK_CKECK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'stockcheck/update': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_STOCK_CKECK, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'stockcheck/delete': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_STOCK_CKECK, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'stockcheck/delete-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_STOCK_CKECK, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],

  'invoice/list': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_INVOICE]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY }, {[constant.SALES_COUNTER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'invoice/create': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_INVOICE]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.SALES_COUNTER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'invoice/get': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_INVOICE]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY }, {[constant.SALES_COUNTER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'invoice/update': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_INVOICE]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.SALES_COUNTER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'invoice/delete': [changeLanguage(), 'jwt-auth',checkPermission({ or :[{[constant.ROLE_INVOICE]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.SALES_COUNTER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'invoice/delete-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_INVOICE, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],

  'import_card/list': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_IMPORT]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY }, {[constant.ROLE_MANUFACTURE_IMPORT_STOCK]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'import_card/create': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_IMPORT]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.ROLE_MANUFACTURE_IMPORT_STOCK]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'import_card/get': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_IMPORT]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY }, {[constant.ROLE_MANUFACTURE_IMPORT_STOCK]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'import_card/update': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_IMPORT]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.ROLE_MANUFACTURE_IMPORT_STOCK]: constant.PERMISSION_TYPE.TYPE_ALL}]}), checkBranch()],
  'import_card/delete': [changeLanguage(), 'jwt-auth', checkPermission({ or :[{[constant.ROLE_IMPORT]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.ROLE_MANUFACTURE_IMPORT_STOCK]: constant.PERMISSION_TYPE.TYPE_ALL}]}), checkBranch()],
  'import_card/delete-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_IMPORT, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],

  'export_card/list': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_EXPORT_STOCK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'export_card/create': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_EXPORT_STOCK, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'export_card/get': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_EXPORT_STOCK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'export_card/update': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_EXPORT_STOCK, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'export_card/delete': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_EXPORT_STOCK, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],

  'invoice_return/list': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_INVOICE_RETURN, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'invoice_return/create': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_INVOICE_RETURN, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'invoice_return/get': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_INVOICE_RETURN, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'invoice_return/update': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_INVOICE_RETURN, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'invoice_return/delete-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_INVOICE_RETURN, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],

  'import_return_card/list': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_IMPORT_RETURN, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'import_return_card/create': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_IMPORT_RETURN, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'import_return_card/get': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_IMPORT_RETURN, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'import_return_card/update': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_IMPORT_RETURN, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'import_return_card/delete': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_IMPORT_RETURN, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'import_return_card/delete-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_IMPORT_RETURN, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],

  'cashbook/list': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_CASHBOOK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  'cashbook/create': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_CASHBOOK, constant.PERMISSION_TYPE.TYPE_ALL)],
  'cashbook/get': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_CASHBOOK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY)],
  'cashbook/update': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_CASHBOOK, constant.PERMISSION_TYPE.TYPE_ALL)],
  'cashbook/delete': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_CASHBOOK, constant.PERMISSION_TYPE.TYPE_ALL)],
  'cashbook/delete-batch': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_CASHBOOK, constant.PERMISSION_TYPE.TYPE_ALL)],

  'report/get-dashboard-report': [changeLanguage(), 'jwt-auth', checkBranch()],
  'report/get-debt-report': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_REPORT_DEBT, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'report/get-sale-report': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_REPORT_SALE, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'report/get-inventory-report': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_REPORT_STOCK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'report/general-debt': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_GENERAL_DEBT, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'report/get-sales-counter': [changeLanguage(), 'jwt-auth', checkPermission(constant.SALES_COUNTER, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],

  'report/import-export-detail': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_REPORT_IMPORT_EXPORT_DETAIL, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'report/get-import-export-report': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_REPORT_IMPORT_EXPORT, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'report/low-stock-report': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_REPORT_LOW_STOCK, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  
  'manufacturing_card/list': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_CARD, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'manufacturing_card/create': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_CARD, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'manufacturing_card/get' : [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_CARD, constant.PERMISSION_TYPE.TYPE_VIEW_ONLY), checkBranch()],
  'manufacturing_card/update': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_CARD, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],
  'manufacturing_card/cancel': [changeLanguage(), 'jwt-auth', checkPermission(constant.ROLE_MANUFACTURE_CARD, constant.PERMISSION_TYPE.TYPE_ALL), checkBranch()],

  'order-card/list': [changeLanguage(), 'jwt-auth', checkPermission({or :[{[constant.ROLE_INVOICE_ORDER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY }, {[constant.ROLE_IMPORT_ORDER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'order-card/create': [changeLanguage(), 'jwt-auth', checkPermission({or :[{[constant.ROLE_INVOICE_ORDER]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.ROLE_IMPORT_ORDER]: constant.PERMISSION_TYPE.TYPE_ALL}]}), checkBranch()],
  'order-card/get': [changeLanguage(), 'jwt-auth', checkPermission({or :[{[constant.ROLE_INVOICE_ORDER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY }, {[constant.ROLE_IMPORT_ORDER]: constant.PERMISSION_TYPE.TYPE_VIEW_ONLY}]}), checkBranch()],
  'order-card/update': [changeLanguage(), 'jwt-auth', checkPermission({or :[{[constant.ROLE_INVOICE_ORDER]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.ROLE_IMPORT_ORDER]: constant.PERMISSION_TYPE.TYPE_ALL}]}), checkBranch()],
  'order-card/cancel' : [changeLanguage(), 'jwt-auth', checkPermission({or :[{[constant.ROLE_INVOICE_ORDER]: constant.PERMISSION_TYPE.TYPE_ALL }, {[constant.ROLE_IMPORT_ORDER]: constant.PERMISSION_TYPE.TYPE_ALL}]}), checkBranch()],
};
