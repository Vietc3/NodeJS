import vn from "date-fns/locale/vi";
import logo from 'assets/img/ohstore_logo.png';
import _ from 'lodash';
import MauTemCuon from "assets/img/icons/menu/Temcuon.jpg";
import MauListCuon from "assets/img/icons/menu/Listcuon.jpg";

function generateQuickFind (arr) {
  let id = {};
  let name = {};
  arr.forEach(item => {
    name[item.id] = item.name;
    if(item.code) id[item.code] = item.id;
  })
  return ({arr, id, name});
}

export default {
  DEFAULT_LANGUAGE: localStorage.getItem("language") || 'vn',
  DEFAULT_BRANCH_ID: localStorage.getItem("branchId") || null,
  DEFAULT_BRANCH_NAME: localStorage.getItem("nameBranch") || null,
  
  DEFAULT_TABLE_STATUS: {
    pageSize: 10,
    pageNumber: 1,
  },

  LIMIT_AUTOCOMPLETE_SEARCH: 20,
  ACTION_MESS:{
    create: "Tạo",
    update: "Cập nhật"
  },
  PLACEHOLDER_AUTO_GENERATE_CODE: "Mã phiếu được sinh tự động",
  LOGO: logo,
  CONFIG_LANGUAGE: [
    {title: "Tiếng Việt", value: 'vn'},
    {title: "English", value: 'en'},
    {title: "한국", value: 'kr'},
    {title: "日本", value: 'jp'},
  ],
  PRODUCT_EXCEL_SHEETS: {
    TWO: 2,
    THREE: 3,
  },
  FIELDS_PRODUCT: [
    {name:'Mã sản phẩm', field:'code'},
    {name:'Tên sản phẩm (*)', field:'name'},
    {name:'Nhóm sản phẩm (*)', field:'productTypeId'},
    {name:'Nhà cung cấp', field:'customerId'},
    {name:'Đơn vị tính (*)', field:'unitId'},
    {name:'Giá bán', field:'saleUnitPrice'},
    {name:'Giá vốn', field:'costUnitPrice'},
    {name:'Tồn kho', field:'stockQuantity'},
    {name:'Mô tả sản phẩm', field:'description'},
    {name:'Kho', field:'stock'},
    {name:'Loại (*)', field:'type'}
  ],
  FIELDS_FORMULA: [
    {name:'Mã thành phẩm (*)', field:'productId'},
    {name:'Mã nguyên vật liệu (*)', field:'materialId'},
    {name:'Số lượng (*)', field:'quantity'}
  ],
  FIELDS_CUSTOMER: [
    {name:'Tên khách hàng (*)', field:'name'},
    {name:'Mã khách hàng', field:'code'},
    {name:'Địa chỉ', field:'address'},
    {name:'Điện thoại', field:'mobile'},
    {name:'Fax', field:'fax'},
    {name:'Mã số thuế', field:'taxCode'},
    {name:'Số tiền nợ tối đa', field:'maxDeptAmount'},
    {name:'Số ngày nợ tối đa', field:'maxDeptDays'},
    {name:'Ghi chú', field:'notes'},
    {name:'Email', field:'email'},
    {name:'Giới tính', field:'gender'},
    {name:'Ngày sinh', field:'birthday'}
  ],
  FIELDS_SUPLIERS: [
    {name:'Tên nhà cung cấp (*)', field:'name'},
    {name:'Mã nhà cung cấp', field:'code'},
    {name:'Địa chỉ', field:'address'},
    {name:'Điện thoại', field:'mobile'},
    {name:'Fax', field:'fax'},
    {name:'Mã số thuế', field:'taxCode'},
    {name:'Ghi chú', field:'notes'},
    {name:'Email', field:'email'},
  ],
  PRINT_TEMPLATE_EXAMPLE_DATA : {

    TEMPLATE_INOICE: {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      created_on: "25-01-2020",
      order_code: "SO0001",
      customer_name: "Bùi Quốc Huy",
      customer_phone_number: "0378026030",
      shipping_address: "244-Nam Hòa-Quận 9",
      billing_address: "244-Nam Hòa-Quận 9",
      customer_email:"aitt@aitt.tech",
      total_quantity: "2",
      total_tax: "10%",
      total: "500000",
      delivery_fee: "0",
      order_discount_value: "20000",
      total_amount: "480000",
      payment_customer: "480000",
      serials:"IMG040567",
      money_return:"0",
      products : [{
        line_stt: "1",
        line_unit: "Chiếc",
        line_variant_code: "Áo sơ mi tay ngắn",
        line_variant: "Áo sơ mi tay ngắn",
        line_quantity: "2",
        line_price: "250000",
        line_amount: "500000",   
        line_discount_rate: "0",
        line_stt_second: "2",
        line_unit_second: "Cái",
        line_variant_code_second: "Áo Pull tay ngắn",
        line_varianta_second: "Áo Pull tay ngắn",
        line_quantity_second: "1",
        line_price_second: "300000",
        line_amount_second: "300000",   
        line_discount_second: "0",
      }]
    },
    TEMPLATE_INOICE_ORDER: {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      created_on: "25-01-2020",
      order_code: "SO0001",
      customer_name: "Bùi Quốc Huy",
      customer_phone_number: "0378026030",
      shipping_address: "244-Nam Hòa-Quận 9",
      billing_address: "244-Nam Hòa-Quận 9",
      customer_email:"aitt@aitt.tech",
      total_quantity: "2",
      total_tax: "10%",
      total: "500000",
      delivery_fee: "0",
      order_discount_value: "20000",
      total_amount: "480000",
      payment_customer: "480000",
      serials:"IMG040567",
      money_return:"0",
      products : [{
        line_stt: "1",
        line_unit: "Chiếc",
        line_variant_code: "Áo sơ mi tay ngắn",
        line_variant: "Áo sơ mi tay ngắn",
        line_quantity: "2",
        line_price: "250000",
        line_amount: "500000",   
        line_discount_rate: "0",
        line_stt_second: "2",
        line_unit_second: "Cái",
        line_variant_code_second: "Áo Pull tay ngắn",
        line_varianta_second: "Áo Pull tay ngắn",
        line_quantity_second: "1",
        line_price_second: "300000",
        line_amount_second: "300000",   
        line_discount_second: "0",
      }]
    },
    TEMPLATE_INVOICE_RETURN :{
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      created_on: "25-01-2020",
      order_code: "SO0001",
      customer_name: "Bùi Quốc Huy",
      customer_phone_number: "0378026030",
      shipping_address: "244-Nam Hòa-Quận 9",
      billing_address: "244-Nam Hòa-Quận 9",
      customer_email:"aitt@aitt.tech",
      total_quantity: "2",
      total_amount: "480000",
      products : [{
        line_stt: "1",
        line_unit: "Chiếc",
        line_variant_code: "Áo sơ mi tay ngắn",
        line_variant: "Áo sơ mi tay ngắn",
        line_quantity: "2",
        line_price: "250000",
        line_discount_price:"200000",
        line_amount: "400000",   
        line_stt_second: "2",
        line_unit_second: "Chiếc",
        line_variant_code_second: "Áo thun màu tím",
        line_variant_second: "Áo thun màu tím",
        line_quantity_second: "1",
        line_price_second: "100000",
        line_amount_second: "100000", 
      }]
    },
    TEMPLATE_IMPORT : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      purchase_order_code: "PO000012",
      created_on: "25-01-2020",
      reference: "SO00001",
      received_on: "30-01-2020",
      supplier_name: "Bùi Thiên Bảo",
      supplier_address: "Gò Vấp-Tp.Hồ Chí Minh",
      location_name: "",
      location_address: "Chi nhánh mặc định",
      total_quantity: "2",
      total_tax: "10%",
      total: "500000",
      total_price: "500000",
      products : [{
        line_stt: "1",
        line_unit: "Chiếc",
        line_variant_name: "Áo sơ mi tay ngắn",
        line_quantity: "2",
        line_tax_rate: "0%",
        line_price: "250000",
        line_amount: "500000",   
        line_stt_second: "2",
        line_unit_second: "Chiếc",
        line_variant_name_second: "Quần âu",
        line_quantity_second: "1",
        line_tax_rate_second: "0%",
        line_price_second: "450000",
        line_amount_second: "450000", 
      }]

    },
    TEMPLATE_IMPORT_ORDER : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      purchase_order_code: "PO000012",
      order_code:"DDH1",
      order_discount_value: "50000",
      created_on: "25-01-2020",
      reference: "SO00001",
      received_on: "30-01-2020",
      supplier_name: "Bùi Thiên Bảo",
      supplier_address: "Gò Vấp-Tp.Hồ Chí Minh",
      location_name: "",
      location_address: "Chi nhánh mặc định",
      total_quantity: "2",
      total_tax: "10%",
      total: "500000",
      total_price: "500000",
      products : [{
        line_stt: "1",
        line_unit: "Chiếc",
        line_variant_name: "Áo sơ mi tay ngắn",
        line_quantity: "2",
        line_tax_rate: "0%",
        line_price: "250000",
        line_amount: "500000",   
        line_stt_second: "2",
        line_unit_second: "Chiếc",
        line_variant_name_second: "Quần âu",
        line_quantity_second: "1",
        line_tax_rate_second: "0%",
        line_price_second: "450000",
        line_amount_second: "450000", 
      }]

    },
    TEMPLATE_IMPORT_RETURN : {
      refund_code:"IMG040567",
      created_on: "25-01-2020",
      location_address:"",
      account_name: "Nguyễn Thiên Bảo",
      supplier_phone_number: "0987654321",
      supplier_name: "Bùi Thiên Bảo",
      total_landed_costs: "0",
      total_discounts: "0",
      transaction_refund_amount: "0",
      transaction_refund_method_name:"Tiền mặt",
      transaction_refund_method_amount: "500000",
      total_quantity: "2",
      total_amount: "480000",
      total_tax: "10%",
      total_price: "500000",
      order_discount_value: "20000",
      products : [{
        line_stt: "1",
        line_variant_sku: "SPQR-IX",
        line_variant_name: "Áo sơ mi tay ngắn",
        line_quantity: "2",
        line_price: "250000",
        line_amount: "500000",
        line_discount_amount: "",   
        line_unit: "Bộ",
        line_stt_second: "2",
        line_variant_sku_second: "SPQR-TD",
        line_variant_name_second: "Áo sơ mi tay dài",
        line_quantity_second: "2",
        line_price_second: "300000",
        line_amount_second: "600000",
        line_discount_amount_second: "",   
      }]
    },
    TEMPLATE_INCOME_EXPONSE_RECEIPT : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      receipt_voucher_code: "PTSO0001",
      issued_on: "30-01-2020",
      object_name: "Nguyễn Minh Trí",
      object_address: "440-Nam Hòa-Quận 9-Tp.Hồ Chí Minh",
      object_phone_number: "0973687243",
      amount: "500000",
      total_text: "Năm trăm nghìn đồng",
    },
    TEMPLATE_INCOME_EXPONSE_PAYMENT : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      payment_voucher_code: "PCPN0001",
      issued_on: "30-01-2020",
      object_name: "Nguyễn Minh Trí",
      object_address: "440-Nam Hòa-Quận 9-Tp.Hồ Chí Minh",
      object_phone_number: "0973687243",
      amount: "500000",
      total_text: "Năm trăm nghìn đồng",
    },
    TEMPLATE_IMPORT_STOCK : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      purchase_order_code: "PO000012",
      created_on: "25-01-2020",
      reference: "SO00001",
      recipient_name: "Quốc Huy",
      received_on: "30-01-2020",
      total_quantity: "2",
      products : [{
        line_stt: "1",
        line_variant_code: "Áo sơ mi tay ngắn",
        line_variant_name: "Áo sơ mi tay ngắn",
        line_quantity: "2", 
        line_stt_second: "2",
        line_variant_code_second: "Áo thun màu tím",
        line_variant_name_second: "Áo thun màu tím",
        line_quantity_second: "2", 
      }]
    },
    TEMPLATE_EXPORT_STOCK : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      recipient_name: "Quốc Huy",
      order_code: "SO0001",
      created_on: "25-01-2020",
      reference: "SO00001",
      exported_on: "30-01-2020",
      received_on: "30-01-2020",
      total_quantity: "2",
      products : [{
        line_stt: "1",
        line_variant_code: "Áo sơ mi tay ngắn",
        line_variant_name: "Áo sơ mi tay ngắn",
        line_quantity: "2", 
        line_stt_second: "2",
        line_variant_code_second: "Áo thun màu tím",
        line_variant_name_second: "Áo thun màu tím",
        line_quantity_second: "2",
      }]
    },
    TEMPLATE_MANUFACTURING_STOCK : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      order_code: "PX00002",
      created_on: "30-01-2020",
      finishedProducts : [{
        line_stt: "1",
        line_variant_code: "Áo sơ mi tay ngắn",
        line_variant_name: "Áo sơ mi tay ngắn",
        line_quantity: "2", 
        line_stt_second: "2",
        line_variant_code_second: "Áo thun màu tím",
        line_variant_name_second: "Áo thun màu tím",
        line_quantity_second: "2",
      }],
      materials : [{
        line_stt_materials: "1",
        line_variant_code_materials: "Vải cotton",
        line_variant_name_materials: "Vải cotton",
        line_quantity_materials: "2", 
        line_stt_materials_second: "2",
        line_variant_code_materials_second: "Vải Kate",
        line_variant_name_materials_second: "Vải Kate",
        line_quantity_materials_second: "4", 
      }]
    },
    TEMPLATE_STOCK_TAKE : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      code: "SA0001",
      created_on: "16-2-2020",
      adjusted_on: "17-2-2020",
      location_address: "Chi nhánh mặc định",
      reason: "Lý do",
      note: "note",
      total_quantity: "1",
      stockCheckCardProducts : [{
        line_stt: "1",
        line_variant_code: "VR01",
        line_variant_name: "Áo sơ mi tay ngắn",
        line_after_quantity: "2",
        line_change_quantity: "1",
        line_reason: "Lý do",
        line_stt_second: "2",
        line_variant_code_second: "VR02",
        line_variant_name_second: "Áo thun màu tím",
        line_after_quantity_second: "2",
        line_change_quantity_second: "1",
        line_reason_second: "Lý do"
      }]
    },
    TEMPLATE_DEPOSIT_RECEIPT : {
      store_name: "AITT OhStore",
      store_address: "TP Hồ Chí Minh",
      store_phone_number: "0378026030",
      store_email: "contact@ohstore.vn",
      receipt_voucher_code: "PTSO0001",
      issued_on: "30-01-2020",
      object_name: "Nguyễn Minh Trí",
      object_address: "440-Nam Hòa-Quận 9-Tp.Hồ Chí Minh",
      object_phone_number: "0973687243",
      amount: "500000",
      total_text: "Năm trăm nghìn đồng",
    },
  },
  PRINT_TEMPLATE_NAME : {
    INVOICE : "invoice",
    INVOICE_RETURN: "invoice_return",
    IMPORT: "import",
    IMPORT_RETURN: "import_return",
    INCOME_EXPENSE_RECEIPT: "incomeexponse_receipt",
    INCOME_EXPENSE_PAYMENT: "incomeexponse_payment",
    IMPORT_STOCK: "import_stock",
    EXPORT_STOCK: "export_stock",
    MANUFACTURING_STOCK: "manufacturing_stock",
    STOCK_TAKE: "stock_take",
    DEPOSIT_CHECKED: "deposit_checked",
    DEPOSIT_RECEIPT: "deposit_receipt",
    INVOICE_ORDER: "invoice_order",
    IMPORT_ORDER: "import_order"
  },
  PRINT_TEMPLATE_OPTIONS : {
    invoice: "Hóa đơn",
    invoice_return: "Phiếu trả hàng",
    import: "Phiếu nhập hàng",
    import_return: "Phiếu trả hàng nhập",
    incomeexponse_receipt: "Phiếu thu",
    incomeexponse_payment: "Phiếu chi",
    import_stock: "Phiếu nhập kho",
    export_stock: "Phiếu xuất kho",
    manufacturing_stock: "Phiếu sản xuất",
    stock_take: "Phiếu kiểm kho",
    deposit_checked: "Tiền ký gửi",
    deposit_receipt: "Rút tiền ký gửi",
    invoice_order: "Đơn đặt hàng",
    import_order: "Đơn đặt hàng nhà cung cấp"
  },
  PRINT_SIZE: {
    A4: "A4",
    A5: "A5",
    K57: "K57",
    K80: "K80"
  },
  COLOR_BUTTON : {
    submit : "submit",
    add : "add",
    delete : "delete",
    exit : "exit",
    export : "export"
  },
  CASH_BOOK_TYPES: [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Ngân hàng" },
    { id: 3, name: "Tổng quỹ" }
  ],

  VALIDATION_MESSAGE: {
    required: "Trường này không thể để trống",
    numeric: "Trường này chỉ nhận giá trị số",
    integer: "Trường này chỉ nhận giá trị số nguyên",
    email: "Email không đúng định dạng",
    phone: "Số điện thoại không đúng định dạng",
    url: "Link không đúng định dạng",
    accepted: "Vui lòng tick chọn vào ô check box",
    max: 'Giá trị không thể lớn hơn :max'
  },

  STOCKCHECK_STATUS: {
    1: "Phiếu tạm",
    2: "Hoàn thành",
    Temp: 1,
    Finish: 2
  },

  IMPORT_STATUS: {
    1: "Hoàn thành",
    2: "Đã hủy",
    FINISHED: 1,
    CANCELED: 2
},

  USER_STATUS: {
    0: "Đang bị khóa",
    1: "Đang hoạt động",
  },

  OPTIONS_MANUFACTURING_STATUS: [
    {title: "Đang thực hiện", value: 0},
    {title: "Hoàn thành", value: 1},
    {title: "Tạm dừng", value: 2},
    {title: "Đã hủy", value: 3},
  ],

  MANUFACTURING_STATUS: {
      0: "Đang thực hiện",
      1: "Hoàn thành",
      2: "Tạm dừng",
      3: "Đã hủy",
      ONGOING: 0,
      FINISHED: 1,
      POSTPONED: 2,
      CANCELLED: 3
  },

  DEPOSIT_TYPES : {
      0 : "",
      1 : "Phiếu thu",
      2 : "Phiếu chi",
  },

  DEBT_TYPES: {
      0 : "",
      1 : "Tạo đơn hàng",
      2 : "Sửa đơn hàng",
      3 : "Hủy đơn hàng",
      4 : "Tạo trả hàng",
      5 : "Sửa trả hàng",
      6 : "Hủy trả hàng",
      7 : "Tạo nhập hàng",
      8 : "Sửa nhập hàng",
      9 : "Hủy nhập hàng",
      10 : "Tạo trả hàng nhập",
      11 : "Sửa trả hàng nhập",
      12 : "Hủy trả hàng nhập",
      13 : "Tạo phiếu thu",
      14 : "Sửa phiếu thu",
      15 : "Hủy phiếu thu",
      16 : "Tạo phiếu chi",
      17 : "Sửa phiếu chi",
      18 : "Hủy phiếu chi",
      19 : "Người dùng điều chỉnh",
  },

  TRANSACTION_TYPE: {
    1: "Mua hàng",
    2: "Nhập hàng",
    3: "Trả hàng",
    4: "Trả hàng nhập"
  },

  LOW_STOCK_STATUS: {
    LOW: 1,
    ENOUGH: 2,
    1: 'Sắp hết hàng',
    2: 'Đủ hàng'
  },

  PRODUCT_STOPPED_STATUS: {
    STOPPED: 1,
    NONE: 2,
    1: 'Ngừng kinh doanh',
    2: 'Đang kinh doanh'
  },

  INCOME_EXPENSE_CUSTOMER_TYPES: _.extend(generateQuickFind([
    { id: 1, name: "Khách hàng",  },
    { id: 2, name: "Nhà cung cấp" },
    { id: 3, name: "Nhân viên" },
    { id: 4, name: "Khác" }
  ]), {
    id: {
      CUSTOMER: 1,
      SUPPLIER: 2,
      STAFF: 3,
      OTHER: 4
    }
  }),
  
  DEFAULT_INCOME_EXPENSE_CARD_TYPES: {
    INVOICE: 1,
    IMPORT_RETURN: 2,
    OTHER_INCOME:  3,
    IMPORT: 4,
    INVOICE_RETURN: 5,
    OTHER_EXPENSE: 6,
  },

  STOCKCHECK_REASONS: [
    { id: 1, name: "Hư hỏng" },
    { id: 2, name: "Hao mòn" },
    { id: 3, name: "Trả hàng" },
    { id: 4, name: "Chuyển hàng" },
    { id: 5, name: "Sản xuất" },
    { id: 6, name: "Khác" },
    { id: 7, name: "Chuyển đổi" },
  ],
  STOCKCHECK_REASONS_NAME: {
    1: "Hư hỏng",
    2: "Hao mòn",
    3: "Trả hàng",
    4: "Chuyển hàng",
    5: "Sản xuất",
    6: "Khác",
    7: "Chuyển đổi",
  },
  BARCODE_PRINT : [
    { name: "Chỉ in mã", value: 0},
    { name: "In mã và tên hàng", value: 1},
    { name: "In mã và giá bán", value: 2},
    { name: "In đầy đủ thông tin", value: 3},
  ],

  INVOICE_STATUS: _.extend(generateQuickFind([
    {id: 1, name: 'Hoàn thành'},
    {id: 2, name: 'Đã hủy'}
  ]), {
    id: {
      FINISHED: 1,
      CANCELLED: 2
    }
  }),

  INCOME_EXPENSE_TYPES: [
    { id: 1, name: "Thu" },
    { id: 2, name: "Chi" }
  ],
  INCOME_EXPENSE_TYPE_NAME: {
    1: "Thu",
    2: "Chi"
  },

  MANUFACTURING_STOCK_STATUS : {
    FINISHED_PRODUCT: 1,
    MATERIAL:2
  },

  MANUFACTURING_STOCK_NAME: {
    FINISHED_PRODUCT: "Thành phẩm",
    MATERIAL: "Nguyên vật liệu",
  },

  COST_TYPE_NAME: {
    1: "Thu",
    2: "Chi",
    Income: 1,
    Expense: 2,
    Customer: {
      1: "Nộp",
      2: "Nhận",
    }
  },
  PRODUCT_DONTSTOP: 0,
  INCOME_AUTO: 1,
  EXPENSE_AUTO: 2,
  
  OTHER_CUSTOMER: {
    id: 0,
    name: 'Khách lẻ',
  },
  CUSTOMER_TYPES: [
    { id: 1, name: "Khách hàng" },
    { id: 2, name: "Nhà cung cấp" }
  ],
  CUSTOMER_TYPE_NAME: {
    1: "Khách hàng",
    2: "Nhà cung cấp",
    Customer: 1,
    Partner: 2
  },
  SELECT_CUSTOMER_TYPES: [
    { value: 0, title: "Tất cả" },
    { value: 1, title: "Khách hàng" },
    { value: 2, title: "Nhà cung cấp" }
  ],
  PAYMENT_TYPES: [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Chuyển khoản" },
    { id: 3, name: "COD" },
    { id: 4, name: "Khác" }
  ],

  INVOICE_PAYMENT_TYPES: _.extend(generateQuickFind([
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Chuyển khoản" },
    { id: 3, name: "Tính vào công nợ" },
  ]), {
    id: {
      cash: 1,
      bank_transfer: 2,
      debt: 3
    },
  }),

  DELIVERY_TYPES: _.extend(generateQuickFind([
    { id: 1, name: "Nhận tại cửa hàng" },
    { id: 2, name: "Gửi hàng" },
    { id: 3, name: "Khác" },
  ]), {
    id: {
      store: 1,
      home: 2,
      other: 3
    },
  }),

  PRODUCT_TYPES: _.extend(generateQuickFind([
    { id: 1, name: "Hàng hóa" },
    { id: 2, name: "Dịch vụ" },
  ]), {
    id: {
      merchandise: 1,
      service: 2,
    },
  }),

  DISCOUNT_TYPES: _.extend(generateQuickFind(
    [
      { id: 1, name: "VNĐ" },
      { id: 2, name: "%" },
    ]
  ), {
    id: {
      VND: 1,
      percent: 2
    },
  }),

  SORT_ASCENT: "ascend",
  LOCALE: vn,
  CURRENCY: "VND",
  COLOR: {
    Import: "#4caf50",
    Export: "red"
  },

  OPTIONS_STOCK_TAKE_STATUS: [
    {value:2,title:"Hoàn thành"},
    {value:1,title:"Phiếu tạm"},
    {value:0,title:"Khác"}
  ],

  OPTIONS_MANUFACTURING_STOCK: [
    {value:1, title:"Thành phẩm"},
    {value:2, title:"Nguyên vật liệu"}
  ],

  OPTIONS_ROLE_TYPE: [
    { title: "Không có quyền", value: 0 },
    { title: "Chỉ xem", value: 1 },
    { title: "Xem và sửa", value: 2 }
  ],
  OPTIONS_ROLE_TYPE_REPORT: [
    { title: "Không có quyền", value: 0 },
    { title: "Chỉ xem", value: 1 }
  ],
  ROLE_TYPE_NAME: {
    0: "Không có quyền",
    1: "Chỉ xem",
    2: "Xem và sửa"
  },

  OPTIONS_PERMISSION_TYPE : {
    product: "Danh mục",
    management_price: "Quản lý giá",
    stock_check: "Kiểm kho",
    invoice: "Đơn hàng",
    invoice_return: "Trả hàng",
    invoice_order_card: "Đặt hàng bán",
    import: "Nhập hàng",
    import_return: "Trả hàng",
    import_order_card: "Đặt hàng nhập",
    sales_counter: "Bán hàng tại quầy",
    manufacture_product: "Thành phẩm",
    manufacture_ware_house: "Kho sản xuất",
    manufacture_card: "Phiếu sản xuất",
    customer: "Khách hàng",
    supplier: "Nhà cung cấp",
    income_expense: "Phiếu thu chi",
    deposit: "Tiền ký gửi",
    income_expense_type: "Loại thu chi",
    setup_store: "Cửa hàng",
    setup_user: "Phân quyền",
    report_overall: "Tổng quan",
    report_sale: "Báo cáo bán hàng",
    report_profit: "Báo cáo lãi lỗ",
    report_stock: "Báo cáo tồn kho",
    report_debt: "Báo cáo công nợ",
    report_cashbook: "Báo cáo sổ quỹ",
    report_income_expense: "Báo cáo thu chi tổng quát",
    report_general_debt: "Báo cáo công nợ tổng quát",
    report_import_export_detail: "Báo cáo nhập xuất tồn chi tiết",
    manufacture_import_stock: "Nhập kho sản xuất",
    manufacture_export_stock: "Xuất kho sản xuất",
    report_import_export: "Báo cáo xuất nhập tồn",
    report_low_stock: "Báo cáo cảnh báo tồn kho",
    setup_branch: "Chi nhánh",
    setup_stock: "Kho",

  },

  OPTIONS_GENDER: [
    {
      name: "Nam",
      title: "Nam",
      value: "0"
    },
    {
      name: "Nữ",
      title: "Nữ",
      value: "1"
    },
    {
      name: "Khác",
      title: "Khác",
      value: "2"
    }
  ],
  
  // Import stock
  IMPORT_STOCK: {
    0: "Nhập hàng",
    1: "Nhập kho thành phẩm",
    2: "Nhập hàng khách hàng trả"
  },
  CREATE_IMPORT_STOCK: "/add-import-stock",
  EDIT_IMPORT_STOCK:"/edit-Import-Stock",
  EDIT_IMPORT_STOCK_PATH: "/admin/edit-Import-Stock/",
  LIST_IMPORT_STOCK: "/list-import_card",
  
  // Export stock
  CREATE_EXPORT_STOCK:"/add-export-stock",
  EDIT_EXPORT_STOCK:"/edit-export-Stock",
  EDIT_EXPORT_STOCK_PATH:"/admin/edit-export-Stock/",
  LIST_EXPORT_STOCK: "/list-export_card",

  EDIT_ORDER_EXPORT_PATH: "/admin/update-export-order-card/2/",
  EDIT_ORDER_IMPORT_PATH: "/admin/update-import-order-card/1/",
  IMPORT_CARD_REASON: {
    IMPORT_PROVIDER: 0,
    FINISHED_PRODUCT: 1,
    INVOICE_RETURN: 2
  },

  IMPORT_CARD_STATUS: {
    FINISHED: 1,
    CANCELLED: 2
  },
  IMPORT_CARD_STATUS_NAME: {
    1: "Hoàn thành",
    2: "Đã hủy"
  },

  INCOME_EXPENSE_CARD_STATUS_NAME: {
    1: "Hoàn thành",
    2: "Đã hủy"
  },

  INCOME_EXPENSE_CARD_STATUS: {
    FINISHED: 1,
    CANCELLED: 2
  },

  COLOR_SUCCESS: "green",
  COLOR_DANGER: "red",
  UPDATE_TIME_OUT: 200,
  UPDATE_TIME_OUT_SALES: 400,
  InputCustomer: {
    Name: 250,
    Code: 50,
    TaxCode: 15,
    RepName: 100,
    Notes: 255,
    Address: 250,
    Mobile: 13,
    Tel: 13,
    MaxDebtAmount: 13,
    Fax: 13,
    Email: 50,
    maxDeptDays:6
  },
  
  InputQtyInit: {
    QuantityInit: 20
  },

  OPTIONS_SALE_REPORT: {
    HOUR: 1, // theo giờ
    DAY: 2, // theo ngày
    MONTH: 3, // theo tháng
    YEAR: 4, // theo năm
    PRODUCT: 5, // theo sản phẩm
    USER: 6, //theo nhân viên
    CUSTOMER: 7, // theo khách hàng,
    INCOME: 8,
    PROFIT: 9
  },

  OPTIONS_STOCKTAKE_REASON: {
    DAMAGE: "1",
    WASTED: "2",
    RETURNS: "3",
    SHIPMENT: "4",
    PRODUCE: "5",
    OTHER: "6"
  },

  OPTIONS_PRICE: {
    CURRENT: 0,
    UNIT: 1,
    LAST_IMPORT: 2,
    GENERAL: 3
  },
  
  NO_PRODUCT: "Chưa có sản phẩm",

  REPORT : {
    Revenue : 1,
    Profit: 2
  },
  DROPDOWN_BUTTON_PROPS: {
    style: { marginBottom: "0", backgroundColor: "rgb(76, 175, 80)", width: 130, height: 41 }
  },
  PERMISSION_NAME: {
    PRODUCT: "product",
    MANAGEMENT_PRICE:"management_price",
    STOCK_CHECK: "stock_check",
    INVOICE: "invoice",
    IMPORT: "import",
    INVOICE_RETURN: "invoice_return",
    IMPORT_RETURN: "import_return",
    DEPOSIT: "deposit",
    INCOME_EXPENSE_TYPE: "income_expense_type",
    INCOME_EXPENSE: "income_expense",
    CUSTOMER: "customer",
    SUPPLIER: "supplier",
    REPORT_OVERALL: "report_overall",
    REPORT_SALE: "report_sale",
    REPORT_PROFIT: "report_profit",
    REPORT_DEBT: "report_debt",
    REPORT_GENERAL_DEBT: "report_general_debt",
    REPORT_STOCK: "report_stock",
    REPORT_CASHBOOK: "report_cashbook",
    SETUP_STORE: "setup_store",
    SETUP_USER: "setup_user",
    MANUFACTURE_PRODUCT:"manufacture_product",
    MANUFACTURE_WARE_HOUSE:"manufacture_ware_house",
    MANUFACTURE_CARD:"manufacture_card",
    REPORT_INCOME_EXPENSE: "report_income_expense",
    INVOICE_ORDER_CARD: "invoice_order_card",
    IMPORT_ORDER_CARD: "import_order_card",
    REPORT_IMPORT_EXPORT_DETAIL: "report_import_export_detail",
    SALES_COUNTER: "sales_counter",
    ACTION_LOG: "action_log",
    ROLE_REPORT_IMPORT_EXPORT: "report_import_export",
    ROLE_REPORT_LOW_STOCK: "report_low_stock",
    SETUP_BRANCH: "setup_branch",
    SETUP_STOCK: "setup_stock",

  },
  PERMISSION_TYPE: {
    TYPE_NONE: 0,
    TYPE_VIEW_ONLY: 1,
    TYPE_ALL: 2
  },
  title: {
    ProductCode: "Mã hàng hóa là thông tin duy nhất",
    ProductName: "Tên sản phẩm tương ứng mã sản phẩm",
    ProductType: "Lựa chọn loại sản phẩm cho sản phẩm",
    ProductUnit: "Đơn vị tính cho sản phẩm",
    Provider: "Nhà cung cấp cho sản phẩm",
    Manufacturer: "Nhà sản xuất cho sản phẩm",
    OriginalPrice:
      "Giá vốn dùng để tính lợi nhuận cho sản phẩm (sẽ tự động thay đổi khi thay đổi phương pháp tính giá vốn)",
    QtyStore: "Số lượng tồn kho của sản phẩm",
    UpdateStore: "Số lượng tồn kho thực tế của sản phẩm (sẽ tự động tạo ra phiếu kiểm kho cho sản phẩm)",
    UnitPrice: "Giá bán cho sản phẩm",
    ProductTypeCategory: "Loại hàng hóa",
  },

  DATABASE_DATE_TIME_FORMAT_STRING: "x",
  PICKER_DATE_TIME_FORMAT_STRING: "dd/MM/yyyy HH:mm:ss",
  PICKER_DATE_FORMAT_STRING: "dd/MM/yyyy",
  DISPLAY_DATE_TIME_FORMAT_STRING: "DD/MM/YYYY HH:mm:ss",
  DISPLAY_DATE_TIME_FORMAT_STRING_DATE_MONTH: "DD/MM HH:mm",
  DISPLAY_DATE_FORMAT_STRING: "DD/MM/YYYY",
  DISPLAY_TIME_FORMAT_STRING: "HH:mm:ss",
  CODE_DATE_FORMAT_STRING: "DDMMYYYY",
  DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT: "DD/MM/YYYY HH:mm",
  PRODUCT_PATH: "/admin/product",
  ADD_PRODUCT : "/admin/product",
  //Stock check card
  ADD_STOCKTAKE_CARD_PATH: "/admin/create-stocktake",
  ADD_STOCKTAKE_CARD_ROUTE: "/create-stocktake",
  EDIT_STOCKTAKE_CARD_PATH: "/admin/edit-stocktake",
  EDIT_STOCKTAKE_CARD_ROUTE: "/edit-stocktake",

  // Barcode
  EDIT_BARCODE_PATH: "/admin/product-barcode",

  // Income card
  MANAGE_INCOME_CARD_PATH: "/admin/income-list/",
  MANAGE_INCOME_EXPENSE_CARD_ROUTE: "/income-expense-list",
  ADD_INCOME_CARD_PATH: "/admin/create-income/",
  ADD_INCOME_CARD_ROUTE: "/create-income",
  EDIT_INCOME_CARD_PATH: "/admin/edit-income/",
  EDIT_INCOME_CARD_ROUTE: "/edit-income",

  // User Management
  MANAGE_USER_PATH: "/admin/user-management",
  ADD_USER_PATH: "/admin/add-user/",
  ADD_USER_ROUTE: "add-user",
  EDIT_USER_PATH: "/admin/edit-user/",
  EDIT_USER_ROUTE: "edit-user",
  MANAGE_ROLE_PATH: "/admin/role-management",
  ADD_ROLE_PATH: "/admin/add-role/",
  ADD_ROLE_ROUTE: "add-role",
  EDIT_ROLE_PATH: "/admin/edit-role/",

  EDIT_STORE_PATH: "/admin/store_info",
  // Expense card
  MANAGE_EXPENSE_CARD_PATH: "/admin/expense-list/",
  MANAGE_EXPENSE_CARD_ROUTE: "/expense-list",
  ADD_EXPENSE_CARD_PATH: "/admin/create-expense/",
  ADD_EXPENSE_CARD_ROUTE: "/create-expense",
  EDIT_EXPENSE_CARD_PATH: "/admin/edit-expense/",
  EDIT_EXPENSE_CARD_ROUTE: "/edit-expense",

  MANAGE_DEPOSIT_CARD_ROUTE: "/deposit-list",
  MANAGE_DEPOSIT_CARD_PATH: "/admin/deposit-list/",

  CREATE_COLLECT_DEPOSIT_CARD_PATH: "/admin/create-collect/1",
  CREATE_WITHDRAW_DEPOSIT_CARD_PATH: "/admin/create-withdraw/2",

  EDIT_COLLECT_DEPOSIT_CARD_PATH: "/admin/edit-collect/1",
  EDIT_WITHDRAW_DEPOSIT_CARD_PATH: "/admin/edit-withdraw/2",

  CREATE_COLLECT_DEPOSIT_CARD_ROUTE: "/create-collect",
  CREATE_WITHDRAW_DEPOSIT_CARD_ROUTE: "/create-withdraw",

  EDIT_COLLECT_DEPOSIT_CARD_ROUTE: "/edit-collect",
  EDIT_WITHDRAW_DEPOSIT_CARD_ROUTE: "/edit-withdraw",

  EDIT_CUSTOMER_PATH: "/admin/edit-customer/1/",
  EDIT_SUPLIER_PATH: "/admin/edit-customer/2/",

  EDIT_BRANCH_PATH: "/admin/edit-branch/",
  EDIT_STOCK_PATH: "/admin/edit-stock/",

  WITHDRAW_DEPOSIT: "2",

  // Cash Book
  MANAGE_CASH_BOOK_PATH: "/admin/cash-book/",
  MANAGE_CASH_BOOK_ROUTE: "/cash-book",

  //Manufacturing Card
  MANUFACTURING_CARD_LIST: "/manufacturing-card",
  ADD_MANUFACTURING_CARD: "/create-manufacturing-card",
  EDIT_MANUFACTURING_CARD: "/edit-manufacturing-card",
  EDIT_MANUFACTURING_CARD_PATH: "/admin/edit-manufacturing-card/",
  MANAGE_STOCKTAKE_CARD_PATH: "/admin/stocktake",
  ADD_PRODUCT_PATH: "/admin/add-product",
  ADD_IMPORT_CARD_PATH: "/admin/create-import",
  ADD_IMPORT_CARD_ROUTE: "/create-import",
  EDIT_IMPORT_CARD_PATH: "/admin/edit-import/",
  EDIT_IMPORT_CARD_ROUTE: "/edit-import",
  MANAGE_IMPORT_CARD_PATH: "/admin/import-card",
  ADD_INVOICE: "/create-invoice",
  ADD_IMPORT_CARD_MANUFACTURE: "/import_card",
  MANAGE_INVOICE:"/admin/edit-invoice/",
  MANAGE_INVOICE_RETURN:"/admin/update-invoice-return/",
  EDIT_INVOICE: "/edit-invoice",
  EDIT_PRODUCT: "/edit-product",
  EDIT_PRODUCT_PATH: "/admin/edit-product/",
  ADMIN_LINK: "/admin",
  ADD_EXPORT_CARD_PATH: "/admin/create-export-card",
  ADD_EXPORT_CARD_ROUTE: "/create-export-card",
  EDIT_EXPORT_CARD_PATH: "/admin/edit-export-card/",
  EDIT_EXPORT_CARD_ROUTE: "/edit-export-card",
  UPDATE_INVOICE_RETURN:"/admin/update-invoice-return/",
  EXPORT_REASON: {
    0: "Bán hàng",
    1: "Sản xuất",
    2: "Trả hàng NCC",
    MANUFACTURE: 1
  },
  BRANCH_STATUS_OPTIONS: [
    {value: 1, title: "Đang hoạt động"},
    {value: 2, title: "Ngừng hoạt động"},
  ],
  ORDER_CARD_TYPE: {
    IMPORT: 1,
    EXPORT: 2
  },
  OPTIONS_ORDER_CARD_STATUS: [ // Để cho select trạng thái
    {value: 1, title: "Đặt hàng"},
    {value: 2, title: "Hoàn thành"},
  ],
  ORDER_CARD_STATUS: {
    ORDERED: 1,
    FINISHED: 2,
    CANCELLED: 3
  },
  ORDER_CARD_STATUS_NAME: {
    1: "Đã đặt hàng",
    2: "Hoàn thành",
    3: "Đã hủy"
  },
  BRANCH_STATUS_NAME: {
    1: "Đang hoạt động",
    2: "Ngừng hoạt động"
  },
  BRANCH_CARD_STATUS: {
    ACTIVE: 1,
    INACTIVE: 2
  },
  IMPORT_TYPE: {
    TYPE_IMPORT_STRING: "0",
    TYPE_IMPORT_RETURN_STRING: "1"
  },
  MANUFACTURE_CARD_STATUS: {
    TEMP: 1,
    FINISH: 2,
    CANCELLED: 3
  },
  MANUFACTURE_OPTIONS: {
    OFF: 0,
    ON: 1
  },

  LANGUAGE_PRODUCT_OPTIONS: {
    OFF: 0,
    ON: 1
  },
  
  NAME_FLAG: [
    { key: "vn", name: "Việt Nam" },
    { key: "en", name: "Anh" }
  ],

  STATUS: {
    TEMP: 1,
    FINISH: 2,
    CANCELLED: 3
  },
  EXPORT_CARD_STATUS: {
    TEMP: 1,
    FINISHED: 2,
    CANCELLED: 3
  },
  DEPOSIT_STATUS: {
    FINISHED: 1,
    CANCELLED: 2
  },

  DEPOSIT_REASON: "Tiền ký gửi",
  DEPOSIT_WITHDRAW_REASON: "Rút tiền ký gửi",

  INCOME_EXPENSE_STATUS: generateQuickFind(
    [
      { id: 1, name: "Hoàn thành", code: 'FINISHED' },
      { id: 2, name: "Đã hủy", code: 'CANCELED' },
    ]
  ),

  INCOME_EXPENSE_TRANSFORM_NAME: 'Tổng tiền',
  
  MOVE_STOCK_CARD_STATUS: generateQuickFind(
    [
      { id: 1, name: "Hoàn thành", code: 'FINISHED' },
      { id: 2, name: "Đã hủy", code: 'CANCELED' },
    ]
  ),

  MANUFACTURING_CARD_STATUS: generateQuickFind(
    [
      { id: 1, name: "Phiếu tạm", code: 'TEMP' },
      { id: 2, name: "Hoàn thành", code: 'FINISH'},
      { id: 3, name: "Đã hủy", code: 'CANCELLED'}
    ]
  ),
  
  MOVE_STOCK_REASON: generateQuickFind([
    {id: 1, name: 'Nhập kho sản xuất', code: 'IMPORT'},
    {id: 2, name: 'Xuất thành phẩm', code: 'EXPORT_FINISHED_PRODUCT'},
    {id: 3, name: 'Xuất trả lại', code: 'EXPORT_RETURN'},
  ]),
  
  PRODUCT_CATEGORY_TYPE: {
    FINISHED: 1,
    MATERIAL: 2
  },
  
  EXPORT_CARD_STATUS_NAME: {
    1: "Phiếu tạm",
    2: "Hoàn thành",
    3: "Đã hủy" 
  },

  DEPOSIT_TYPE_NAME : {
    1: "Thu tiền",
    2: "Rút tiền" 
  },

  DEPOSIT_TYPE : {
    COLLECT: 1,
    WITHDRAW: 2 
  },
  DEPOSIT_STATUS_NAME : {
    1: "Hoàn thành",
    2: "Đã hủy" 
  },
  INVOICE_RETURN_CARD_STATUS: {
    FINISHED: 1,
    CANCELLED: 2 
  },
  IMPORT_RETURN_CARD_STATUS: {
    FINISHED: 1,
    CANCELLED: 2 
  },
  IMPORT_RETURN_CARD_STATUS_NAME: {
    1: "Hoàn thành",
    2: "Hủy"
  },

  INVOICE_RETURN_CARD_STATUS_NAME: {
    1: "Hoàn thành",
    2: "Hủy" 
  },
  CUSTOMER_TYPE: {
    TYPE_CUSTOMER: 1,
    TYPE_SUPPLIER: 2,
  },
  INCOME_EXPENSE_TYPE: {
    TYPE_INCOME: 1,
    TYPE_EXPENSE: 2,
  },
  NUMBER_LENGTH: {
    PERCENT: 100,
    PERCENT_VALUE: 999,
    VALUE: 10000000000
  },

  REGISTER_STORE:{
    FULL_NAME_MINIMUM: 5,
    FULL_NAME_MAXIMUM: 30,
    EMAIL: 30,
    MOBILE: 13,
    STORE_NAME_MINIMUM: 5,
    STORE_NAME_MAXIMUM: 30,
    ADDRESS_MINIMUM: 30,
    ADDRESS_MAXIMUM: 250,
  },

  ERROR: {
    CANT_BIGGER_MAX_DISCOUNT: "Giảm giá không thể lớn hơn chiết khấu tối đa",
  },

  SELECT_GROUP_IMPORT_EXPORT_REPORT: [
    {name: "Sản phẩm", value: 1},
    {name: "Khách hàng", value: 2},
    {name: "Nhà cung cấp", value: 3},
  ],

  SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE: {
    PRODUCT: 1,
    CUSTOMER: 2,
    SUPPLIER: 3
  },

  TYPE_CARD_IMPORT_EXPORT_REPORT: {
    1: "Mua hàng",
    2: "Trả hàng",
    3: "Nhập hàng",
    4: "Trả hàng",
    5: "Xuất bán hàng",
    6: "Khách trả hàng",
    7: "Nhập hàng NCC",
    8: "Xuất trả hàng NCC",
    9: "Kiểm kho",
    10: "Chuyển vào kho sx",
    11: "Nhập từ kho sx"
  },
  PLACEHOLDER_SEARCH_PRODUCTS: "Tìm sản phẩm theo mã hoặc tên",
  STOCK_QUANTITY_LIST: {
    1: 'stockQuantity',
    2: 'stockQuantity2',
    3: 'stockQuantity3',
    4: 'stockQuantity4',
    5: 'stockQuantity5',
    6: 'stockQuantity6',
  },
  EXCEL_FILE_NAME: {
    PRODUCT: "mau_nhap_file_san_pham.xlsx",
    CUSTOMER: "mau_nhap_file_khach_hang.xlsx",
    SUPPLIER: "mau_nhap_file_ncc.xlsx"
  },
  MAX_LENGTH_NUMBER_INPUT: 15,
  ACTION: {
    LOGIN: 1,
    CREATE: 2,
    UPDATE: 3,
    CANCEL: 4,
    DELETE: 5,
    STOP: 6
  },
  ACTION: {
    DELETE: 5
  },
  ACTION_NAME : {
    1: "Đăng nhập",
    2: "Tạo",
    3: "Cập nhật",
    4: "Hủy",
    5: "Xóa",
    6: "Ngừng kinh doanh",
    7: "Điều chỉnh",
    8: "Chuyển đổi nhóm",
    9: "Cho phép kinh doanh",
    10: "Chuyển đổi tồn kho",
    11: "Nhập"
  },
  ACTION_LOG_NAME : {
    1: "đã Đăng nhập",
    2: "đã Tạo",
    3: "đã Cập nhật",
    4: "đã Hủy",
    5: "đã Xóa",
    6: "đã Ngừng kinh doanh",
    7: "đã Điều chỉnh",
    8: "đã Chuyển đổi nhóm",
    9: "đã Cho phép kinh doanh",
    10: "đã Chuyển đổi tồn kho",
    11: "đã Nhập"
  },
  ACTION_LOG_TYPE_NAME: {
    1: "Xác thực",
    2: "Sản phẩm",
    3: "Đơn hàng",
    4: "Trả hàng",
    5: "Nhập hàng",
    6: "Trả hàng nhập",
    7: "Đặt hàng bán",
    8: "Đặt hàng nhập",
    9: "Phiếu thu",
    10: "Phiếu chi",
    11: "Thu đặt cọc",
    12: "Công nợ",
    13: "Khách hàng",
    14: "Nhà cung cấp",
    15: "Chi nhánh",
    16: "Kho",
    17: "Kiểm kho",
    18: "Sản xuất",
    19: "Nhập kho sản xuất",
    20: "Xuất kho sản xuất",
    21: "Xuất kho thành phẩm",
    22: "Người dùng",
    23: "Rút đặt cọc",
    24: "Hình ảnh sản phẩm",
    25: "Loại thu chi",
    26: "Nguyên vật liệu",
    27: "Danh sách sản phẩm",
    28: "Danh sách khách hàng",
    29: "Danh sách nhà cung cấp",
    30: "Giá sản phẩm",
    31: "Nhóm sản phẩm",
    32: "Đơn vị tính",
    33: "Bộ phận",
    34: "Thiết lập cửa hàng"
  },
  ACTION_TYPE: {
    IMAGE_PRODUCT: 24
  },
  OPTIONS_ACTION_TYPE: [
    {value: 1, title: "Xác thực"},
    {value: 2, title: "Sản phẩm"},
    {value: 3, title: "Đơn hàng"},
    {value: 4, title: "Trả hàng"},
    {value: 5, title: "Nhập hàng"},
    {value: 6, title: "Trả hàng nhập"},
    {value: 7, title: "Đặt hàng bán"},
    {value: 8, title: "Đặt hàng nhập"},
    {value: 9, title: "Phiếu thu"},
    {value: 10, title: "Phiếu chi"},
    {value: 11, title: "Thu đặt cọc"},
    {value: 12, title: "Công nợ"},
    {value: 13, title: "Khách hàng"},
    {value: 14, title: "Nhà cung cấp"},
    {value: 15, title: "Chi nhánh"},
    {value: 16, title: "Kho"},
    {value: 17, title: "Kiểm kho"},
    {value: 18, title: "Sản xuất"},
    {value: 19, title: "Nhập kho sản xuất"},
    {value: 20, title: "Xuất kho sản xuất"},
    {value: 21, title: "Xuất kho thành phẩm"},
    {value: 22, title: "Người dùng"},
    {value: 23, title: "Rút đặt cọc"},
    {value: 24, title: "Hình ảnh sản phẩm"},
    {value: 25, title: "Loại thu chi"},
    {value: 26, title: "Nguyên vật liệu"},
    {value: 27, title: "Danh sách sản phẩm"},
    {value: 28, title: "Danh sách khách hàng"},
    {value: 29, title: "Danh sách nhà cung cấp"},
    {value: 30, title: "Giá sản phẩm"},
    {value: 31, title: "Nhóm sản phẩm"},
    {value: 32, title: "Đơn vị tính"},
    {value: 33, title: "Bộ phận"},
    {value: 34, title: "Thiết lập"}
  ],
  
  CARD_CODE_CONFIG: {
    ID: "Số thứ tự phiếu (không theo tiền tố)",
    id: "Số thứ tự phiếu (theo tiền tố)",
    "datetime:format": "Định dạng ngày giờ (DD: ngày, MM: tháng, YYYY: năm,...)",
    "prefix:card_prefix": "Tiền tố mã phiếu (a-z, A-Z, 0-9)",
    customer_code: "Mã khách hàng/NCC",
    "customer_counter:format": "Số lượng phiếu theo mã khách hàng/NCC",
    "customer_counter_by:period,format": "Số lượng phiếu của khách hàng/NCC theo khoảng thời gian (period)",
  }
};
