
import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import "date-fns";
import moment from "moment";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
// Core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import OhTable from 'components/Oh/OhTable';
import OhToolbar from 'components/Oh/OhToolbar';
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";

// Antd
import { Modal } from "antd";

//Css
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

// Service
import invoiceService from "services/InvoiceService";

import ExtendFunction from "lib/ExtendFunction";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap-daterangepicker/daterangepicker.css';
import OhSearchFilter from "components/Oh/OhSearchFilter.jsx";
import Constants from "variables/Constants/";
import _ from 'lodash';
class InvoiceList extends React.Component {
  constructor(props) {
    super(props);

    this.defaultFilterFormData = {
      fromDate: moment()
        .subtract(30, "day")
        .startOf("day"),
      toDate: moment().endOf("day"),
    };

    this.state = {
      startTime: moment().startOf('day').format("DD/MM/YYYY"),
      endTime: moment().endOf('day').format("DD/MM/YYYY"),
      dateTime: {
        start: new Date(moment().startOf('day')).getTime(),
        end: new Date(moment().endOf('day')).getTime()
      },
      invoiceProducts: [],
      filterFormData: { ...this.defaultFilterFormData },
      searchText: "",
      brerror: null,
      sorter: {},
      filters: {},
    };

    this.invoiceProducts_copy = [];
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
    this.currentPage = {
      pageSize: 10,
      page: 1
    };
  }

  async setData(invoices, totalInvoice) {
    var invoiceProducts = invoices || [{}];

    if (invoiceProducts.length > 0) {
      invoiceProducts.map(data => data.key = data.id);

      this.setState({
        invoiceProducts: invoiceProducts,
        totalInvoice
      });

    } else {
      this.setState({
        invoiceProducts: [],
        totalInvoice: 0
      });
    }
    this.invoiceProducts_copy = invoiceProducts;
  }

  async getData() {
    let { filter, pageSize, pageNumber, sortField, sortOrder, isManualSort } = this.state.filters;

    pageSize = pageSize || 10
    pageNumber = pageNumber || 1
    
    const query = {
      filter: filter,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
    };

    try {
      let getInvoice = await invoiceService.getListInvoice(query);

      if (getInvoice === false) throw getInvoice.error

      else {
        this.setData(getInvoice.data, getInvoice.count)
      }
    }
    catch (err) {
      this.error(err)
    }
  }

  error = mess => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    });
  };

  handleChangeFilter = filterData => {
    if (
      moment(filterData.fromDate) <= moment(filterData.toDate)
    ) {
      this.setState({ filterFormData: filterData },
        () => this.getData(this.currentPage.pageSize, this.currentPage.page)
      );
    }

  };

  handleChangeTime = (a) => {
    const { startTime, endTime } = this.state
    const start = moment(a.startDate._d).format("DD/MM/YYYY")
    const end = moment(a.endDate._d).format("DD/MM/YYYY")
    if (startTime !== start || endTime !== end) {
      this.setState({
        startTime: start,
        endTime: end,
        dateTime: {
          start: a.startDate._d,
          end: a.endDate._d
        }
      })
    }
  }

  handleChangCreate = record => {
    this.setState({
      redirect: <Redirect to={{ pathname: record ? ("/admin/add-invoice-return/" + record.id) : "/admin/add-return-card/" }} />
    });
  };

  onChange = (obj) => {
    this.setState({
      filters: {
        ...this.state.filters,
        ...obj
      }
    })
    
    this.getData();
  }

  render() {
    const { t, title, visible } = this.props;
    const { invoiceProducts } = this.state;

    let columns = [
      {
        title: t("Mã đơn hàng"),
        dataIndex: "code",
        key: "code",
        width: "12%",
        align:"left",
      },
      {
        title: t("Ngày tạo"),
        dataIndex: "createdAt",
        key: "createdAt",
        width: "18%",
        align:"left",
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)

      },

      {
        title: t("Nhân viên"),
        dataIndex: "userName",
        key: "userName",
        width: "15%",
        align: "left",

      },
      {
        title: t("Khách hàng"),
        dataIndex: "customerName",
        key: "customerName",
        width: "40%",
        align: "left",
      },
      {
        title: t("Tổng tiền"),
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: "15%",
        align: "right",
        render: (value, record) => {
          return <div className="ellipsis-not-span">{value ? ExtendFunction.FormatNumber(Number(value).toFixed(2)) : 0}</div>;
        }
      }
    ];

    return (
      <>
        {this.state.redirect}
        {this.state.brerror}
        <Modal
          className="ListInvoice"
          title={t(title)}
          visible={visible}
          width={1100}
          onCancel={this.props.onCancel}
          footer={null}
          maskClosable={false}
          zIndex={1050}
        >
          <GridContainer style={{ width: "100%", marginLeft: "2px", marginTop: "-20px" }}>
            <GridItem xs={12}>
              <OhToolbar
                right={[
                  {
                    type: "link",
                    onClick: () => this.handleChangCreate(),
                    label: t("Trả hàng không theo đơn"),
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
                id={"invoice-list-search-filter"}
                onFilter={(filter, manualFilter) => {
                  this.setState(
                    {
                      filters: {
                        ...this.state.filters,
                        filter,
                        manualFilter
                      },
                    },
                    () => this.getData()
                  );
                }}
                filterFields={[
                  { type: "date", title: t("Ngày tạo"), field: "createdAt" },
                  {
                    type: "input-range",
                    title: t("Tổng tiền"),
                    field: "totalAmount",
                    placeholder: t("Nhập {{type}}", {type: t("Giá trị").toLowerCase()})
                  },
                  {
                    type: "input-text",
                    title: t("Mã đơn hàng"),
                    field: "code",
                    placeholder: t("Nhập {{type}}", {type: t("Mã đơn hàng").toLowerCase()})
                  },
                  {
                    type: "input-text",
                    title: t("Nhân viên"),
                    field: "user.fullName",
                    placeholder: t("Nhập {{type}}", {type: t("Tên nhân viên").toLowerCase()})
                  },
                  {
                    type: "input-text",
                    title: t("Khách hàng"),
                    field: "customerId.name",
                    placeholder: t("Nhập {{type}}", {type: t("Tên khách hàng").toLowerCase()})
                  }
                ]}
                defaultShowAll={false}
                searchInput={{
                  fields: ["code"],
                  placeholder: t("Tìm theo mã đơn hàng")
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer style={{ width: "100%", margin: 0 }}>
            <GridItem xs={12}>
              <OhTable
                onRef={ref => (this.tableRef = ref)}
                columns={columns}
                dataSource={invoiceProducts}
                id={"invoice-list-table"}
                onChange={(tableState, isManualSort) => {
                  this.onChange({
                    ...tableState,
                    isManualSort
                  });
                }}
                total={this.state.totalInvoice}
                onRowClick={(e, record, rowIndex) => this.handleChangCreate(record)}
              />
            </GridItem>
          </GridContainer>
        </Modal>
      </>
    );
  }
}

export default connect()(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(InvoiceList)
  )
);
