import { Modal } from "antd";
import React from "react";
// multilingual
import { withTranslation } from "react-i18next";
import Constants from "variables/Constants/index";
import OhToolbar from "components/Oh/OhToolbar";
import {  MdSave, MdCancel } from "react-icons/md";
import PaymentForm from "./PaymentForm";
import moment from 'moment';
import IncomeExpenseService from 'services/IncomeExpenseService';
import { notifySuccess, notifyError } from "components/Oh/OhUtils";

class IncomeExpenseTypeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payAmount: 0,
      depositAmount: 0,
      dataPayment: {},
      isPay: false,
      noteIncomeExpense: ''
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.dataPayment !== prevProps.dataPayment) {
      this.setState({
        dataPayment: this.props.dataPayment,
        payAmount: this.props.dataPayment.debtAmount
      })
    }
  }

  handleSubmit = async () => {
    const {dataPayment, t, visiblePayForm} = this.props;
    if(visiblePayForm && !this.state.payAmount){
      notifyError(t("Số tiền thanh toán phải lớn hơn 0"))
    }
    else {
      if(this.paymentFormRef.ohFormRef.allValid()){
        this.setState({
          isPay: true
        })
        let dataExpense = {
          incomeExpenseAt: this.state.incomeExpenseAt || moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
          notes: this.state.noteIncomeExpense,
          customerId: dataPayment.customerId,
          incomeExpenseCardTypeId: Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN,
          paymentDetail: [{
            cardId: dataPayment.cardID,
            payAmount: Number(this.state.payAmount)
          }],
          depositAmount: Number(this.state.depositAmount),
          customerType: Constants.CUSTOMER_TYPE.TYPE_CUSTOMER
        }
        let createdExpense = await IncomeExpenseService.saveExpenseCard(dataExpense);
        if(createdExpense.status){
          notifySuccess(t("Tạo phiếu thu thành công"));
          this.props.onCancel(true)
          this.setState({
            isPay: false
          })
        }
        else {
          notifyError(t(createdExpense.message));
          this.setState({
            isPay: false
          })
        }
      }
    }
  }

  render() {
    const { t, visiblePayForm } = this.props;
    const { title, dataPayment } = this.state;
    return (
      <>
        {this.state.br}
        {this.state.brerror}
        {visiblePayForm ? (
          <Modal
            title={t(title)}
            visible={visiblePayForm}
            onCancel ={() => this.props.onCancel()}
            width={600}
            footer={[
              <OhToolbar
                right={[
                  {
                    type: "button" ,
                    label: t("Thanh toán"),
                    onClick:() => this.handleSubmit(),
                    icon: <MdSave/>,
                    typeButton:"add",
                    simple: true,
                    permission:{
                      name: Constants.PERMISSION_NAME.INCOME_EXPENSE,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    },
                    disabled: this.state.isPay
                  },
                  {
                    type: "button",
                    label: t("Hủy"),
                    onClick: () => this.props.onCancel(),
                    icon: <MdCancel />,
                    typeButton:"exit",
                    simple: true,
                    permission:{
                      name: Constants.PERMISSION_NAME.INCOME_EXPENSE,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    },
                  },
                ]} 
              />
            ]}
          >
            <PaymentForm
              finalAmount={dataPayment.debtAmount || 0}
              noteIncomeExpense={dataPayment.noteIncomeExpense || ''}
              customerId={dataPayment.customerId || null}
              onRef={ref => (this.paymentFormRef = ref)}
              visiblePayForm = {visiblePayForm}
              onChange={(formData) => {
                this.setState({
                  payAmount: formData.payAmount,
                  depositAmount: formData.depositAmount,
                  incomeExpenseAt: formData.incomeExpenseAt,
                  noteIncomeExpense: formData.noteIncomeExpense
                })
              }}
            />
          </Modal>
        ) : null}
      </>
    );
  }
}

export default withTranslation("translations")(
  IncomeExpenseTypeForm
);
