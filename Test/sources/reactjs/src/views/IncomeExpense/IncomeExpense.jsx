// css
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import OhTable from "components/Oh/OhTable";
import OhCheckbox from "components/Oh/OhCheckbox";
import OhToolbar from "components/Oh/OhToolbar";
import ExtendFunction from "lib/ExtendFunction";
import moment from "moment";
import React, { Fragment } from "react";
// multilingual
import { withTranslation } from "react-i18next";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";
import { Redirect } from "react-router-dom";
import incomeExpenseService from "services/IncomeExpenseService";
import Constants from "variables/Constants/";
import ExcelImport from "./components/ExcelOrder";
import PDFImport from "./components/PDFOrder";
import { notifyError } from 'components/Oh/OhUtils';
import IncomeExpenseTypeService from 'services/IncomeExpenseTypeService';
import { ExportCSV } from 'ExportExcel/ExportExcel';
import { connect } from "react-redux";
import _ from 'lodash';
import store from "store/Store";
import Actions from "store/actions";
import crypto from "crypto";

class OrderForm extends React.Component {
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
      selectedRowKeys: [],
      expandedRowKeys: [],
      incomeExpenseCards: [],
      alert: null,
      br: null,
      brerror: null,
      filterFormData: { ...this.defaultFilterFormData },
      incomeExpenseCardsCount: 0,
      dataSource: [],
      IncExpCardType: []
    };
    this.currentPage = {
      pageSize: 10,
      page: 1
    };
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  componentDidMount = () => {
    this.getIncExpCardType();
  };

  getData = async () => {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    pageNumber = pageNumber || 1;
    pageSize = pageSize || 10;

    const query = {
      filter: filter || {},
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? [{[sortField]: sortOrder}] : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? {sortField, sortOrder} : {},
    };

    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    
    if (this.props.incomeExpenses[hashFilterPage]) {
      this.setDataIncExp(this.props.incomeExpenses[hashFilterPage].data, this.props.incomeExpenses[hashFilterPage].count);
    }

    let getIncomeExpenseCards = await incomeExpenseService.getIncomeExpenseCards({ ...query, limit: pageSize * 2 })

    if (getIncomeExpenseCards.status) {
      this.setDataIncExp(getIncomeExpenseCards.data.slice(0, pageSize), getIncomeExpenseCards.count)
      store.dispatch(Actions.changeIncomeExpense({...this.props.incomeExpenses, [hashFilterPage]: { data: getIncomeExpenseCards.data.slice(0, pageSize), count: getIncomeExpenseCards.count }}))
      
      if (pageSize && pageNumber && getIncomeExpenseCards.count/(pageSize*pageNumber) > 1) 
        this.getDataPageAfter({ ...query, skip: pageNumber * pageSize }, getIncomeExpenseCards.data.slice(pageSize, pageSize * 2), getIncomeExpenseCards.count);
    }
    else notifyError(getIncomeExpenseCards.error);
  };

  getDataPageAfter = async (query, data, count) => {
    let hashFilterPage = crypto.createHash("md5").update(JSON.stringify(query)).digest('hex');
    store.dispatch(Actions.changeIncomeExpense({...this.props.incomeExpenses, [hashFilterPage]: { data: data, count: count }}));
  }

  setDataIncExp(data, count){
    this.setState({
      incomeExpenseCards: data,
      dataSource: data.map(item => (
        {
          ...item, 
          amount: ExtendFunction.FormatNumber(item.amount), 
          incomeExpenseAt: moment(item.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT),
          createdAt: moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT),
          customerName: item.customerName
        }
      )),
      incomeExpenseCardsCount: count
    });
  }
  
  onChange = (obj, extra) => {
    if(obj) {
      this.filters = {
        ...this.filters,
        ...obj
      }
    }
    if(extra) {
      this.filters.filter = {
        ...this.filters.filter,
        ...extra
      }
    }
    
    this.getData();
  }

  setData = (incomeExpenseCards, totalIncomeExpenseCards) => {
    incomeExpenseCards.map(item => (item.key = item.id));

    this.setState({
      incomeExpenseCards: incomeExpenseCards,
      totalIncomeExpenseCards
    });
  };

  hideAlert = () => {
    this.setState({
      alert: null
    });
  };

  getColums = () => {
    const { t } = this.props;
    let columns = [
      {
        title: t("Mã"),
        dataIndex: "code",
        align: "left",
        width: "8%"
      },
      {
        title: t("Người nộp/nhận"),
        dataIndex: "customerName",
        align: "left",
        width: "16%",
      },
      {
        title: t("Mã đối tác"),
        dataIndex: "customerCode",
        align: "left",
        width: "8%",
      },
      {
        title: t("Loại phiếu"),
        dataIndex: "incomeExpenseCardTypeId_name",
        align: "left",
        width: "12%",
        render: value => <span>{t(value)}</span>,
      },
      {
        title: t("Số tiền"),
        align: "right",
        dataIndex: "amount",
        width: "12%"
      },
      {
        title: t("Trạng thái"),
        dataIndex: "status",
        align: "left",
        width: "12%",
        render: value => <span style={{color: value === Constants.INCOME_EXPENSE_STATUS.id.CANCELED ? "red" : null }}>{t(Constants.INCOME_EXPENSE_STATUS.name[value])}</span>,
      },
      {
        title: t("Ngày thu/chi"),
        dataIndex: "incomeExpenseAt",
        align: "left",
        width: "12%"
        
      },
    ];
    return columns;
  };

  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  };

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t, nameBranch } = this.props;
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

    let dataIncomeExpenseCardPDF = await incomeExpenseService.getIncomeExpenseCards(query);

    if (dataIncomeExpenseCardPDF.status) PDFImport.productPDF(dataIncomeExpenseCardPDF.data, t, nameBranch)
    else notifyError(dataIncomeExpenseCardPDF.error)
  }

  exportExcel = async () => {
    const {t} = this.props;
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
    
    let dataIncomeExpenseCard = await incomeExpenseService.getIncomeExpenseCards(query);

    if (dataIncomeExpenseCard.status) ExportCSV(ExcelImport.getTableExcel(dataIncomeExpenseCard.data, t), t("DanhSachPhieuThuChi"), ['D'])
    else notifyError(dataIncomeExpenseCard.error)
  }

  getIncExpCardType = async () => {
    const {t} = this.props;
    let getIncExpCardType = await IncomeExpenseTypeService.getIncomeExpenseTypes();
    console.log(getIncExpCardType)
    if(getIncExpCardType.status){
      this.setState({
        IncExpCardType: getIncExpCardType.data
      })
    }
    else{
      notifyError(t(getIncExpCardType.error))
    }
  }

  render() {
    let columns = this.getColums();
    const { t } = this.props;
    const {
      dataSource,
      IncExpCardType
    } = this.state;

    return (
      <Fragment>
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        {this.state.alert}
        <Card>
          <CardBody>
            <OhToolbar
              leftCol={55}
              left={[
                {
                  type: "list",
                  label: t("Xuất file"),
                  typeButton:"export",
                  icon: <MdVerticalAlignBottom />,
                  permission:{
                    name: Constants.PERMISSION_NAME.INCOME_EXPENSE,
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
                }, {
                  type: 'custom',
                  component: (
                    <OhCheckbox
                      isHorizontal={true}
                      options={Constants.INCOME_EXPENSE_TYPES.map(item => {
                        return ({value: item.id, label: t('Phiếu ' + item.name.toLowerCase())})
                      })}
                      defaultValue={Constants.INCOME_EXPENSE_TYPES.map(item => item.id)}
                      onChange={value => {
                        this.onChange(null, {type: {in: value}});
                      }}
                    />
                  )
                }
              ]}
              right={[
                {
                  type: "link",
                  label: t("Thêm phiếu thu mới"),
                  linkTo: Constants.ADD_INCOME_CARD_PATH,
                  permission:{
                    name: Constants.PERMISSION_NAME.INCOME_EXPENSE,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                  icon: <MdAddCircle />,
                  typeButton:"add",
                  simple: true
                },
                {
                  type: "link",
                  label: t("Thêm phiếu chi mới"),
                  linkTo: Constants.ADD_EXPENSE_CARD_PATH,
                  permission:{
                    name: Constants.PERMISSION_NAME.INCOME_EXPENSE,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                  icon: <MdAddCircle />,
                  typeButton:"add",
                  simple: true
                },
              ]} 
            />
            <OhSearchFilter
              id="income-expense-filter"
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                {
                  type: "input-range",
                  title: t("Số tiền"),
                  field: "amount",
                },
                {
                  type: "input-text",
                  title: t("Mã phiếu"),
                  field: "code",
                },
                {
                  type: "select",
                  title: t("Loại phiếu"),
                  field: "incomeExpenseCardTypeId",
                  options: IncExpCardType.sort((a, b) => a.id - b.id).map(item => ({value: item.id, title: t(item.name)})),
                  placeholder: t("Chọn loại phiếu")
                },
                {
                  type: "input-text",
                  title: t("Người nộp/nhận"),
                  field: "customerName",
                },
                {
                  type: "select",
                  title: t("Trạng thái"),
                  field: "status",
                  options: [{ value: 1, title: t(Constants.INCOME_EXPENSE_CARD_STATUS_NAME[1]) }, { value: 2, title: t(Constants.INCOME_EXPENSE_CARD_STATUS_NAME[2]) }]
                },
                {
                  type: "input-text",
                  title: t("Người tạo"),
                  field: "createdBy.fullName",
                },
                {
                  type: "date",
                  title: t("Ngày thu/chi"),
                  field: "incomeExpenseAt",
                }
                ,
                {
                  type: "date",
                  title: t("Ngày tạo"),
                  field: "createdAt",
                },
                {
                  type: "input-text",
                  title: t("Mã đối tác"),
                  field: "customerCode",
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
              total={this.state.incomeExpenseCardsCount}
              columns={columns}
              dataSource={dataSource}
              hasCheckbox={true}
              id={"income-expense-card-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => {
                this.setState({
                  redirect: (
                    <Redirect
                      from="/auth/login-page"
                      to={{
                        pathname: (parseInt(record.type) === Constants.COST_TYPE_NAME.Income
                            ? Constants.EDIT_INCOME_CARD_PATH
                            : Constants.EDIT_EXPENSE_CARD_PATH) + record.id
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

export default connect(
  function (state) {
    return {
      nameBranch: state.branchReducer.nameBranch,
      incomeExpenses: state.incExpReducer.incomeExpenses
    };
  }
)( 
    withTranslation("translations")(OrderForm)
);