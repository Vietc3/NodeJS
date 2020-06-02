import React, { Component } from 'react';
import OhTable from 'components/Oh/OhTable.jsx';
import CardBody from "components/Card/CardBody.jsx";
import { withTranslation } from 'react-i18next';
import Constants from 'variables/Constants/index.js';
import moment from "moment";
import { notifyError } from "components/Oh/OhUtils.js";
import DepositService from 'services/DepositService.js';
import ExtendFunction from 'lib/ExtendFunction.js';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import OhDateTimePicker from 'components/Oh/OhDateTimePicker.jsx';

class ListDeposit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      totaldataSource: 0,
      InputValue: [moment().subtract(1, 'years').startOf('day'), moment().endOf('day')],
      dateTime: {
        start: moment().subtract(1, 'years').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf()
      },
      filters: {}
    };
  }

  componentDidMount = () => {
    
    if (this.props.customerId)
    
      this.getData(this.props.customerId)
  }
  
  getData = async (customerId) => {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.state.filters;
    let { customer } = this.props;
    let { dateTime } = this.state;
    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;
    filter = { ...filter, createdAt: { "<=": new Date(dateTime.end).getTime(), ">=": new Date(dateTime.start).getTime() }, customerId: customerId , status: Constants.DEPOSIT_STATUS.FINISHED} || { customerId: customerId, status: Constants.DEPOSIT_STATUS.FINISHED};

    const query = {
      filter: filter,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };
    
      let getDeposits = await DepositService.getDeposits(query);

      if (getDeposits.status) {
        
        this.setState({
          dataSource: getDeposits.data,
          totaldataSource: getDeposits.count,
          totalDeposit: customer.totalDeposit

        })
      }
      else  notifyError(getDeposits.message)
  
  }
  
  getColums = () => {
    const { t } = this.props;

    let columns = [
    {
        title: t("Thời gian"),
        align: "left",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: (a, b) => a.createdAt - b.createdAt,
        onSort: (a, b) => a.createdAt - b.createdAt,
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
        },
      {
        title: t("Loại"),
        align: "left",
        dataIndex: "type",
        isManualSort: true,
        key: "type",
        render: value => t(Constants.DEPOSIT_TYPE_NAME[value])
      },
      {
        title: t("Tham chiếu"),
        dataIndex: "type",
        isManualSort: true,
        sorter: true,
        align: "rigth",
        render: (value, record) => {
          
          if ( value === 0 || record.originalVoucherId === 0){
            return ( 
              <span> { t(Constants.DEPOSIT_TYPES[value]) }&nbsp; 
              {
                <a style={{cursor:"pointer"}} href={this.showInfor(value, record)} target="_blank" rel="noopener noreferrer" >{record.code}</a>
                }
              </span>
                );
          } else {
            return ( 
            <span> { Constants.DEPOSIT_TYPES[value] }&nbsp; 
            {
              <a style={{cursor:"pointer"}} href={this.showInfor(value, record)} target="_blank" rel="noopener noreferrer" >{record.originalVoucherCode}</a>
              }
            </span>
              );
          }

        }
      },
      {
        title: t("Giá trị"),
        align:"right",
        dataIndex: "amount",
        isManualSort: true,
        key: "amount",
        render: (value, record) => {
          return ExtendFunction.FormatNumber(Number(value).toFixed(0))
        }
      },
    ];
    return columns
  }
  showInfor = (type,record) => {
    let URL = window.location.origin;
      let path = record.typeIncomeExpense === Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME ? Constants.EDIT_INCOME_CARD_PATH : Constants.EDIT_EXPENSE_CARD_PATH;
      switch (type) {
      case 1:
        return (
          record.originalVoucherId === 0 ? (URL + Constants.EDIT_COLLECT_DEPOSIT_CARD_PATH + '/' + record.id) :
          (URL + path + record.originalVoucherId)
        );

      case 2:
        return (
          record.originalVoucherId === 0 ? (URL +  Constants.EDIT_WITHDRAW_DEPOSIT_CARD_PATH + '/' + record.id) :
          (URL + path + record.originalVoucherId)
        );
        default:
          break;
    }
    
  }
  render() {
    const { t , customerId} = this.props;
    const { dataSource, InputValue } = this.state;
    return (
      
        <CardBody>
          <GridContainer alignItems="center">
            <GridItem>
              <span className="TitleInfoForm">{t("Ngày")}</span>
            </GridItem>
            <GridItem>
              <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                  let dateTime = {start: start, end: end};
                  this.setState({dateTime},() => this.getData(this.props.customerId))
                }}
              />
            </GridItem>
          </GridContainer>
          <div>{t("Số tiền ký gửi còn lại")+": "}<span className="role-label label-fontSize15 label-green">{ExtendFunction.FormatNumber(Number(this.state.totalDeposit).toFixed(0))}</span></div>
          <OhTable
            onRef={ref => (this.tableRef = ref)}
            columns={this.getColums()}
            dataSource={dataSource}
            onChange={(sorter, manualSort) => {
              this.setState(
                {
                  filters: {
                    ...sorter,
                    manualSort
                  },
                },
                () => this.getData(customerId)
              )
            }}
            id={"deposit-customer-table"}
            total={this.state.totaldataSource}
          />
        </CardBody>
      
    );
  }
}

export default withTranslation("translations")(ListDeposit);