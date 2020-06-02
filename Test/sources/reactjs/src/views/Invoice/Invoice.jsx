import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import { withTranslation } from "react-i18next";
// css
import { connect } from "react-redux";
import ExtendFunction from "lib/ExtendFunction";
import Constants from 'variables/Constants/';
import { Redirect } from 'react-router-dom';
import moment from "moment";
import invoiceService from 'services/InvoiceService';
import PDFImport from './components/PDFOrder';
import { ExportCSV } from 'ExportExcel/ExportExcel';
import ExcelImport from './components/ExcelOrder';
import OhToolbar from "components/Oh/OhToolbar";
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import OhTable from "components/Oh/OhTable";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import { notifyError } from 'components/Oh/OhUtils';
import _ from 'lodash';
import crypto from "crypto";
import Actions from "store/actions/";
import store from "store/Store";

class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.defaultFilterFormData = {
      fromAmount: '0',
      toAmount: '1000000000',
      fromDate: moment().subtract(30, 'day').startOf('day'),
      toDate: moment().endOf('day'),
      cardCode: ""
    }
    this.state = {
      selectedRowKeys: [],
      expandedRowKeys: [],
      invoices: [],
      alert: null,
      br: null,
      brerror: null,
      filterFormData: { ...this.defaultFilterFormData },
    }
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  getData = async () => {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    const query = {
      filter: filter || {},
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    
    if (this.props.invoices[hashFilterPage]) {
      this.setData(this.props.invoices[hashFilterPage].data, this.props.invoices[hashFilterPage].count);
    }

    let getInvoices = await invoiceService.getInvoices({...query, limit: pageSize * 2});

    if (getInvoices.status) {
      this.setData(getInvoices.data.slice(0, pageSize), getInvoices.count);
      
      if (pageSize && pageNumber && getInvoices.count/(pageSize*pageNumber) > 1) 
        this.getDataPageAfter({ ...query, skip: pageNumber * pageSize }, getInvoices.data.slice(pageSize, pageSize * 2), getInvoices.count);
            
      store.dispatch(Actions.changeInvoice({...this.props.invoices, [hashFilterPage]: { data: getInvoices.data.slice(0, pageSize), count: getInvoices.count }}));           
    }
    else notifyError(getInvoices.error)

  }

  getDataPageAfter = async (query, data, count) => {
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    store.dispatch(Actions.changeInvoice({...this.props.invoices, [hashFilterPage]: { data: data, count: count }}));
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }

  setData = (datainvoices, totalInvoices) => {
    datainvoices.map(item => item.key = item.id)

    this.setState({
      invoices: datainvoices,
      totalInvoices
    })
  }

  hideAlert = () => {
    this.setState({
      alert: null
    })
  }

  getColums = () => {
    const { t } = this.props;
    let columns = [
      {
        title: t("Mã đơn hàng"),
        align: "left",
        dataIndex: "code",
        key: "code",
        width: "16%",
        render: value => {
          return <div title={value}>{value}</div>
        },
      },
      {
        title: t("Thời gian"),
        align: "left",
        dataIndex: "invoiceAt",
        key: "invoiceAt",
        width: "22%",
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t("Khách hàng"),
        align: "left",
        dataIndex: "customerId.name",
        isManualSort: true,
        width: "30%",
        sortDirections: ["descend", "ascend"],
        key: "customerName",

      },
      {
        title: t("Tổng tiền"),
        align: "right",
        dataIndex: "finalAmount",
        key: "finalAmount",
        width: "16%",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(value)
        }
      },
      {
        title: t("Trạng thái"),
        align: "left",
        dataIndex: "status",
        key: "status",
        width: "16%",
        render: value => {
          return (
            <span style={{color: value === Constants.INVOICE_STATUS.id.CANCELLED ? "red": null}}>{t(Constants.INVOICE_STATUS.name[value])}</span>
          )
        }
      }
    ];
    return columns
  }

  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
    });
  };

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t, nameBranch} = this.props;
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
    
    let dataInvoicesPDF = await await invoiceService.getInvoices(query)
   
    if ( dataInvoicesPDF.status ) PDFImport.productPDF(dataInvoicesPDF.data, dataInvoicesPDF.data, t, nameBranch)
    else notifyError(dataInvoicesPDF.error)

  }

  exportExcel = async () => {
    const { t } = this.props;
    let { selectedRowKeys } = this.state;
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
    
    let dataInvoices = await await invoiceService.getInvoices(query)

    if ( dataInvoices.status ) ExportCSV(ExcelImport.getTableExcel(dataInvoices.data, t), t("DanhSachDonHang"), ['D'])
    else notifyError(dataInvoices.error)

  }

  render() {
    let columns = this.getColums();
    const { t } = this.props
    const { invoices, totalInvoices } = this.state;
    return (
      <Fragment>
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        {this.state.alert}
        <Card>
          <CardBody>
            <OhToolbar
              left={[
                {
                  type: "list",
                  label: t("Xuất file"),
                  icon: <MdVerticalAlignBottom />,
                  typeButton: "export",
                  permission: {
                    name: Constants.PERMISSION_NAME.INVOICE,
                    type: Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY
                  },
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
                }
              ]}
              right={[
                {
                  type: "link",
                  linkTo: Constants.ADMIN_LINK + Constants.ADD_INVOICE,
                  label: t("Tạo đơn hàng"),
                  icon: <MdAddCircle />,
                  simple: true,
                  typeButton: "add",
                  permission: {
                    name: Constants.PERMISSION_NAME.INVOICE,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },

              ]}
            />
            <OhSearchFilter
            id={"invoices-table"}
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                // { 
                //   type: "date", 
                //   title: t("Ngày tạo"), 
                //   field: "createdAt" },
                {
                  type: "input-range",
                  title: t("Giá trị"),
                  field: "totalAmount",
                  placeholder: t("Nhập {{type}}", {type: "$t(giá trị)"})
                },
                {
                  type: "input-text",
                  title: t("Khách hàng"),
                  field: "customerId.name",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: "$t(tên khách hàng)"})
                }
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["code"],
                placeholder: t("Tìm theo mã đơn hàng")
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
              columns={columns}
              dataSource={invoices}
              total={totalInvoices}
              hasCheckbox={true}
              id={"invoices-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => {
                this.setState({
                  redirect: (
                    <Redirect
                      to={{
                        pathname: Constants.ADMIN_LINK + Constants.EDIT_INVOICE + "/" + record.id
                      }}
                    />
                  )
                });
              }}
            />
          </CardBody>
        </Card>
      </Fragment>
    )
  }
}

OrderForm.propTypes = {
  classes: PropTypes.object
};

export default connect(
  function (state) {
    return {
      nameBranch: state.branchReducer.nameBranch,
      invoices: state.invoiceReducer.invoices
    };
  }
)( 
  withTranslation("translations")(
    withStyles(theme => ({
      ...extendedTablesStyle,
      ...buttonsStyle
    }))(OrderForm)
  )
);