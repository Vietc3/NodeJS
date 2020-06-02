import React, { Component } from 'react';
import OhTable from 'components/Oh/OhTable.jsx';
import OhSearchFilter from 'components/Oh/OhSearchFilter.jsx';
import OhToolbar from 'components/Oh/OhToolbar.jsx';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { withTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import Constants from 'variables/Constants/index.js';
import PDFImport from './PDFExportStock.jsx'
import moment from "moment";
import { notifyError } from 'components/Oh/OhUtils.js';
import MoveStockService from 'services/MoveStockService.js';
import ExtendFunction from 'lib/ExtendFunction.js';
import { connect } from "react-redux";
import _ from 'lodash';
import crypto from "crypto";
import Actions from "store/actions/";
import store from "store/Store";

class ListImport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      dataSource: [],
      totaldataSource: 0,
    };
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  getColums = () => {
    const { t } = this.props;

    let columns = [
      {
        title: t("Mã phiếu"),
        align: "left",
        width: "15%",
        dataIndex: "code",
        key: "code",
        sorter: (a, b) => a.code.localeCompare(b.code),
        onSort: (a, b) => a.code.localeCompare(b.code),
      },
      {
        title: t("Lý do"),
        align: "rigth",
        width: "15%",
        dataIndex: "reason",
        isManualSort: true,
        key: "reason",
        render: value => t(Constants.MOVE_STOCK_REASON.name[value])
      },
      {
        title: t("Thời gian"),
        align: "left",
        width: "17%",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: (a, b) => a.createdAt - b.createdAt,
        onSort: (a, b) => a.createdAt - b.createdAt,
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t("Người tạo"),
        align: "left",
        width: "38%",
        dataIndex: "createdBy.fullName",
        isManualSort: true,
        key: "userName",
      },
      {
        title: t("Trạng thái"),
        align: "left",
        width: "15%",
        dataIndex: "status",
        key: "status",
        render: value => {
          return (
          <span style={{color: value === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED ? "red" : " "}}> {t(Constants.MOVE_STOCK_CARD_STATUS.name[value])} </span> 
          )
        }
      },
    ];
    return columns
  }

  getData = async () => {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;
    filter =  {
      ...(filter ? filter : {}), 
      reason: {'in': [
        Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT,
        Constants.MOVE_STOCK_REASON.id.EXPORT_RETURN,
      ]}
    };
    
    const query = {
      filter: filter,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    
    if (this.props.exportStocks[hashFilterPage]) {
      this.setState({
        dataSource: this.props.exportStocks[hashFilterPage].data,
        totaldataSource: this.props.exportStocks[hashFilterPage].count
      })
    }
    
    let importStock = await MoveStockService.getMoveStockCardList({ ...query, limit: pageSize * 2 });

    if (importStock.status) {
      store.dispatch(Actions.changeExportStockList({...this.props.exportStocks, [hashFilterPage]: {data: importStock.data.slice(0, pageSize), count: importStock.count}}))
      this.setState({
        dataSource: importStock.data.slice(0, pageSize),
        totaldataSource: importStock.count
      })

      if (pageSize && pageNumber && importStock.count/(pageSize*pageNumber) > 1) 
        this.getDataPageAfter({ ...query, skip: pageNumber * pageSize }, importStock.data.slice(pageSize, pageSize * 2), importStock.count);
    }
    else notifyError(importStock.message)
  }

  getDataPageAfter = async (query, data, count) => {
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    store.dispatch(Actions.changeExportStockList({...this.props.exportStocks, [hashFilterPage]: { data: data, count: count }}));
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }

  handleRemove = () => {

  }

  getDataExcel = (data) => {
    let { t } = this.props;
    let dataExcel = [["#", t("Mã phiếu"), t("Lý do"), t("Ngày tạo"), t("Người tạo"), t("Trạng thái")]];
    for (let item in data) {
      dataExcel.push(
        [
          parseInt(item) + 1,
          data[item].code,
          t(Constants.IMPORT_STOCK[data[item].reason]),
          moment(data[item].createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
          data[item].createdBy.fullName,
          t(Constants.MOVE_STOCK_CARD_STATUS.name[data[item].status]),
        ]);
    }
    return dataExcel;
  }

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t , nameBranch} = this.props;
    let { sortField, sortOrder, manualFilter, isManualSort } = this.filters;
    let filter = {
      ...this.filters.filter, 
      reason: {'in': [
        Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT,
        Constants.MOVE_STOCK_REASON.id.EXPORT_RETURN,
      ]}
    };

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataImportPDF = await MoveStockService.getMoveStockCardList(query)
    if (dataImportPDF.status) PDFImport.productPDF(dataImportPDF.data, t, nameBranch)
    else notifyError(dataImportPDF.error)
  }

  exportExcel = async () => {
    let { t } = this.props;
    let { selectedRowKeys } = this.state;
    let { sortField, sortOrder, manualFilter, isManualSort } = this.filters;
    let filter = {
      ...this.filters.filter, 
      reason: {'in': [
        Constants.MOVE_STOCK_REASON.id.EXPORT_FINISHED_PRODUCT,
        Constants.MOVE_STOCK_REASON.id.EXPORT_RETURN,
      ]}
    };

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataImport = await MoveStockService.getMoveStockCardList(query)

    if (dataImport.status) ExtendFunction.exportToCSV(this.getDataExcel(dataImport.data, t), t("DanhSachPhieuXuatKho"))
    else notifyError(dataImport.error)
  }

  render() {
    const { t } = this.props;
    const { dataSource, totaldataSource } = this.state;

    return (
      <Card>
        <CardBody>
          {this.state.redirect}
          <OhToolbar
            left={[
              {
                type: "list",
                label: "Xuất file",
                typeButton: "export",
                icon: <MdVerticalAlignBottom />,
                permission: {
                  name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
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
                linkTo: Constants.ADMIN_LINK + Constants.CREATE_EXPORT_STOCK,
                label: t("Tạo phiếu xuất"),
                icon: <MdAddCircle />,
                simple: true,
                typeButton: "add",
                permission: {
                  name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                },
              },

            ]}
          />
          <OhSearchFilter
             id={"expand-stock-table"}
            onFilter={(filter, manualFilter) => {
              this.onChange({
                filter,
                manualFilter
              });
            }}
            filterFields={[
              { type: "date", title: t("Ngày tạo"), field: "createdAt" },
              {
                type: "input-text",
                title: t("Người tạo"),
                field: "createdBy.fullName",
                isManualFilter: true,
                placeholder: t("Nhập {{type}}", {type: t("Người tạo").toLowerCase()})
              },
              {
                type: "input-text",
                title: t("Mã phiếu"),
                field: "code",
                placeholder: t("Nhập {{type}}", {type: t("Mã phiếu").toLowerCase()})
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
            dataSource={dataSource}
            total={totaldataSource}
            hasCheckbox={true}
            id={"expand-stock-table"}
            onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
            onRowClick={(e, record, index) => {
              this.setState({
                redirect: this.props.currentUser.permissions.manufacture_ware_house < Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY ? null : (
                  <Redirect
                    to={{
                      pathname: Constants.ADMIN_LINK + Constants.EDIT_EXPORT_STOCK + "/" + record.id
                    }}
                  />
                ),
              });
            }}
          />
        </CardBody>
      </Card>
    );
  }
}

export default connect(function (state) {
  return {
    currentUser: state.userReducer.currentUser,
    nameBranch: state.branchReducer.nameBranch,
    exportStocks: state.exportStockReducer.exportStocks
  };
})(withTranslation("translations")(ListImport));