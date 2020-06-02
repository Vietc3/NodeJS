import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import moment from "moment";
import { withTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom'
import withStyles from "@material-ui/core/styles/withStyles"
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody";
import ExtendFunction from 'lib/ExtendFunction';
import "react-datepicker/dist/react-datepicker.css";
import Constants from 'variables/Constants/';
import ImportService from 'services/ImportService';
import PDFImport from './components/PDFImport';
import ExcelImport from './components/ExcelImport';
import OhToolbar from 'components/Oh/OhToolbar';
import { MdAddCircle,MdVerticalAlignBottom  } from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import OhTable from 'components/Oh/OhTable';
import OhSearchFilter from 'components/Oh/OhSearchFilter';
import { notifyError } from 'components/Oh/OhUtils';
import { ExportCSV } from 'ExportExcel/ExportExcel';
import { connect } from "react-redux";
import _ from 'lodash';
import importReturnService from "services/ImportReturnService";
import crypto from "crypto";
import Actions from "store/actions/";
import store from "store/Store";

class ImportList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      alert: null,
      br: null,
      brerror: null,
      dataSource: [],
    };
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
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
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    
    if (this.props.importReturns[hashFilterPage]) {
      this.setData(this.props.importReturns[hashFilterPage].data, this.props.importReturns[hashFilterPage].count);
    }

    let getDataServer = await importReturnService.getImportReturnList({...query, limit: pageSize * 2});

    if (getDataServer.status) {
      this.setData(getDataServer.data.slice(0, pageSize), getDataServer.count);
      store.dispatch(Actions.changeImportReturn({...this.props.importReturns, [hashFilterPage]: {data: getDataServer.data.slice(0, pageSize), count: getDataServer.count}}))

      if (pageSize && pageNumber && getDataServer.count/(pageSize*pageNumber) > 1) 
        this.getDataPageAfter({ ...query, skip: pageNumber * pageSize }, getDataServer.data.slice(pageSize, pageSize * 2), getDataServer.count);
    }
    else notifyError(getDataServer.error)

  }

  getDataPageAfter = async (query, data, count) => {
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    store.dispatch(Actions.changeImportReturn({...this.props.importReturns, [hashFilterPage]: { data: data, count: count }}));
  }


  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }

  setData(Imports, totalImports) {
    Imports.map(item => item.key = item.id)
    this.setState({
      dataSource: Imports,
      totalImports
    })
  }

  getColumns = () => {
    let { t } = this.props;
    let columns = [
      {
        title: t('Mã phiếu'),
        dataIndex: 'code',
        key: 'code',
        align:"left",
        width:"14%",
        sorter: (a, b) => a.code.localeCompare(b.code),
        onSort: (a, b) => a.code.localeCompare(b.code),

      },
      {
        title: t('Thời gian'), dataIndex: 'exportedAt', key: 'exportedAt',
        key: 'code',
        sorter: (a, b) => (a.exportedAt - b.exportedAt),
        onSort: (a, b) => (a.exportedAt - b.exportedAt),
        align:"left",
        width:"15%",
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t('Nhà cung cấp'),
        dataIndex: 'customerId.name',
        align:"left",
        width:"37%",
        isManualSort: true,
      },
      {
        title: t('Tổng tiền'), dataIndex: 'finalAmount', key: 'finalAmount',
        align: 'right',
        sorter: (a, b) => a.finalAmount - b.finalAmount,
        onSort: (a, b) => a.finalAmount - b.finalAmount,
        width:"22%",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(Number(value).toFixed(0))
        }
      },
      {
        title: t('Trạng thái'), dataIndex: 'status', key: 'status',
        sorter: (a, b) => a.status - b.status,
        onSort: (a, b) => a.status - b.status,
        align:"left",
        width:"12%",
        render: value => {
          return (
            <span style={{color: value === Constants.IMPORT_STATUS.CANCELED ? "red": null}}>{t(Constants.IMPORT_STATUS[value])}</span>
          )
        }
      }
    ];

    return columns;
  }

  getDataExport = async() => {
    let { selectedRowKeys } = this.state;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }

    filter = filter ? {...filter, reason: Constants.IMPORT_CARD_REASON.IMPORT_PROVIDER } : { reason: Constants.IMPORT_CARD_REASON.IMPORT_PROVIDER };

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataExport = await importReturnService.getImportReturnList(query);
    if (dataExport.status) 
      return dataExport.data;
    else {
      notifyError(dataExport.error);
      return null;
    }
  }

  exportPDF = async () => {
    let {t, nameBranch}= this.props;
    let data = await this.getDataExport();
    if (data) PDFImport.productPDF(data, data,t, nameBranch);
  }

  exportExcel = async () => {
    const { t } = this.props;
    let data = await this.getDataExport();
    if (data) ExportCSV(ExcelImport.getTableExcel(data,t), t("DanhSachTraHangNhap"), ['D']);
  }

  hideAlert = () => {
    this.setState({ alert: null })
  }

  render() {
    const { t } = this.props;
    const { dataSource, totalImports } = this.state;

    return (
      <Fragment>
        <Card>
          <CardBody>
            {this.state.br}
            {this.state.brerror}
            {this.state.redirect}
            {this.state.alert}
            <OhToolbar
              left={[
                {
                  type: "list",
                  label: t("Xuất file"),
                  typeButton: "export",
                  icon: <MdVerticalAlignBottom />,
                  permission: {
                    name: Constants.PERMISSION_NAME.IMPORT,
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
                  linkTo: Constants.ADD_EXPORT_CARD_PATH,
                  label: t("Thêm phiếu trả hàng"),
                  icon: <MdAddCircle />,
                  simple: true,
                  typeButton: "add",
                  permission: {
                    name: Constants.PERMISSION_NAME.IMPORT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },

              ]}
            />
            <OhSearchFilter
            id={"import-export-product-table"}
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                { type: "date", title: t("Thời gian"), field: "exportedAt" },
                {
                  type: "input-range",
                  title: t("Tổng tiền"),
                  field: "totalAmount",
                  placeholder: t("Nhập giá trị")
                },
                {
                  type: "select",
                  title: t("Trạng thái"),
                  field: "status",
                  placeholder: t("Chọn trạng thái"),
                  options: [{ value: 1, title: t(Constants.IMPORT_CARD_STATUS_NAME[1]) }, { value: 2, title: t(Constants.IMPORT_CARD_STATUS_NAME[2]) }]
                },
                {
                  type: "input-text",
                  title: t("NCC"),
                  field: "customerId.name",
                  isManualFilter: true,
                  placeholder: t("Nhập tên NCC")
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
              columns={this.getColumns()}
              dataSource={dataSource}
              total={totalImports}
              hasCheckbox={true}
              id={"import-export-product-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => {
                this.setState({
                  redirect: (
                    <Redirect
                      to={{
                        pathname: Constants.EDIT_EXPORT_CARD_PATH + record.id
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

ImportList.propTypes = {
  classes: PropTypes.object
};

export default connect(
  function (state) {
    return {
      nameBranch: state.branchReducer.nameBranch,
      importReturns: state.importReturnReducer.importReturns
    };
  }
)( withTranslation("translations")(withStyles((theme) => ({
  ...extendedTablesStyle,
  ...buttonsStyle
}))(ImportList)));