module.exports.constant= {
  NOT_FOUND: -1,
  finish: 2,
  tempCard: 1,
  zero: 0,
  reasonOther: 6,
  import: "phiếu nhập",
  invoice: "đơn hàng",
  invoiceReturn: "phiếu trả hàng",
  importReturn: "phiếu trả hàng nhập",
  manufacturingCard: "phiếu sản xuất",
  space: " ",
  autoCheckStockChangeStockProduct: "Phiếu kiểm kho được tạo tự động khi chuyển đổi số lượng tồn kho của sản phẩm",
  autoCheckStockCreateProduct: "Phiếu kiểm kho được tạo tự động khi tạo sản phẩm ",
  autoCheckStockUpdateProduct: "Phiếu kiểm kho được tạo tự động khi cập nhật sản phẩm ",
  autoExportCreateImportReturn: "Phiếu xuất kho được tạo tự động khi tạo phiếu trả hàng nhập ", 
  autoExportUpdateImportReturn: "Phiếu xuất kho được tạo tự động khi cập nhật phiếu trả hàng nhập ",
  autoImportCreateInvoiceReturn: "Phiếu nhập kho được tạo tự động khi tạo phiếu trả hàng",
  autoImportUpdateInvoiceReturn: "Phiếu nhập kho được tạo tự động khi cập nhật phiếu trả hàng",

  autoDeptCardCreate: "Công nợ được tạo tự động khi tạo ",
  autoDeptCardPaid: "Công nợ được tạo tự động khi thanh toán ",
  autoAppDeposit: "Tiền ký gửi được thu tự động khi tạo ",
  autoAppCancelDeposit: "Tiền ký gửi được thu tự động khi hủy ",
  autoAppUpdateDeposit: "Tiền ký gửi được thu tự động khi cập nhật ",
  autoWithdrawUpdateDeposit: "Tiền ký gửi được rút tự động khi cập nhật ",
  autoWithdrawDeposit: "Tiền ký gửi được rút tự động khi tạo ",
  autoIncomeCreate: "Phiếu thu được tạo tự động khi tạo ",
  autoExpenseCreate: "Phiếu chi được tạo tự động khi tạo ",
  autoCashBookCreate: "Sổ quỹ được tạo tự động khi tạo ",
  
  //intercept message
  INTERCEPT: {
    // Công nợ
    EXIST_DEBT_CODE: 'Công nợ đã tồn tại',
    CANT_UPDATE_DEBT: 'Không thể cập nhật công nợ',
    NOT_FOUND_DEBT: "Không tìm thấy công nợ",
    
    // đơn hàng
    EXIST_INVOICE_CODE: "Mã đơn hàng đã tồn tại",
    NOT_FOUND_INVOICE: "Không tìm thấy đơn hàng",
    CANT_UPDATE_INVOICE_BECAUSE_RETURNED: "Không thể cập nhật đơn hàng do đơn hàng đã bị trả",
    CANT_CANCEL_INVOICE_BECAUSE_RETURNED: "Không thể hủy đơn hàng do đơn hàng đã bị trả",
    CANT_CANCEL_INVOICE_BECAUSE_PAID: "Không thể hủy đơn hàng do đơn hàng đã thanh toán",

    // đặt hàng
    EXIST_ORDER_CODE: "Mã đặt hàng đã tồn tại",
    NOT_FOUND_ORDER: "Không tìm thấy đơn đặt hàng",

    //phiếu nhập
    NOT_FOUND_IMPORT_CARD: "Không tìm thấy phiếu nhập",
    CANT_UPDATE_IMPORT_BECAUSE_RETURNED: "Không thể cập nhật đơn hàng do phiếu nhập đã bị trả",
    CANT_CANCEL_IMPORT_BECAUSE_RETURNED: "Không thể hủy phiếu nhập do đơn hàng đã bị trả",
    CANCELLED_IMPORT_CARD: "Phiếu nhập này đã bị hủy",
    
    // đặt cọc
    NOT_FOUND_DEPOSIT: "Không tìm thấy phiếu ký gửi",
    NOT_ENOUGH_DEPOSIT: 'Tiền ký gửi không đủ để thực hiện',
    
    // customer
    NOT_FOUND_CUSTOMER: "Khách hàng không tồn tại trong hệ thống",
    
    // invoice return
    NOT_FOUND_INVOICE_RETURN: "Không tìm thấy phiếu trả hàng",
    
    // income
    CANT_PAY: 'Không thể thanh toán',
    NOT_FOUND_INCOME: "Không tìm thấy phiếu thu",
    CANT_UPDATE_INCOME: "Không thể cập nhật phiếu thu này",
    CANT_CANCEL_INCOME: "Không thể hủy phiếu thu này",
    NOT_ENOUGH_INCOME_AMOUNT: "Giá trị phiếu thu phải lớn hơn 0",
    NOT_ENOUGH_INCOME_DEBT: "Số tiền thu vào nhiều hơn tiền cần trả",
    INCOME_IS_CANCELED: "Phiếu thu đã bị hủy",
    CANT_PAY_CANCELED_CARD: 'Không thể thanh toán phiếu đã hủy',
    DONT_HAVE_PAY_CARD: 'Không có phiếu để thanh toán',
    
    // expense
    NOT_FOUND_EXPENSE: "Không tìm thấy phiếu chi",
    CANT_UPDATE_EXPENSE: "Không thể cập nhật phiếu chi này",
    CANT_CANCEL_EXPENSE: "Không thể hủy phiếu chi này",
    NOT_ENOUGH_EXPENSE_AMOUNT: "Giá trị phiếu chi phải lớn hơn 0",
    NOT_ENOUGH_EXPENSE_DEBT: "Số tiền chi ra nhiều hơn tiền cần chi",
    EXPENSE_IS_CANCELED: "Phiếu chi đã bị hủy",
    
    // move stock card
    NOT_FOUND_MOVE_STOCK_CARD: "Không tìm thấy phiếu chuyển kho này",
    NOT_FOUND_REASON: "Không tìm thấy lý do của phiếu chuyển hàng",
    NOT_FOUND_ANY_PRODUCT: "Không tìm thấy sản phẩm nào",
    
    // product
    NOT_FOUND_PRODUCT: "Không tìm thấy sản phẩm",
    NEGATIVE_QUANTITY: "Số lượng sản phẩm không thể nhỏ hơn 0",
    NOT_ENOUGH_STOCK_QUANTITY: "Số lượng tồn trong kho không đủ để thực hiện",
    NOT_ENOUGH_MANUFACTURING_QUANTITY: "Số lượng tồn trong kho sản xuất không đủ để thực hiện",
    IS_NOT_FINISH_PRODUCT: "Sản phẩm không phải thành phẩm",
    
    // phiếu xuất
    EXIST_EXPORT_CARD_CODE: "Mã phiếu xuất đã tồn tại",
    
    // phiếu trả hàng nhập
    NOT_FOUND_IMPORT_RETURN_CARD: "Không tìm thấy phiếu trả hàng nhập",
    
    // phiếu sản xuất
    NOT_FOUND_MANUFACTURING_CARD: 'Không tìm thấy phiếu sản xuất',
    
    // other
    UsageError: "Thông tin không hợp lệ",
    CANT_UPDATE: 'Không thể cập nhật phiếu',
    CANT_CANCEL: 'Không thể hủy phiếu',
    CANT_DELETE: 'Không thể xóa phiếu',
    NOT_FOUND: 'Không thể tìm thấy ',
    CANT_USE_SYSTEM_PREFIX: 'Mã tự nhập không được có tiền tố %s của hệ thống',
    EXIST_CODE: "Mã '%s' đã tồn tại",
    
    // Chi nhánh
    NOT_FOUND_BRANCH: "Không tìm thấy chi nhánh",
    BRANCH_NOT_TRANSACTION: "Chi nhánh này đang tạm ngưng hoạt động",
    // Kho
    NOT_FOUND_STOCK: "Không tìm thấy kho",
    STOCK_DELETE: "Kho đã bị xóa xin chọn kho khác",

    NOT_FOUND_ACTION_LOG: "Không tìm thấy nhật kí cửa hàng"
  },
  // 1 - Tạo đơn hàng
  // 2 - Sửa đơn hàng
  // 3 - Hủy đơn hàng
  // 4 - Tạo trả hàng
  // 5 - Sửa trả hàng
  // 6 - Hủy trả hàng
  // 7 - Tạo nhập hàng
  // 8 - Sửa nhập hàng
  // 9 - Hủy nhập hàng
  // 10 - Tạo trả hàng nhập
  // 11 - Sửa trả hàng nhập
  // 12 - Hủy trả hàng nhập
  // 13 - Tạo phiếu thu
  // 14 - Sửa phiếu thu
  // 15 - Hủy phiếu thu
  // 16 - Tạo phiếu chi
  // 17 - Sửa phiếu chi
  // 18 - Hủy phiếu chi
  // 19 - Người dùng điều chỉnh
  DEBT_TYPES: {
    CREATE_INVOICE: 1,
    UPDATE_INVOICE: 2,
    DELETE_INVOICE: 3,
    
    CREATE_INVOICE_RETURN: 4,
    UPDATE_INVOICE_RETURN: 5,
    DELETE_INVOICE_RETURN: 6,
    
    CREATE_IMPORT: 7,
    UPDATE_IMPORT: 8,
    DELETE_IMPORT: 9,
    
    CREATE_IMPORT_RETURN: 10,
    UPDATE_IMPORT_RETURN: 11,
    DELETE_IMPORT_RETURN: 12,
    
    CREATE_INCOME: 13,
    UPDATE_INCOME: 14,
    DELETE_INCOME: 15,
    
    CREATE_EXPENSE: 16,
    UPDATE_EXPENSE: 17,
    DELETE_EXPENSE: 18,

    USER_CREATE: 19
  },
  
  DEPOSIT_TYPES: {
    ADD: 1,
    WITHDRAW: 2,
  },
  formatHour: "HH DD/MM/YYYY",
  formatDay: "DD/MM/YYYY",
  formatMonth: "MM/YYYY",
  formatYear: "YYYY",

  CUSTOMER_TYPE:{
    ALL: 0,
    TYPE_CUSTOMER: 1,
    TYPE_SUPPLIER: 2
  },

  CUSTOMER_TYPE_NAME: {
    1: "Khách hàng",
    2: "Nhà cung cấp",
  },

  INCOME_EXPENSE_TYPE:{
    TYPE_RECEIPT: 1,
    TYPE_PAYMENT: 2
  },

  INCOME_EXPENSE_TYPES:{
    INCOME: 1,
    EXPENSE: 2
  },

  INCOME_EXPENSE_CUSTOMER_TYPES: {
    CUSTOMER: 1,
    SUPPLIER: 2,
    STAFF: 3,
    OTHER: 4
  },
  
  // data khởi tạo incomeExpenseCardType
  // 1 - Thu tiền hàng (áp dụng khi bán hàng)
	// 2 - Thu tiền NCC hoàn trả (tự động, áp dụng khi trả hàng nhập)
  // 3 - Thu nhập khác
  // 4 - Chi tiền nhập hàng (khi nhập hàng)
	// 5 - Chi tiền trả hàng (khi khách trả hàng)
	// 6 - Khoản chi khác
  DEFAULT_INCOME_EXPENSE_CARD_TYPES: {
    INVOICE: {name: 'Tiền bán hàng', type: 1, auto: 1, shouldUpdateDebt: 1, code: 1}, // type: 1 - thu, 2 - chi
    IMPORT_RETURN: {name: 'Thu tiền NCC hoàn trả', type: 1, auto: 1, shouldUpdateDebt: 1, code: 2},
    OTHER_INCOME: {name: 'Thu nhập khác', type: 1, auto: 1, code: 3},
    IMPORT: {name: 'Tiền mua hàng', type: 2, auto: 1, shouldUpdateDebt: 1, code: 4},
    INVOICE_RETURN: {name: 'Chi tiền trả hàng', type: 2, auto: 1, shouldUpdateDebt: 1, code: 5},
    OTHER_EXPENSE: {name: 'Khoản chi khác', type: 2, auto: 1, code: 6},
  },
  
  DEFAULT_CUSTOMERS: {
    OTHER_CUSTOMER: {name: 'Khách lẻ', code: 'KH-001', type: 1}, // type: 1 - khách hàng, 2 - nhà cung cấp
  },

  PERMISSION_TYPE : {
    TYPE_VIEW_ONLY: 1,
    TYPE_ALL: 2
  },
  
  AUTO_INCOME_EXPENSE_TYPE: {
    RECEIPT_INVOICE: 1,
    RECEIPT_IMPORT_RETURN: 2,
    RECEIPT_OTHER: 3,
    PAYMENT_IMPORT: 4,
    PAYMENT_INVOICE_RETURN: 5,
    PAYMENT_OTHER: 6,
  },

  PRODUCT_CATEGORY_TYPE: {
    FINISHED: 1,
    MATERIAL: 2
  },

  MANUFACTURING_STATUS: {
    ONGOING: 0,
    FINISHED: 1,
    POSTPONED: 2,
    CANCELED: 3
  },

  FORGOT_PASSWORD: "/auth/forgot-password",
  
  ROLE_PRODUCT: 'product',
  ROLE_STOCK_CKECK: 'stock_check',
  ROLE_INVOICE: 'invoice',
  ROLE_IMPORT: 'import',
  ROLE_INVOICE_RETURN: 'invoice_return',
  ROLE_IMPORT_RETURN: 'import_return',
  ROLE_CUSTOMER: 'customer',
  ROLE_SUPPLIER: 'supplier',
  ROLE_CASHBOOK: 'cashbook',
  ROLE_INCOME_EXPENSE: 'income_expense',
  ROLE_SETUP_STORE: 'setup_store',
  ROLE_ACTION_LOG: 'action_log',
  ROLE_SETUP_USER: 'setup_user',
  ROLE_REPORT_OVERALL: 'report_overall',
  ROLE_REPORT_SALE: 'report_sale',
  ROLE_REPORT_PROFIT: 'report_profit',
  ROLE_REPORT_STOCK: 'report_stock',
  ROLE_GENERAL_DEBT: 'report_general_debt',
  ROLE_REPORT_DEBT: 'report_debt',
  ROLE_REPORT_CASHBOOK: 'report_cashbook',
  ROLE_REPORT_INCOME_EXPENSE: 'report_income_expense',
  ROLE_MANUFACTURING: 'manufacturing',
  ROLE_MANUFACTURE_PRODUCT: 'manufacture_product',
  ROLE_MANUFACTURE_WARE_HOUSE: 'manufacture_ware_house',
  ROLE_MANUFACTURE_CARD: 'manufacture_card',
  ROLE_MANUFACTURE_IMPORT_STOCK: 'manufacture_import_stock',
  ROLE_MANUFACTURE_EXPORT_STOCK: 'manufacture_export_stock',
  ROLE_MANAGEMENT_PRICE: 'management_price',
  ROLE_INVOICE_ORDER: 'invoice_order_card',
  ROLE_IMPORT_ORDER: 'import_order_card',
  ROLE_REPORT_IMPORT_EXPORT_DETAIL: "report_import_export_detail",
  SALES_COUNTER: "sales_counter",
  ROLE_REPORT_IMPORT_EXPORT: "report_import_export",
  ROLE_REPORT_LOW_STOCK: "report_low_stock",
  ROLE_SETUP_BRANCH: 'setup_branch',
  ROLE_SETUP_STOCK: 'setup_stock',

  IMPORT_CARD_REASON: {
    IMPORT_PROVIDER: 0,
    FINISHED_PRODUCT: 1,
    INVOICE_RETURN: 2
  },
  IMPORT_CARD_STATUS: {
    FINISHED: 1,
    CANCELED : 2
  },
  STOCK_CHECK_CARD_STATUS: {
    FINISHED: 2,
  },
  STOCK_CHECK_CARD_REASON: {
    FAIL: 1,
    ATROPHY: 2,
    INVOICE_RETURN:3,
    CONVERT_PRODUCT: 4,
    MANUFACTURE: 5,
    OTHER: 6,
    CONVERT_QUANTITY: 7
  },

  DEPOSIT_CARD_STATUS: {
    FINISHED: 1,
    CANCELED : 2,
  },
  INVOICE_CARD_STATUS: {
    FINISHED: 1,
    CANCELED : 2,
  },
  ORDER_CARD_STATUS: {
    ORDERER: 1,
    FINISHED: 2,
    CANCELED: 3
  },
  ORDER_CARD_TYPE: {
    IMPORT: 1,
    INVOICE: 2
  },
  INCOME_EXPENSE_CARD_STATUS: {
    FINISHED: 1,
    CANCELED : 2,
  },
  INVOICE_RETURN_CARD_STATUS: {
    FINISHED: 1,
    CANCELED : 2,
  },
  EXPORT_CARD_REASON: {
    SALE: 0,
    MANUFACTURE: 1,
    RETURN_PROVIDER: 2
  },
  EXPORT_CARD_STATUS: {
    FINISHED: 1,
    CANCELED : 2
  },
  MANUFACTURE_VALUE: {
    ON: 1,
    OFF: 0
  },
  
  // BRANCHES
  BRANCH_STATUS: {
    OFF: 0,
    FINISHED: 1,
    CANCELED: 2,
  },
  
  // Lý do chuyển kho
  MOVE_STOCK_REASON: {
    IMPORT: {id: 1, name: 'Nhập kho sản xuất'},
    EXPORT_FINISHED_PRODUCT: {id: 2, name: 'Xuất thành phẩm'},
    EXPORT_RETURN: {id: 3, name: 'Xuất trả lại'},
  },
  
  MOVE_STOCK_STATUS: {
    FINISHED: 1,
    CANCELED: 2,
  },
  MANUFACTURE_STOCK_VALUE: {
    ON: 1,
    OFF: 0
  },
  TRANSACTION_CARD_TYPE: {
    INVOICE: 1,
    IMPORT: 2,
    INVOICE_RETURN: 3,
    IMPORT_RETURN: 4
  },

  LOW_STOCK_STATUS: {
    LOW: 1,
    ENOUGH: 2,
  },

  PRODUCT_STOPPED_STATUS: {
    STOPPED: 1,
    NONE: 2,
  },

  SELECT_GROUP_IMPORT_EXPORT_REPORT: {
    ALL: 0,
    PRODUCT: 1,
    CUSTOMER: 2,
    SUPPLIER: 3
  },

  TYPE_CARD_IMPORT_EXPORT_REPORT: {
    INVOICE_CUSTOMER: 1,
    INVOICE_RETURN_CUSTOMER: 2,
    IMPORT_CUSTOMER: 3,
    IMPORT_RETURN_CUSTOMER: 4,
    INVOICE_PRODUCT: 5,
    INVOICE_RETURN_PRODUCT: 6,
    IMPORT_PRODUCT: 7,
    IMPORT_RETURN_PRODUCT: 8,
    STOCK_CHECK: 9,
    IMPORT_STOCK: 10,
    EXPORT_STOCK: 11
  },
  BRANCH_DEFAULT: 1,
  
  STOCK_QUANTITY_LIST: {
    1: 'stockQuantity',
    2: 'stockQuantity2',
    3: 'stockQuantity3',
    4: 'stockQuantity4',
    5: 'stockQuantity5',
    6: 'stockQuantity6',
  },
  DEFAULT_STOCK_LIST: "Kho mặc định",

  // FUNCTION OF ACTION LOG
  ACTION_LOG_TYPE: {
    AUTHENTICATE: 1, //xác thực
    PRODUCT: 2, // sản phẩm
    INVOICE: 3, // đơn hàng
    INVOICE_RETURN: 4, // trả hàng
    IMPORT: 5, // nhập hàng
    IMPORT_RETURN: 6, // trả hàng nhập
    ORDER_INVOICE: 7, // đặt hàng bán
    ORDER_IMPORT: 8, // đặt hàng nhập
    INCOME: 9, // phiếu thu
    EXPENSE: 10, // phiếu chi
    COLLECTING_DEPOSIT: 11, // thu đặt cọc
    DEBT: 12, // công nợ
    CUSTOMER: 13, // khách hàng
    SUPPLIER: 14, // ncc
    BRANCH: 15, // chi nhánh
    STOCK: 16, // kho
    STOCK_CHECK: 17, // kiểm kho
    MANUFACTURE: 18, // Sản xuất
    IMPORT_STOCK: 19, // nhập kho sx
    EXPORT_STOCK: 20, // xuất kho sx
    EXPORT_FINISHED_PRODUCT: 21, //xuất kho thành phẩm
    USER: 22,
    WITHDRAW_DEPOSIT: 23, // rút đặt cọc
    IMAGE_PRODUCT: 24,
    INCOME_EXPENSE_TYPE: 25,
    FORMULA: 26, // NVL
    IMPORT_PRODUCT: 27,
    IMPORT_CUSTOMER: 28,
    IMPORT_SUPPLIER: 29,
    PRODUCT_PRICE: 30,
    PRODUCT_TYPE: 31,
    PRODUCT_UNIT: 32,
    ROLE: 33,
    SETUP: 34
  },

  // ACTION OF ACTION LOG
  ACTION: {
    LOGIN: 1,
    CREATE: 2,
    UPDATE: 3,
    CANCEL: 4,
    DELETE: 5,
    STOP: 6,
    ADD: 7,
    TRANSFER_GROUP: 8,
    ACTIVE: 9,
    EXCHANGE: 10,
    IMPORT: 11
  },
  USER_ADMIN: 1,
  BRANCH_NAME_DEFAULT: "Chi nhánh mặc định",
  PRODUCT_TYPES: {
    merchandise: 1,
    service: 2,
  },
  PRODUCT_TYPES_NAME: {
    merchandise: "hàng hóa",
    service: "dịch vụ",
  },
  CARD_TYPE: {
    invoice: "invoice",
    importCard: "importCard",
    invoiceReturn: "invoiceReturn",
    importReturn: "importReturn",
    income: "income",
    expense: "expense",
    stockCheckCard: "stockCheckCard",
    importOrderCard: "importOrderCard",
    invoiceOrderCard: "invoiceOrderCard",
    moveStock: "moveStock",
    manufacturingCard: "manufacturingCard",
  },
  DATABASE_FIELD: {
    mevabe: "Mẹ và bé",
    noithat: "Nội thất",
    sach: "Sách",
    taphoa: "Tạp hóa",
    thoitrang: "Thời trang",
    vatlieuxaydung: "Vật liệu xây dựng",
    dienlanh: "Điện tử",
  }

}