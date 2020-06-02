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
import moment from "moment";
import { notifyError } from "components/Oh/OhUtils.js";
import DepositService from 'services/DepositService.js';
import ExtendFunction from 'lib/ExtendFunction.js';
import { connect } from "react-redux";
import PDF from './Export/PDF.js';
import Excel from './Export/Excel.jsx';
import _ from 'lodash';
import crypto from "crypto";
import Actions from "store/actions/";
import store from "store/Store";

class ListDeposit extends Component {
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
    
    if (this.props.deposits[hashFilterPage]) {
      this.setData(this.props.deposits[hashFilterPage].data, this.props.deposits[hashFilterPage].count);
    }
    
    let getDeposits = await DepositService.getDeposits({ ...query, limit: pageSize * 2 });

    if (getDeposits.status) {

      store.dispatch(Actions.changeDepositList({...this.props.deposits, [hashFilterPage]: {data: getDeposits.data.slice(0, pageSize), count: getDeposits.count}}))

      if (pageSize && pageNumber && getDeposits.count/(pageSize*pageNumber) > 1) 
        this.getDataPageAfter({ ...query, skip: pageNumber * pageSize }, getDeposits.data.slice(pageSize, pageSize * 2), getDeposits.count);
      
      this.setData(getDeposits.data.slice(0, pageSize), getDeposits.count)
    }
    else notifyError(getDeposits.message)
  
  }

  setData(data, count) {
    this.setState({
      dataSource: data,
      totaldataSource: count
    })
  }

  getDataPageAfter = async (query, data, count) => {
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    store.dispatch(Actions.changeDepositList({...this.props.imports, [hashFilterPage]: { data: data, count: count }}));
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
        title: t("Mã"),
        align: "left",
        dataIndex: "code",
        key: "code",
        width:"12%",
        sorter: (a, b) => a.code.localeCompare(b.code),
        onSort: (a, b) => a.code.localeCompare(b.code),
      },
      {
        title: t("Loại"),
        align: "rigth",
        dataIndex: "type",
        isManualSort: true,
        key: "type",
        width:"12%",
        render: value => t(Constants.DEPOSIT_TYPE_NAME[value])
      },
      {
        title: t("Thời gian"),
        align: "left",
        dataIndex: "createdAt",
        key: "createdAt",
        width:"12%",
        sorter: (a, b) => a.createdAt - b.createdAt,
        onSort: (a, b) => a.createdAt - b.createdAt,
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t("Đối tượng"),
        align: "left",
        dataIndex: "customerId.type",
        isManualSort: true,
        width:"12%",
        key: "customerId.type",
        render: (value, record) => t(Constants.CUSTOMER_TYPE_NAME[value])
      },
      {
        title: t("Tên"),
        align: "left",
        dataIndex: "customerId.name",
        isManualSort: true,
        width:"27%",
        key: "customerId.name",
      },
      {
        title: t("Giá trị"),
        align: "left",
        dataIndex: "amount",
        isManualSort: true,
        key: "amount",
        width:"13%",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(Number(value).toFixed(0))
        }
      },
      {
        title: t("Trạng thái"),
        align: "left",
        dataIndex: "status",
        key: "status",
        width:"12%",
        render: value => <span style={{color: value === Constants.DEPOSIT_STATUS.CANCELLED ? "red" : null }}>{t(Constants.DEPOSIT_STATUS_NAME[value])}</span>
      },
    ];
    return columns
  }

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t , nameBranch} = this.props;
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
    
    let dataDepostCardPDF = await DepositService.getDeposits(query)
    
    if ( dataDepostCardPDF.status ) PDF.productPDF(dataDepostCardPDF.data, t, nameBranch)
    else notifyError(dataDepostCardPDF.error)
  }

  getDataExportExcel = async () => {
    let { selectedRowKeys } = this.state;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;
    let { t } = this.props;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataDepostCardExcel = await DepositService.getDeposits(query)

    if ( dataDepostCardExcel.status ) {
      ExtendFunction.exportToCSV(Excel.getTableExcel(dataDepostCardExcel.data, t), t("Danhsachtienkygui"))
    }
    else {
      notifyError(dataDepostCardExcel.error);
    }
    
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
                permission:{
                  name: Constants.PERMISSION_NAME.DEPOSIT,
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
                simple: true,
                
              }
            ]}
            right={[
              {
                type: "link",
                linkTo: Constants.CREATE_COLLECT_DEPOSIT_CARD_PATH,
                label: t("Thêm phiếu thu"),
                icon: <MdAddCircle />,
                simple: true,
                typeButton: "add",
                permission:{
                  name: Constants.PERMISSION_NAME.DEPOSIT,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                },
              },
              {
                type: "link",
                linkTo: Constants.CREATE_WITHDRAW_DEPOSIT_CARD_PATH,
                label: t("Thêm phiếu rút"),
                icon: <MdAddCircle />,
                simple: true,
                typeButton: "add",
                permission:{
                  name: Constants.PERMISSION_NAME.DEPOSIT,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                },
              },

            ]}
          />
          <OhSearchFilter
            id="Deposit-Filter"
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
                title: t("Tên"),
                field: "customerId.name",
                isManualFilter: true,
                placeholder: t("Nhập {{type}}", {type: t("Tên").toLowerCase()})
              },
              {
                type: "input-text",
                title: t("Mã phiếu"),
                field: "code",
                placeholder: t("Nhập {{type}}", {type: t("Mã phiếu").toLowerCase()})
              },
              {
                type: "input-range",
                title: t("Giá trị"),
                field: "amount",
              },
              {
                type: "select",
                title: t("Đối tượng"),
                field: "customerId.type",
                isManualFilter: true,
                options: [ { value: 1, title: t(Constants.CUSTOMER_TYPE_NAME[1]) },{ value: 2, title: t(Constants.CUSTOMER_TYPE_NAME[2]) }]
              },
              {
                type: "select",
                title: t("Loại"),
                field: "type",
                options: [ { value: 1, title: t(Constants.DEPOSIT_TYPE_NAME[1]) },{ value: 2, title: t(Constants.DEPOSIT_TYPE_NAME[2]) }]
              },
              {
                type: "select",
                title: t("Trạng thái"),
                field: "status",
                options: [ { value: 1, title: t(Constants.DEPOSIT_STATUS_NAME[1]) },{ value: 2, title: t(Constants.DEPOSIT_STATUS_NAME[2]) }]
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
            id={"deposit-table"}
            onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
            onRowClick={(e, record, index) => {
              this.setState({
                redirect: (
                  <Redirect
                    to={{
                      pathname: record.type === Constants.DEPOSIT_TYPE.COLLECT ? (Constants.EDIT_COLLECT_DEPOSIT_CARD_PATH + "/" + record.id) : (Constants.EDIT_WITHDRAW_DEPOSIT_CARD_PATH + "/" + record.id)
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
export default connect(
  function (state) {
    return {
      nameBranch: state.branchReducer.nameBranch,
      deposits: state.depositReducer.deposits
    };
  }
)( 
    withTranslation("translations")(ListDeposit)
);
