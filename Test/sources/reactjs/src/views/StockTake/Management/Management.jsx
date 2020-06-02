import withStyles from "@material-ui/core/styles/withStyles";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import OhTable from "components/Oh/OhTable";
import OhToolbar from "components/Oh/OhToolbar";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import { MdAddCircle,MdVerticalAlignBottom } from "react-icons/md";
import { Redirect } from "react-router-dom";
import stockCheckService from "services/StockCheckService";
import Constants from "variables/Constants/";
import ExportPDF from "views/StockTake/Components/PDF/ProductPDF";
import ExtendFunction from "lib/ExtendFunction";
import BranchService from 'services/BranchService';
import { notifyError } from 'components/Oh/OhUtils';
import { ExportCSV } from 'ExportExcel/ExportExcel';
import _ from "lodash";
import crypto from "crypto";
import Actions from "store/actions/";
import store from "store/Store";

class Issue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockCheckCards: [],
      dataSource: [],
      selectedRowKeys: [],
      stockCheckCardsCount: 0,
      alert: null,
      br: null,
      brerror: null,
      redirect: null,
      rejectedFilters: {}
    };
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
      manualSort: (isManualSort && sortOrder) ? {sortField, sortOrder} : {},
    };
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');

    if (this.props.stockChecks[hashFilterPage]) {
      this.setState({
        stockCheckCards: this.props.stockChecks[hashFilterPage].data,
        dataSource: this.getDataSource(this.props.stockChecks[hashFilterPage].data),
        stockCheckCardsCount: this.props.stockChecks[hashFilterPage].count
      });
    }

    const getStockCheckCards = await stockCheckService.getStockCheckCards({ ...query, limit: pageSize * 2 });

    if (getStockCheckCards.status) {
      store.dispatch(Actions.changeStockCheck({...this.props.stockChecks, [hashFilterPage]: {data: getStockCheckCards.data.slice(0, pageSize), count: getStockCheckCards.count}}));

      this.setState({
        stockCheckCards: getStockCheckCards.data,
        dataSource: this.getDataSource(getStockCheckCards.data),
        stockCheckCardsCount: getStockCheckCards.count
      });

      if (pageSize && pageNumber && getStockCheckCards.count/(pageSize*pageNumber) > 1) 
        this.getDataPageAfter({ ...query, skip: pageNumber * pageSize }, getStockCheckCards.data.slice(pageSize, pageSize * 2), getStockCheckCards.count);
    }
  }

  getDataPageAfter = async (query, data, count) => {
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    store.dispatch(Actions.changeStockCheck({...this.props.stockChecks, [hashFilterPage]: { data: data, count: count }}));
  }
  
  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }
    this.getData();
  }

  getDataSource = stockCheckCards => {
    let data = _.cloneDeep(stockCheckCards)
    return data.map(item => {
      return {
        ...item,
        checkedAt: moment(item.checkedAt, Constants.DATABASE_DATE_TIME_FORMAT_STRING).format(
          Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT
        ),
        updatedAt: moment(item.updatedAt, Constants.DATABASE_DATE_TIME_FORMAT_STRING).format(
          Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT
        ),
        status: Constants.STOCKCHECK_STATUS[item.status],
        realQuantity: ExtendFunction.FormatNumber(item.realQuantity), 
        realAmount: ExtendFunction.FormatNumber(item.realAmount),
      };
    });
  };

  getColumns = () => {
    let { t } = this.props;
    let columns = [
      {
        title: t("Mã phiếu"),
        dataIndex: "code",
        width: "20%",
        align: "left",
        isManualSort: true,
        render: value => {
          return <div title={value}>{value}</div>
        },
      },
      {
        title: t("Thời gian"),
        dataIndex: "updatedAt",
        width: "21%",
        align: "left",
        isManualSort: true,
      },
      {
        title: t("Người tạo"),
        dataIndex: "userName",
        width: "21%",
        align: "left",
        isManualSort: true,
      },
      {
        title: t("Ghi chú"),
        dataIndex: "notes",
        type: 'notes',
        width: "38%",
        align: "left",
        isManualSort: true,
      }
    ];
    return columns;
  };

  success = mess => {
    this.setState({
      br: (
        <NotificationSuccess
          closeNoti={() => this.setState({ brsuccess: null }, () => this.hideAlert())}
          message={mess}
        />
      )
    });
  };

  error = mess => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    });
  };

  getDataExcel = (data, t) => {
    //header file Excel
    let dataExcel = [["#", t("Mã phiếu"), t("Thời gian"), t("Số lượng"), t("Giá trị"), t("Ghi chú")]];

    for (let item in data) {
      //push data into file Excel
      dataExcel.push([
        parseInt(item) + 1,
        data[item].code,
        moment(data[item].checkedAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
        data[item].realQuantity,
        data[item].realAmount,
        data[item].notes
      ]);
    }
    return dataExcel;
  };

  exportPDF = async () => {
    let { t, nameBranch } = this.props;
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

    let dataStockCheckCardPDF = await await stockCheckService.getStockCheckCards(query)

    if ( dataStockCheckCardPDF.status ) ExportPDF.exportPDF(dataStockCheckCardPDF.data, t, nameBranch)
    else notifyError(dataStockCheckCardPDF.error)
    
  }

  exportExcel = async () => {
    let { t } = this.props;
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

    let dataStockCheckCard = await await stockCheckService.getStockCheckCards(query)

    if ( dataStockCheckCard.status ) ExportCSV(this.getDataExcel(dataStockCheckCard.data, t), t("DanhSachKiemKho"),['D','E'])
    else notifyError(dataStockCheckCard.error)
    
  }

  render() {
    const {
      stockCheckCardsCount,
      dataSource,
      alert,
      brerror,
      br,
      redirect
    } = this.state;
    let {t} = this.props;

    return (
      <Fragment>
        {alert}
        {brerror}
        {br}
        {redirect}
        <Card>
          <CardBody>
            <OhToolbar
              left={[
                {
                  type: "list",
                  label: t("Xuất file"),
                  icon: <MdVerticalAlignBottom />,
                  typeButton:"export",
                  permission : {
                    name: Constants.PERMISSION_NAME.STOCK_CHECK,
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
                  linkTo: Constants.ADD_STOCKTAKE_CARD_PATH,
                  label: "Tạo phiếu kiểm kho",
                  icon: <MdAddCircle />,
                  simple: true,
                  typeButton:"add",
                  permission : {
                    name: Constants.PERMISSION_NAME.STOCK_CHECK,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
                
              ]}
            />
            <OhSearchFilter
             id={"stockcheck-table"}
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                { type: "date", 
                  title: t("Ngày tạo"), 
                  field: "checkedAt" 
                },
                {
                  type: "input-text",
                  title: t("Mã phiếu"),
                  field: "code",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Mã phiếu")})
                },
                {
                  type: "input-text",
                  title: t("Người tạo"),
                  field: "userName",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Người tạo")})
                },
                {
                  type: "input-text",
                  title: t("Ghi chú"),
                  field: "notes",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Ghi chú")})
                }
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["code", "notes"],
                placeholder: "Tìm mã phiếu, ghi chú"
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
              total={stockCheckCardsCount}
              hasCheckbox={true}
              id={"stockcheck-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => {
                this.setState({
                  redirect: (
                    <Redirect
                      from="/auth/login-page"
                      to={{
                        pathname: Constants.EDIT_STOCKTAKE_CARD_PATH + "/" + record.id
                      }}
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

Issue.propTypes = {
  classes: PropTypes.object
};

export default connect(
  function (state) {
    return {
      nameBranch: state.branchReducer.nameBranch,
      stockChecks: state.stockCheckReducer.stockChecks
    };
  }
)(  withTranslation("translations")(
    withStyles(theme => ({
      ...extendedTablesStyle,
      ...buttonsStyle
    }))(Issue)
  )
);