import React, { Fragment } from "react";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { withTranslation } from "react-i18next";
// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import ExtendFunction from "lib/ExtendFunction";
import { trans } from "lib/ExtendFunction";
import moment from "moment";
import {
  Redirect
} from "react-router-dom";
import "../css/css.css";
import ProductPDF from "./components/PDF/ProductPDF.js";
import ConvertProductType from './components/Product/SelectProductType';
import productService from 'services/ProductService';
import OhToolbar from "components/Oh/OhToolbar";
import { MdAddCircle, MdDelete, MdCheck, MdLock, MdCancel, MdCached, MdDone, MdVerticalAlignBottom} from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf, AiOutlineUnorderedList, AiOutlineToTop, AiFillPrinter, AiOutlineSetting, AiFillCaretRight, AiFillCaretDown} from "react-icons/ai";
import Constants from "variables/Constants/";
import OhTable from "components/Oh/OhTable";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import OhButton from "components/Oh/OhButton.jsx"
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import OhModal from "components/Oh/OhModal";
import OhRadio from "components/Oh/OhRadio";
import { Container } from "@material-ui/core";
import templateProduct from "lib/templateFile/mau_nhap_file_san_pham.xlsx";
import readXlsxFile from 'read-excel-file';
import ModalChangeStock from './components/Product/ModalChangeStock';
import { ExportCSV } from 'ExportExcel/ExportExcel';
import ReactHtmlParser from 'react-html-parser';
import productTypeService from "services/ProductTypeService";
import Product from "./Product.jsx";
import ProductIcon from "assets/img/icons/menu/product_view.png";
import ProductTypeIcon from "assets/img/icons/menu/producttype_view.png";
import Store from "store/Store";
import searchFilterAction from "store/actions/searchFilterAction";
import _ from 'lodash';
import ManualSortFilter from "MyFunction/ManualSortFilter";
import Actions from "store/actions/";

const table_id = "product-table";
const table_type_id = "product-type-table-view";

class Management extends React.Component {
  constructor(props) {
    super(props);
    this.checkTable = +(localStorage.getItem("checkview") || "0") === 0 ? true : false;
    this.state = {
      editedProduct: {},
      failsProducts: [],
      errProductData: [],
      errFormulaData: [],
      titleFile: "Vui lòng chọn file",
      stopOnCodeDuplicateError: 0,
      open: false,
      visible: false,
      type: null,
      file: null,
      notification: null,
      dataSource: [],
      fullStockList: {},
      slide: 1,
      photoIndex: 0,
      dataPrint: [],
      selectedRowKeys: [],
      expandedRowKeys: [],
      errFormulaProducts: [],
      titleShowList: null,
      visibleCovertProductType: false,
      br: null,
      brerror: null,
      valueIsStop: 0,
      visibleChangeStock: false,
      changedRecord: {},
      loading: false,
      loading_product: false,
      checkViewTable: this.checkTable ,
      dataProductType: this.props.productTypes && this.props.productTypes.length ? this.props.productTypes : [],
      totalProductTypes: this.props.productTypes && this.props.productTypes.length ? this.props.productTypes.length : 0,
      dataProductTypeId: [],
      isResetSelectedRowKeys: false,
      viewTable: false
    };
    
    this.onCancel = this.onCancel.bind(this);
    this.importFile = this.importFile.bind(this);
    this.filters = {};
    this.productTypeId = undefined;
    this.tableProductTypeId = undefined;
    this.filterProducts = {};
    this.existWorkSheetFormula = false;
    this.getProductType = _.debounce(this.getProductType, Constants.UPDATE_TIME_OUT);
    this.tableProductRef = {}
    this.pageSize = 10;
    this.viewColumn = [];
  }

  onChangeStatus = async (item, value, mess) => {
    let productTypeId = this.productTypeId;
    const t = this.props.t;
    this.setState({
      notification: (
        <SweetAlert
          showConfirm={false}
          showCancel={false}
          style={{ width: window.innerWidth < 900 ? 300 : 450, display: "block", marginLeft: 0, marginTop: 0, top: `${(window.innerHeight / 2 - 85) * 100 / window.innerHeight}%`, left: `${(window.innerWidth / 2 - (window.innerWidth < 900 ? 150 : 225)) * 100 / window.innerWidth}%` }}
          title={
            <div style={{ fontSize: "12px", lineHeight: "1.5em" }}>
              <span style={{ color: "black", marginLeft: "2px" }}>
                {ReactHtmlParser(t("{{mess}}<br>sản phẩm này?", {mess: t(mess)}))}</span>
            </div>}
          onCancel={() => this.hideAlert()}
          onConfirm={() => this.hideAlert()}
        >

          <div style={{ textAlign: "center" }}>
            <OhButton
              type="add"
              onClick={() => {
                this.hideAlert();
                this.updateProduct(item, value, productTypeId)
              }}
              icon={<MdDone />}
            >
              {t("Đồng ý")}
            </OhButton>
            <OhButton
              type="exit"
              icon={<MdCancel />}
              onClick={() => this.hideAlert()}
            >
              {t("Thoát")}
            </OhButton>
          </div>
        </SweetAlert>
      )
    });
  };

  onChangeProductBatch = async (value, mess, name) => {
    let productTypeId = this.productTypeId;
    let { t } = this.props;
    let { selectedRowKeys } = this.state;
    let selectedAll = selectedRowKeys.length;
    let isCheckAll = productTypeId ? this.tableProductRef[productTypeId] && this.tableProductRef[productTypeId].tableRef && this.tableProductRef[productTypeId].tableRef.state.isSelectedAll : this.tableProductRef && this.tableProductRef.tableRef && this.tableProductRef.tableRef.state.isSelectedAll;

    if (isCheckAll){
      selectedAll = productTypeId ? this.tableProductRef[productTypeId].tableRef.props.total : this.tableProductRef.tableRef.props.total;
    }

    this.setState({
      notification: (
        <SweetAlert
          showConfirm={false}
          showCancel={false}
          style={{ width: window.innerWidth < 900 ? 300 : 470, display: "block", marginLeft: 0, marginTop: 0, top: `${(window.innerHeight / 2 - 85) * 100 / window.innerHeight}%`, left: `${(window.innerWidth / 2 - (window.innerWidth < 900 ? 150 : 235)) * 100 / window.innerWidth}%` }}
          title={
            <div style={{ fontSize: "18px", lineHeight: "1.5em" }}>
              <span style={{ color: "black", marginLeft: "2px" }}>
                {ReactHtmlParser(t("actionSelectedProduct", {mess: t(mess), count: selectedAll, toGroup: name ? t("tới nhóm <strong>{{name}}</strong>", {name}) : ""}))}
              </span>
            </div>}
          onCancel={() => this.hideAlert()}
          onConfirm={() => this.hideAlert()}
        >

          <div style={{ textAlign: "center" }}>
            <OhButton
              type="add"
              onClick={() => {
                this.hideAlert();
                this.updateProductBatch(selectedRowKeys, value, productTypeId, isCheckAll)
              }}
              icon={<MdDone />}
            >
              {t("Đồng ý")}
            </OhButton>
            <OhButton
              type="exit"
              icon={<MdCancel />}
              onClick={() => this.hideAlert()}
            >
              {t("Thoát")}
            </OhButton>
          </div>
        </SweetAlert>
      )
    });
  };

