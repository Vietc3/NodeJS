import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Card from "components/Card/Card.jsx";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import AddCustomer from "./AddCustomer.jsx";
import MoreDetail from "./MoreDetail.jsx";
import TablePDFModal from "./TablePDFModal.jsx";
import { connect } from "react-redux";
import ExportPDF from './ExportPDF.js';
import { ExportCSV } from 'ExportExcel/ExportExcel.jsx';
import CustomerService from "services/CustomerService.js";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import OhTable from "components/Oh/OhTable.jsx";
import OhToolbar from "components/Oh/OhToolbar.jsx";
import OhSearchFilter from "components/Oh/OhSearchFilter.jsx";
import { AiOutlineFileExcel, AiOutlineFilePdf, AiOutlineToTop } from "react-icons/ai";
import { MdAddCircle, MdVerticalAlignBottom} from "react-icons/md";
import { Redirect } from 'react-router-dom';
import moment from "moment";
import Constants from "variables/Constants/index.js";
import ExtendFunction from "lib/ExtendFunction.js";
import { notifySuccess, notifyError } from 'components/Oh/OhUtils.js';
import OhButton from "components/Oh/OhButton.jsx"
import OhModal from "components/Oh/OhModal.jsx";
import OhRadio from "components/Oh/OhRadio.jsx";
import { Container } from "@material-ui/core";
import templateCustomers from "lib/templateFile/mau_nhap_file_khach_hang.xlsx";
import templateSupliers from "lib/templateFile/mau_nhap_file_ncc.xlsx";
import readXlsxFile from 'read-excel-file'
import _ from 'lodash';
import ManualSortFilter from "MyFunction/ManualSortFilter.js";
import Actions from "store/actions/";
import store from "store/Store.js";

