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
import OhLink from "components/Oh/OhLink";

// multilingual
import { withTranslation } from "react-i18next";
import "date-fns";
import PayForm from './PayForm';
import { Link } from "react-router-dom";

class PaymentHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visiblePayForm: false,
      dataPayment: {},
      incomeCards: []
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.dataPayment !== this.props.dataPayment){
      this.setState({
        dataPayment: this.props.dataPayment
      })
    }
  }

  onCancel = (isUpdate) => {
    this.setState({
      visiblePayForm: false
    }, () => this.props.checkUpdateForm(isUpdate))
  }

  render () {
    const { t, isCanceledCard, incomeCards, dataImport, dataEdit } = this.props;
    const {dataPayment} = this.state;
    let newImport = {
      totalAmount: Math.round(dataImport.totalAmount),
      finalAmount: Math.round(dataImport.finalAmount),
      paidAmount: Math.round(dataImport.paidAmount),
      discountAmount: Math.round(dataImport.discountAmount),
      taxAmount: Math.round(dataImport.taxAmount),
      deliveryAmount: Math.round(dataImport.deliveryAmount)
    };

    let oldImport = {
      totalAmount: Math.round(dataEdit.totalAmount),
      finalAmount: Math.round(dataEdit.finalAmount),
      paidAmount: Math.round(dataEdit.paidAmount),
      discountAmount: Math.round(dataEdit.discountAmount),
      taxAmount: Math.round(dataEdit.taxAmount),
      deliveryAmount: Math.round(dataEdit.deliveryAmount)
    };
    let isShowPayForm = (JSON.stringify(newImport) === JSON.stringify(oldImport)) && dataPayment.debtAmount > 0 && !isCanceledCard ;
    return (
      <>
        <PayForm
          visiblePayForm = {this.state.visiblePayForm}
          dataPayment = {dataPayment}
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
                    <b className = 'ContentFormPaddingLeftBlue'>{ExtendFunction.FormatNumber(dataPayment.paidAmount)}</b>
                    {dataPayment.debtAmount > 0 ? 
                    <>
                      <b className = 'ContentFormPaddingLeft' >{t("Còn lại") + ": "}</b>
                      <b className = 'ContentFormPaddingLeftRed'>{ExtendFunction.FormatNumber(dataPayment.debtAmount)}</b>
                    </>
                    : null }
                  </FormLabel>
                </GridItem>
                {isShowPayForm  ?
                  <OhButton
                    type="add"
                    onClick={() => this.setState({
                      visiblePayForm: true
                    })}
                    >
                    {("Thanh toán")}
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
              {incomeCards && incomeCards.length > 0 ? 
                incomeCards.map(item => {
                  if(item.incomeExpenseCardId.status === Constants.INCOME_EXPENSE_STATUS.id.CANCELED) return null
                  return (
                    <GridContainer style={{ width: "100%", margin: 0, }}>
                      <GridItem xs={12} >
                        <FormLabel className="InfoFormAddEdit">
                          <b className='ContentFormPaddingLeft'>{moment(item.incomeExpenseCardId.incomeExpenseAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)}</b>
                          <Link
                            target="_blank"
                            linkTo={Constants.EDIT_INCOME_CARD_PATH + item.incomeExpenseCardId.id}
                            className={'link-invoice'}
                          >{item.incomeExpenseCardId.code}</Link>
                          <b className='ContentFormPaddingLeft'>{t("Đã thanh toán") + ": " + ExtendFunction.FormatNumber(Math.round(item.paidAmount))}</b>
                        </FormLabel>
                      </GridItem>
                    </GridContainer>
                  )
                })
                : null}

            </CardBody>
          </Card>
        </GridItem>
      </>
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
