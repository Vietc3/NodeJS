import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import OhTable from "components/Oh/OhTable";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import withStyles from "@material-ui/core/styles/withStyles";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx"
import { notifyError } from 'components/Oh/OhUtils';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ExtendFunction from "lib/ExtendFunction";
import Constants from 'variables/Constants/';
import { Redirect } from 'react-router-dom';
import OhToolbar from "components/Oh/OhToolbar";
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import moment from "moment";
import OrderService from 'services/OrderCardService';
import PDFImport from './components/PDFOrder';
import ExcelImport from './components/ExcelOrder';
import { connect } from "react-redux";
import _ from 'lodash';
import crypto from "crypto";
import Actions from "store/actions/";
import store from "store/Store";

class ListOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      orders: [],
      totalOrder: 0
    }
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.type !== this.props.match.params.type )
      this.getData()
  }

  async getData() {
    let { filter, sortField, sortOrder, manualFilter, isManualSort, pageSize, pageNumber } = this.filters;
    let type = this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ?
      Constants.ORDER_CARD_TYPE.IMPORT : Constants.ORDER_CARD_TYPE.EXPORT;
    let isImportOrder = this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? true : false;    

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    filter = {...filter, type: type }

    const query = {
      filter: filter,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');

    if (isImportOrder) {
      if (this.props.importOrders[hashFilterPage]) {
        this.setState({ orders: this.props.importOrders[hashFilterPage].data, totalOrder: this.props.importOrders[hashFilterPage].count })
      }
    }
    else if (this.props.saleOrders[hashFilterPage]) {
      this.setState({ orders: this.props.saleOrders[hashFilterPage].data, totalOrder: this.props.saleOrders[hashFilterPage].count })
    }

    try {
      let getOrders = await OrderService.getOrders({...query, limit: pageSize * 2 })

      if (getOrders.status) {
        this.setState({ orders: getOrders.data.slice(0, pageSize), totalOrder: getOrders.count })

        isImportOrder ? store.dispatch(Actions.changeImportOrder({...this.props.importOrders, [hashFilterPage]: {data: getOrders.data.slice(0, pageSize), count: getOrders.count}}))
          : store.dispatch(Actions.changeSaleOrder({...this.props.saleOrders, [hashFilterPage]: {data: getOrders.data.slice(0, pageSize), count: getOrders.count}}))

      if (pageSize && pageNumber && getOrders.count/(pageSize*pageNumber) > 1) 
        this.getDataPageAfter({ ...query, skip: pageNumber * pageSize }, getOrders.data.slice(pageSize, pageSize * 2), getOrders.count, isImportOrder);
      }
      else throw getOrders.message
    }
    catch(error) {
      if (typeof error === "string") notifyError(error)

      notifyError(error)
    }
  }

  getDataPageAfter(query, data, count, isImportOrder) {
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');

    if(isImportOrder) {
      store.dispatch(Actions.changeImportOrder({...this.props.importOrders, [hashFilterPage]: {data: data, count: count }}))
    }
    else {
      store.dispatch(Actions.changeSaleOrder({...this.props.saleOrders, [hashFilterPage]: {data: data, count: count }}))
    }
  }

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t, nameBranch} = this.props;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    let type = this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ?
      Constants.ORDER_CARD_TYPE.IMPORT : Constants.ORDER_CARD_TYPE.EXPORT;

    filter = {...filter, type: type }

    if (selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll) {
      filter = { ...filter, id: { in: selectedRowKeys } };
    }

    let query = {
      filter: filter,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let getOrders = await OrderService.getOrders(query)
   
    if ( getOrders.status ) PDFImport.productPDF(getOrders.data, type, t, nameBranch)
    else notifyError(getOrders.message)

  }

  exportExcel = async () => {
    let { selectedRowKeys } = this.state;
    let { t } = this.props;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    let type = this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ?
      Constants.ORDER_CARD_TYPE.IMPORT : Constants.ORDER_CARD_TYPE.EXPORT;
    
    filter = {...filter, type: type }

    if (selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll) {
      filter = { ...filter, id: { in: selectedRowKeys } };
    }

    let query = {
      filter: filter,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let getOrders = await OrderService.getOrders(query)
    
    if ( getOrders.status ) ExtendFunction.exportToCSV(ExcelImport.getTableExcel(getOrders.data, type, t), t("DanhSachDatHang"))
    else notifyError(getOrders.message)

  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }

  getColums = () => {
    const { t } = this.props;
    let columns = [
      {
        title: t("Mã đặt hàng"),
        align: "left",
        dataIndex: "code",
        key: "code",
        width: "12%",
        sortDirections: ["descend", "ascend"],
        render: value => {
          return <div title={value}>{value}</div>
        },
      },
      {
        title: t("Thời gian"),
        align: "left",
        dataIndex: "orderAt",
        key: "orderAt",
        width: "16%",
        sortDirections: ["descend", "ascend"],
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t("Ngày giao"),
        align: "left",
        dataIndex: "expectedAt",
        key: "expectedAt",
        width: "16%",
        sortDirections: ["descend", "ascend"],
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? t("NCC") : t("Khách hàng"),
        align: "left",
        dataIndex: "customerId.name",
        isManualSort: true,
        width: "23%",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.customerId.name ? a.customerId.name.localeCompare(b.customerId.name) : -1),
        key: "customerName",

      },
      {
        title: t("Tổng tiền"),
        align: "right",
        dataIndex: "finalAmount",
        key: "finalAmount",
        width: "16%",
        sortDirections: ["descend", "ascend"],
        render: (value, record) => {
          return ExtendFunction.FormatNumber(Math.round(value))
        }
      },
      {
        title: t("Trạng thái"),
        align: "left",
        dataIndex: "status",
        key: "status",
        width: "10%",
        sortDirections: ["descend", "ascend"],
        render: value => {
          return (
            <span style={{color: value === Constants.ORDER_CARD_STATUS.CANCELLED ? "red": null}}>{t(Constants.ORDER_CARD_STATUS_NAME[value])}</span>
          )
        }
      }
    ];
    return columns
  }

  render() {
    const { t } = this.props
    const { orders, totalOrder } = this.state;
    let isTypeImport = this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? true : false;

    return (
      <Card>
        {this.state.redirect}
        <CardBody>
          <OhToolbar
            left={[
              {
                type: "list",
                label: t("Xuất file"),
                icon: <MdVerticalAlignBottom />,
                typeButton: "export",
                permission: {
                  name: isTypeImport ? Constants.PERMISSION_NAME.IMPORT_ORDER_CARD : Constants.PERMISSION_NAME.INVOICE_ORDER_CARD,
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
                linkTo: this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? 
                  Constants.ADMIN_LINK + "/add-import-order-card/1" : Constants.ADMIN_LINK + "/add-export-order-card/2",
                label: t("Tạo phiếu đặt hàng"),
                icon: <MdAddCircle />,
                simple: true,
                typeButton: "add",
                permission: {
                  name: isTypeImport ? Constants.PERMISSION_NAME.IMPORT_ORDER_CARD : Constants.PERMISSION_NAME.INVOICE_ORDER_CARD,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                },
              },

            ]}
          />
          <OhSearchFilter
            id={parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? "order-import-table" : "order-export-table"}
            onFilter={(filter, manualFilter) => {
              this.onChange({
                filter,
                manualFilter
              });
            }}
            filterFields={[
              { type: "date", title: t("Ngày đặt"), field: "orderAt" },
              { type: "date", title: t("Ngày giao"), field: "expectedAt" },
              {
                type: "input-range",
                title: t("Giá trị"),
                field: "totalAmount",
                placeholder: t("Nhập {{type}}", {type: t("Giá trị").toLowerCase()})
              },
              {
                type: "input-text",
                title: isTypeImport ? t("NCC") : t("Khách hàng"),
                field: "customerId.name",
                isManualFilter: true,
                placeholder: isTypeImport ? t("Nhập {{type}}", {type: t("NCC").toLowerCase()}) : t("Nhập {{type}}", {type: t("Khách hàng").toLowerCase()})
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
            columns={this.getColums()}
            dataSource={orders}
            total={totalOrder}
            hasCheckbox={true}
            id={parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? "order-import-table" : "order-export-table"}
            onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
            onRowClick={(e, record, index) => {
              this.setState({
                redirect: (
                  <Redirect
                    to={{
                      pathname: this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? 
                        Constants.ADMIN_LINK + "/update-import-order-card/1/" + record.id : Constants.ADMIN_LINK + "/update-export-order-card/2/" + record.id
                    }}
                  />
                )
              });
            }}
          />
        </CardBody>
      </Card>
    );
  }
}

export default connect(
  function (state) {
    return {
      nameBranch: state.branchReducer.nameBranch,
      importOrders: state.importOrderReducer.importOrders,
      saleOrders: state.saleOrderReducer.saleOrders
    };
  }
)( 
  withTranslation("translations")(
    withStyles(theme => ({
      ...extendedTablesStyle,
      ...buttonsStyle
    }))(ListOrder)
  )
);