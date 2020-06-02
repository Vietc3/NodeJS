import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from 'react-i18next';
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import FormLabel from "@material-ui/core/FormLabel";
import NotificationError from "components/Notification/NotificationError.jsx";
import OhTable from 'components/Oh/OhTable';
import Constants from "variables/Constants/";
import { MdViewList, MdVerticalAlignBottom } from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar";
import incomeExpenseTypeService from "services/IncomeExpenseTypeService";
import { notifyError } from "components/Oh/OhUtils";
import IncomeExpenseService from "services/IncomeExpenseService";
import userService from 'services/UserService';
import OhMultiChoice from "components/Oh/OhMultiChoice";
import OhSelect from "components/Oh/OhSelect";
import OhSelectGroup from "components/Oh/OhSelectGroup";
import { Container, Col, Row } from "react-bootstrap";
import OhDateTimePicker from 'components/Oh/OhDateTimePicker';

class Debt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      InputValue: [moment().startOf('month'),moment().endOf('month')],
      dateTime: {
        start: Number((moment().startOf('month')).format(Constants.DATABASE_DATE_TIME_FORMAT_STRING)),
        end: Number((moment().endOf('month')).format(Constants.DATABASE_DATE_TIME_FORMAT_STRING)),
      },
      dataIncomeExpense: [],
      brerror: null,
      incomeExpenseTypes: [],
      users: [],
      formData: {},
      customers: [],
      totalIncome: 0, 
      totalExpense: 0, 
      totalOverBalance: 0
    }
    this.type = this.props.location.pathname === "/admin/customer-debt-report" ? 1 : 2;
  }

  componentDidMount() {
    let start = moment().startOf('month')
    let end = moment().endOf('month')
    this.getData(start, end);
    this.getIncomeExpenseType();
    this.getUser();
    this.getCustomer();
  }

  async getData(start, end) {
    let {formData} = this.state;

    this.setState({
      loading: true
    });

    let filter = {
      incomeExpenseAt: { ">=": new Date(start).getTime(), "<=": new Date(end).getTime() },
      status: Constants.INCOME_EXPENSE_CARD_STATUS.FINISHED,
      createdBy: formData.createdBy === "Tất cả" ? undefined : formData.createdBy,
    }

    if(formData.incomeExpenseCardTypeId && formData.incomeExpenseCardTypeId.length > 0){
      let findItemAll = formData.incomeExpenseCardTypeId.indexOf(0)
      if(findItemAll === -1)
        filter.incomeExpenseCardTypeId = {in: formData.incomeExpenseCardTypeId}
    }

    if(formData.customerName){
      if(!isNaN(formData.customerName))
        filter.customerId = formData.customerName;
      else
        filter.customerName = formData.customerName;
      filter.customerType = formData.customerType;
    }

    let dataIncomeExpense = await IncomeExpenseService.getIncomeExpenseCards({
      filter: filter,
      sort: [{incomeExpenseAt: "ASC"}]
    })
    
    if (dataIncomeExpense.status){
      let data = dataIncomeExpense.data;
      let totalIncome = 0;
      let totalExpense = 0;
      let totalOverBalance = 0;
      data.map((item) => {

        if(item.type === Constants.COST_TYPE_NAME.Income) {
          item.income = item.amount;
          totalIncome += item.amount;
        }
        else{
          item.expense = item.amount;
          totalExpense += item.amount;
        }

        return item;
      })

      let i = 0;
      while(i < data.length){
        let j = i+1;
        let date = moment(data[i].incomeExpenseAt).format(Constants.DISPLAY_DATE_FORMAT_STRING);
        while(j > 0 && j < data.length && moment(data[j].incomeExpenseAt).format(Constants.DISPLAY_DATE_FORMAT_STRING) === date ){
          data[j].incomeExpenseAt = '';
          j ++;
        }
        i = j;
      }

      totalOverBalance = totalIncome - totalExpense;
      this.setState({
        dataIncomeExpense: data,
        totalIncome,
        totalExpense,
        totalOverBalance,
        loading: false
      })
    }
    else {
      notifyError(dataIncomeExpense.error)
      this.setState({
        loading: false
      })
    }
  }

  error = (mess) => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    })
  }

  export = () => {
    const {t} = this.props;
    const { dataIncomeExpense, totalIncome, totalExpense, totalOverBalance } = this.state;
    let dataExcel = [[
      t("Thời gian"),
      t("Mã phiếu"),
      t("Người nộp/nhận"),
      t("Lý do"),
      t("Tiền thu"),
      t("Tiền chi"),
      t("Số dư")
    ]];

    let total = ['', '', '', '',
      ExtendFunction.FormatNumber(Number(totalIncome || 0).toFixed(2)), 
      ExtendFunction.FormatNumber(Number(totalExpense || 0).toFixed(2)), 
      ExtendFunction.FormatNumber(Number(totalOverBalance || 0).toFixed(2))
    ];
    
    dataExcel.push(total);

    for (let item of dataIncomeExpense) {
      dataExcel.push(
        [
          item.incomeExpenseAt ? moment(item.incomeExpenseAt).format(Constants.DISPLAY_DATE_FORMAT_STRING) : '',
          item.code,
          item.customerName,
          item.incomeExpenseCardTypeId_name,
          ExtendFunction.FormatNumber(Number(item.income || 0).toFixed(2)),
          ExtendFunction.FormatNumber(Number(item.expense || 0).toFixed(2)),
        ])
    }

    dataExcel.push(total);

    return dataExcel;
  }

  getIncomeExpenseType = async () => {
    let { t } = this.props;
    try {
      let getIncomeExpenseTypes = await incomeExpenseTypeService.getIncomeExpenseTypes();
      if (getIncomeExpenseTypes.status) {
        this.setState({ 
          incomeExpenseTypes: getIncomeExpenseTypes.data
        });
      }
      else throw getIncomeExpenseTypes.error
    }
    catch (error) {
      if (typeof error === "string") notifyError(t(error))
    }
  }

  getUser = async () => {
    let { t } = this.props;
    try {
      let getUser = await userService.getUserList();
      if (getUser.status) {
        this.setState({ 
          users: getUser.data
        });
      }
      else throw getUser.error
    }
    catch (error) {
      if (typeof error === "string") notifyError(t(error))
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.formData.incomeExpenseCardTypeId !== this.state.formData.incomeExpenseCardTypeId){
      this.getCustomer()
    }
  }

  getCustomer = async () => {
    const {t} = this.props;
    let filter= {status: Constants.INCOME_EXPENSE_CARD_STATUS.FINISHED};
    
    let dataIncomeExpense = await IncomeExpenseService.getIncomeExpenseCards({
      filter: filter,
    })

    if (dataIncomeExpense.status){
      let data = dataIncomeExpense.data;
      let customers = [];
      let customerNames = [];
      data.map((item) => {
        let findCustomer = customerNames.filter(record => record.title === item.customerName && record.type === item.customerType);
        if(findCustomer.length === 0 && item.customerName){
          customers.push({title: item.customerName, value: item.customerId || item.customerName, type: item.customerType });
          customerNames.push({title: item.customerName, type: item.customerType})
        }
        return item;
      }) 

      let CustomerGroup = {
        groupName: t(Constants.INCOME_EXPENSE_CUSTOMER_TYPES.arr.filter(item => item.id === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.CUSTOMER)[0].name) ,
        array: customers.filter(item => item.type === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.CUSTOMER).sort(function (a, b) {
          return a.title.localeCompare(b.title);
        })
      };

      let SupplierGroup = {
        groupName: t(Constants.INCOME_EXPENSE_CUSTOMER_TYPES.arr.filter(item => item.id === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER)[0].name) ,
        array: customers.filter(item => item.type === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER).sort(function (a, b) {
          return a.title.localeCompare(b.title);
        })
      };

      let StaffGroup = {
        groupName: t(Constants.INCOME_EXPENSE_CUSTOMER_TYPES.arr.filter(item => item.id === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.STAFF)[0].name) ,
        array: customers.filter(item => item.type === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.STAFF).sort(function (a, b) {
          return a.title.localeCompare(b.title);
        })
      };

      let OtherGroup = {
        groupName: t(Constants.INCOME_EXPENSE_CUSTOMER_TYPES.arr.filter(item => item.id === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.OTHER)[0].name) ,
        array: customers.filter(item => item.type === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.OTHER).sort(function (a, b) {
          return a.title.localeCompare(b.title);
        })
      };

      let customerGroup = [CustomerGroup, SupplierGroup, StaffGroup, OtherGroup];
      
      this.setState({
        customers: customerGroup
      })
    }
    else
      notifyError(dataIncomeExpense.error)
  }

  getLink = (type, id) => {
    let URL = window.location.origin;
    if(type === Constants.COST_TYPE_NAME.Income){
      return URL + Constants.EDIT_INCOME_CARD_PATH + id
    }
    else {
      return URL + Constants.EDIT_EXPENSE_CARD_PATH + id
    }
  }

  render() {
    const { t } = this.props
    const { InputValue, dateTime, dataIncomeExpense, incomeExpenseTypes, users, formData, customers, totalIncome, totalExpense, totalOverBalance, loading } = this.state;
    
    let columnTable = [
      {
        title: t("Thời gian"),
        dataIndex: "incomeExpenseAt",
        width: "13%",
        align: "left",
        sorter: false,
        render: value => {
          return value ? moment(value).format(Constants.DISPLAY_DATE_FORMAT_STRING) : ''
        },
      },
      {
        title: t("Mã phiếu"),
        dataIndex: "code",
        width: "13%",
        align: "left",
        sorter: false,
        render: (value, record) => {
          return (
            <span>
              <a style={{ cursor: "pointer" }} href={this.getLink(record.type, record.id)} target="_blank" rel="noopener noreferrer">{value}</a>
            </span>
          );
        }
      },
      {
        title: t("Người nộp/nhận"),
        dataIndex: "customerName",
        width: "28%",
        align: "left",
        sorter: false,
      },
      {
        title: t("Lý do"),
        dataIndex: "incomeExpenseCardTypeId_name",
        align: "left",
        width: "20%",
        sorter: false,
        render: value => {
          return(
            <span>
              {t(value)}
            </span>
          )
        },
      },
      {
        title: t("Tiền thu"),
        dataIndex: "income",
        align: "right",
        width: "13%",
        sorter: false,
        render: value => {
          return ExtendFunction.FormatNumber(value) || 0;
        },
      },
      {
        title: t("Tiền chi"),
        dataIndex: "expense",
        align: "right",
        width: "13%",
        sorter: false,
        render: value => {
          return ExtendFunction.FormatNumber(value) || 0;
        },
      },
    ];

    return (
      <div>
        <Card >
          <GridContainer style={{ padding: '0px 0px 0px 40px' }} alignItems="center">
            <GridItem xs={12}>
              <GridContainer alignItems="center">
                <OhToolbar
                  left={[
                    {
                      type: "csvlink",
                      typeButton: "export",
                      csvData: this.export(),
                      fileName: t("BaoCaoThuChi.xls"),
                      onClick: () => { },
                      label: t("Xuất báo cáo"),
                      icon: <MdVerticalAlignBottom />,
                    }
                  ]}
                />
                <GridItem>
                  <span className="TitleInfoForm">{t("Thời gian")}</span>
                </GridItem>
                <GridItem>
                  <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                    let dateTime = {start: start, end: end};
                    this.setState({dateTime})
                    }}
                  />
                </GridItem>
                <GridItem >
                  <OhToolbar
                    left={[

                      {
                        type: "button",
                        label: t("Xem báo cáo"),
                        onClick: () => this.getData(dateTime.start, dateTime.end),
                        icon: <MdViewList />,
                        simple: true,
                        typeButton: "add",
                      },
                    ]}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>

          <GridContainer alignItems="center" style={{width: "100%", marginTop: -30}}>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <GridContainer justify='left' style={{marginLeft: 0}}>
                <FormLabel className="TitleReport">
                  <b className='TitleForm'>{t("Loại thu chi")}&nbsp;</b>
                </FormLabel>
                <OhMultiChoice
                  dataSourcePType={incomeExpenseTypes.sort((a, b) => a.id - b.id).map(item => ({id: item.id, name: item.name}))}
                  placeholder={t("Chọn loại thu chi")}
                  onChange={(value) => {
                    this.setState({
                      formData: {
                        ...formData,
                        incomeExpenseCardTypeId: value
                      }
                    });
                  }}
                  className='reportIncExpTypeSelect'
                />

                <FormLabel className="TitleReport">
                  <b className='TitleForm'>{t("Người nộp/nhận")}&nbsp;</b>
                </FormLabel>
                <OhSelectGroup
                  options={[{array:[{title: t("Tất cả")}]}].concat(customers)}
                  placeholder={t("Chọn người nộp/nhận")}
                  onChange={(value, record) => {
                    this.setState({
                      formData: {
                        ...formData,
                        customerName: value,
                        customerType: record.type
                      }
                    });
                  }}
                  className='reportSelect'
                />
                
                <FormLabel className="TitleReport">
                  <b className='TitleForm'>{t("Người tạo")}&nbsp;</b>
                </FormLabel>
                <OhSelect
                  options={[{id: "Tất cả", fullName: t("Tất cả")}].concat(users.sort((a, b) => a.fullName ? a.fullName.localeCompare(b.fullName) : -1)).map(item => (
                    {
                      value: item.id, 
                      title: item.fullName,
                    }))}
                  placeholder={t("Chọn người tạo")}
                  onChange={(value) => {
                    console.log(value)
                    this.setState({
                      formData: {
                        ...formData,
                        createdBy: value
                      }
                    });
                  }}
                  className='reportSelect'
                />
              </GridContainer>
            </GridItem>
          </GridContainer>

          <GridContainer style={{ width: "100%", marginTop: -10}}>
            <GridItem xs={12} sm={12} md={12}>
              <GridContainer justify='flex-end'>
                <GridItem xs={12} sm={10} md={8} lg={6}>
                  <Container style={{textAlign: 'right'}}>
                    <Row className = 'row-invoice'>
                      <Col className='LableAmountReport'>{t("Tổng thu")}</Col>
                      -
                      <Col className='LableAmountReport'>{t("Tổng chi")}</Col>
                      =
                      <Col className='LableAmountReport'>{t("Tồn quỹ")}</Col>
                    </Row>

                    <Row className = 'row-invoice'>
                      <Col  className={'AmountReport'}>
                        {ExtendFunction.FormatNumber(totalIncome)}
                      </Col>

                      <Col  className={'AmountReport'}>
                        {ExtendFunction.FormatNumber(totalExpense)}
                      </Col>

                      <Col  className={'AmountReport'}>
                        {ExtendFunction.FormatNumber(totalOverBalance)}
                      </Col>
                    </Row>
                  </Container>
                </GridItem>
              </GridContainer>
              <GridItem style={{ textAlign: 'center', marginLeft: "20px" }}>
                <OhTable
                  id="debt-report"
                  columns={columnTable}
                  dataSource={dataIncomeExpense.length > 500 ? dataIncomeExpense.slice(0,500) : dataIncomeExpense}
                  isNonePagination={true}
                  loading={loading}
                />
              </GridItem>
              {dataIncomeExpense.length > 500 ?
                <GridItem >
                  <GridContainer >
                    <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                      <b className='HeaderForm'>{t("Hiển thị 1–500 của 500+ kết quả. Để thu hẹp kết quả, bạn hãy chỉnh sửa phạm vi thời gian hoặc chọn Xuất báo cáo để xem đầy đủ")}</b>
                    </FormLabel>
                  </GridContainer>
                </GridItem>
                :
                null
              }
            </GridItem>
          </GridContainer>
        </Card>
      </div>
    );
  }
}

Debt.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (withTranslation("translations")(withStyles(dashboardStyle)(Debt)));
