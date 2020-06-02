
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import moment from "moment";

// @material-ui/icons
import withStyles from "@material-ui/core/styles/withStyles";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";

// Css
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import "react-datepicker/dist/react-datepicker.css";

import InvoiceList from "../../CreateInvoiceReturn/InvoiceList.jsx";
import OhTable from 'components/Oh/OhTable';
import OhToolbar from 'components/Oh/OhToolbar';
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";
import ExtendFunction from "lib/ExtendFunction";
import Constants from 'variables/Constants/';
import ExportPDF from "../PDF/ExportPDF.js";
// Service
import invoiceReturnService from "services/InvoiceReturnService";
import OhSearchFilter from "components/Oh/OhSearchFilter.jsx";
import { notifyError } from 'components/Oh/OhUtils';
import _ from 'lodash';
import crypto from "crypto";
import Actions from "store/actions/";
import store from "store/Store";

class Issue extends React.Component {
  constructor(props) {
    super(props);

    this.defaultFilterFormData = {
      fromAmount: "0",
      toAmount: "1000000000",
      fromDate: moment()
        .subtract(30, "day")
        .startOf("day"),
      toDate: moment().endOf("day"),
      cardCode: ""
    };

    this.state = {
      expandedRowKeys: [],
      filterFormData: { ...this.defaultFilterFormData },
      alert: null,
      isShowFilter: false,
      sorter: {},
      selectedRowKeys: [],
      dataSource: [],
      type: "add",
      visible: false,
      title: "",
    };
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
    this.filters = {};
    this.currentPage = {
      pageSize: 10,
      page: 1
    };
  }

  async setData(invoiceReturns, totalInvoiceReturn) {
    var dataSource = invoiceReturns || [{}];

    if (dataSource.length > 0) {
      this.setState({
        dataSource: dataSource,
        totalInvoiceReturn
      });
    } else
      this.setState({
        dataSource: [],
        totalInvoiceReturn: 0
      });
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

    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    
    if (this.props.invoiceReturns[hashFilterPage]) {
      this.setData(this.props.invoiceReturns[hashFilterPage].data, this.props.invoiceReturns[hashFilterPage].count);
    }

    try {
      let getInvoiceReturn = await invoiceReturnService.getInvoiceReturnList({...query, limit: pageSize * 2});

      if (getInvoiceReturn.status === false) throw getInvoiceReturn.message

      else {
        this.setData(getInvoiceReturn.data.slice(0, pageSize), getInvoiceReturn.count);
        
        store.dispatch(Actions.changeInvoiceReturn({...this.props.invoiceReturns, [hashFilterPage]: { data: getInvoiceReturn.data.slice(0, pageSize), count: getInvoiceReturn.count }}));

        if ( pageSize && pageNumber && getInvoiceReturn.count/(pageSize*pageNumber) > 1 ) 
          this.getDataAfter({ ...query, skip: pageNumber * pageSize }, getInvoiceReturn.data.slice(pageSize, pageSize * 2), getInvoiceReturn.count)
      }
    }
    catch (err) {
      if(typeof err === "string") notifyError(err)
    }
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

  hideAlert = () => {
    this.setState({ alert: null });
  };

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t , nameBranch } = this.props;
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
    
    let dataInvoiceReturnPDF = await invoiceReturnService.getInvoiceReturnList(query)

    if ( dataInvoiceReturnPDF.status ) ExportPDF.productPDF(dataInvoiceReturnPDF.data, t , nameBranch)
    else notifyError(dataInvoiceReturnPDF.error)
  
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
    
    let dataInvoiceReturn = await invoiceReturnService.getInvoiceReturnList(query)

