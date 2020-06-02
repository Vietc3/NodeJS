import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

// multilingual
import { withTranslation } from "react-i18next";
import Constants from 'variables/Constants/';
import "date-fns";
import OhForm from "components/Oh/OhForm";
import CustomerService from "services/CustomerService";
import ExtendFunction from "lib/ExtendFunction";


class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    let {dataInvoice} = this.props;    
    this.state = {
      formData: {
        payType: dataInvoice.payType === undefined ? Constants.INVOICE_PAYMENT_TYPES.id.cash : dataInvoice.payType,
        payAmount: dataInvoice.finalAmount === undefined ? 0 : dataInvoice.finalAmount,
        isGetDeposit: dataInvoice.isGetDeposit === undefined ? [] : dataInvoice.isGetDeposit,
        depositAmount: dataInvoice.depositAmount === undefined ? 0 : dataInvoice.depositAmount,
        isPayLater: dataInvoice.isPayLater === undefined ? [] : dataInvoice.isPayLater,
        incomeExpenseAt: new Date().getTime(),
        noteIncomeExpense: dataInvoice.noteIncomeExpense === undefined ? "" : dataInvoice.noteIncomeExpense,
      },
      totalDeposit: 0,
      prevIsGetDeposit: false,
      prevIsPayLater: true
    };
    this.props.onRef(this);
  }
  
  componentWillMount = () => {
    this.props.onChange(this.state.formData)
    if(this.props.isCreateIncome) {
      this.getPayAmount(this.props.dataInvoice.debtAmount);
      this.getDeposit();
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if(this.props.dataInvoice && this.props.dataInvoice.customerId && 
      this.props.dataInvoice.customerId !== prevProps.dataInvoice.customerId){
      this.getDeposit();
    }

    if(this.props.dataInvoice && this.props.dataInvoice.finalAmount !== prevProps.dataInvoice.finalAmount
      && (!this.state.formData.isPayLater || (this.state.formData.isPayLater && this.state.formData.isPayLater.length === 0))){
      this.getPayAmount(this.props.dataInvoice.finalAmount);
    }
    
  }

  getPayAmount = (value) => {
    this.setState({
      formData: {
        ...this.state.formData,
        payAmount: value
      },
    }, () => this.props.onChange(this.state.formData))
  }

  getDeposit = async () => {
    if(this.props.dataInvoice.customerId){
      let getCustomer = await CustomerService.getCustomer(this.props.dataInvoice.customerId);
      
      if (getCustomer.status)
        this.setState({
          totalDeposit: getCustomer.data.totalDeposit
        })
    }
  }

  onChange = async (value) => {
    if(value.isPayLater.length > 0) {
      value.isGetDeposit = [];
      value.payAmount = 0;
      value.depositAmount = 0;
      this.setState({
        prevIsPayLater: false
      })
    }
    else {
      if(this.state.prevIsPayLater === false){
        value.payAmount = this.props.dataInvoice.finalAmount;
        this.setState({
          prevIsPayLater: true
        })
      }

      if(value.isGetDeposit.length === 0) {
        value.depositAmount = 0;
        this.setState({
          prevIsGetDeposit: false
        })
      }

      else{
        if(this.state.prevIsGetDeposit === false){
          if(value.payAmount > this.state.totalDeposit) {
            value.depositAmount = this.state.totalDeposit;
          }
          else {
            value.depositAmount = value.payAmount;
          }
          this.setState({
            prevIsGetDeposit: true
          })
        }
      }
    }

    if(value.payAmount === "")
      value.payAmount = 0;

    if(value.depositAmount === "")
      value.depositAmount = 0;

    if(value.incomeExpenseAt === "0")
      value.incomeExpenseAt = new Date().getTime();
      
      ;
      
    this.setState({
      formData: value
    }, () => this.props.onChange(this.state.formData, value.isPayLater.length > 0 ? true : false))
  }

  getColumns = () => {
    const { t, visiblePayForm, dataInvoice } = this.props;
    const { formData, totalDeposit } = this.state;
    let maxGetDeposit = formData.payAmount > totalDeposit ? totalDeposit : formData.payAmount;
    let columns = [
      [
        {
          name: t("isPayLater"),
          ohtype: visiblePayForm ? null : "checkbox",
          options: [{ value: 1, label: t("Thanh toán sau") }],
        },
        {
          name: "incomeExpenseAt",
          label: t("Ngày thu"),
          ohtype: "date-picker",
          validation: "required",
          showTime: true,
          formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
          disabled: formData.isPayLater && formData.isPayLater[0]
        },
        {
          name: "payAmount",
          label: t("Số tiền"),
          ohtype: "input-number",
          validation: `max:${visiblePayForm ? dataInvoice.debtAmount : dataInvoice.finalAmount},num`,
          message: t("Số tiền thanh toán không thể lớn hơn số tiền phải thanh toán"),
          isDecimal:false,
          isNegative:false,
          disabled: formData.payType === Constants.INVOICE_PAYMENT_TYPES.id.debt || (formData.isPayLater && formData.isPayLater[0]),
          integer: Constants.MAX_LENGTH_NUMBER_INPUT,
        },
        {
          name: t("isGetDeposit"),
          ohtype: totalDeposit > 0 ? "checkbox" : null,
          options: [{ value: 1, label: t("Lấy từ tiền ký gửi (số dư {{amount}})", {amount: ExtendFunction.FormatNumber(totalDeposit)}) }],
          disabled: formData.isPayLater && formData.isPayLater[0]
        },
        {
          name: t("depositAmount"),
          ohtype: totalDeposit > 0 ? "input-number" : null,
          validation: `max:${maxGetDeposit},num`,
          message: t("Không thể sử dụng nhiều hơn tiền ký gửi hiện có hoặc số tiền cần phải thanh toán"),
          disabled: formData.isGetDeposit && formData.isGetDeposit[0] ? false : true,
          isDecimal:false,
          isNegative:false,
          integer: Constants.MAX_LENGTH_NUMBER_INPUT,
        },
        {
          name: "noteIncomeExpense",
          label: t("Ghi chú"),
          ohtype: "textarea",
          minRows: 2,
          maxRows: 2
        },
      ],
      []
    ];
    if(visiblePayForm)
      columns.splice(1,1);
    return columns;
  }

  render() {
    const { t } = this.props;
    const { formData } = this.state;
    return (
      <OhForm
        title={t("Thanh toán nhanh")}
        defaultFormData={ formData }
        onRef={ref => this.ohFormRef = ref}
        columns={this.getColumns()}
        onChange={value => {
          this.onChange(value);
        }}
      />
    );
  }
}

export default connect()(
    withTranslation("translations")(
      withStyles(theme => ({
        ...regularFormsStyle
      }))(ProductForm)
    )
  );
