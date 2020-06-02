// Views
import Dashboard from "views/Dashboard/Dashboard.jsx";
import SalesCounter from "views/SalesCounter/Management.js";
import Product from "views/Product/Management.jsx";
import ProductAdd from "views/Product/components/Product/Form.jsx";
import Equalizer from "assets/img/icons/menu/Tongquan.png";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AddImport from "assets/img/icons/AddImport.png";
import AddExport from "assets/img/icons/AddExport.png";
import MyAccount from "views/MyAccount/MyAccount.js";
import QuotaReport from "views/QuotaReport/QuotaReport.jsx";
import FinishedEstimatesReport from "views/FinishedEstimates/FinishedEstimates.jsx";


import UserManagement from "views/User/UserManagement/UserManagement.js";
import EditUser from "views/User/UserManagement/EditUser.jsx";
import RoleManagement from "views/User/RoleManagement/RoleManagement.js";
import EditRole from "views/User/RoleManagement/EditRole.jsx";
import CreateCustomer from "views/Customer/CreateCustomer.jsx";
import SaleReport from "views/SaleReport/Management.jsx";


import Customer from "views/Customer/Customer.jsx";
import ProductUnit from "views/ProductUnit/ProductUnit";
import Price from "views/Price/Price";
import ImportExportCardManagement from "views/ImportExport/Management/Management";
import CreateReturn from "views/ImportExport/CreateInvoiceReturn/components/Create";
import CreateInvoiceReturn from "views/ImportExport/CreateInvoiceReturn/Create";
import EditInvoiceReturn from "views/ImportExport/CreateInvoiceReturn/Create";

import CreateStockTakeCard from "views/StockTake/Create/Create.jsx";
import StockTakeCardManagement from "views/StockTake/Management/Management.jsx";
import ProductType from "views/ProductType/ProductType.jsx";

import Setting from "views/InfoPrint/Setting";
import InfoPrintForm from "views/InfoPrint/components/InfoPrintForm";
import ManufacturingCardInfo from "views/InfoPrint/components/ManufacturingCardInfo"
import CardCode from "views/InfoPrint/components/CardCode"
import StoreInfo from "views/InfoPrint/components/StoreInfo";

import IncomeExpense from "views/IncomeExpense/IncomeExpense.jsx";
import CreateIncomeExpense from "views/IncomeExpense/Create/Create.jsx";
import InventoryReport from "views/InventoryReport/InventoryReport.jsx";
import BarCode from "views/Product/components/Product/BarCode.jsx";

import IncomeExpenseTypes from "views/IncomeExpenseTypes/IncomeExpenseTypes.jsx";
import CreateReturnIcon from "assets/img/icons/createreturn.png";
import LoginPage from "views/Pages/LoginPage.jsx";
import RegisterPage from "views/Pages/RegisterPage.jsx";
import Forgotpass from "views/Pages/Forgotpass.jsx";
import NewPasswordPage from "views/Pages/NewPasswordPage.jsx";
import Invoice from "views/Invoice/Invoice.jsx";
import FinishedProduct from "views/FinishedProduct/FinishedProduct.jsx"
import CreateInvoice from "views/Invoice/Create/Create.jsx";

import Constants from "variables/Constants/index.js";
import ImportList from "views/Import/ImportList.jsx";
import CreateImport from "views/Import/components/CreateImport.jsx";

import ImportReturn from "views/ImportReturn/ImportReturnList.jsx";
import CreateImportReturn from "views/ImportReturn/components/Create.jsx";

import Debt from "views/Report/Debt.jsx";
import IncomeExpenseReport from "views/Report/IncomeExpense.jsx";
import ImportExportReport from "views/Report/ImportExport.jsx";

import DepositList from "views/Deposit/List.js";
import Deposits from "views/Deposit/Components/Deposit.js";

import ManufacturingStock from "views/ManufacturingStock/index.js";

import ImportStockList from "views/ImportStock/list.jsx";
import ImportStockCard from "views/ImportStock/Card/Management.jsx";

import CreateExportStock from "views/ExportStock/Create.jsx";
import ExportStock from "views/ExportStock/ListExportStock.jsx";

import ManufacturingCard from "views/ManufacturingCard/ManufacturingCard.jsx";
import CreateManufacturingCard from "views/ManufacturingCard/Create/Create.jsx";
import StoreReport from "views/StoreReport/StoreReport.jsx";