  hideAlert = () => {
    this.setState({
      notification: null
    });
  };

  onCancel = () => {
    this.setState({
      visible: false,
      type: "",
      title: "",
    }, () => {
      if (this.productTypeId){
        this.tableProductRef[this.productTypeId].tableRef.resetSelectRowKeys()
      }
      else this.tableProductRef.tableRef.resetSelectRowKeys()

    });
  };

  async componentWillMount() {
    let { t } = this.props;

    if (this.props.location && this.props.location.state && this.props.location.state.quota ) {
      Store.dispatch(searchFilterAction.changeSearchFilter(table_id, {
        filterValue: {},
        manualFilterValue: {quota: this.props.location.state.quota },
        tags: {quota: t(Constants.LOW_STOCK_STATUS[1])},
        backupDefaultValue: { quota: this.props.location.state.quota }
      }))
      this.checkTable = true;
      this.setState({
        checkViewTable: this.checkTable
      })
      localStorage.setItem("checkview", 0);      
    }

    if (this.props.productList && this.props.productList.length) {
      let products = await productService.getProductList({});

      if (products.status) {

        let dataProducts = ManualSortFilter.sortArrayObject(products.data, "name", "asc")

        Store.dispatch(Actions.changeProductList(dataProducts))
      }
    }
  }

  async getProductType() {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filterProducts;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    const query = {
      filter: filter || {},
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? {sortField, sortOrder} : {},
    };
      let getProductTypes = await productTypeService.getProductTypes(query);

      if (getProductTypes.status) {
        this.setDataProductType(getProductTypes.data, getProductTypes.count);
      }
      else notifyError(getProductTypes.message);
  }

  async setDataProductType(ProductTypes, count) {

    let dataProductType = []; 
      if (ProductTypes.length > 0) { 
        for (let i in ProductTypes) {
          dataProductType.push({ ...ProductTypes[i], key: ProductTypes[i].id});
        }
      }
      this.setState({
        dataProductType: dataProductType,
        dataPrintFull: dataProductType,
        totalProductTypes: count,
        loading_product: false,
      });
  }

  onChange = (obj) => {    
    this.filterProducts = {
      ...this.filterProducts,
      ...obj
    }

    if (this.props.productTypes && this.props.productTypes.length) {
      let filter = { ...this.filterProducts.filter, ...this.filterProducts.manualFilter };

      let dataFilter = ManualSortFilter.ManualSortFilter(this.props.productTypes, filter, { sortField: this.filterProducts.sortField, sortOrder: this.filterProducts.sortOrder })

      this.setDataProductType(dataFilter, dataFilter.length)
    }
    else this.getProductType();
  }

  handleChange = (pagination, filters, sorter, extra) => {
    document.getElementById("scroll").scrollIntoView(0);
    this.setState({
      dataPrint: extra.currentDataSource,
    })
  }

  updateProduct = async (item, action, productTypeId) => {
    let actionResult;
    if (action !== undefined) {
      if (action.isDelete)
        actionResult = await productService.deleteProduct(item.id);
      if (action.isStop !== undefined)
        actionResult = await productService.stopProduct(item.id, action);
    }

    if (actionResult.status) {
      if (action.isDelete)
        this.success("Xóa sản phẩm thành công");

      else
        this.success("Cập nhật sản phẩm thành công");
    }
    else
      this.error(actionResult.error);

    if (!productTypeId){
      if(this.props.productList && this.props.productList.length) {
        this.tableProductRef.getDataStore([item.id], action.isDelete ? true : false)
      }
      else this.tableProductRef.getData();
      this.tableProductRef.tableRef.resetSelectRowKeys();
    } else {      
      this.tableProductRef[productTypeId].tableRef.resetSelectRowKeys();
      if(this.props.productList && this.props.productList.length) {
        this.tableProductRef[productTypeId].getDataStore([item.id], action.isDelete ? true : false)
      }
      else this.tableProductRef[productTypeId].getData(productTypeId);

    }

    this.setState({
      isResetSelectedRowKeys: true,
      selectedRowKeys: [],
    })
  }

  updateProductBatch = async (ids, action, productTypeId, isCheckAll) => {
    let actionResult;

    if (action !== undefined) {
      if (action.isDelete)
        actionResult = await productService.deleteProductBatch({ ids: ids, isCheckAll: isCheckAll, typeId: productTypeId });
      if (action.isStop !== undefined)
        actionResult = await productService.stopProductBatch({ ids: ids, isStop: action.isStop, isCheckAll: isCheckAll, typeId: productTypeId });
      if (action.productTypeId)
        actionResult = await productService.updateProductBatch({ ids: ids, productTypeId: action.productTypeId, isCheckAll: isCheckAll, typeId: productTypeId });
    }

    if (actionResult.status) {
      if (action.isStop || action.isStop === Constants.PRODUCT_DONTSTOP){
        this.success("Cập nhật các sản phẩm thành công");
      } else if (action.isDelete){
        this.success("Xóa các sản phẩm thành công");
      } else {
        this.success("Chuyển nhóm sản phẩm thành công");
      }
      if (!productTypeId){
        if(this.props.productList && this.props.productList.length) {
          this.tableProductRef.getDataStore(isCheckAll ? actionResult.data.map(item => item.id) : ids, action.isDelete ? true : false)
        } else this.tableProductRef.getData();
          this.tableProductRef.tableRef.resetSelectRowKeys();

      } else {
        this.tableProductRef[productTypeId].tableRef.resetSelectRowKeys();

        if(this.props.productList && this.props.productList.length) {
          this.tableProductRef[productTypeId].getDataStore(isCheckAll ? actionResult.data.map(item => item.id) : ids, action.isDelete ? true : false)
        } else this.tableProductRef[productTypeId].getData(productTypeId);

        if (action.productTypeId  && this.tableProductRef[action.productTypeId]) {
          if(this.props.productList && this.props.productList.length) {
            this.tableProductRef[action.productTypeId].getDataStore(isCheckAll ? actionResult.data.map(item => item.id) : ids, action.isDelete ? true : false)
          } else this.tableProductRef[action.productTypeId].getData(action.productTypeId);
        }

      }

      this.setState({
        isResetSelectedRowKeys: true,
        selectedRowKeys: [],
      })
    }
    else {
      this.error(actionResult.error);
        if (!productTypeId){
          this.tableProductRef.tableRef.resetSelectRowKeys();
        } else {
          this.tableProductRef[productTypeId].tableRef.resetSelectRowKeys();
        }    
      }
  }

