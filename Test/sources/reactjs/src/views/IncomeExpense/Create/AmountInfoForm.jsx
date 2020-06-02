import OhForm from 'components/Oh/OhForm';
import "date-fns";
import React from "react";
import Constants from "variables/Constants/";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ExtendFunction from 'lib/ExtendFunction';
import { withTranslation } from "react-i18next";

class AmountInfoForm extends React.Component {
  constructor(props) {
    super(props);
    let defaultValue = this.props.defaultValue || {};
    this.state = {
      formData: {
        paymentType: defaultValue.paymentType || Constants.PAYMENT_TYPES[0].id,
        amount: defaultValue.amount || '0',
        depositAmount: defaultValue.depositAmount || '0',
        isGetDeposit: (defaultValue.depositAmount || 0) > 0 ? [1] : []
      },
      prevIsGetDeposit: false,
    };
    if(this.props.onRef) this.props.onRef(this);

    this.sendChange(false);
  }

  onChange = obj => {
    let { customerInfo, isEdit, defaultValue } = this.props;
    
    let maxDepositAmount = (customerInfo && customerInfo.totalDeposit) ? customerInfo.totalDeposit : 0;

    if(isEdit && defaultValue) {
      maxDepositAmount = maxDepositAmount + (defaultValue.depositAmount + (defaultValue.customerId && defaultValue.customerId.totalDeposit ? defaultValue.customerId.totalDeposit : 0 ) || 0);
    }

    if(obj.isGetDeposit.length === 0){
      obj.depositAmount = 0;
      this.setState({
        prevIsGetDeposit: false
      })
    }
    else{
      if(this.state.prevIsGetDeposit === false){
        if(obj.amount > maxDepositAmount) {
          obj.depositAmount = maxDepositAmount;
        }
        else {
          obj.depositAmount = obj.amount;
        }
        
        this.setState({
          prevIsGetDeposit: true
        })
      }
    }
    let formData = {
      ...this.state.formData,
      ...obj
    };

    this.setState(
      {
        formData: formData
      }, () => this.sendChange(true)
    );
  };
  
  sendChange = (isInputAmount) => {
    if(this.props.onChange) this.props.onChange({
      ...this.state.formData,
      ...(this.state.formData.isGetDeposit && this.state.formData.isGetDeposit.length ? {} : {depositAmount: 0})
    }, isInputAmount)
  }

  componentDidMount = () => {
  }

  componentDidUpdate = (prevProps, prevState) => {
    let prevSumAmount = 0;
    let SumAmount = 0;
    let arrayPrev = prevProps.cardList.paymentDetail || [];
    arrayPrev.forEach(item => prevSumAmount += isNaN(parseInt(item.payAmount)) ? 0 : parseInt(item.payAmount));

    let arrProps = this.props.cardList.paymentDetail || [];
    arrProps.forEach(item => SumAmount += isNaN(parseInt(item.payAmount)) ? 0 : parseInt(item.payAmount))
    if(prevSumAmount !== SumAmount) {
      let {formData} = this.state;
      this.setState({
        formData: {
          ...formData,
          amount: SumAmount,
          depositAmount: formData.isGetDeposit && formData.isGetDeposit[0] ? formData.depositAmount : 0
        },
      }, () => this.sendChange(false));
    }
    
    if(this.props.isEdit && this.props.defaultValue !== prevProps.defaultValue){
      const {defaultValue} = this.props;
      this.setState({
        formData: {
          paymentType: defaultValue.paymentType,
          amount: defaultValue.amount,
          depositAmount: defaultValue.depositAmount,
          isGetDeposit: defaultValue.depositAmount > 0 ? [1] : []
        },
        prevIsGetDeposit: defaultValue.depositAmount > 0 ? true : false
      }, () => this.sendChange(false))
    }
  }

  getColumns = () => {
    const { t, isCancel, customerInfo, isEdit, defaultValue, commonInfo } = this.props;
    const { incomeExpenseCardTypeId, type, customerType } = commonInfo;
    const { formData } = this.state;
    let maxDepositAmount = (customerInfo && customerInfo.totalDeposit) ? customerInfo.totalDeposit : 0;
    if(isEdit && defaultValue && !isCancel) {
      maxDepositAmount = maxDepositAmount + (defaultValue.depositAmount + (defaultValue.customerId && defaultValue.customerId.totalDeposit ? defaultValue.customerId.totalDeposit : 0 ) || 0);
    }
    let columns = [
      [
        {
          name: t("amount"),
          label: t("Tổng giá trị"),
          ohtype: "input-number",
          validation: "required|not_in:0",
          disabled: isCancel,
          isDecimal: false,
          rowClassName: 'amount-input'
        },
        {
          name: "isGetDeposit",
          ohtype: (maxDepositAmount <= 0 
            || (incomeExpenseCardTypeId && incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN)
            || (incomeExpenseCardTypeId && incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN)
            || (type === Constants.INCOME_EXPENSE_TYPE.TYPE_EXPENSE && customerType && customerType === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER)
            || (type === Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME && customerType && customerType === Constants.CUSTOMER_TYPE.TYPE_SUPPLIER)) 
            ? null : "checkbox",
          options: [{ value: 1, label: t("Lấy từ tiền ký gửi") + " (" + t("số dư") + ": " + ExtendFunction.FormatNumber(maxDepositAmount) + ')' }],
          disabled: isCancel
        },
        {
          name: "depositAmount",
          ohtype: (maxDepositAmount <= 0 
            || (incomeExpenseCardTypeId && incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN)
            || (incomeExpenseCardTypeId && incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN)
            || (type === Constants.INCOME_EXPENSE_TYPE.TYPE_EXPENSE && customerType && customerType === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER)
            || (type === Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME && customerType && customerType === Constants.CUSTOMER_TYPE.TYPE_SUPPLIER)) 
            ? null : "input-number",
          rowClassName: 'amount-input',
          validation: formData.isGetDeposit[0] === 1 ? `integer|max:${maxDepositAmount},num|max:${formData.amount},num` : "integer|min:0,num",
          disabled: !isCancel && (formData.isGetDeposit && formData.isGetDeposit[0]) ? false : true,
          isDecimal: false,
        },
      ],
    ]

    return columns;
  }

  render() {
    const { formData } = this.state;
    const { t } = this.props;
    return (
      <GridItem xs={12}>
        <Card>
          <CardBody xs={12} style={{ padding: 0 }}>
            <GridContainer>
              <GridItem xs={12} md={6}>
                <OhForm
                  title={t("Giá trị ghi nhận")}
                  defaultFormData={formData}
                  onRef={ref => this.ohFormRef = ref}
                  columns={this.getColumns()}
                  onChange={value => {
                    this.onChange(value);
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default withTranslation("translations")(AmountInfoForm)