import TongQuanIcon from "assets/img/icons/menu/Tongquan.png";
import SanPhamIcon from "assets/img/icons/menu/Sanpham.png";
import DanhMucIcon from "assets/img/icons/menu/Danhmuc.png";
import NhomSanPhamIcon from "assets/img/icons/menu/Nhomsanpham.png";
import QuanLyGiaIcon from "assets/img/icons/menu/Quanlygia.png";
import KiemKhoIcon from "assets/img/icons/menu/Kiemkho.png";
import TonKhoIcon from "assets/img/icons/menu/Tonkho.png";
import UocLuongThanhPhamIcon from "assets/img/icons/menu/UocLuongThanhPham.png";
import DonViTinhIcon from "assets/img/icons/menu/Donvitinh.png";
import GiaoDichIcon from "assets/img/icons/menu/Giaodich.png";
import DonHangIcon from "assets/img/icons/menu/Donhang.png";
import NhapHangIcon from "assets/img/icons/menu/Nhaphang.png";
import TraHangIcon from "assets/img/icons/menu/Trahang.png";
import TraHangNhapIcon from "assets/img/icons/menu/Trahangnhap.png";
import SoQuyIcon from "assets/img/icons/menu/Soquy.png";
import LoaiThuChiIcon from "assets/img/icons/menu/Phanloaithuchi.png";
import PhieuThuIcon from "assets/img/icons/menu/Phieuthu.png";
import PhieuChiIcon from "assets/img/icons/menu/Phieuchi.png";
import DoiTacIcon from "assets/img/icons/menu/Doitac.png";
import KhacHangIcon from "assets/img/icons/menu/Khachhang.png";
import NCCIcon from "assets/img/icons/menu/Nhacungcap.png";
import BaoCaoIcon from "assets/img/icons/menu/Baocao.png";
import BCBanHangIcon from "assets/img/icons/menu/Baocaosell.png";
import QuanLyNguoiDungIcon from "assets/img/icons/menu/Quanlynguoidung.png";
import DanhSachNguoiDungIcon from "assets/img/icons/menu/Danhsachnguoidung.png";
import VaiTroIcon from "assets/img/icons/menu/Vaitro.png";
import ChucNangIcon from "assets/img/icons/menu/Chucnang.png";
import QuanLyTinhNangIcon from "assets/img/icons/menu/Cauhinhchucnang.png"
import KhoSanXuatIcon from "assets/img/icons/menu/Khosx@0.5x.png";
import NhapThanhPhamIcon from "assets/img/icons/menu/Nhapthanhpham@0.5x.png";
import PhieuSanXuatIcon from "assets/img/icons/menu/Phieusx@0.5x.png";
import QuanLySanXuatIcon from "assets/img/icons/menu/Quanlysx@0.5x.png";
import ThanhPhamIcon from "assets/img/icons/menu/Thanhpham@0.5x.png";
import XuatNVLIcon from "assets/img/icons/menu/Xuatnvl@0.5x.png";
import NhapXuatChiTietIcon from "assets/img/icons/menu/Chitietnxt@0.5x.png";
import NhapXuatTonIcon from "assets/img/icons/menu/Nxt@0.5x.png";
import CongNoTongQuatIcon from "assets/img/icons/menu/Congnotongquat@0.5x.png";
import NhanVienQuayIcon from "assets/img/icons/menu/Nhanvienquay@0.5x.png";
import ThuChiTongQuatIcon from "assets/img/icons/menu/Thuchitongquat@0.5x.png";
import NhatKyIcon from "assets/img/icons/menu/historyaction.png";
import ListOrder from "views/Order";
import CreateOrder from "views/Order/create";
import GerenalDebtReport from "views/GerenalDebtReport/GerenalDebtReport";
import Branches from "views/Branch";
import BranchForm from "views/Branch/component";
import StockList from "views/StockList";
import CreateStock from "views/StockList/component";
import ActionLog from "views/ActionLog";

