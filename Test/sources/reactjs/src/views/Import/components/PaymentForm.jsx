import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

// multilingual
import { withTranslation } from "react-i18next";
import "date-fns";
import OhForm from "components/Oh/OhForm";
import ExtendFunction from "lib/ExtendFunction";
import CustomerService from "services/CustomerService";
import Constants from 'variables/Constants/';


class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    let { finalAmount, depositAmount, customerId, noteIncomeExpense } = this.props;
    this.state = {
      formData: {
        payAmount: finalAmount ? finalAmount : 0,
        isGetDeposit: [],
        depositAmount: depositAmount ? depositAmount : 0,
        isPayLater: [],
        incomeExpenseAt: new Date().getTime(),
        noteIncomeExpense: noteIncomeExpense ? noteIncomeExpense  : '',
      },
      totalDeposit: 0,
      prevIsGetDeposit: false,
      prevIsPayLater: true
    };
    this.props.onChange(this.state.formData)
    this.props.onRef(this);
    if(customerId) {
      this.getDeposit(customerId)
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.finalAmount !== prevProps.finalAmount
      && (!this.state.formData.isPayLater || (this.state.formData.isPayLater && this.state.formData.isPayLater.length === 0))) {
      this.setState({
        formData: {
          ...this.state.formData,
          payAmount: this.props.finalAmount
        },
      })
    }
    if (this.props.customerId !== prevProps.customerId && this.props.customerId ){
      this.getDeposit(this.props.customerId);
    }
  }

  getDeposit = async (customerId) => {
    let getCustomer = await CustomerService.getSupplier(customerId);
    if(getCustomer.status)
      this.setState({
        totalDeposit: getCustomer.data.totalDeposit
      })
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
        value.payAmount = this.props.finalAmount;
        this.setState({
          prevIsPayLater: true
        })
      }
      
      if(value.isGetDeposit.length === 0) {
        this.setState({
          prevIsGetDeposit: false
        })
        value.depositAmount = 0;
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
      
    this.setState({
      formData: value
    }, () => this.props.onChange(this.state.formData, value.isPayLater.length > 0 ? true : false))
  }

  getColumns = () => {
    const { t, visiblePayForm, finalAmount } = this.props;
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
          label: t("Ngày chi"),
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
          isDecimal:false,
          isNegative:false,
          validation: `max:${finalAmount},num`,
          message: t("Số tiền thanh toán không thể lớn hơn số tiền phải thanh toán"),
          disabled: formData.isPayLater && formData.isPayLater[0],
          integer: Constants.MAX_LENGTH_NUMBER_INPUT,
        },
        {
          name: t("isGetDeposit"),
          ohtype: totalDeposit > 0 ? "checkbox" : null,
          options: [{ value: 1, label: t("Lấy từ tiền ký gửi (số dư {{amount}})", {amount: ExtendFunction.FormatNumber(totalDeposit)}) }],
          disabled: formData.isPayLater && formData.isPayLater[0],
        },
        {
          name: t("depositAmount"),
          ohtype: totalDeposit > 0 ? "input-number" : null,
          isDecimal:false,
          isNegative:false,
          validation: `max:${maxGetDeposit},num`,
          message: t("Không thể sử dụng nhiều hơn tiền ký gửi hiện có hoặc số tiền cần phải thanh toán"),
          disabled: formData.isGetDeposit && formData.isGetDeposit[0] ? false : true,
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
    if (visiblePayForm)
      columns.splice(1, 1);
    return columns;
  }

  render() {
    const { t } = this.props;
    const { formData } = this.state;
    return (
      <OhForm
        title={t("Lịch sử thanh toán")}
        defaultFormData={formData}
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
