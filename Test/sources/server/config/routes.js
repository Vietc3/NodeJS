/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  before: {

    '/*': function (req, res, next) {
      sails.hooks.i18n.setLocale(req.getLocale());
      next();
    }
  },
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/
   
   // USER PROFILE
  "GET /api/v1/user_profile": { action: "user-profile/get" },
  "GET /api/v1/user_profile/avatar": { action: "user-profile/get-avatar" },
  "PUT /api/v1/user_profile": { action: "user-profile/update" },
  "PUT /api/v1/user_profile/change_password": { action: "user-profile/change-password" },

	 // USER
  "POST /api/v1/users/signup": { action: "user/create" },
  "POST /api/v1/users/login": { action: "user/login" },
  "GET /api/v1/users/:id": { action: "user/get" },
  "PUT /api/v1/users/:id": { action: "user/update" },
  "POST /api/v1/users/reset-password": { action: "user/reset-password" },
  "POST /api/v1/users/list": { action: "user/list" },
  "DELETE /api/v1/users/:id": { action: "user/delete" },
  "POST /api/v1/users/deleteBatch": { action: "user/delete-batch" },
  "POST /api/v1/users/forgot-password/": { action: "user/forgot-password" },


  //PRODUCT
  "POST /api/v1/product": { action: "product/create" },
  "GET /api/v1/product/:id": { action: "product/get" },
  "GET /api/v1/product/branch/:id": { action: "product/get-branch-products" },
  "PUT /api/v1/product/:id": { action: "product/update" },
  "DELETE /api/v1/product/:id": { action: "product/delete" },
  "PUT /api/v1/product/stop/:id": { action: "product/stop" },
  "POST /api/v1/product/list": { action: "product/list" },
  "POST /api/v1/product/updateBatch": { action: "product/update-batch" },
  "POST /api/v1/product/deleteBatch": { action: "product/delete-batch" },
  "POST /api/v1/product/stopBatch": { action: "product/stop-batch" },
  "POST /api/v1/product/updatePrice": { action: "product/update-price" },
  "GET /api/v1/product/formula/:id": { action: "product/get-formula" },
  "PUT /api/v1/product/formula/update/:id": { action: "product/update-formula" },
  "POST /api/v1/product/import": { action: "product/import" },
  "POST /api/v1/product/convertStockQuantity": { action: "product/convert-stock-quantity" },
  "POST /api/v1/product/formula/list": { action: "product/list-formula" },

  // PRODUCT TYPE
  "POST /api/v1/product_types": { action: "product_type/create" },
  "POST /api/v1/product_types/list": { action: "product_type/list" },
  "GET /api/v1/product_types/:id": { action: "product_type/get" },
  "PUT /api/v1/product_types/:id": { action: "product_type/update" },
  "DELETE /api/v1/product_types/:id": { action: "product_type/delete" },
  "POST /api/v1/product_types/deleteBatch": { action: "product_type/delete-batch" },

  // PERMISSION
  "POST /api/v1/permission": { action: "permission/create" },
  "PUT /api/v1/permission/:id": { action: "permission/update" },

  //INVOICE_RETURN
  "POST /api/v1/invoice_return": { action: "invoice_return/create" },
  "GET /api/v1/invoice_return/:id": { action: "invoice_return/get" },
  "PUT /api/v1/invoice_return/:id": { action: "invoice_return/update" },
  "DELETE /api/v1/invoice_return/:id": { action: "invoice_return/cancel" },
  "POST /api/v1/invoice_return/list": { action: "invoice_return/list" },
  "POST /api/v1/invoice_return/deleteBatch": { action: "invoice_return/delete-batch" },

  //ROLE
  "POST /api/v1/role": { action: "role/create" },
  "GET /api/v1/role/:id": { action: "role/get" },
  "PUT /api/v1/role/:id": { action: "role/update" },
  "DELETE /api/v1/role/:id": { action: "role/delete" },
  "POST /api/v1/role/list": { action: "role/list" },
  "POST /api/v1/role/deleteBatch": { action: "role/delete-batch" },
  "GET /api/v1/role/user/:id": { action: "user/get-user-role" },

  "POST /api/v1/cashflow": { action: "cashflow/create" },
  "POST /api/v1/cashflow/list": { action: "cashflow/list" },
  "PUT /api/v1/cashflow/:id": { action: "cashflow/update" },
  "GET /api/v1/cashflow/:id": { action: "cashflow/get" },
  "DELETE /api/v1/cashflow/:id": { action: "cashflow/delete" },
  "POST /api/v1/cashflow/deleteBatch": { action: "cashflow/delete-batch" },

  "POST /api/v1/product_unit": { action: "product_unit/create" },
  "GET /api/v1/product_unit/:id": { action: "product_unit/get" },
  "PUT /api/v1/product_unit/:id": { action: "product_unit/update" },
  "DELETE /api/v1/product_unit/:id": { action: "product_unit/delete" },
  "POST /api/v1/product_unit/list": { action: "product_unit/list" },
  "POST /api/v1/product_unit/deleteBatch": { action: "product_unit/delete-batch" },

  "POST /api/v1/invoice": { action: "invoice/create" },
  "POST /api/v1/invoice/list": { action: "invoice/list" },
  "POST /api/v1/invoice/list-invoice": { action: "invoice/invoice-list" },
  "GET /api/v1/invoice/:id": { action: "invoice/get" },
  "DELETE /api/v1/invoice/:id": { action: "invoice/delete" },
  "PUT /api/v1/invoice/:id": { action: "invoice/update" },
  "POST /api/v1/invoice/deleteBatch": { action: "invoice/delete-batch" },
  "POST /api/v1/invoice/:id": { action: "invoice/cancel" },

  //Order Card
  "POST /api/v1/order-card": { action: "order-card/create" },
  "POST /api/v1/order-card/list": { action: "order-card/list" },
  "GET /api/v1/order-card/:id": { action: "order-card/get" },
  "PUT /api/v1/order-card/:id": { action: "order-card/update" },
  "POST /api/v1/order-card/:id": { action: "order-card/cancel" },

  // DEBT CARD
  "POST /api/v1/debt": {action: "debt/create"},
  "POST /api/v1/debt/list": {action: "debt/list"},
  "GET /api/v1/debt/:id": {action: "debt/get"},

  // IMPORT CARD
  "POST /api/v1/import_card": { action: "import_card/create" },
  "POST /api/v1/import_card/list": { action: "import_card/list" },
  "GET /api/v1/import_card/:id": { action: "import_card/get" },
  "DELETE /api/v1/import_card/:id": { action: "import_card/delete" },
  "PUT /api/v1/import_card/:id": { action: "import_card/update" },
  "POST /api/v1/import_card/deleteBatch": { action: "import_card/delete-batch" },
  "POST /api/v1/import_card/:id": { action: "import_card/cancel" },

  // EXPORT CARD
  'POST /api/v1/export_card': { action: 'export_card/create' },
  'POST /api/v1/export_card/list': { action: 'export_card/list' },  
  'GET /api/v1/export_card/:id': { action: 'export_card/get' },
  'DELETE /api/v1/export_card/:id': { action: 'export_card/delete' },
  'PUT /api/v1/export_card/:id': { action: 'export_card/update' }, 
  'POST /api/v1/export_card/deleteBatch': { action: 'export_card/delete-batch' },
  
  // IMPORT RETURN CARD
  'POST /api/v1/import_return_card': { action: 'import_return_card/create' },
  'POST /api/v1/import_return_card/list': { action: 'import_return_card/list' },  
  'GET /api/v1/import_return_card/:id': { action: 'import_return_card/get' },
  'DELETE /api/v1/import_return_card/:id': { action: 'import_return_card/cancel' },
  'PUT /api/v1/import_return_card/:id': { action: 'import_return_card/update' }, 
  'POST /api/v1/import_return_card/deleteBatch': { action: 'import_return_card/delete-batch' },

  // INCOME EXPENSE TYPE
  "POST /api/v1/income_expense_type": { action: "income_expense_type/create" },
  "POST /api/v1/income_expense_type/list": { action: "income_expense_type/list" },
  "GET /api/v1/income_expense_type/:id": { action: "income_expense_type/get" },
  "PUT /api/v1/income_expense_type/:id": { action: "income_expense_type/update" },
  "DELETE /api/v1/income_expense_type/:id": { action: "income_expense_type/delete" },
  "POST /api/v1/income_expense_type/deleteBatch": { action: "income_expense_type/delete-batch" },
  
  // MOVE STOCK CARD
  'POST /api/v1/move_stock_card': { action: 'move_stock_card/create' },
  'POST /api/v1/move_stock_card/list': { action: 'move_stock_card/list' },  
  'GET /api/v1/move_stock_card/:id': { action: 'move_stock_card/get' },
  'POST /api/v1/move_stock_card/cancel': { action: 'move_stock_card/cancel' },
  'PUT /api/v1/move_stock_card/:id': { action: 'move_stock_card/update' }, 
	
	// STOCK CHECK CARD
  'POST /api/v1/stockcheck': { action: 'stockcheck/create' },
  'POST /api/v1/stockcheck/list': { action: 'stockcheck/list' },  
  'GET /api/v1/stockcheck/:id': { action: 'stockcheck/get' },
  'DELETE /api/v1/stockcheck/:id': { action: 'stockcheck/delete' },
  'PUT /api/v1/stockcheck/:id': { action: 'stockcheck/update' }, 
  "POST /api/v1/stockcheck/deleteBatch": { action: "stockcheck/delete-batch" },

  // INCOME EXPENSE
  "POST /api/v1/income_expense/list": { action: "income_expense/list" },
  "POST /api/v1/income_expense/:type": { action: "income_expense/create" },
  "GET /api/v1/income_expense/:type/:id": { action: "income_expense/get" },
  "PUT /api/v1/income_expense/:type/:id": { action: "income_expense/update" },
  "DELETE /api/v1/income_expense/:type/:id": { action: "income_expense/cancel" },

  // CUSTOMER
  "POST /api/v1/customer/:type": { action: "customer/create" },
  "GET /api/v1/customer/:type/:id": { action: "customer/get" },
  "PUT /api/v1/customer/:type/:id": { action: "customer/update" },
  "DELETE /api/v1/customer/:type/:id": { action: "customer/delete" },
  "POST /api/v1/customer/:type/list": { action: "customer/list" },
  "POST /api/v1/customer/:type/updateBatch": { action: "customer/update-batch" },
  "POST /api/v1/customer/:type/deleteBatch": { action: "customer/delete-batch" },
  "POST /api/v1/customer/:type/import": { action: "customer/import" },

  //FILE STORAGE
  "POST /api/v1/file-storage": { action: "filestorage/upload" },
  "POST /api/v1/file-storage/delete": { action: "filestorage/delete" },
  "POST /api/v1/file-storage/list": { action: "product/get-image-product" },
  
  // CASHBOOK
  'POST /api/v1/cashbook': { action: 'cashbook/create' },
  'POST /api/v1/cashbook/list': { action: 'cashbook/list' },  
  'GET /api/v1/cashbook/:id': { action: 'cashbook/get' },
  'DELETE /api/v1/cashbook/:id': { action: 'cashbook/delete' },
  'PUT /api/v1/cashbook/:id': { action: 'cashbook/update' }, 
  'POST /api/v1/cashbook/deleteBatch': { action: 'cashbook/delete-batch' },

  //DASH BOARD
  "POST /api/v1/get-dashboard-report": { action: "report/get-dashboard-report" },

  // INVENTORY REPORT
  "POST /api/v1/get-inventory-report": { action: "report/get-inventory-report"},
  "POST /api/v1/get-import-export-report": { action: "report/get-import-export-report"},
  "POST /api/v1/get-general-debt-report": { action: "report/general-debt"},
  
  //REPORT
  "POST /api/v1/get-debt-report": { action: "report/get-debt-report" },
  "POST /api/v1/get-sale-report": { action: "report/get-sale-report" },
  "POST /api/v1/import-export-detail": { action: "report/import-export-detail" },

  //PRINT
  "POST /api/v1/store-config/print": { action: "StoreConfig/print-template" },
  "POST /api/v1/store-config/get": { action: "StoreConfig/get" },
  "PUT /api/v1/store-config/update": { action: "StoreConfig/update" },
  "POST /api/v1/store-config/": { action: "StoreConfig/get" },
  "PUT /api/v1/store-config/:id": { action: "StoreConfig/update" },
  "POST /api/v1/store-config/print-template": { action: "StoreConfig/get-print-template" },
  "GET /api/v1/store-config/logo": { action: "StoreConfig/get-logo" },
  "GET /api/v1/store-config/expired": { action: "StoreConfig/get-expired" },
  
  //MANUFACTURING CARD
  'POST /api/v1/manufacturing_card': { action: 'manufacturing_card/create' },
  "GET /api/v1/manufacturing_card/:id": { action: "manufacturing_card/get" },
  "POST /api/v1/manufacturing_card/list": { action: "manufacturing_card/list" },
  "PUT /api/v1/manufacturing_card/:id": { action: "manufacturing_card/update" },
  "POST /api/v1/manufacturing_card/:id": { action: "manufacturing_card/cancel" },

  //DEPOSIT CARD
  "POST /api/v1/deposit_card": { action: "deposit_card/create" },
  "POST /api/v1/deposit_card/list": { action: "deposit_card/list" },
  "GET /api/v1/deposit_card/:id": { action: "deposit_card/get" },
  "DELETE /api/v1/deposit_card/:id": { action: "deposit_card/cancel" },
  "PUT /api/v1/deposit_card/:id": { action: "deposit_card/update" },

  //QUOTA REPORT
  "POST /api/v1/low-stock-report": { action: "report/low-stock-report"},

  //SALES COUNTER
  "POST /api/v1/get-sales-counter": { action: "report/get-sales-counter" },

  //FINISHED ESTIMATES
  "POST /api/v1/finished-estimates-report": { action: "report/finished-estimates-report"},
  "POST /api/v1/finished-estimates-report/get": { action: "report/expand-finished-estimates"},
  
  //TENANTS
  "POST /api/v1/store": { action: "store/create" },
  
  //BRANCHES
  "POST /api/v1/branch": { action: "branch/create" },
  "GET /api/v1/branch/:id": { action: "branch/get" },
  "POST /api/v1/branch/list": { action: "branch/list" },
  "PUT /api/v1/branch/:id": { action: "branch/update" },
  'DELETE /api/v1/branch/:id': { action: 'branch/delete' },
  
  // STOCKLIST
  "POST /api/v1/stocklist": { action: "stocklist/create" },
  "GET /api/v1/stocklist/:id": { action: "stocklist/get" },
  "POST /api/v1/stocklist/list": { action: "stocklist/list" },
  "PUT /api/v1/stocklist/:id": { action: "stocklist/update" },
  'DELETE /api/v1/stocklist/:id': { action: 'stocklist/delete' },

  // ACTION LOG
  "POST /api/v1/actionlog/list": { action: "action_log/list" },
  "GET /api/v1/actionlog/:id": { action: "action_log/get" }

  
  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
