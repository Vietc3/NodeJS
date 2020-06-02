import React, { Component } from 'react';
import OhTable from 'components/Oh/OhTable';
import OhSearchFilter from 'components/Oh/OhSearchFilter';
import OhToolbar from 'components/Oh/OhToolbar';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody";
import { withTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import Constants from 'variables/Constants/';
import moment from "moment";
import { notifyError } from 'components/Oh/OhUtils';
import MoveStockService from 'services/MoveStockService';
import PDF from './Export/PDF';
import Excel from './Export/Excel';
import ExtendFunction from 'lib/ExtendFunction';
import { connect } from "react-redux";
import _ from 'lodash';
import crypto from "crypto";
import Actions from "store/actions/";
import store from "store/Store";

class ListExport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      dataSource: [],
      totaldataSource: 0
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
        width: "20%",
        dataIndex: "code",
        key: "code",
        sorter: (a, b) => a.code.localeCompare(b.code),
        onSort: (a, b) => a.code.localeCompare(b.code),
      },
      {
        title: t("Thời gian"),
        align: "left",
        width: "25%",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: (a, b) => a.createdAt - b.createdAt,
        onSort: (a, b) => a.createdAt - b.createdAt,
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t("Người tạo"),
        align: "left",
        width: "35%",
        dataIndex: "createdBy.fullName",
        isManualSort: true,
        key: "userName",
      },
      {
        title: t("Trạng thái"),
        align: "left",
        width: "20%",
        dataIndex: "status",
        key: "status",
        render: value => <span style={{color: value === Constants.MOVE_STOCK_CARD_STATUS.id.CANCELED ? "red" : null }}>{t(Constants.MOVE_STOCK_CARD_STATUS.name[value])}</span>
      },
    ];
    return columns
  }

  getData = async () => {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;
    
    filter = filter ? {...filter, reason: Constants.MOVE_STOCK_REASON.id.IMPORT } : { reason: Constants.MOVE_STOCK_REASON.id.IMPORT };

    const query = {
      filter: filter,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? {sortField, sortOrder} : {},
    };

    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    
    if (this.props.importStocks[hashFilterPage]) {
      this.setState({
        dataSource: this.props.importStocks[hashFilterPage].data,
        totaldataSource: this.props.importStocks[hashFilterPage].count
      })
    }

    try {
      let exportStock = await MoveStockService.getMoveStockCardList({ ...query, limit: pageSize * 2 });
      if ( exportStock.status ) {
        store.dispatch(Actions.changeImportStockList({...this.props.importStocks, [hashFilterPage]: {data: exportStock.data.slice(0, pageSize), count: exportStock.count}}))
        this.setState({
          dataSource: exportStock.data.slice(0, pageSize),
          totaldataSource: exportStock.count
        })
        if (pageSize && pageNumber && exportStock.count/(pageSize*pageNumber) > 1) 
          this.getDataPageAfter({ ...query, skip: pageNumber * pageSize }, exportStock.data.slice(pageSize, pageSize * 2), exportStock.count);
      }
      else throw exportStock.error
    }
    catch(err) {
      if ( typeof err === "string" ) notifyError(err)
    } 

  }

  getDataPageAfter = async (query, data, count) => {
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    store.dispatch(Actions.changeImportStockList({...this.props.importStocks, [hashFilterPage]: { data: data, count: count }}));
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t , nameBranch } = this.props;
    let { sortField, sortOrder, manualFilter, isManualSort } = this.filters;
    let filter = {...this.filters.filter, reason: Constants.MOVE_STOCK_REASON.id.IMPORT};

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };
    
    let dataExportPDF = await MoveStockService.getMoveStockCardList(query)
    if ( dataExportPDF.status ) PDF.exportStockPDF(dataExportPDF.data, t , nameBranch)
    else notifyError(dataExportPDF.error)
  }

  getDataExportExcel = async () => {
    let { t } = this.props;
    let { selectedRowKeys } = this.state;
    let { sortField, sortOrder, manualFilter, isManualSort } = this.filters;
    let filter = {...this.filters.filter, reason: Constants.MOVE_STOCK_REASON.id.IMPORT};
    
    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) { 
      filter = { ...filter, id: { in: selectedRowKeys } }          
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataExportExcel = await MoveStockService.getMoveStockCardList(query)

    if ( dataExportExcel.status ) {
      ExtendFunction.exportToCSV(Excel.getTableExcel(dataExportExcel.data, t), t("DanhSachPhieuNhap"))     
    }
    else {
      notifyError(dataExportExcel.error);
    }
    
  }

  render() {
    const { t } = this.props;
    const { dataSource, totaldataSource } = this.state;
    
    return (
      <Card>
        {this.state.redirect}
        <CardBody>
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
                    onClick: () => this.getDataExportExcel(),
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
                linkTo: Constants.ADMIN_LINK + Constants.CREATE_IMPORT_STOCK,
                label: t("Tạo phiếu nhập"),
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
                      pathname: Constants.ADMIN_LINK + Constants.EDIT_IMPORT_STOCK + "/" + record.id
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

export default connect(function (state) {
  return {
    currentUser: state.userReducer.currentUser,
    nameBranch: state.branchReducer.nameBranch,
    importStocks: state.importStockReducer.importStocks
  };
})(withTranslation("translations")(ListExport));