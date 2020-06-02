import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import DebtService from 'services/DebtService';
import { withTranslation } from "react-i18next";
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction.js";
import Constants from 'variables/Constants/index.js';
import OhTable from 'components/Oh/OhTable.jsx';
import FormDebt from "./FromDebt.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { notifyError } from "components/Oh/OhUtils.js";
import OhDateTimePicker from 'components/Oh/OhDateTimePicker.jsx';

const propTypes =
{
  visibled: PropTypes.bool,
  type: PropTypes.string,
  data: PropTypes.object,
  classes: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
};

class DebtCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      debt: [],
      filters: {},
      total: 0,
      InputValue: [moment().subtract(1,'years').startOf('day') ,moment().endOf('day')],
      dateTime: {
        start: moment().subtract(1, 'years').startOf('day').valueOf(),
        end: moment().endOf('day').valueOf()
      },
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.visible !== this.props.visible)
      this.setState({
        visible: this.props.visible
      });

  }

  getData = async (customerId) => {
    let { filter, pageSize, pageNumber, sortField, sortOrder, isManualSort, manualFilter } = this.state.filters;
    let { dateTime } = this.state;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    filter = {...filter, createdAt: { "<=": new Date(dateTime.end).getTime(), ">=": new Date(dateTime.start).getTime() }}
    const query = {
      filter: { ...filter, customerId: customerId } || { customerId: customerId },
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let getDebtCards = await DebtService.getDebtCards(query);
    
    if (getDebtCards.status)
      this.setData(getDebtCards.data, getDebtCards.count)
    else notifyError(getDebtCards)
  }

  setData = async (debt, total) => {
    this.setState({
      debt: debt,
      total
    })
  }
  showModalAdd = () => {
    let { debt } =  this.state;
    return (
      <FormDebt
        visibled = { this.props.visibled }
        onCancel = { this.props.onCancel}
        customerId ={ this.props.customerId}
        data = {debt}
        type = {this.props.type}
        onChangeVisible={visible => {
          this.setState({ visible: visible });
          this.getData(this.props.customerId);
        }}
      />
    );
  };

  showInfor = (type,record) => {
    let URL = window.location.origin;

    switch (type) {
      
      case 1:
      case 2:
      case 3:
      return (
          URL + Constants.MANAGE_INVOICE + record.originalVoucherId
      );
      
      case 4:
      case 5:
      case 6:
        return (
          URL + Constants.MANAGE_INVOICE_RETURN + record.originalVoucherId
        );
        

      case 7:
      case 8:
      case 9:
        return (
          URL + Constants.EDIT_IMPORT_CARD_PATH + record.originalVoucherId
        );

      case 10:
      case 11:
      case 12:
        return (
          URL + Constants.EDIT_EXPORT_CARD_PATH + record.originalVoucherId
        );

      case 13:
      case 14:
      case 15:
        return (
          URL + Constants.EDIT_INCOME_CARD_PATH + record.originalVoucherId
        );

      case 16:
      case 17:
      case 18:
        return (
          URL + Constants.EDIT_EXPENSE_CARD_PATH + record.originalVoucherId
        );

      default:
        break;
    }
  }
  render() {
      const {t, customerId} = this.props;
      const { debt, InputValue} = this.state;
      
      let columns = [
      
      {
        title: t("Thời gian"),
        dataIndex: "createdAt",
        isManualSort: true,
        sorter: true,
          render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)
      },
      {
        title: t("Thao tác"),
        dataIndex: "type",
        isManualSort: true,
        sorter: true,
        align: "rigth",
        render: (value, record) => {
          
          if ( value === 0 || value === 19){
            return t(Constants.DEBT_TYPES[value]);
          } else {
            return ( 
            <span> { t(Constants.DEBT_TYPES[value]) }&nbsp; 
            {
              <a style={{cursor:"pointer"}} href={this.showInfor(value, record)} target="_blank" rel="noopener noreferrer">{record.originalVoucherCode}</a>
              }
            </span>
              
              );
          }
        }
      },
      {
        title: t("Giá trị"),
        dataIndex: "changeValue",
        isManualSort: true,
        align:"right",
        sorter: true,
        render: (value, record) => {
          return ExtendFunction.FormatNumber(value);
        }
      },
      {
        title: t("Công nợ còn lại"),
        dataIndex: "remainingValue",
        isManualSort: true,
        align:"right",
        sorter: true,
        render: (value, record) => {
          return ExtendFunction.FormatNumber(value);
          
        }
      }
    ]
   
    return (
      <Fragment>
        {this.props.visibled ? this.showModalAdd() : null}
        <div>
        <GridContainer alignItems="center">
            <GridItem>
              <span className="TitleInfoForm">{t("Thời gian")}</span>
            </GridItem>
            <GridItem>
              <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                  let dateTime = {start: start, end: end};
                  this.setState({dateTime},() => this.getData(this.props.customerId))
                }}
              />
            </GridItem>
          </GridContainer>
          <OhTable
            onRef={ref => (this.tableRef = ref)}
            columns={columns}
            dataSource={debt}
            onChange={(sorter, manualSort) => {
              this.setState(
                {
                  filters: {
                    ...this.state.filters,
                    ...sorter,
                    manualSort
                  },
                },
                () => this.getData(customerId)
              )
            }}
            id={"debt-table"}
            total={this.state.total}
          />
        </div>
      </Fragment>
    );
  }
}
DebtCustomer.propTypes = propTypes;

export default (
  withTranslation("translations")(
    withStyles(theme => ({
    }))(DebtCustomer)
  )
);