  success = (mess) => {
    const { t } = this.props;
    notifySuccess(t(mess));
    this.onCancel();

  }

  error = (mess) => {
    const { t } = this.props;
    notifyError(t(mess));
  }

 formatted_date(){
  var result="";
  result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
  return result;
}

  getDataExcel = (data, t, nameBranch) => {
    //header file Excel
    let dataExcel = [[t("Chi nhánh"), nameBranch ], [t("Thời gian"), this.formatted_date() ]];
    let headerExcel = ["#"];
    if(this.viewColumn.length > 0){
      this.viewColumn.map(item => {
        if(item.visible || item.visible === undefined)
          headerExcel.push(t(item.title))
        return item;
      })
      dataExcel.push(headerExcel)
    }
    else{
      dataExcel.push(["#", t("Mã sản phẩm"), t("Tên sản phẩm"), t("Nhóm sản phẩm"), t("ĐVT"), t("Giá bán"),
        t("Giá vốn"), t("Tồn kho chính"), t("Tồn kho sx")]);
    }

    for (let item in data) {
      //push data into file Excel
      if(this.viewColumn.length > 0){
        let bodyExcel = [];
        this.viewColumn.map(column => {
          if(column.visible || column.visible === undefined)
            bodyExcel.push(data[item][column.dataIndex])
          return column;
        })
        dataExcel.push([
          parseInt(item) + 1,
          ...bodyExcel])
      }
      else{
        dataExcel.push(
          [
            parseInt(item) + 1,
            data[item].code,
            data[item].name,
            data[item].productTypeId_name,
            data[item].unitId_name,
            data[item].saleUnitPrice,
            data[item].costUnitPrice,
            data[item].sumQuantity,
            data[item].productstock_manufacturingQuantity
          ]);
      }
    }
    return dataExcel;
  }

  getDataFormulaExcel = (data, t) => {
    //header file Excel
    let dataExcel = [["#", t("Thành phẩm"), t("Nguyên vật liệu"), t("Số lượng")]];


    for (let item in data) {

      //push data into file Excel
      dataExcel.push(
        [
          parseInt(item) + 1,
          data[item].productCode,
          data[item].materialCode,
          data[item].quantity,
        ]);
    }
    return dataExcel;
  }


  showListProduct = (valueIsStop, titleShowList) => {
    this.setState({
      valueIsStop: valueIsStop,
      titleShowList: titleShowList,
      searchText: {},
    })
  }

  convertProductType = () => {
    this.setState({
      visibleCovertProductType: true
    })
  }

  exportPDF = async () => {
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;    
    let { selectedRowKeys } = this.state;
    let { t, nameBranch } = this.props;  
    let arrId = [];
    let checkisSelectedAll;

    if (this.productTypeId) {
      arrId.push(this.productTypeId);
      if (this.tableProductRef[this.productTypeId]){
        checkisSelectedAll = this.tableProductRef[this.productTypeId].tableRef.state.isSelectedAll
      }    
    } else {
      checkisSelectedAll = this.tableProductRef.tableRef.state.isSelectedAll
    }

    let selectArrayId = arrId.length ? [{"productTypeId.id": arrId }] : [];

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !checkisSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
      selectArrayId: selectArrayId

    };
    
    let dataProductPDF = await productService.getProductList(query)
    
