import store from 'store/Store';
import languageAction from 'store/actions/languageAction';
import branchAction from 'store/actions/branchAction';
import stockListAction from 'store/actions/stockListAction';
import productListAction from 'store/actions/productListAction';
import productTypeListAction from 'store/actions/productTypeListAction';
import productUnitListAction from 'store/actions/productUnitListAction';
import customerListAction from 'store/actions/customerListAction';
import supplierListAction from 'store/actions/supplierListAction';
import invoiceAction from 'store/actions/invoiceAction';
import invoiceReturnAction from 'store/actions/invoiceReturnAction';
import importAction from 'store/actions/importAction';
import importReturnAction from 'store/actions/importReturnAction';
import incExpAction from 'store/actions/incExpAction';
import depositAction from 'store/actions/depositAction';
import incExpTypeAction from 'store/actions/incExpTypeAction';
import userListAction from 'store/actions/userListAction';
import roleAction from 'store/actions/roleAction';
import saleOrderAction from 'store/actions/saleOrderAction';
import importOrderAction from 'store/actions/importOrderAction';
import stockCheckAction from 'store/actions/stockCheckAction';
import importStockAction from 'store/actions/importStockAction';
import exportStockAction from 'store/actions/exportStockAction';

function loading(value) {
	store.dispatch({type: 'UPDATE_LOADING', payload: value})
}

export default {		
	loading: {
		on: () => loading(true),
		off: () => loading(false)
	},
  ...languageAction,
  ...branchAction,
  ...stockListAction,
  ...productListAction,
  ...productTypeListAction,
  ...productUnitListAction,
  ...customerListAction,
  ...supplierListAction,
  ...invoiceAction,
  ...invoiceReturnAction,
  ...importAction,
  ...importReturnAction,
  ...incExpAction,
  ...depositAction,
  ...incExpTypeAction,
  ...userListAction,
  ...roleAction,
  ...saleOrderAction,
  ...importOrderAction,
  ...stockCheckAction,
  ...importStockAction,
  ...exportStockAction
};