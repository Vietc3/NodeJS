import React, { Component } from 'react';
import OhTable from 'components/Oh/OhTable.jsx';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { withTranslation } from 'react-i18next';
import Constants from 'variables/Constants/index.js';
import OhToolbar from 'components/Oh/OhToolbar.jsx';
import { ExportCSV } from 'ExportExcel/ExportExcel.jsx';
import OhDateTimePicker from 'components/Oh/OhDateTimePicker.jsx';
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import { MdVerticalAlignBottom } from "react-icons/md";
import moment from "moment";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import OhSearchFilter from "components/Oh/OhSearchFilter.jsx";
import ActionLogService from 'services/ActionLogService.js';
import Information from './Information.jsx';
import { notifyError } from 'components/Oh/OhUtils.js';
import ExcelImport from './ExcelLog.jsx';
import PDFImport from './PDFLog.jsx';

class ActionLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      dataSource: [],
      totaldataSource: 0,
      InputValue: [moment().subtract(1,'month').startOf('day'), moment().endOf('day')],
      dateTime: {
        start: moment().subtract(1,'month').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf()
      },
    }
    this.filters = {};
  }

  async getData() {
    let { filter, sortField, sortOrder, manualFilter, isManualSort, pageSize, pageNumber } = this.filters;
    let { start, end } = this.state.dateTime

    pageSize = pageSize || Constants.DEFAULT_TABLE_STATUS.pageSize;
    pageNumber = pageNumber || Constants.DEFAULT_TABLE_STATUS.pageNumber;

    filter = { ...filter, createdAt: { "<=": new Date(end).getTime(), ">=": new Date(start).getTime() } }

    const query = {
      filter: filter,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let getDataActionLog = await ActionLogService.getActionLogs(query)

    if (getDataActionLog.status) {
      this.setState({
        dataSource: getDataActionLog.data,
        totaldataSource: getDataActionLog.count
      })
    }
  }

  onChangeDateTime(dateTime) {
    this.setState({ dateTime }, () => this.getData())
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }

  exportExcel = async () => {
    const { t } = this.props;
    let { start, end } = this.state.dateTime
    let { filter, sortField, sortOrder, manualFilter, isManualSort, pageSize, pageNumber } = this.filters;
    filter = { ...filter, createdAt: { "<=": new Date(end).getTime(), ">=": new Date(start).getTime() } }
    const query = {
      filter: filter,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };
    let getDataActionLog = await ActionLogService.getActionLogs(query)
    if (getDataActionLog.status) ExportCSV(ExcelImport.getTableExcel(getDataActionLog.data, t), t("LichSuThaoTac"))
    else notifyError(getDataActionLog.error)
  }

  exportPDF = async () => {
    const { t } = this.props;
    let { start, end } = this.state.dateTime
   
    let { filter, sortField, sortOrder, manualFilter, isManualSort, pageSize, pageNumber } = this.filters;
   
    filter = { ...filter, createdAt: { "<=": new Date(end).getTime(), ">=": new Date(start).getTime() } }
    const query = {
      filter: filter,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let getDataActionLog = await ActionLogService.getActionLogs(query)
    
    if (getDataActionLog.status) PDFImport.productPDF(getDataActionLog.data, getDataActionLog.data, t)
    else notifyError(getDataActionLog.error)
  }

  getColums = () => {
    const { t } = this.props;

    let columns = [
      {
        title: t("Nhân viên"),
        align: "left",
        dataIndex: "userName"
      },
      {
        title: t("Chức năng"),
        align: "left",
        dataIndex: "function",
        sorter: false,
        render: value => t(Constants.ACTION_LOG_TYPE_NAME[value])
      },
      {
        title: t("Thời gian"),
        align: "left",
        dataIndex: "createdAt",
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)
      },
      {
        title: t("Thao tác"),
        align: "left",
        dataIndex: "action",
        sorter: false,
        render: value => t(Constants.ACTION_NAME[value])
      },
      {
        title: t("Nội dung"),
        align: "left",
        sorter: false,
        render: (value, record) => {
          return (
          <span >{t(Constants.ACTION_NAME[record.action]) + " " + t(Constants.ACTION_LOG_TYPE_NAME[record.function]).toLowerCase() + " "}{record.code ? <a href={this.showInfor(record)} target="_blank" rel="noopener noreferrer">{record.code}</a> : " "}</span>
          )
        }
      },
      {
        title: t("Chi nhánh"),
        align: "left",
        dataIndex: "branchName"
      }
    ];
    return columns
  }

  showInfor = (data) => {
    let URL = window.location.origin;

    switch(data.function) {
      case 2: 
        return (
          URL + Constants.EDIT_PRODUCT_PATH + data.codeId
        ); 
      case 3:
        return (
          URL + Constants.MANAGE_INVOICE + data.codeId
        );      
      case 4:
        return (
          URL + Constants.MANAGE_INVOICE_RETURN + data.codeId
        );
      case 5:
        return (
          URL + Constants.EDIT_IMPORT_CARD_PATH + data.codeId
        );
      case 6:
        return (
          URL + Constants.EDIT_EXPORT_CARD_PATH + data.codeId
        );   
      case 7:
        return (
          URL + Constants.EDIT_ORDER_EXPORT_PATH + data.codeId
        ); 
      case 8:
        return (
          URL + Constants.EDIT_ORDER_IMPORT_PATH + data.codeId
        ); 
      case 9:
        return (
          URL + Constants.EDIT_INCOME_CARD_PATH + data.codeId
        );     
      case 10:
        return (
          URL + Constants.EDIT_EXPENSE_CARD_PATH + data.codeId
        );
      case 11:
        return (
          URL + Constants.EDIT_COLLECT_DEPOSIT_CARD_PATH  + "/" + data.codeId
        )
      case 23:
        return (
          URL + Constants.EDIT_WITHDRAW_DEPOSIT_CARD_PATH + "/" + data.codeId
        )
      case 13:
        return (
          URL + Constants.EDIT_CUSTOMER_PATH + data.codeId
        )
      case 14:
        return (
          URL + Constants.EDIT_SUPLIER_PATH + data.codeId
        )
      case 15:
        return (
          URL + Constants.EDIT_BRANCH_PATH + data.codeId
        )
      case 16:
        return (
          URL + Constants.EDIT_STOCK_PATH + data.codeId
        )
      case 17:
        return (
          URL + Constants.EDIT_STOCKTAKE_CARD_PATH + "/" + data.codeId
        )
      case 18:        
        return (
          URL + Constants.EDIT_MANUFACTURING_CARD_PATH + data.codeId
        )
      case 19:        
        return (
          URL + Constants.EDIT_IMPORT_STOCK_PATH + data.codeId
        )
      case 20:        
        return (
          URL + Constants.EDIT_EXPORT_STOCK_PATH + data.codeId
        )
      case 21:        
        return (
          URL + Constants.EDIT_EXPORT_STOCK_PATH + data.codeId
        )
      case 22:
        return (
          URL + Constants.EDIT_USER_PATH + data.codeId
        )
      default:
        break;
    }
  }

  render() {
    const { t } = this.props;
    const { dataSource, totaldataSource, InputValue } = this.state;

    return (
      <Card>
        <GridContainer style={{ padding: '0px 0px 0px 40px' }} alignItems="center">
          <GridItem xs={12}>
            <GridContainer alignItems="center">
              <OhToolbar
                // leftCol={100}
                left={[
                  {
                    type: "list",
                    label: t("Xuất file"),
                    icon: <MdVerticalAlignBottom />,
                    typeButton: "export",
                    permission:{
                      name: Constants.PERMISSION_NAME.ACTION_LOG,
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
                  },
                ]}
              />
              <GridItem>
                <span className="TitleInfoForm">{t("Thời gian")}</span>
              </GridItem>
              <GridItem>
                <OhDateTimePicker defaultValue={InputValue} onChange={(start, end) => this.onChangeDateTime({ start, end })} />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
        <CardBody>
          <OhSearchFilter
            id="action-log-filter"
            onFilter={(filter, manualFilter) => {
              this.onChange({
                filter,
                manualFilter
              });
            }}
            filterFields={[
              {
                type: "input-text",
                title:  t("Tên {{type}}", { type: t("Nhân viên") }),
                field: "user.fullName",
                isManualFilter: true,
                placeholder: t("Nhập tên {{type}}", { type: t("Nhân viên").toLowerCase() })
              },
              {
                type: "input-text",
                title: t("Tên {{type}}", { type: t("Chi nhánh") }),
                field: "branch.name",
                isManualFilter: true,
                placeholder: t("Nhập tên {{type}}", { type: t("Chi nhánh") }),
              },
              {
                type: "select",
                title: t("Chức năng"),
                field: "function",
                options: Constants.OPTIONS_ACTION_TYPE.map(item => ({...item, title: t(item.title)})),
              },
            ]}
            defaultShowAll={false}
            searchInput={{
              fields: ["user.fullName", "branch.name"],
              placeholder: t("Tìm theo nhân viên, chi nhánh")
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
            isExpandable={true}
            columns={this.getColums()}
            dataSource={dataSource}
            total={totaldataSource}
            id={"list-action-log-table"}
            expandedRowRender={(record) => {
              return (<Card style ={{margin:"0px 0px 0px 0px"}}>
                        <CardBody>
                          <Information id={record.id}/>
                        </CardBody>
                      </Card>)
            }}
          />
        </CardBody>
      </Card>
    );
  }
}

export default withTranslation("translations")(ActionLog);