    if ( dataProductPDF.status ) {
      dataProductPDF.data.map( item => {
        item.name = trans(item.name, true)
      })
      
      ProductPDF.productPDF(dataProductPDF.data, t, nameBranch, this.viewColumn)
    }
    else notifyError(dataProductPDF.error)
  }

  exportExcel = async () => {
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;
    let { selectedRowKeys } = this.state;    
    let { t, nameBranch } = this.props;    
    let arrId = [];
    let filterProduct, filterFormula, checkisSelectedAll;

    if (this.productTypeId) {
      arrId.push(this.productTypeId);
      if (this.tableProductRef[this.productTypeId]){
        checkisSelectedAll = this.tableProductRef[this.productTypeId].tableRef.state.isSelectedAll
      }

    } else {
      if (this.state.checkViewTable)
        checkisSelectedAll = this.tableProductRef.tableRef.state.isSelectedAll;
      else return notifyError(t("Yêu cầu chọn nhóm sản phẩm"))
    }

    let selectArrayId = arrId.length ? [{"productTypeId.id": arrId }] : [];
    let selectArrayId_formula = arrId.length ? [{"productId.productTypeId": arrId }] : [];


    if ( selectedRowKeys && selectedRowKeys.length > 0 && !checkisSelectedAll ) {
      filterProduct = {...filter, id: { in: selectedRowKeys } };  
      filterFormula = {...filter, productId: { in: selectedRowKeys }};   
      
    } 

    let query = {
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},

    };

    let [dataProduct, productFormulas] = await Promise.all([
      productService.getProductList({...query, selectArrayId: selectArrayId, filter: filterProduct || {}}),
      productService.getFormulaList({...query, selectArrayId: selectArrayId_formula, filter: filterFormula || {}})
    ])
      
    let dataFormula = [];

    if ( dataProduct.status && productFormulas.status) {

      dataProduct.data.forEach( item => {
        item.name = ExtendFunction.languageName(item.name)[this.props.languageCurrent];
      })

      productFormulas.data.forEach( ele => {
        let materialName = ExtendFunction.languageName(ele.materialId.name)[this.props.languageCurrent];
        let productName = ExtendFunction.languageName(ele.productId.name)[this.props.languageCurrent];
        dataFormula.push({productName: productName, materialName: materialName, quantity: ele.quantity, productCode: ele.productId.code, materialCode: ele.materialId.code })
      })
      
      ExportCSV([{data: this.getDataExcel(dataProduct.data, t, nameBranch), cols: ['F','G','H']}, {data: this.getDataFormulaExcel(dataFormula, t), cols: ['D']}], t("DanhSachSanPham"))
    }
    else notifyError(dataProduct.error || productFormulas.error)
  }

  uploadFile() {
    if( !this.state.loading ) {
      this.refs.fileUploader.click();
    }
  }

  handleStopOnCodeDuplicateError(e){
    this.setState({stopOnCodeDuplicateError: e});
  }
  handleCancleImport(){
    let { t } = this.props;    
    if( !this.state.loading ) {
      this.setState({open: false, stopOnCodeDuplicateError: 0, titleFile: t("Vui lòng chọn file"), file: null});
      this.refs.fileUploader.value = null;
    }
  }

  async handleChangeFile(e){
    let { t } = this.props;  
    e.preventDefault();
    let file = e.target.files[0];
    if (!file) {
      this.setState({ file: this.state.file || undefined });
      return;
    }
    var validExts = [".xlsx", ".xls"];
    var fileExt = file.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) 
    notifyError(t("Vui lòng chọn file excel"))
    else this.setState({ file: file, titleFile: file.name});
  }

  async importFile(){
    let { t } = this.props;  
    let errProductData = [];
    let errFormulaData = [];
    let errFile = false;

    if(!this.state.file) notifyError(t("Vui lòng chọn file"));
    else{

      let productsJSON, formulaJSON;
      await readXlsxFile(this.state.file, { getSheets: true }).then((sheets) => {
        this.sheets = sheets;

        if(sheets.length === 2 && ((sheets[0].name === 'sản phẩm' && sheets[1].name === 'công thức sx') || (sheets[1].name === 'sản phẩm' && sheets[0].name === 'công thức sx')))
          errFile = true
      }).catch(err=> errFile = true)
      if(errFile) {
        notifyError(t("Định dạng file sai, khuyên dùng file mẫu để thực hiện nhập dữ liệu"))
        this.setState({loading: false});
        this.workSheetProduct = this.workSheetFormula = null;
        this.existWorkSheetFormula = false;
        return;
      }

      this.setState({loading: true});

      await readXlsxFile(this.state.file, { sheet: 'sản phẩm' }).then(async(data) => {
        productsJSON = await ExtendFunction.ImportExcelToJSON(data,Constants.FIELDS_PRODUCT);
      }).catch((err) => this.workSheetProduct = "sản phẩm")

      await readXlsxFile(this.state.file, { sheet: 'công thức sx' }).then(async(data) => {
        formulaJSON = await ExtendFunction.ImportExcelToJSON(data,Constants.FIELDS_FORMULA);
      }).catch((err) => this.sheets.length === Constants.PRODUCT_EXCEL_SHEETS.TWO || (this.sheets.length === Constants.PRODUCT_EXCEL_SHEETS.THREE && formulaJSON) ? null : this.workSheetFormula = 'công thức sx')

      if((productsJSON && !productsJSON.status && productsJSON.err.length === 0) || (formulaJSON && !formulaJSON.status && formulaJSON.err.length === 0)){
        this.workSheetProduct = !productsJSON.status ? "sản phẩm" : this.workSheetProduct;
        this.workSheetFormula = formulaJSON && !formulaJSON.status ? "công thức sx" : this.workSheetFormula;
      }

      if(this.workSheetProduct || this.workSheetFormula){
        notifyError(t("Lỗi xử lý dữ liệu trên trang {{sheet}}", {
          sheet: (this.workSheetProduct ? `\"${this.workSheetProduct}\"` : "") + 
                (this.workSheetProduct && this.workSheetFormula ? ", " : "") + 
                (this.workSheetFormula ? `\"${this.workSheetFormula}\"` : "")
        }));
        
        this.setState({loading: false});
        this.workSheetProduct = this.workSheetFormula = null;
        this.existWorkSheetFormula = false;
        return;
      }
      else{

        errProductData = productsJSON.err ? await ExtendFunction.ImportExcelToArray(productsJSON.err,Constants.FIELDS_PRODUCT) : [];
        errFormulaData = (formulaJSON && formulaJSON.err) ? await ExtendFunction.ImportExcelToArray(formulaJSON.err,Constants.FIELDS_FORMULA) : [];

        if(errProductData.length === 0 && errFormulaData.length === 0) {

          formulaJSON = (formulaJSON && formulaJSON.data) ? formulaJSON.data : "";

          let ImportFileProducts = await productService.importProducts({products: productsJSON.data, formula: formulaJSON, stopOnCodeDuplicateError: this.state.stopOnCodeDuplicateError});

          if(ImportFileProducts.status){
            if (ImportFileProducts.data.length > 0 && ImportFileProducts.error.length > 0){
              notifyError(t("Một số sản phẩm không thể cập nhật"));
            } else {
              notifySuccess(t("Nhập dữ liệu thành công"));

            }

            this.refs.fileUploader.value = null;
            this.setState({titleFile: t("Vui lòng chọn file"), file: null, stopOnCodeDuplicateError: 0, failsProducts: ImportFileProducts.error})
            if (!this.productTypeId && (this.tableProductRef.getData || this.tableProductRef.getDataStore)) {
              if(this.props.productList && this.props.productList.length) {                
                let arrIds = ImportFileProducts.data[0] && ImportFileProducts.data[0].map(item => item.data && item.data.id)
                this.tableProductRef.getDataStore(arrIds, false)
              }
              else this.tableProductRef.getData();
            }
          }
          else {
            if(ImportFileProducts.error && ImportFileProducts.error.length > 0)
              this.setState({failsProducts: ImportFileProducts.error});

            if(ImportFileProducts.failedFormulas && ImportFileProducts.failedFormulas.length > 0)
              this.setState({errFormulaProducts: ImportFileProducts.failedFormulas});

            if (ImportFileProducts.data && ImportFileProducts.data.length > 0 ){
              notifyError(t("Một số sản phẩm không thể cập nhật"));
              if (!this.productTypeId && (this.tableProductRef.getData || this.tableProductRef.getDataStore)) {
                if(this.props.productList && this.props.productList.length) {
                  let arrIds = ImportFileProducts.data && ImportFileProducts.data.map(item => item.data && item.data.id)
                  this.tableProductRef.getDataStore(arrIds, false)
                }
                else this.tableProductRef.getData();
              }
            } 
          }
        }
      }

      this.setState({errProductData: errProductData, errFormulaData: errFormulaData, open: false, loading: false});
      
      this.workSheetProduct = this.workSheetFormula = null;
      this.existWorkSheetFormula = false;
    }
  }
  
  openChangeStockModal = (record) => {
    this.setState({
      visibleChangeStock: true,
      changedRecord: record
    })
  }
  
  onToggle = async() =>{
    localStorage.setItem("checkview", this.state.checkViewTable ? 1 : 0);    

    if (this.state.checkViewTable){
      if (!this.state.dataProductType.length){        
        this.setState({
          loading_product: true
        })
        this.getProductType();
      }
      this.setState({
        checkViewTable: false,
        selectedRowKeys: [],
      })
    } 
    else {
      this.setState({
        checkViewTable: true,
        selectedRowKeys: [],
      })
      this.productTypeId = undefined;
      this.tableProductTypeId = undefined;
    }

  }

  onChangeSelectedRowkeys=(ref, record)=>{   
    this.tableProductTypeId = record.id;
    if (this.productTypeId && record.id !== this.productTypeId) {
      if (this.tableProductRef[this.productTypeId]){
        this.tableProductRef[this.productTypeId].tableRef.resetSelectRowKeys();
      }
    }
  }


  customExpandIcon=(props) =>{  
    if (props.expanded) {
      return (
        <a
          style={{ color: "black" }}
          onClick={e => {
            props.onExpand(props.record, e);
          }}
        >
        <AiFillCaretDown/>
        </a>
      );
    } else {
      return (
        <a
          style={{ color: "black" }}
          onClick={e => {
            props.onExpand(props.record, e);
          }}
        >
        <AiFillCaretRight/>
        </a>
      );
    }
  }
  onChangViewTable = (props) =>{
    if (props  && props.length > 0 && !this.state.checkViewTable){
      this.setState({
        viewTable: true
      })
    } else {
      this.setState({
        viewTable: false
      })
    }
  }

  render() {
    let { selectedRowKeys, valueIsStop, dataProductType, isResetSelectedRowKeys, viewTable } = this.state;
    const { t } = this.props;
    
    let errProductsColumn = [
      {
        title: "Mã sản phẩm",
        dataIndex: "code",
        key: "code",
        width: "20%",
        align: "left",
        sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : -1),
      },
      {
        title: "Tên sản phẩm" + " (*)",
        dataIndex: "name",
        key: "name",
        width: "27%",
        align: "left",
        sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : -1),
        render: value => trans(value) 
      },
      {
        title: "Nhóm sản phẩm" + " (*)",
        dataIndex: "productTypeId",
        key: "productTypeId",
        width: "20%",
        align: "left",
        sorter: (a, b) => (a.productTypeId ? a.productTypeId.localeCompare(b.productTypeId) : -1),
        // isManualSort: true,
      },
      {
        title: "Đơn vị tính" + " (*)",
        dataIndex: "unitId",
        key: "unitId",
        width: "15%",
        align: "left",
        sorter: (a, b) => (a.unitId ? a.unitId.localeCompare(b.unitId) : -1),
      },
      {
        title: "Giá bán",
        dataIndex: "productprice.saleUnitPrice",
        key: "saleUnitPrice",
        width: "20%",
        align: "right",
        sorter: (a, b) => (a.saleUnitPrice ? a.saleUnitPrice.localeCompare(b.saleUnitPrice) : -1),
        render: value => {
          return <div className="ellipsis-not-span">{value ? ExtendFunction.FormatNumber(value) : "0"}</div>;
        },
      },
      {
        title: "Giá vốn",
        dataIndex: "productprice.costUnitPrice",
        key: "costUnitPrice",
        width: "20%",
        align: "right",
        sorter: (a, b) => (a.costUnitPrice ? a.costUnitPrice.localeCompare(b.costUnitPrice) : -1),
        render: value => {
          return <div className="ellipsis-not-span">{value ? ExtendFunction.FormatNumber(Math.round(value)) : "0"}</div>;
        },
      },
      {
        title: "Tồn kho",
        dataIndex: "productstock.stockQuantity",
        key: "stockQuantity",
        align: "right",
        width: "13%",
        sorter: (a, b) => (a.stockQuantity ? a.stockQuantity.localeCompare(b.stockQuantity) : -1),
        render: value => {
          return <div className="ellipsis-not-span" >{value ? ExtendFunction.FormatNumber(value) : "0"}</div>;
        },
      },
    ];

    let errFormulaColumn = [
      {
        title: t("Mã thành phẩm") + " (*)",
        dataIndex: "productId",
        key: "productId",
        width: "40%",
        align: "left",
        sorter: (a, b) => (a.productId ? a.productId.localeCompare(b.productId) : -1),
      },
      {
        title: t("Mã nguyên vật liệu") + " (*)",
        dataIndex: "materialId",
        key: "materialId",
        width: "40%",
        align: "left",
        sorter: (a, b) => (a.materialId ? a.materialId.localeCompare(b.materialId) : -1),
      },
      {
        title: t("Số lượng") + " (*)",
        dataIndex: "quantity",
        key: "quantity",
        width: "20%",
        align: "right",
        // isManualSort: true,
        sorter: (a, b) => (a.quantity ? a.quantity.localeCompare(b.quantity) : -1),
      },
    ];

    let getTypeColumns = [
      {
        title: t("Tên nhóm"),
        dataIndex: "name",
        key: "name",
        width: "100%",
        sorter: (a, b) => a.name.toString().localeCompare(b.name),
        sortDirections: ["descend", "ascend"],
        render: value => trans(value),
      },
    ];

    return (
      <Fragment>
        {this.state.notification}
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        <OhModal
          title={t("Nhập hàng hóa từ file dữ liệu")}
          footer={null}
          content={
            <Container>
              <span>{t("Tải về file dữ liệu mẫu")}: </span><a href={templateProduct} download={t(Constants.EXCEL_FILE_NAME.PRODUCT)}>Excel file</a>
              <GridItem>
                <OhButton disabled={this.state.loading} onClick={() => this.uploadFile()}>{t("Chọn file")}</OhButton>
                <span style={{cursor: "pointer"}} onClick={() => this.uploadFile()}>{t(this.state.titleFile)}</span>
                <input type="file" id="file" ref="fileUploader" accept=".xlsx,.xls" style={{display: "none"}} onChange={e => this.handleChangeFile(e)}/>
              </GridItem>
              <GridItem>
                <b>{t("Xử lý trùng mã hàng, khác tên hàng?")}</b><br/>
                <OhRadio
                  name={"code"}
                  disabled={this.state.loading}
                  defaultValue={this.state.stopOnCodeDuplicateError}
                  onChange={(e) => this.handleStopOnCodeDuplicateError(e)}
                  options={[
                    {name: t("Báo lỗi, dừng import"), value: 0},
                    {name: t("Thay thế tên hàng cũ bằng tên hàng mới"), value: 1}
                  ]}
                />
              </GridItem>
              <GridItem style={{textAlign:"right  "}}>
                <OhButton loading={this.state.loading} onClick={this.importFile}>{t("Nhập {{type}}", {type: t("Dữ liệu").toLowerCase()})}</OhButton>
                <OhButton type="exit" disabled= {this.state.loading} onClick={() => this.handleCancleImport()}>{t("Thoát")}</OhButton>
              </GridItem>
            </Container>
          }
          onOpen={this.state.open}
          onClose={() => this.handleCancleImport()}
        />
        <OhModal
          title={t("Có lỗi trong quá trình nhập dữ liệu")}
          footer={null}
          className={"Product"}
          content={
            <>
              {this.state.failsProducts.length > 0 ?
              <>
                <p>{t("Có lỗi phát sinh khi xử lý dữ liệu trên bảng sản phẩm")}:</p>
                <OhTable
                  onRef={ref => (this.tableProductsRef = ref)}
                  columns={[
                    {
                      title: t("Mã sản phẩm"),
                      dataIndex: "code",
                      key: "code",
                      width: "20%",
                      sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : -1),
                      render: value => {
                        return <div className="ellipsis-not-span">{value}</div>;
                      },
                      ellipsis: true,
                    },
                    {
                      title: t("Tên sản phẩm"),
                      dataIndex: "name",
                      key: "name",
                      width: "30%",
                      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : -1),
                      render: value => trans(value),
                      ellipsis: true,
                    },
                    {
                      title: t("Lý do"),
                      dataIndex: "reason",
                      key: "reason",
                      width: "50%",
                      sorter: (a, b) => (a.reason ? a.reason.localeCompare(b.reason) : -1),
                      render: value => {
                        return <div className="ellipsis-not-span">{value}</div>;
                      },
                      ellipsis: true,
                    },
                  ]}
                  dataSource={this.state.failsProducts}
                  total={this.state.failsProducts ? this.state.failsProducts.length : 0}
                  id={"failsProduct-table"}
                  onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
                  emptyDescription={Constants.NO_PRODUCT}
                /> 
              </> : null}

              { this.state.errFormulaProducts.length > 0 ?
              <>
                <p>{t("Có lỗi phát sinh khi xử lý dữ liệu trên bảng công thức sản xuất")}:</p>
                <OhTable
                  onRef={ref => (this.tableErrFormulaProductsRef = ref)}
                  columns={[
                    {
                      title: t("Mã sản phẩm"),
                      dataIndex: "code",
                      key: "code",
                      width: "30%",
                      sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : -1),
                      render: value => {
                        return <div className="ellipsis-not-span">{value}</div>;
                      },
                    },
                    {
                      title: t("Lý do"),
                      dataIndex: "reason",
                      key: "reason",
                      width: "70%",
                      sorter: (a, b) => (a.reason ? a.reason.localeCompare(b.reason) : -1),
                      render: value => {
                        return <div className="ellipsis-not-span">{value}</div>;
                      },
                    },
                  ]}
                  dataSource={this.state.errFormulaProducts}
                  total={this.state.errProductData ? this.state.errFormulaProducts.length : 0}
                  id={"errFormulaProduct-table"}
                  onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
                  emptyDescription={Constants.NO_PRODUCT}
                /> 
              </>: null }

              { this.state.errProductData.length > 0 ?
              <>
                <p>{t("Có lỗi phát sinh khi xử lý dữ liệu trên bảng sản phẩm")}:</p>
                <OhTable
                  onRef={ref => (this.tableErrProductsRef = ref)}
                  columns={errProductsColumn}
                  dataSource={this.state.errProductData}
                  total={this.state.errProductData ? this.state.errProductData.length : 0}
                  id={"errProduct-table"}
                  onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
                  emptyDescription={Constants.NO_PRODUCT}
                /> 
              </>: null }

              { this.state.errFormulaData.length > 0 ?
              <>
                <p>{t("Có lỗi phát sinh khi xử lý dữ liệu trên bảng công thức sản xuất")}:</p>
                <OhTable
                  onRef={ref => (this.tableErrFormulaRef = ref)}
                  columns={errFormulaColumn}
                  dataSource={this.state.errFormulaData}
                  total={this.state.errFormulaData ? this.state.errFormulaData.length : 0}
                  id={"errFormula-table"}
                  onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
                  emptyDescription={Constants.NO_PRODUCT}
                /> 
              </> : null }
            </>
          }
          onOpen={(this.state.failsProducts.length > 0 || this.state.errProductData.length > 0 || this.state.errFormulaData.length > 0 || this.state.errFormulaProducts.length > 0) ? true : false}
          onClose={() => this.setState({failsProducts: [], errProductData: [], errFormulaData: [], errFormulaProducts: [], open: true})}
          width={1000}
        />
        { 
          this.state.visibleCovertProductType ?
            <ConvertProductType
              title={t("Chuyển nhóm hàng")}
              visible={this.state.visibleCovertProductType}
              changeVisible={(visible) => this.setState({ visibleCovertProductType: visible })}
              changeProductType={(type, ground) => this.onChangeProductBatch({ productTypeId: type }, t("Bạn có chắc chắn muốn chuyển "), ground)}
            /> 
            : null 
        }
        {
          this.state.visibleChangeStock ?
            <ModalChangeStock
              visibleChangeStock = {this.state.visibleChangeStock}
              changedRecord = {this.state.changedRecord}
              onChangeVisible = {(visible, isGetData, dataProduct) => {
                this.setState({
                  visibleChangeStock: visible
                }, () => {
                  if ( isGetData ) {                    
                    if (this.productTypeId && dataProduct && dataProduct.length){
                      let productTypeId = [];
                      let productIds = [];

                      dataProduct.map(item =>{                                                
                        productTypeId.push(item.productTypeId);
                        productIds.push(item.value)
                      })                      
                                            
                      if (productTypeId.length && this.tableProductRef[this.productTypeId]){

                        if ( this.tableProductRef[productTypeId[0]] ){
                          if(this.props.productList && this.props.productList.length) {
                            this.tableProductRef[productTypeId[0]].getDataStore([productIds[0]], false)
                          }
                          else this.tableProductRef[productTypeId[0]].getData(productTypeId[0]);
                        }
                        if ( this.tableProductRef[productTypeId[1]] ){
                          if(this.props.productList && this.props.productList.length) {
                            this.tableProductRef[productTypeId[1]].getDataStore([productIds[1]], false)
                          }
                          else this.tableProductRef[productTypeId[1]].getData(productTypeId[1]);
                        }                        
                      }
                    } else if (dataProduct.length){                      

                      if(this.props.productList && this.props.productList.length) {
                        let productIds = [];

                        dataProduct.map(item =>{
                          productIds.push(item.value)
                        })

                        this.tableProductRef.getDataStore(productIds, false)
                      }
                      else this.tableProductRef.getData()
                    }
                  }
                  
                })
              }}
            />
          : null
        }

        <Card>
          <CardBody style ={{top:0}}>
            <OhToolbar
              left={[
                {
                  type: "list",
                  label: t("Xuất file"),
                  icon: <MdVerticalAlignBottom />,
                  typeButton: "export",
                  listDropdown: [
                    {
                      title: "Excel",
                      type: "button",
                      onClick: () => this.exportExcel(),
                      icon: <AiOutlineFileExcel className="icon-export" />,
                      color: Constants.COLOR_SUCCESS
                    },
                    {
                      title: "PDF",
                      onClick: () => this.exportPDF(),
                      icon: <AiOutlineFilePdf className="icon-export" />,
                      color: Constants.COLOR_DANGER
                    }
                  ],
                  dropPlacement: "bottom-start",
                  simple: true
                },
                {
                  type: "button",
                  label: t("Nhập danh sách"),
                  icon: <AiOutlineToTop />,
                  onClick: () => this.setState({open: true}),
                  typeButton: "export",
                  simple: true,
                  permission: {
                    name: Constants.PERMISSION_NAME.PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
                viewTable === false && !this.state.checkViewTable ? {} :
                {
                  type: "button",
                  label: t("Tùy chỉnh hiển thị"),
                  icon: <AiOutlineSetting />,
                  onClick: !this.tableProductTypeId ? () => this.tableProductRef.tableRef.openSetting() : () => this.tableProductRef[this.tableProductTypeId] && this.tableProductRef[this.tableProductTypeId].tableRef && this.tableProductRef[this.tableProductTypeId].tableRef.openSetting() || null,
                  typeButton: "export",
                  simple: true,
                  
                },
              ]}
              right={[
                {
                  type: selectedRowKeys.length ? "list" : null,
                  label: t("Thao tác"),
                  typeButton: "export",
                  icon: <AiOutlineUnorderedList />,
                  permission: {
                    name: Constants.PERMISSION_NAME.PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                  listDropdown: [
                    {
                      title: t("Chuyển nhóm hàng"),
                      onClick: () => this.convertProductType(),
                      icon: <MdCached />
                    },
                    {
                      title: t("Xóa sản phẩm"),
                      onClick: () => this.onChangeProductBatch({ isDelete: 1 }, t("Bạn có chắc chắn muốn xóa ")),
                      icon: <MdDelete />
                    },
                    {
                      title: t("Cho phép kinh doanh"),
                      onClick: () => this.onChangeProductBatch({ isStop: 0 }, t("Bạn có chắc chắn muốn kinh doanh trở lại ")),
                      icon: <MdCheck />,
                    },
                    {
                      title: t("Ngừng kinh doanh"),
                      onClick: () => this.onChangeProductBatch({ isStop: 1 }, t("Bạn có chắc chắn muốn ngừng kinh doanh ")),
                      icon: <MdLock />,
                    },
                    {
                      title: t("In mã vạch"),
                      onClick: () => {
                        this.setState({
                          redirect: (
                            <Redirect
                              to={{
                                pathname: Constants.EDIT_BARCODE_PATH,
                                state: {
                                  selectedRowKeys: selectedRowKeys,
                                  pageSize: this.pageSize
                                }
                              }}
                            />
                          )
                        });
                      },
                      icon: <AiFillPrinter />,
                    }
                  ],
                  dropPlacement: "bottom-start",
                  simple: true
                },
                {
                  type: "link",
                  linkTo: "/admin/add-product",
                  params: { valueIsStop: { valueIsStop } },
                  label: t("Tạo sản phẩm"),
                  icon: <MdAddCircle />,
                  typeButton: "add",
                  simple: true,
                  permission: {
                    name: Constants.PERMISSION_NAME.PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
              ]}
            />
            <div style={{width:"100%", height: 60}}>
              <div className="div-product-check-view">
              <OhButton 
                onClick={() => this.onToggle()} 
                className="button-product-check-view"
                type="add" 
                icon={ this.state.checkViewTable ? 
                    <img src = {ProductIcon} style={{ width: 20, height: 20, marginLeft: -4 }}/> : 
                    <img src = {ProductTypeIcon} style={{ width: 20, height: 20,marginLeft: -4 }}/> } 
                >
              </OhButton>
              </div>
              <div className="product-search-filter">  
              { this.state.checkViewTable ?
              <OhSearchFilter
              key={table_id}
              id={table_id}
              onFilter={(filter, manualFilter) => {
                this.tableProductRef.onChange({
                  filter,
                  manualFilter
                });
              }}
              checkViews={[{status: false}]}
              filterFields={[
                {
                  type: "input-text",
                  title: t("Mã sản phẩm"),
                  field: "code",
                  // isManualFilter: true,
                  placeholder: t("Nhập") + " " + t("Mã sản phẩm").toLowerCase()
                },
                {
                  type: "input-text",
                  title: t("Tên sản phẩm"),
                  field: "name",
                  // isManualFilter: true,
                  placeholder: t("Nhập") + " " + t("Tên sản phẩm").toLowerCase()
                },
                {
                  type: "input-text",
                  title: t("Nhóm sản phẩm"),
                  field: "productTypeId.name",
                  // isManualFilter: true,
                  placeholder: t("Nhập") + " " + t("Nhóm sản phẩm").toLowerCase()
                },
                {
                  type: "input-range",
                  title: t("Giá vốn"),
                  field: "productprice.costUnitPrice",
                  placeholder: t("Nhập") + " " + t("Giá vốn").toLowerCase()
                },
                {
                  type: "input-range",
                  title: t("Giá bán"),
                  field: "productprice.saleUnitPrice",
                  placeholder: t("Nhập") + " " + t("Giá bán").toLowerCase()
                },
                {
                  type: "input-range",
                  title: t("Tồn kho"),
                  field: "sumQuantity",
                  placeholder: t("Nhập") + " " + t("Tồn kho").toLowerCase()
                },
                {
                  type: "select",
                  title: t("Tồn kho tối thiểu"),
                  field: "quota",
                  isManualFilter: true,
                  options: [
                    { value: 2, title: t(Constants.LOW_STOCK_STATUS[2]) },
                    { value: 1, title: t(Constants.LOW_STOCK_STATUS[1]) }
                  ],
                  placeholder: t("Chọn định mức")
                },
                {
                  type: "select",
                  title: t("Trạng thái"),
                  field: "status",
                  isManualFilter: true,
                  options: [
                    { value: 2, title: t(Constants.PRODUCT_STOPPED_STATUS[2]) },
                    { value: 1, title: t(Constants.PRODUCT_STOPPED_STATUS[1]) }
                  ],
                  placeholder: t("Chọn") + " " + t("Trạng thái").toLowerCase()
                },
                {
                  type: "input-text",
                  title: t("Nhà cung cấp"),
                  field: "customerId.name",
                  placeholder: t("Nhập") + " " + t("Nhà cung cấp").toLowerCase()
                },
                {
                  type: "select",
                  title: t("Loại sản phẩm"),
                  field: "category",
                  options: [
                    { value: 1, title: t(Constants.MANUFACTURING_STOCK_NAME.FINISHED_PRODUCT) },
                    { value: 2, title: t(Constants.MANUFACTURING_STOCK_NAME.MATERIAL) }
                  ],
                  placeholder: t("Chọn") + " " + t("Loại sản phẩm").toLowerCase()
                },
                {
                  type: "select",
                  title: t("Loại hàng hóa"),
                  field: "type",
                  options: Constants.PRODUCT_TYPES.arr.map(item => ({value: item.id, title: t(item.name), data: item})),
                  placeholder: t("Chọn") + " " + t("Loại hàng hóa").toLowerCase()
                },
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["code", "name"],
                placeholder: t("Tìm theo mã sản phẩm hoặc tên sản phẩm")
              }}
            />:
            <OhSearchFilter
              key={table_type_id}
              id={table_type_id}
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                {
                  type: "input-text",
                  title: t("Tên nhóm"),
                  field: "name",
                  placeholder: t("Nhập tên nhóm")
                }
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["name"],
                placeholder: t("Tìm theo tên nhóm sản phẩm")
              }}
            />}
              </div> 
            </div>

            { !this.state.checkViewTable ? 
            <OhTable
            onRef={ref => (this.tableProductTypeRef = ref)}
            columns={getTypeColumns}
            className="table-product-type-view"
            rowClassName={() => { return 'rowOhTable'}}
            dataSource={dataProductType}
            onChange={(tableState, isManualSort) => {
              this.onChange({
                ...tableState,
                isManualSort
              });
            }}
            isExpandable={true}
            hasCheckbox={false}
            expandIcon={(props) => this.customExpandIcon(props)} 
            onExpandedRowsChange={(props)=>this.onChangViewTable(props)}         
            loading={this.state.loading_product}
            onRowClick={(ref, record) => this.onChangeSelectedRowkeys(ref, record)}
            total={this.state.totalProductTypes}
            id="table-product-type"
            expandedRowRender={(record) => {
              this.productTypeId = record.id;
              let id = record.id;
              
                return (
                    <Card style ={{margin:"0px 0px 0px -20px"}} key = {"card-table-product-type-"+record.id}>
                        <CardBody style ={{marginTop:"4px"}}>
                            <Product
                                tableId={table_id}
                                productTypeId = {record ? record.id : undefined }
                                onSelectChange = {(selectedRowKeys) =>
                                  this.setState({
                                    selectedRowKeys
                                  })
                                }
                                onChangeStatus = {(item, value, mess)=>this.onChangeStatus(item, value, mess)}
                                openChangeStockModal = {(record)=>this.openChangeStockModal(record)}
                                onValueIsStop = {(valueIsStop)=>this.setState({valueIsStop})}
                                onRef={ref => this.tableProductRef[id] = ref }
                                isResetSelectedRowKeys = {isResetSelectedRowKeys}
                                onResetRowKey= {(isResetSelectedRowKeys) => this.setState({isResetSelectedRowKeys, selectedRowKeys: []})}
                                onChangePageSize={(pageSize) => this.pageSize = pageSize}
                                onChangeViewColumn={(column) => this.viewColumn = column}
                            />
                     </CardBody>
                    </Card>
                )
            }}
            />
            :
            <Product
                tableId={table_id}
                productTypeId = {undefined}
                onSelectChange = {(selectedRowKeys) => this.setState({selectedRowKeys})}
                onChangeStatus = {(item, value, mess)=>this.onChangeStatus(item, value, mess)}
                openChangeStockModal = {(record)=>this.openChangeStockModal(record)}
                onValueIsStop = {(valueIsStop)=>this.setState({valueIsStop})}
                onRef={ref => (this.tableProductRef = ref)}
                onChangePageSize={(pageSize) => this.pageSize = pageSize}
                onChangeViewColumn={(column) => this.viewColumn = column}
            />}
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

export default connect(
  function (state) {
    return {
      User: state.reducer_user.User,
      User_Function: state.reducer_user.User_Function,
      permissionsUser: state.userReducer.currentUser.permissions,
      Manufacture: state.reducer_user.Manufacture,
      languageCurrent: state.languageReducer.language,
      nameBranch: state.branchReducer.nameBranch,
      stockList: state.stockListReducer.stockList,
      productTypes: state.productTypeReducer.productTypes,
      productList: state.productListReducer.products
    };
  }
)(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(Management)
  )
);