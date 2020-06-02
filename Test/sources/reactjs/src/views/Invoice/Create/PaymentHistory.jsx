import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import OhButton from "components/Oh/OhButton.jsx";
import Constants from 'variables/Constants/';
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";

// multilingual
import { withTranslation } from "react-i18next";
import "date-fns";
import PayForm from './PayForm';

class PaymentHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visiblePayForm: false,
      dataInvoice: {}
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.dataInvoice !== this.props.dataInvoice){
      this.setState({
        dataInvoice: this.props.dataInvoice
      })
    }
  }
  showInfor = (record) => {
    let URL = window.location.origin;
      return (URL + Constants.EDIT_INCOME_CARD_PATH + record.id )
  }

  onCancel = (isUpdate) => {
    this.setState({
      visiblePayForm: false
    }, () => this.props.checkUpdateForm(isUpdate))
  }

  render () {
    const { t, dataEdit, isCanceledCard } = this.props;
    const {dataInvoice} = this.state;

    let newInvoice = {
      totalAmount: Math.round(dataInvoice.totalAmount),
      finalAmount: Math.round(dataInvoice.finalAmount),
      paidAmount: Math.round(dataInvoice.paidAmount),
      discountAmount: Math.round(dataInvoice.discountAmount),
      taxAmount: Math.round(dataInvoice.taxAmount),
      deliveryAmount: Math.round(dataInvoice.deliveryAmount)
    };

    let oldInvoice = {
      totalAmount: Math.round(dataEdit.totalAmount),
      finalAmount: Math.round(dataEdit.finalAmount),
      paidAmount: Math.round(dataEdit.paidAmount),
      discountAmount: Math.round(dataEdit.discountAmount),
      taxAmount: Math.round(dataEdit.taxAmount),
      deliveryAmount: Math.round(dataEdit.deliveryAmount)
    };

    let isShowPayForm = (JSON.stringify(newInvoice) === JSON.stringify(oldInvoice)) && Math.round(dataInvoice.debtAmount) > 0 && !isCanceledCard ;
    return (
      <GridContainer>
        <PayForm
          visiblePayForm = {this.state.visiblePayForm}
          dataInvoice = {dataInvoice}
          onCancel = {(isUpdate) => this.onCancel(isUpdate)}
        />
        <GridItem xs={12}>
          <Card >
            <CardBody xs={12} style={{ padding: 0 }}>
              <GridContainer style={{ width: "100%" , margin: 0 }}>
                <GridItem xs={12} >
                  <FormLabel className="ProductFormAddEdit">
                    <b className = 'HeaderForm'>{t("Lịch sử thanh toán")}</b>
                  </FormLabel>
                </GridItem>
              </GridContainer>
              
              <GridContainer style={{ width: "100%", margin: 0,  }}>
                <GridItem  >
                  <FormLabel className="InfoFormAddEdit">
                    <b className = 'ContentFormPaddingLeft'>{t("Đã thanh toán") + ": "}</b>
                    <b className = 'ContentFormPaddingLeftBlue'>{ExtendFunction.FormatNumber(Math.round(dataInvoice.paidAmount))}</b>
                    {dataInvoice.debtAmount > 0 ?
                    <>
                      <b className = 'ContentFormPaddingLeft' >{t("Còn lại") + ": "}</b>
                      <b className = 'ContentFormPaddingLeftRed'>{ExtendFunction.FormatNumber(Math.round(dataInvoice.debtAmount))}</b>
                    </>
                    : null }
                  </FormLabel>
                </GridItem>
                {isShowPayForm ?
                  <OhButton
                    type="add"
                    onClick={() => this.setState({
                      visiblePayForm: true
                    })}
                    >
                    {t("Thanh toán")}
                  </OhButton>
                : null}
              </GridContainer>

              <GridContainer style={{ width: "100%" , margin: 0 }}>
                <GridItem xs={12} >
                  <FormLabel className="InfoFormAddEdit">
                    <b className = 'HeaderForm'>{t("Chi tiết thanh toán")}</b>
                  </FormLabel>
                </GridItem>
              </GridContainer>
              {dataEdit.incomeCards && dataEdit.incomeCards.length > 0 ? 
                dataEdit.incomeCards.map(item => {
                  if(item.incomeExpenseCardId.status === Constants.INCOME_EXPENSE_STATUS.id.CANCELED) return null
                  return (
                    <GridContainer key={item.incomeExpenseCardId.code} style={{ width: "100%", margin: 0, }}>
                      <GridItem xs={12} >
                        <FormLabel className="InfoFormAddEdit">
                          <b className='ContentFormPaddingLeft'>{moment(item.incomeExpenseCardId.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)}</b>
                          <a style={{cursor:"pointer"}} href={this.showInfor(item.incomeExpenseCardId)} target="_blank" rel="noopener noreferrer" className='link-invoice' >{ item.incomeExpenseCardId.code || ""}</a>
                          <b className='ContentFormPaddingLeft'>{t("Đã thanh toán") + ": " + ExtendFunction.FormatNumber(item.paidAmount)}</b>
                        </FormLabel>
                      </GridItem>
                    </GridContainer>
                  )
                })
                : null}

            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default connect()(
    withTranslation("translations")(
      withStyles(theme => ({
        ...regularFormsStyle
      }))(PaymentHistory)
    )
  );