    if ( dataInvoiceReturn.status ) ExtendFunction.exportToCSV(this.getDataExcel(dataInvoiceReturn.data), t("Danhsachtrahang"))
    else notifyError(dataInvoiceReturn.error)
  
  }

  getColumns = () => {
    let { t } = this.props;
    let columns = [
      {
        title:t("Mã phiếu"),
        dataIndex: "code",
        key: "code",
        align:"left",
        width:"12%",
        onSort: (a, b) => a.code.localeCompare(b.code),
        sorter: (a, b) => a.code.localeCompare(b.code)
      },
      {
        title:t("Đơn hàng"),
        dataIndex: "reference",
        key: "invoiceId",
        align:"left",
        width:"12%",
        onSort: (a, b) => a.reference.localeCompare(b.reference),
        sorter: (a, b) => a.reference.localeCompare(b.reference)
      },
      {
        title:t("Khách hàng"),
        dataIndex: "recipientId.name",
        key: "recipientId",
        onSort: (a, b) => a.reference.localeCompare(b.reference),
        sorter: (a, b) => (a.recipientId.name ? a.recipientId.name.localeCompare(b.recipientId.name) : -1),
        align:"left",
        width:"36%",
      },
      {
        title: t("Thời gian"),
        dataIndex: "createdAt",
        key: "createdAt",
        align:"left",
        width:"16%",
        sorter: (a, b) =>
          moment(a.createdAt, Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT).format(
            Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT
          ) >
            moment(b.createdAt, Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT).format(
              Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT
            )
            ? 1
            : -1,
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t("Tổng tiền"),
        dataIndex: "finalAmount",
        key: "finalAmount",
        align:"right",
        width:"12%",
        onSort: (a, b) => (parseInt(a.finalAmount) > parseInt(b.finalAmount) ? 1 : -1),
        sorter: (a, b) => (parseInt(a.finalAmount) > parseInt(b.finalAmount) ? 1 : -1),
        render: value => <span style={{ fontWeight: 500 }}>{ExtendFunction.FormatNumber(parseInt(value))}</span>
      },
      {
        title: t("Trạng thái"),
        dataIndex: "status",
        key: "status",
        align:"left",
        width:"12%",
        onSort: (a, b) => a.status.toString().localeCompare(b.status),
        sorter: (a, b) => a.status.toString().localeCompare(b.status),
        render: value => {
          return (
            <span style={{color: value === Constants.INVOICE_RETURN_CARD_STATUS.CANCELLED ? "red": null}}>{t(Constants.INVOICE_RETURN_CARD_STATUS_NAME[value])}</span>
          )
        }
      }
    ];
    return columns;
  };

  handleChangeEdit = record => {
    this.setState({
      redirect: <Redirect to={{ pathname: (record.reference ? "/admin/update-invoice-return/" : "/admin/edit-return-card/") + record.id}} />
    });
  };

  onCreateInvoiceReturn = () => {
    const t = this.props.t;
    this.setState({
      visible: true,
      title: t("Chọn đơn để trả hàng")
    });
  }
  onCancel = () => {
    this.setState({
      visible: false,
      title: "",
    });
  };

  getDataExcel = (data) => {
    let { t } = this.props;
    let dataExcel = [[

      t("Mã trả hàng"),
      t("Đơn hàng"), t("Khách hàng"), t("Thời gian"),
      t("Tổng tiền"), t("Trạng thái")]];

    for (let item in data) {

      dataExcel.push(
        [
          data[item].code,
          data[item].reference,
          data[item].recipientId && data[item].recipientId.name ? data[item].recipientId.name : "",
          moment(data[item].createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
          data[item].finalAmount ? data[item].finalAmount : 0,
          data[item].status ? t(Constants.INVOICE_RETURN_CARD_STATUS_NAME[data[item].status]) : ""
        ]);
    }
    return dataExcel;
  }

  render() {
    const { t } = this.props;
    const { dataSource, type } = this.state;
    let columns = this.getColumns(dataSource);

    return (
      <Fragment>
        {this.state.alert}
        {this.state.redirect}
        <InvoiceList
          visible={this.state.visible}
          title={this.state.title}
          onCancel={this.onCancel}
          type={type}
        />
        <OhToolbar
          left={[
            {
              type: "list",
              label: t("Xuất file"),
              typeButton:"export",
              icon: <MdVerticalAlignBottom />,
              permission : {
                name: Constants.PERMISSION_NAME.INVOICE_RETURN,
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
              onClick: () => this.onCreateInvoiceReturn(),
              label: t("Tạo phiếu trả hàng"),
              icon: <MdAddCircle />,
              simple: true,
              typeButton:"add",
              permission : {
                name: Constants.PERMISSION_NAME.INVOICE_RETURN,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
                },
            },
          ]}
        />
        <OhSearchFilter
        id={"export-table"}
          onFilter={(filter, manualFilter) => {
            this.onChange({
              filter,
              manualFilter
            });
          }}
          filterFields={[
            { type: "date", title: t("Ngày tạo"), field: "createdAt" },
            {
              type: "input-range",
              title: t("Tổng tiền"),
              field: "finalAmount",
              placeholder: t("Nhập {{type}}", {type: t("Giá trị").toLowerCase()})
            },
            {
              type: "input-text",
              title: t("Mã trả hàng"),
              field: "code",
              placeholder: t("Nhập {{type}}", {type: t("Mã trả hàng").toLowerCase()})
            },
            {
              type: "input-text",
              title: t("Đơn hàng"),
              field: "reference",
              placeholder: t("Nhập {{type}}", {type: t("Mã đơn hàng").toLowerCase()})
            },
            {
              type: "select",
              title: t("Trạng thái"),
              field: "status",
              options: [{ value: 1, title: t(Constants.INVOICE_RETURN_CARD_STATUS_NAME[1]) }, { value: 2, title: t(Constants.INVOICE_RETURN_CARD_STATUS_NAME[2]) }]
            },
            {
              type: "input-text",
              title: t("Khách hàng"),
              field: "recipientId.name",
              isManualFilter: true,
              placeholder: t("Nhập {{type}}", {type: t("Tên khách hàng").toLowerCase()})
            }
          ]}
          defaultShowAll={false}
          searchInput={{
            fields: ["code"],
            placeholder: t("Tìm theo mã phiếu")
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
          dataSource={dataSource}
          total={this.state.totalInvoiceReturn}
          onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
          hasCheckbox={true}
          id={"export-table"}
          columns={columns}
          onRowClick={(e, record, index) => this.handleChangeEdit(record)}
        />
      </Fragment>
    );
  }
}

Issue.propTypes = {
  classes: PropTypes.object
};

export default connect(
  function (state) {
    return {
      nameBranch: state.branchReducer.nameBranch,
      invoiceReturns: state.invoiceReturnReducer.invoiceReturns
    };
  }
)( 
  withTranslation("translations")(
    withStyles(theme => ({
      ...extendedTablesStyle,
      ...buttonsStyle
    }))(Issue)
  )
);