class Customer extends React.Component {
  constructor(props) {
    super(props);
    let { t } = this.props;
    let dataSource = [];

    if (this.props.location.pathname === "/admin/Customer" && this.props.customers && this.props.customers.length) {
      dataSource = this.props.customers
    }

    if (this.props.location.pathname === "/admin/Provider" && this.props.suppliers && this.props.suppliers.length) {
      dataSource = this.props.suppliers.filter(item => item.branchId === +this.props.branchId)
    }

    this.state = {
      dataSource,
      dataCustomer: [],
      editCustomer: {},
      viewCustomer: {},
      failsCustomers: [],
      errData: [],
      titleFile: t("Vui lòng chọn file"),
      visible: false,
      visibleView: false,
      visibleSelectPDF: false,
      file: null,
      type: null,
      alert: null,
      selectedColumnPDF: {},
      dataPrint: [],
      stopOnCodeDuplicateError: 0,
      br: null,
      open: false,
      customerCheckCardsCount: dataSource.length,
      customerCheckCards: [],
      selectedRowKeys: [],
      loading: false,
    };

    this.dataSource_copy = [];
    this.filters = {};
    this.type = this.props.location.pathname === "/admin/Customer" ? Constants.CUSTOMER_TYPE_NAME.Customer : Constants.CUSTOMER_TYPE_NAME.Partner;
    this.data = "Customer_" + [this.type];
    this.importFile = this.importFile.bind(this);
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible)
      this.setState({
        visible: this.props.visible
      });
  }

  async componentDidMount() {
    if (this.type === Constants.CUSTOMER_TYPE_NAME.Customer && this.props.customers && this.props.customers.length) {
      let getCustomers = await CustomerService.getCustomers({});

      if (getCustomers.status) {
        store.dispatch(Actions.changeCustomerList(ManualSortFilter.sortArrayObject(getCustomers.data, "name", "asc")))
      }
    }

    if (this.type === Constants.CUSTOMER_TYPE_NAME.Partner && this.props.suppliers && this.props.suppliers.length) {
      let getCustomers = await CustomerService.getSuppliers({});

      if (getCustomers.status) {
        let data = getCustomers.data.concat(this.props.suppliers);

        data = _.uniqBy(data, "id");

        store.dispatch(Actions.changeSupplierList(ManualSortFilter.sortArrayObject(data, "name", "asc")))
      }
    }
  }

  async getDataStore(data) {
    let isCheck = this.type === Constants.CUSTOMER_TYPE_NAME.Customer;
    
    let dataUpdate = data.concat(isCheck ? this.props.customers : this.props.suppliers);

    dataUpdate = _.uniqBy(dataUpdate, "id");

    if (isCheck)
      store.dispatch(Actions.changeCustomerList(ManualSortFilter.sortArrayObject(dataUpdate, "name", "asc")));
    else store.dispatch(Actions.changeSupplierList(ManualSortFilter.sortArrayObject(dataUpdate, "name", "asc")));

    this.onChange();

  }

  async getData() {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

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
    let getCustomers;
    this.type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? 
      getCustomers = await CustomerService.getCustomers(query)
    : 
      getCustomers = await CustomerService.getSuppliers(query)

    if (getCustomers.status) {
      this.setState({
        dataSource: getCustomers.data,
        customerCheckCardsCount: getCustomers.count,
        dataPrintFull: getCustomers.data
      });
    } else {
      notifyError(getCustomers.error);
    }
  }
  
  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    if ((this.type === Constants.CUSTOMER_TYPE_NAME.Customer && this.props.customers && this.props.customers.length) || (this.type === Constants.CUSTOMER_TYPE_NAME.Partner && this.props.suppliers && this.props.suppliers.length)) {
      let filter = { ...this.filters.filter, ...this.filters.manualFilter };

      if (filter.createdAt && typeof filter.createdAt === "object" && !filter.createdAt.length) {
        let key = Object.keys(filter.createdAt);

        let filterCreatedAt = { and: [{[key[0]]: filter.createdAt[key[0]]}, {[key[1]]: filter.createdAt[key[1]]}] }

        filter.createdAt = filterCreatedAt;
      }

      let data = this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? this.props.customers : this.props.suppliers.filter(item => item.branchId === +this.props.branchId);

      let dataFilter = ManualSortFilter.ManualSortFilter(data, filter, { sortField: this.filters.sortField, sortOrder: this.filters.sortOrder })

      this.setState({
        dataSource: dataFilter,
        customerCheckCardsCount: dataFilter.length,
        dataPrintFull: dataFilter
      })
    }
    else this.getData();
  }

  onCancel = () => {
    this.setState({
      visible: false,
      visibleView: false,
      visibleSelectPDF: false,
      type: "",
      title: "",
      alert: null
    });
  };

  getTableExcel = (data) => {
    let { t } = this.props;
    let dataExcel = [[ 
      this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t("Mã khách hàng") : t("Mã nhà cung cấp"),
      this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t("Tên khách hàng") : t("Tên nhà cung cấp"),
      t('Thời gian'),
      t('Địa chỉ'),
      t('Email'),
      t('Số điện thoại'),
      t("Công nợ"),
      t("Tiền ký gửi")
    ]];
    for (let customer of data) {
      dataExcel.push(
        [
          customer.code,
          customer.name,
          moment(customer.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
          customer.address,
          customer.email,
          customer.tel ? customer.tel : '',          
          customer.totalOutstanding ?  customer.totalOutstanding : 0,
          customer.totalDeposit ? customer.totalDeposit : 0,
        ]);
    }
    return dataExcel;
  }
  
  getColumns = () => {
    let { t } = this.props;
    let columns =
      [
        {
          title: t("Mã"),
          dataIndex: "code",
          align: "left",
          width: "16%",
        },
        {

          title: t("Tên"),
          dataIndex: "name",
          align: "left",
          width: "37%",
        },
        {
          title: t("Điện thoại"),
          dataIndex: "tel",
          align: "left",
          width: "17%",
        },

        {
          title: t("Công nợ"),
          dataIndex: "totalOutstanding",
          align:"right",
          width: "15%",
          render: (value,record)=> {
            return (
              <div className="ellipsis-not-span">
                  {value ? ExtendFunction.FormatNumber(value) : 0}
              </div>
            );
          }
        },
        {
          title: t("Tiền ký gửi"),
          dataIndex: "totalDeposit",
          align:"right",
          width: "15%",
          isManualSort: true,
          render: (value,record)=> {
            return (
              <div className="ellipsis-not-span">
                  {value ? ExtendFunction.FormatNumber(value) : 0}
              </div>
            );
          }
        },
      ];
    return columns;
  }

  getErrCustomersColumn = () => {
    let { t } = this.props;
    let columns =
      [
        {
          title: t("Mã"),
          dataIndex: "code",
          align: "left",
          width: "20%",
        },
        {

          title: t("Tên") + "(*)",
          dataIndex: "name",
          align: "left",
          width: "20%",
        },
        {

          title: t("Địa chỉ"),
          dataIndex: "address",
          align: "left",
          width: "20%",
        },
        {

          title: t("Email"),
          dataIndex: "email",
          align: "left",
          width: "20%",
        },
        {
          title: t("Điện thoại"),
          dataIndex: "mobile",
          align: "left",
          width: "20%",
        },
      ];
    return columns;
  }

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t, nameBranch } = this.props;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    }; 

    if (this.type === Constants.CUSTOMER_TYPE_NAME.Customer) {
      let dataCustomerdPDF = await CustomerService.getCustomers(query);
      if (dataCustomerdPDF.status) ExportPDF.exportPDF(dataCustomerdPDF.data, this.type, t, nameBranch)
      else notifyError(dataCustomerdPDF.error)
    }
    else {
      let dataSupplierPDF = await CustomerService.getSuppliers(query);
      if (dataSupplierPDF.status) ExportPDF.exportPDF(dataSupplierPDF.data, this.type, t, nameBranch)
      else notifyError(dataSupplierPDF.error)
    }
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
    let errData = [];

    if(!this.state.file) notifyError(t("Vui lòng chọn file"));
    else{

      this.setState({loading: true});

      let dataJSON;
      await readXlsxFile(this.state.file, { sheet: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? 'khách hàng' : 'nhà cung cấp' }).then(async(data) => {

        if(this.type === Constants.CUSTOMER_TYPE_NAME.Customer)
          dataJSON = await ExtendFunction.ImportExcelToJSON(data,Constants.FIELDS_CUSTOMER);
        else dataJSON = await ExtendFunction.ImportExcelToJSON(data,Constants.FIELDS_SUPLIERS);
      }).catch((err) => this.workSheet = (this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? 'khách hàng' : 'nhà cung cấp'))

      if(dataJSON && !dataJSON.status && dataJSON.err.length === 0){
        this.workSheet = !dataJSON.status ? (this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? 'khách hàng' : 'nhà cung cấp') : this.workSheet;
      }

      if(this.workSheet){
        notifyError(t("Lỗi xử lý dữ liệu trên trang {{sheet}}", {sheet: `\"${this.workSheet}\"` || ""}));
        this.setState({loading: false});
        this.workSheet = null;
        return;
      }
      else {

        errData = dataJSON.err ? await ExtendFunction.ImportExcelToArray(dataJSON.err,this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? Constants.FIELDS_CUSTOMER : Constants.FIELDS_SUPLIERS) : [];
 
        if(errData.length === 0) {

          let ImportFile;
          if(this.type === Constants.CUSTOMER_TYPE_NAME.Customer)
            ImportFile = await CustomerService.importCustomers({data: dataJSON.data, stopOnCodeDuplicateError: this.state.stopOnCodeDuplicateError});
          else 
            ImportFile = await CustomerService.importSuppliers({data: dataJSON.data, stopOnCodeDuplicateError: this.state.stopOnCodeDuplicateError});

          if(ImportFile.status){
            
            if (ImportFile.data && ImportFile.error.length > 0){
              notifyError(t("Một số {{type}} không thể cập nhật",{type: (this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t(Constants.CUSTOMER_TYPE_NAME[1]).toLowerCase() : t(Constants.CUSTOMER_TYPE_NAME[2]).toLowerCase())}) );
            } else {
              notifySuccess(t("Nhập dữ liệu thành công"));

            }

            this.refs.fileUploader.value = null;
            this.setState({titleFile: t("Vui lòng chọn file"), file: null, stopOnCodeDuplicateError: 0, failsCustomers: ImportFile.error})

            if ((this.type === Constants.CUSTOMER_TYPE_NAME.Customer && this.props.customers && this.props.customers.length) || (this.type === Constants.CUSTOMER_TYPE_NAME.Partner && this.props.suppliers && this.props.suppliers.length)) {
              let dataUpdate = [];
              ImportFile.data.forEach(item => dataUpdate.push(item.data))
              this.getDataStore(dataUpdate);
            }
            else this.getData();
          }
          else {
            ImportFile.mess ? notifyError(ImportFile.mess) : this.setState({failsCustomers: ImportFile.error});
          }
        }
      }

      this.setState({open: false, errData: errData, loading: false});
      this.workSheet = null;
    }
  }

  exportExcel = async () => {
    let { selectedRowKeys } = this.state;
    let { t } = this.props;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }
    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };
    
    if (this.type === Constants.CUSTOMER_TYPE_NAME.Customer) {
      let dataCustomer = await CustomerService.getCustomers(query);

      if (dataCustomer.status) ExportCSV(this.getTableExcel(dataCustomer.data), t("DanhSachKhachHang"), ['G', 'H'])
      else notifyError(dataCustomer.error)
    }
    else {
      let dataSupplier = await CustomerService.getSuppliers(query);

      if (dataSupplier.status) ExportCSV(this.getTableExcel(dataSupplier.data), t("DanhSachNhaCungCap"), ['G', 'H'])
      else notifyError(dataSupplier.error)
    }
  }

  render() {
    let { dataSource, customerCheckCardsCount } = this.state;
    let { t } = this.props;
    
    return (
      <Fragment>
        {this.state.alert}
        {this.state.redirect}
        <OhModal 
          title={t("Nhập {{type}} từ file dữ liệu", {type: (this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t(Constants.CUSTOMER_TYPE_NAME[1]).toLowerCase() : t(Constants.CUSTOMER_TYPE_NAME[2]).toLowerCase())})}
          footer={null}
          content={
            <Container>
              <span>{t("Tải về file dữ liệu mẫu")}: </span><a href={this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? templateCustomers : templateSupliers} download={this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t(Constants.EXCEL_FILE_NAME.CUSTOMER) : t(Constants.EXCEL_FILE_NAME.SUPPLIER) }>Excel file</a>
              <GridItem>
                <OhButton disabled={this.state.loading} onClick={() => this.uploadFile()}>{t("Chọn file")}</OhButton>
                <span style={{cursor: "pointer"}} onClick={() => this.uploadFile()}>{t(this.state.titleFile)}</span>
                <input type="file" id="file" ref="fileUploader" accept=".xlsx,.xls" style={{display: "none"}} onChange={e => this.handleChangeFile(e)}/>
              </GridItem>
              <GridItem>
                <b>{t("Xử lý trùng mã {{type}}, khác tên?",{type:(this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t(Constants.CUSTOMER_TYPE_NAME[1]).toLowerCase() : t(Constants.CUSTOMER_TYPE_NAME[2]).toLowerCase())})}</b><br/>
                <OhRadio
                  name={"code"}
                  disabled={this.state.loading}
                  defaultValue={this.state.stopOnCodeDuplicateError}
                  onChange={(e) => this.handleStopOnCodeDuplicateError(e)}
                  options={[
                    {name: t("Báo lỗi, dừng import"), value: 0},
                    {name: t("Thay thế thông tin cũ bằng thông tin mới"), value: 1}
                  ]}
                />
              </GridItem>
              <GridItem style={{textAlign:"right  "}}>
                <OhButton loading={this.state.loading} onClick={this.importFile}>{t("Nhập {{type}}", {type: t("Dữ liệu").toLowerCase()})}</OhButton>
                <OhButton disabled={this.state.loading} type="exit" onClick={() => this.handleCancleImport()}>{t("Thoát")}</OhButton>
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
            <p>{t("Có lỗi phát sinh khi xử lý các dòng dữ liệu sau")}:</p>
              {this.state.failsCustomers && this.state.failsCustomers.length > 0 ?
              <>
                <OhTable
                  onRef={ref => (this.tableProductsRef = ref)}
                  columns={[
                    {
                      title: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t("Mã khách hàng") : t("Mã nhà cung cấp"),
                      dataIndex: "code",
                      key: "code",
                      width: "20%",
                      render: value => {
                        return <div className="ellipsis-not-span">{value}</div>;
                      },
                      ellipsis: true,
                    },
                    {
                      title: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t("Tên khách hàng") : t("Tên nhà cung cấp"),
                      dataIndex: "name",
                      key: "name",
                      width: "30%",
                      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : -1),
                      sortDirections: ["descend", "ascend"],
                      render: value => {
                        return <div className="ellipsis-not-span">{value}</div>;
                      },
                      ellipsis: true,
                    },
                    {
                      title: t("Lý do"),
                      dataIndex: "reason",
                      key: "reason",
                      width: "50%",
                      sorter: (a, b) => (a.reason ? a.reason.localeCompare(b.reason) : -1),
                      sortDirections: ["descend", "ascend"],
                      render: value => {
                        return <div className="ellipsis-not-span">{value}</div>;
                      },
                      ellipsis: true,
                    },
                  ]}
                  dataSource={this.state.failsCustomers}
                  total={this.state.failsCustomers ? this.state.failsCustomers.length : 0}
                  id={"failsProduct-table"}
                  onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
                /> 
              </> : null }


              { this.state.errData.length > 0 ?
              <>
                <OhTable
                  onRef={ref => (this.tableErrDataRef = ref)}
                  columns={this.getErrCustomersColumn()}
                  dataSource={this.state.errData}
                  total={this.state.errData ? this.state.errData.length : 0}
                  id={"errData-table"}
                  onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
                  emptyDescription={Constants.NO_PRODUCT}
                /> 
              </>: null }

            </>
          }
          onOpen={( (this.state.failsCustomers && this.state.failsCustomers.length > 0) || (this.state.errData && this.state.errData.length > 0) ) ? true : false}
          onClose={() => this.setState({failsCustomers: [], errData: [], open: true})}
          width={1000}
        />
        <Card>
          <CardBody>
            <OhToolbar
              left={[
                {
                  type: "list",
                  label: t("Xuất file"),
                  icon: <MdVerticalAlignBottom />,
                  typeButton:"export",
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
                  permission : {
                    name: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? Constants.PERMISSION_NAME.CUSTOMER:Constants.PERMISSION_NAME.SUPPLIER ,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
              ]}
              right={[
                {
                  type: "link",
                  linkTo: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? `/admin/add-customer/1` : `/admin/add-provider/2`,
                  label: t("Thêm mới"),
                  icon: <MdAddCircle />,
                  simple: true,
                  typeButton:"add",
                  permission : {
                    name: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? Constants.PERMISSION_NAME.CUSTOMER:Constants.PERMISSION_NAME.SUPPLIER ,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
                
              ]}
            />
            <OhSearchFilter
              id={this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? "customercheck-filter" : "suppliercheck-filter"}
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                { type: "date", 
                  title: t("Ngày tạo"), 
                  field: "createdAt" 
                },
                {
                  type: "input-text",
                  title: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t("Mã {{type}}", { type: t("Khách hàng") }) : t("Mã {{type}}", { type: t("Nhà cung cấp") }),
                  field: "code",
                  isManualFilter: true,
                  placeholder: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t("Nhập mã {{type}}", { type: t("Khách hàng").toLowerCase() }) : t("Nhập mã {{type}}", { type: t("Nhà cung cấp").toLowerCase() })
                },
                {
                  type: "input-text",
                  title: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t("Tên {{type}}", { type: t("Khách hàng") }) : t("Tên {{type}}", { type: t("Nhà cung cấp") }),
                  field: "name",
                  isManualFilter: true,
                  placeholder:  this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? t("Nhập tên {{type}}", { type: t("Khách hàng") })  : t("Nhập tên {{type}}", { type: t("Nhà cung cấp") }),
                },
                {
                  type: "input-range",
                  title: t("Công nợ"),
                  field: "totalOutstanding",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Công nợ").toLowerCase()})
                },
                {
                  type: "input-range",
                  title: t("Tiền ký gửi"),
                  field: "totalDeposit",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Tiền ký gửi").toLowerCase()})
                }
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["name", "tel", "code"],
                placeholder: this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? 
                t("Tìm theo tên, mã khách hàng, số điện thoại") : t("Tìm theo tên, mã nhà cung cấp, số điện thoại")
              }}
            />
            <OhTable
              onRef={ref => (this.tableRef = ref)}
              onChange={(tableState, isManualSort) => {
                this.onChange({
                  ...tableState,
                  isManualSort
                });
              }}
              columns={this.getColumns()}
              dataSource={dataSource}
              total={customerCheckCardsCount}
              hasCheckbox={true}
              id={this.type === Constants.CUSTOMER_TYPE_NAME.Customer ? "customercheck-table" : "suppliercheck-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => {
                this.setState({
                  redirect: (
                    <Redirect
                      from="/auth/login-page"
                      to={
                        this.type === 1 ? `/admin/edit-customer/1/${record.id}` : `/admin/edit-provider/2/${record.id}`
                      }
                    />
                  )
                });
              }}
            />
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

Customer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  function (state) {
    return {
      nameBranch: state.branchReducer.nameBranch,
      branchId: state.branchReducer.branchId,
      suppliers: state.supplierListReducer.suppliers,
      customers: state.customerListReducer.customers
    };
  }
)(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(Customer)
  )
);