var dashRoutes = [
 
  {
    path: "/dashboard",
    name: "Tổng quan",
    iconImage: TongQuanIcon,
    component: Dashboard,
    layout: "/admin",
    permissionName: { and: [Constants.PERMISSION_NAME.REPORT_OVERALL] },
  },
  {
    path: "/sales-counter",
    name: "Bán hàng tại quầy",
    iconImage: NhanVienQuayIcon,
    component: SalesCounter,
    layout: "/admin",
    permissionName: { and: [Constants.PERMISSION_NAME.SALES_COUNTER] },
  },
  {
    collapse: true,
    name: "Sản phẩm",
    iconImage: SanPhamIcon,
    layout: "/admin",
    state: "ProductCollapse",
    permissionName: { or: [Constants.PERMISSION_NAME.PRODUCT, Constants.PERMISSION_NAME.STOCK_CHECK, Constants.PERMISSION_NAME.MANAGEMENT_PRICE] },
    views: [
      {
        collapse: true,
        path: "/product",
        name: "Danh mục",
        iconImage: DanhMucIcon,
        component: Product,
        permissionName: { or: [Constants.PERMISSION_NAME.PRODUCT] },
        layout: "/admin",
        views: [
          {
            path: "/add-product",
            name: "Tạo sản phẩm",
            iconImage: Equalizer,
            component: ProductAdd,
            permissionName: { and: [Constants.PERMISSION_NAME.PRODUCT] },
            redirect: true,
            layout: "/admin"
          },
          {
            path: "/edit-product",
            name: "Cập nhật sản phẩm",
            parameter_name: "/:productId?",
            iconImage: Equalizer,
            component: ProductAdd,
            permissionName: { and: [Constants.PERMISSION_NAME.PRODUCT] },
            redirect: true,
            layout: "/admin"
          },
        ]
      },
      {
        path: "/type-product",
        name: "Nhóm sản phẩm",
        iconImage: NhomSanPhamIcon,
        component: ProductType,
        permissionName: { or: [Constants.PERMISSION_NAME.PRODUCT] },
        layout: "/admin"
      },
      {
        path: "/PriceManagement",
        name: "Quản lý giá",
        iconImage: QuanLyGiaIcon,
        component: Price,
        permissionName: { or: [Constants.PERMISSION_NAME.MANAGEMENT_PRICE] },
        layout: "/admin"
      },
      {
        collapse: true,
        path: "/stocktake",
        name: "Kiểm kho",
        iconImage: KiemKhoIcon,
        component: StockTakeCardManagement,
        permissionName: { or: [Constants.PERMISSION_NAME.STOCK_CHECK] },
        layout: "/admin",
        views: [
          {
            path: Constants.ADD_STOCKTAKE_CARD_ROUTE,
            name: "Tạo phiếu kiểm kho",
            iconImage: AddImport,
            component: CreateStockTakeCard,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.STOCK_CHECK] },
            layout: "/admin"
          },
          {
            path: Constants.EDIT_STOCKTAKE_CARD_ROUTE,
            parameter_name: "/:cardID?",
            name: "Cập nhật phiếu kiểm kho",
            iconImage: AddImport,
            component: CreateStockTakeCard,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.STOCK_CHECK] },
            layout: "/admin"
          },
        ]
      },
      {
        path: "/ProductUnit",
        name: "Đơn vị tính",
        iconImage: DonViTinhIcon,
        component: ProductUnit,
        permissionName: { or: [Constants.PERMISSION_NAME.PRODUCT] },
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Bán hàng",
    iconImage: GiaoDichIcon,
    layout: "/admin",
    permissionName: { or: [Constants.PERMISSION_NAME.INVOICE, Constants.PERMISSION_NAME.INVOICE_RETURN, Constants.PERMISSION_NAME.INVOICE_ORDER_CARD] },
    state: "Negotiate",
    views: [
      {
        collapse: true,
        path: "/invoice",
        name: "Đơn hàng",
        iconImage: DonHangIcon,
        component: Invoice,
        permissionName: { or: [Constants.PERMISSION_NAME.INVOICE] },
        layout: "/admin",
        state: "Invoice",
        views: [
          {
            path: Constants.ADD_INVOICE,
            parameter_name: "/:invoiceId?",
            name: "Tạo đơn hàng",
            component: CreateInvoice,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INVOICE] },
            layout: "/admin"
          },
          {
            path: Constants.EDIT_INVOICE,
            parameter_name: "/:invoiceId?",
            name: "Cập nhật đơn hàng",
            component: CreateInvoice,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INVOICE] },
            layout: "/admin"
          },
        ]
      },
      {
        collapse: true,
        path: "/list-invoice-return",
        name: "Trả hàng",        
        iconImage: TraHangIcon,
        component: ImportExportCardManagement,
        permissionName: { or: [Constants.PERMISSION_NAME.INVOICE_RETURN] },
        layout: "/admin",
        state: "InvoiceReturn",
        views: [
          {
            path: "/add-return-card",
            name: "Tạo phiếu trả hàng",
            iconImage: AddExport,
            component: CreateReturn,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INVOICE_RETURN] },
            layout: "/admin"
          },
          {
            path: "/edit-return-card",
            name: "Sửa phiếu trả hàng",
            parameter_name: "/:cardCode?",
            parameter_value: [""],
            iconImage: AddExport,
            component: CreateReturn,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INVOICE_RETURN] },
            layout: "/admin"
          },
          {
            path: "/add-invoice-return",
            parameter_name: "/:invoiceId?",
            parameter_value: [""],
            name: "Tạo phiếu trả hàng",
            iconImage: AddExport,
            component: CreateInvoiceReturn,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INVOICE_RETURN] },
            layout: "/admin"
          },
          {
            path: "/update-invoice-return",
            parameter_name: "/:cardCode?",
            parameter_value: [""],
            name: "Chi tiết trả hàng",
            iconImage: AddExport,
            component: EditInvoiceReturn,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INVOICE_RETURN] },
            layout: "/admin"
          },
        ]
      },
      {
        collapse: true,
        path: "/export-order-card",
        name: "Đặt hàng",
        iconImage: TraHangNhapIcon,
        parameter_name: "/:type?",
        parameter_value: [Constants.ORDER_CARD_TYPE.EXPORT],
        component: ListOrder,
        permissionName: { or: [Constants.PERMISSION_NAME.INVOICE_ORDER_CARD] },
        layout: "/admin",
        state: "ExOrder",
        views: [
          {
            path: "/add-export-order-card",
            name: "Tạo đơn đặt hàng",
            redirect: true,
            parameter_name: "/:type?/:cardID?",
            parameter_value: [Constants.ORDER_CARD_TYPE.EXPORT, ""],
            iconImage: AddImport,
            component: CreateOrder,
            permissionName: { and: [Constants.PERMISSION_NAME.INVOICE_ORDER_CARD] },
            layout: "/admin"
          },
          {
            path: "/update-export-order-card",
            name: "Sửa đơn đặt hàng",
            parameter_name: "/:type?/:cardID?",
            parameter_value: [Constants.ORDER_CARD_TYPE.EXPORT, ""],
            iconImage: CreateReturnIcon,
            component: CreateOrder,
            permissionName: { and: [Constants.PERMISSION_NAME.INVOICE_ORDER_CARD] },
            redirect: true,
            layout: "/admin"
          }
        ]
      },       
    ]
  },
  {
    collapse: true,
    name: "Phiếu nhập hàng",
    iconImage: NhapHangIcon,
    layout: "/admin",
    permissionName: { or: [ Constants.PERMISSION_NAME.IMPORT, Constants.PERMISSION_NAME.IMPORT_RETURN, Constants.PERMISSION_NAME.IMPORT_ORDER_CARD ] },
    state: "Import",
    views: [
      {
        collapse: true,
        path: "/import-card",
        name: "Phiếu nhập hàng",
        iconImage: PhieuSanXuatIcon,
        component: ImportList,
        permissionName: { or: [Constants.PERMISSION_NAME.IMPORT] },
        layout: "/admin",
        state: "ImportCard",
        views: [
          {
            path: Constants.ADD_IMPORT_CARD_ROUTE,
            name: "Tạo phiếu nhập hàng",
            redirect: true,
            parameter_name: "/:cardID?",
            parameter_value: [""],
            iconImage: AddImport,
            component: CreateImport,
            permissionName: { and: [Constants.PERMISSION_NAME.IMPORT] },
            layout: "/admin"
          },
          {
            path: Constants.EDIT_IMPORT_CARD_ROUTE,
            name: "Sửa phiếu nhập hàng",
            parameter_name: "/:cardID?",
            parameter_value: [""],
            redirect: true,
            iconImage: AddImport,
            component: CreateImport,
            permissionName: { and: [Constants.PERMISSION_NAME.IMPORT] },
            layout: "/admin"
          },
        ]
      },
      {
        collapse: true,
        path: "/export-card",
        name: "Trả hàng nhập",
        iconImage: TraHangNhapIcon,
        component: ImportReturn,
        permissionName: { or: [Constants.PERMISSION_NAME.IMPORT_RETURN] },
        layout: "/admin",
        state: "ExportCard",
        views: [
          {
            path: Constants.ADD_EXPORT_CARD_ROUTE,
            name: "Tạo phiếu trả hàng nhập",
            parameter_name: "/:importId?",
            parameter_value: [""],
            iconImage: CreateReturnIcon,
            component: CreateImportReturn,
            permissionName: { and: [Constants.PERMISSION_NAME.IMPORT_RETURN] },
            redirect: true,
            layout: "/admin"
          },
          {
            path: Constants.EDIT_EXPORT_CARD_ROUTE,
            name: "Sửa phiếu trả hàng nhập",
            parameter_name: "/:cardCode?",
            parameter_value: [""],
            iconImage: CreateReturnIcon,
            component: CreateImportReturn,
            permissionName: { and: [Constants.PERMISSION_NAME.IMPORT_RETURN] },
            redirect: true,
            layout: "/admin"
          }
        ]
      },
      {        
        collapse: true,
        path: "/import-order-card",
        name: "Đặt hàng",
        iconImage: PhieuSanXuatIcon,
        parameter_name: "/:type?",
        parameter_value: [Constants.ORDER_CARD_TYPE.IMPORT],
        component: ListOrder,
        permissionName: { or: [Constants.PERMISSION_NAME.IMPORT_ORDER_CARD] },
        layout: "/admin",
        state: "ImOrder",
        views: [
          {
            path: "/add-import-order-card",
            name: "Tạo đơn đặt hàng",
            redirect: true,
            parameter_name: "/:type?/:cardID?",
            parameter_value: [Constants.ORDER_CARD_TYPE.IMPORT, ""],
            iconImage: AddImport,
            component: CreateOrder,
            permissionName: { and: [Constants.PERMISSION_NAME.IMPORT_ORDER_CARD] },
            layout: "/admin"
          },
          {
            path: "/update-import-order-card",
            name: "Sửa đơn đặt hàng",
            parameter_name: "/:type?/:cardID?",
            parameter_value: [Constants.ORDER_CARD_TYPE.IMPORT, ""],
            redirect: true,
            iconImage: AddImport,
            component: CreateOrder,
            permissionName: { and: [Constants.PERMISSION_NAME.IMPORT_ORDER_CARD] },
            layout: "/admin"
          },
        ]
      },
    ]
  },  
  {
    collapse: true,
    name: "Quản lý sản xuất",
    iconImage: QuanLySanXuatIcon,
    layout: "/admin",
    state: "Manufacture",
    expandDefault: false,
    permissionName: { or: [Constants.PERMISSION_NAME.MANUFACTURE_PRODUCT, Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE, Constants.PERMISSION_NAME.MANUFACTURE_CARD] },
    views: [
      {
        path: "/finished_products",
        name: "Thành phẩm",
        component: FinishedProduct,
        iconImage: ThanhPhamIcon,
        permissionName: { or: [Constants.PERMISSION_NAME.MANUFACTURE_PRODUCT] },
        layout: "/admin",
      },
      {
        collapse: true,
        path: Constants.MANUFACTURING_CARD_LIST,
        name: "Phiếu sản xuất",
        iconImage: PhieuSanXuatIcon,
        component: ManufacturingCard,
        permissionName: { or: [Constants.PERMISSION_NAME.MANUFACTURE_CARD] },
        layout: "/admin",
        views: [
          {
            path: Constants.ADD_MANUFACTURING_CARD,
            name: "Tạo phiếu sản xuất",
            component: CreateManufacturingCard,
            redirect: true,
            permissionName: {and:[Constants.PERMISSION_NAME.MANUFACTURE_CARD]},
            layout: "/admin"
          },
          {
            path: Constants.EDIT_MANUFACTURING_CARD,
            parameter_name: "/:id?",
            name: "Cập nhật phiếu sản xuất",
            component: CreateManufacturingCard,
            redirect: true,
            permissionName: {and:[Constants.PERMISSION_NAME.MANUFACTURE_CARD]},
            layout: "/admin"
          },
        ]
      },
      {
        path: "/manufacturing_warehouse",
        name: "Kho sản xuất",
        component: ManufacturingStock,
        iconImage: KhoSanXuatIcon,
        layout: "/admin",
        collapse: true,
        expandDefault: false,
        state: "manufacturing_warehouse",
        permissionName: { or: [Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE] },
        views: [
          {
            collapse: true,
            name: "Nhập kho",
            path: Constants.LIST_IMPORT_STOCK,
            iconImage: NhapThanhPhamIcon,
            layout: "/admin",
            state: "ExportManufactureCollapse",
            component: ImportStockList,
            permissionName: { or: [Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE] },
            views: [
              {
                path: Constants.CREATE_IMPORT_STOCK,
                name: "Tạo phiếu nhập",
                component: ImportStockCard,
                redirect: true,
                permissionName: {and:[Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE]},
                layout: "/admin",
              },
              {
                path: Constants.EDIT_IMPORT_STOCK,
                name: "Sửa phiếu nhập",
                parameter_name: "/:cardID?",
                component: ImportStockCard,
                redirect: true,
                permissionName: {and:[Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE]},
                layout: "/admin",
              }
            ]
          },
          {
            collapse: true,
            path: Constants.LIST_EXPORT_STOCK,
            name: "Xuất kho",
            iconImage: XuatNVLIcon,
            layout: "/admin",
            component: ExportStock,
            permissionName: { or: [Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE] },
            views: [
              {
                path: Constants.CREATE_EXPORT_STOCK,
                name: "Tạo phiếu xuất",
                redirect: true,
                component: CreateExportStock,
                permissionName: {and:[Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE]},
                layout: "/admin"
              },
              {
                path: Constants.EDIT_EXPORT_STOCK,
                parameter_name: "/:cardID?",
                name: "Sửa phiếu xuất",
                redirect: true,
                component: CreateExportStock,
                permissionName: {and:[Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE]},
                layout: "/admin"
              },
            ]
          },
        ]
      },
    ]
  },
  {
    collapse: true,
    name: "Sổ quỹ",
    iconImage: SoQuyIcon,
    permissionName: { or: [Constants.PERMISSION_NAME.INCOME_EXPENSE, Constants.PERMISSION_NAME.DEPOSIT, Constants.PERMISSION_NAME.INCOME_EXPENSE_TYPE] },
    layout: "/admin",
    state: "CashBook",
    views: [
      {
        collapse: true,
        path: Constants.MANAGE_INCOME_EXPENSE_CARD_ROUTE,
        name: "Phiếu thu chi",
        iconImage: PhieuThuIcon,
        component: IncomeExpense,
        permissionName: { and: [Constants.PERMISSION_NAME.INCOME_EXPENSE] },
        layout: "/admin",
        views: [
          {
            path: Constants.ADD_INCOME_CARD_ROUTE,
            parameter_name: "/:cardId?",
            name: "Tạo phiếu thu",
            component: CreateIncomeExpense,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INCOME_EXPENSE] },
            layout: "/admin"
          },
          {
            path: Constants.EDIT_INCOME_CARD_ROUTE,
            parameter_name: "/:cardId?",
            name: "Cập nhật phiếu thu",
            component: CreateIncomeExpense,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INCOME_EXPENSE] },
            layout: "/admin"
          },
          {
            path: Constants.ADD_EXPENSE_CARD_ROUTE,
            parameter_name: "/:cardId?",
            name: "Tạo phiếu chi",
            component: CreateIncomeExpense,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INCOME_EXPENSE] },
            layout: "/admin"
          },
          {
            path: Constants.EDIT_EXPENSE_CARD_ROUTE,
            parameter_name: "/:cardId?",
            name: "Cập nhật phiếu chi",
            component: CreateIncomeExpense,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.INCOME_EXPENSE] },
            layout: "/admin"
          },
        ]
      },
      {
        collapse: true,
        path: Constants.MANAGE_DEPOSIT_CARD_ROUTE,
        name: "Tiền ký gửi",
        iconImage: PhieuChiIcon,
        component: DepositList,
        permissionName: { and: [Constants.PERMISSION_NAME.DEPOSIT] },
        layout: "/admin",
        views: [
          {
            path: Constants.CREATE_WITHDRAW_DEPOSIT_CARD_ROUTE,
            parameter_name: "/:typeId?",
            parameter_value: ["2"],
            name: "Rút tiền ký gửi",
            component: Deposits,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.DEPOSIT] },
            layout: "/admin"
          },
          {
            path: Constants.EDIT_WITHDRAW_DEPOSIT_CARD_ROUTE,
            parameter_name: "/:typeId?/:CardId?",
            parameter_value: ["2"],
            name: "Rút tiền ký gửi",
            component: Deposits,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.DEPOSIT] },
            layout: "/admin"
          },
          {
            path: Constants.CREATE_COLLECT_DEPOSIT_CARD_ROUTE,
            parameter_name: "/:typeId?",
            parameter_value: ["1"],
            name: "Thu tiền ký gửi",
            component: Deposits,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.DEPOSIT] },
            layout: "/admin"
          },
          {
            path: Constants.EDIT_COLLECT_DEPOSIT_CARD_ROUTE,
            parameter_name: "/:typeId?/:CardId?",
            parameter_value: ["1"],
            name: "Thu tiền ký gửi",
            component: Deposits,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.DEPOSIT] },
            layout: "/admin"
          },
        ]
      },
      {
        path: "/income-expense-types",
        name: "Loại thu chi",
        iconImage: LoaiThuChiIcon,
        component: IncomeExpenseTypes,
        permissionName: { and: [Constants.PERMISSION_NAME.INCOME_EXPENSE_TYPE] },
        layout: "/admin"
      },
    ]
  },
  {
    path: "/create-income",
    parameter_name: "/:isExpense?",
    parameter_value: ["0"],
    name: "Tạo phiếu thu",
    redirect: true,
    iconImage: CreateReturnIcon,
    // component: CreateIncomeExpense,
    view: ["add_income_expense"],
    layout: "/admin"
  },
  {
    path: "/create-expense",
    parameter_name: "/:isExpense?",
    parameter_value: ["1"],
    name: "Tạo phiếu chi",
    iconImage: CreateReturnIcon,
    redirect: true,
    // component: CreateIncomeExpense,
    view: ["add_income_expense"],
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Đối tác",
    iconImage: DoiTacIcon,
    layout: "/admin",
    state: "CustomerCollapse",
    permissionName: { or: [Constants.PERMISSION_NAME.CUSTOMER, Constants.PERMISSION_NAME.SUPPLIER] },
    views: [
      {
        collapse: true,
        path: "/Customer",
        name: "Khách hàng",
        iconImage: KhacHangIcon,
        component: Customer,
        permissionName: { or: [Constants.PERMISSION_NAME.CUSTOMER] },
        layout: "/admin",
        views: [
          {
            path: "/add-customer",
            parameter_name: "/:type?/:id?",
            name: "Tạo khách hàng",
            icon: Equalizer,
            component: CreateCustomer,
            permissionName: { and: [Constants.PERMISSION_NAME.CUSTOMER] },
            redirect: true,
            layout: "/admin"
          },
          {
            path: "/edit-customer",
            parameter_name: "/:type?/:id?",
            name: "Cập nhật khách hàng",
            icon: Equalizer,
            component: CreateCustomer,
            permissionName: { and: [Constants.PERMISSION_NAME.CUSTOMER] },
            redirect: true,
            layout: "/admin"
          },
        ]
      },
      {
        collapse: true,
        path: "/Provider",
        name: "Nhà cung cấp",
        iconImage: NCCIcon,
        component: Customer,
        permissionName: { or: [Constants.PERMISSION_NAME.SUPPLIER] },
        layout: "/admin",
        views: [
          {
            path: "/add-provider",
            parameter_name: "/:type?/:id?",
            name: "Tạo nhà cung cấp",
            icon: Equalizer,
            component: CreateCustomer,
            permissionName: { and: [Constants.PERMISSION_NAME.SUPPLIER] },
            redirect: true,
            layout: "/admin"
          },
          {
            path: "/edit-provider",
            parameter_name: "/:type?/:id?",
            name: "Cập nhật nhà cung cấp",
            icon: Equalizer,
            component: CreateCustomer,
            permissionName: { and: [Constants.PERMISSION_NAME.SUPPLIER] },
            redirect: true,
            layout: "/admin"
          }
        ]
      },
    ]
  },
  {
    collapse: true,
    name: "Báo cáo",
    iconImage: BaoCaoIcon,
    layout: "/admin",
    state: "ReportCollapse",
    permissionName: { or: [ Constants.PERMISSION_NAME.REPORT_SALE, Constants.PERMISSION_NAME.REPORT_STOCK, Constants.PERMISSION_NAME.REPORT_DEBT, 
      Constants.PERMISSION_NAME.REPORT_INCOME_EXPENSE, Constants.PERMISSION_NAME.REPORT_GENERAL_DEBT, Constants.PERMISSION_NAME.REPORT_IMPORT_EXPORT_DETAIL,
      Constants.PERMISSION_NAME.MANUFACTURE_PRODUCT, Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE, Constants.PERMISSION_NAME.MANUFACTURE_CARD,
      Constants.PERMISSION_NAME.ROLE_REPORT_IMPORT_EXPORT, Constants.PERMISSION_NAME.ROLE_REPORT_LOW_STOCK
    ] },
    views: [
      {
        path: "/sale-report",
        name: "Bán hàng",
        iconImage: BCBanHangIcon,
        component: SaleReport,
        permissionName: { and: [Constants.PERMISSION_NAME.REPORT_SALE] },
        layout: "/admin"
      },
      {
        path: "/import-export-report",
        name: "Nhập xuất tồn",
        iconImage: NhapXuatTonIcon,
        component: StoreReport,
        permissionName: { and: [Constants.PERMISSION_NAME.ROLE_REPORT_IMPORT_EXPORT] },
        layout: "/admin"
      },
      {
        path: "/import-export-detail-report",
        name: "Nhập xuất chi tiết",
        iconImage: NhapXuatChiTietIcon,
        component: ImportExportReport,
        permissionName: { and: [Constants.PERMISSION_NAME.REPORT_IMPORT_EXPORT_DETAIL] },
        layout: "/admin"
      },
      {
        path: "/inventory-report",
        name: "Tồn kho",
        iconImage: TonKhoIcon,
        component: InventoryReport,
        permissionName: { and: [Constants.PERMISSION_NAME.REPORT_STOCK] },
        layout: "/admin"
      },
      {
        path: "/low_stock_report",
        name: "Cảnh báo tồn kho",
        iconImage: DonViTinhIcon,
        component: QuotaReport,
        permissionName: { and: [Constants.PERMISSION_NAME.ROLE_REPORT_LOW_STOCK] },
        layout: "/admin"
      },
      {
        path: "/income-expense-report",
        name: "Thu chi tổng quát",
        iconImage: ThuChiTongQuatIcon,
        component: IncomeExpenseReport,
        permissionName: { and: [Constants.PERMISSION_NAME.REPORT_INCOME_EXPENSE] },
        layout: "/admin"
      },
      {
        path: "/general-debt-report",
        name: "Công nợ tổng quát",
        iconImage: CongNoTongQuatIcon,
        component: GerenalDebtReport,
        permissionName: { and: [Constants.PERMISSION_NAME.REPORT_GENERAL_DEBT] },
        layout: "/admin"
      },      
      {
        path: "/customer-debt-report",
        name: "Công nợ phải thu",
        iconImage: KhacHangIcon,
        component: Debt,
        permissionName: { and: [Constants.PERMISSION_NAME.REPORT_DEBT] },
        layout: "/admin"
      },
      {
        path: "/provider-debt-report",
        name: "Công nợ phải trả",
        iconImage: NCCIcon,
        component: Debt,
        permissionName: { and: [Constants.PERMISSION_NAME.REPORT_DEBT] },
        layout: "/admin"
      },
      {
        path: "/finished-estimates-report",
        name: "Ước tính thành phẩm",
        iconImage: UocLuongThanhPhamIcon,
        component: FinishedEstimatesReport,
        permissionName: { or: [Constants.PERMISSION_NAME.MANUFACTURE_PRODUCT, Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE, Constants.PERMISSION_NAME.MANUFACTURE_CARD] },
        layout: "/admin"
      },
    ]
  },
  {
    collapse: true,
    name: "Quản lý người dùng",
    iconImage: QuanLyNguoiDungIcon,
    layout: "/admin",
    state: "UserCollapse",
    permissionName: { or: [Constants.PERMISSION_NAME.SETUP_USER] },
    views: [
      {
        collapse: true,
        path: "/user-management",
        name: "Người dùng",
        iconImage: DanhSachNguoiDungIcon,
        component: UserManagement,
        state: "UserManagementCollapse",
        permissionName: { or: [Constants.PERMISSION_NAME.SETUP_USER] },
        layout: "/admin",
        views: [
          {
            path: "/add-user",
            name: "Tạo người dùng",
            component: EditUser,
            redirect: true,
            layout: "/admin",
            permissionName: { and: [Constants.PERMISSION_NAME.SETUP_USER] },
          },
          {
            path: "/edit-user",
            name: "Sửa người dùng",
            component: EditUser,
            redirect: true,
            layout: "/admin",
            permissionName: { and: [Constants.PERMISSION_NAME.SETUP_USER] },
          },
        ]
      },
      {
        collapse: true,
        path: "/role-management",
        name: "Bộ phận",
        iconImage: VaiTroIcon,
        component: RoleManagement,
        state: "UserManagementCollapse",
        permissionName: { or: [Constants.PERMISSION_NAME.SETUP_USER] },
        layout: "/admin",
        views: [
          {
            path: "/add-role",
            name: "Tạo bộ phận",
            component: EditRole,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.SETUP_USER] },
            layout: "/admin"
          },
          {
            path: "/edit-role",
            name: "Sửa bộ phận",
            component: EditRole,
            redirect: true,
            permissionName: { and: [Constants.PERMISSION_NAME.SETUP_USER] },
            layout: "/admin"
          }
        ]
      },

    ]
  },
  {
    collapse: true,
    path: "/settings",
    name: "Thiết lập",
    iconImage: ChucNangIcon,
    component: Setting,
    layout: "/admin",
    permissionName: { or: [Constants.PERMISSION_NAME.SETUP_STORE, Constants.PERMISSION_NAME.SETUP_BRANCH, Constants.PERMISSION_NAME.SETUP_STOCK ] },
    views: [
      {
        path: "/store_info",
        name: "Thông tin cửa hàng",
        iconImage: BCBanHangIcon,
        component: StoreInfo,
        permissionName: { and: [Constants.PERMISSION_NAME.SETUP_STORE] },
        redirect: true,
        layout: "/admin"
      },
      {
        path: "/print-templates",
        name: "Tùy chọn mẫu in",
        iconImage: BCBanHangIcon,
        component: InfoPrintForm,
        permissionName: { and: [Constants.PERMISSION_NAME.SETUP_STORE] },
        redirect: true,
        layout: "/admin"
      },
      {
        path: "/store_options",
        name: "Cấu hình chức năng",
        iconImage: QuanLyTinhNangIcon,
        component: ManufacturingCardInfo,
        permissionName: { and: [Constants.PERMISSION_NAME.SETUP_STORE] },
        redirect: true,
        layout: "/admin"
      },
      {
        path: "/card-codes",
        name: "Cấu hình mã phiếu",
        iconImage: QuanLyTinhNangIcon,
        component: CardCode,
        permissionName: { and: [Constants.PERMISSION_NAME.SETUP_STORE] },
        redirect: true,
        layout: "/admin"
      },
      {
        path: "/branch_management",
        name: "Quản lý chi nhánh",
        icon: AccountCircle,
        permissionName: { and: [Constants.PERMISSION_NAME.SETUP_BRANCH] },
        component: Branches,
        layout: "/admin",
        redirect: true,
      },
      {
        path: "/stock_management",
        name: "Quản lý kho",
        icon: AccountCircle,
        permissionName: { and: [Constants.PERMISSION_NAME.SETUP_STOCK] },
        component: StockList,
        layout: "/admin",
        redirect: true,
      },
    ]
  },
  {
    path: "/action-log",
    name: "Lịch sử thao tác",
    iconImage: NhatKyIcon,
    component: ActionLog,
    layout: "/admin",
    permissionName: { or: [Constants.PERMISSION_NAME.ACTION_LOG] },
  },
  {
    path: "/my-profile",
    name: "Thông tin của tôi",
    icon: AccountCircle,
    component: MyAccount,
    redirect: true,
    layout: "/admin"
  },
  {
    path: "/login-page",
    parameter_name: "/:email?/:password?",
    name: "Trang đăng nhập",
    parameter_name: "/:email?/:password?",
    mini: "L",
    rtlMini: "هعذا",
    component: LoginPage,
    layout: "/auth",
    redirect: true
  },
  {
    path: "/register-page",
    name: "Trang đăng ký",
    mini: "R",
    rtlMini: "صع",
    component: RegisterPage,
    layout: "/auth",
    redirect: true
  },
  {
    path: "/forgot-password-page",
    name: "Quên mật khẩu",
    mini: "R",
    rtlMini: "صع",
    component: Forgotpass,
    layout: "/auth",
    redirect: true
  },
  {
    path: "/forgot-password",
    name: "Trang đổi mật khẩu",
    mini: "R",
    rtlMini: "صع",
    component: NewPasswordPage,
    redirect: true,
    layout: "/auth"
  },
  {
    path: "/product-barcode",
    name: "In mã vạch",
    icon: AccountCircle,
    component: BarCode,
    layout: "/admin",
    redirect: true,
  },
  {
    path: "/add-branch",
    name: "Tạo chi nhánh",
    icon: AccountCircle,
    component: BranchForm,
    layout: "/admin",
    redirect: true,
  },
  {
    path: "/edit-branch",
    name: "Cập nhật chi nhánh",
    parameter_name: "/:cardId?",
    icon: AccountCircle,
    component: BranchForm,
    layout: "/admin",
    redirect: true,
  },
  {
    path: "/add-stock",
    name: "Tạo kho",
    icon: AccountCircle,
    component: CreateStock,
    layout: "/admin",
    redirect: true,
  },
  {
    path: "/edit-stock",
    name: "Cập nhật kho",
    parameter_name: "/:stockId?",
    icon: AccountCircle,
    component: CreateStock,
    layout: "/admin",
    redirect: true,
  },
  
];

export default dashRoutes;
