import { combineReducers } from "redux";

import reducer_user from "./reducer_user_old";
import userReducer from "./UserReducer";
import user from "./stockCheckReducer";
import Summary from "./Summary";
import paginationReducer from "./paginationReducer";
import searchFilterReducer from "./searchFilterReducer";
import languageReducer from "./languageReducer";
import branchReducer from "./branchReducer";
import stockListReducer from "./stockListReducer";
import productListReducer from "./productListReducer";
import productTypeReducer from "./productTypeListReducer";
import productUnitReducer from "./productUnitListReducer";
import customerListReducer from "./customerListReducer";
import supplierListReducer from "./supplierListAction";
import invoiceReducer from "./invoiceReducer";
import invoiceReturnReducer from "./invoiceReturnReducer"
import importReducer from "./importReducer";
import importReturnReducer from "./importReturnReducer";
import incExpReducer from "./incExpReducer";
import depositReducer from "./depositReducer";
import incExpTypeReducer from "./incExpTypeReducer";
import userListReducer from "./userListReducer";
import roleReducer from "./roleReducer";
import saleOrderReducer from "./saleOrderReducer";
import importOrderReducer from "./importOrderReducer";
import stockCheckReducer from "./stockCheckReducer";
import importStockReducer from "./importStockReducer";
import exportStockReducer from "./exportStockReducer";

export default combineReducers({
  reducer_user,
  user,
  userReducer,
  Summary,
  paginationReducer,
  searchFilterReducer,
  languageReducer,
  branchReducer,
  stockListReducer,
  productListReducer,
  productTypeReducer,
  productUnitReducer,
  customerListReducer,
  supplierListReducer,
  invoiceReducer,
  invoiceReturnReducer,
  importReducer,
  importReturnReducer,
  incExpReducer,
  depositReducer,
  incExpTypeReducer,
  userListReducer,
  roleReducer,
  saleOrderReducer,
  importOrderReducer,
  stockCheckReducer,
  exportStockReducer,
  importStockReducer
});
