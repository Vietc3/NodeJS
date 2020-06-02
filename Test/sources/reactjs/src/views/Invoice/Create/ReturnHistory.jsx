import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

// multilingual
import { withTranslation } from "react-i18next";
import Constants from 'variables/Constants/';
import "date-fns";
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";

class CreateInvoice extends React.Component {
  showInfor = (item) => {
    const { cardType } = this.props;
    let URL = window.location.origin;
    
      return (URL + (cardType === Constants.PRINT_TEMPLATE_NAME.INVOICE_RETURN ?
        "/admin/update-invoice-return/" :
        "/admin/edit-export-card/")
       + item.id )
  }
  render() {
    const { t, dataReturn } = this.props;
    return (
        <GridItem xs={12}>
          <Card >
            <CardBody >
              <GridContainer style={{ width: "100%" ,  }}>
                <GridItem xs={12} >
                  <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
                    <b className = 'HeaderForm'>{t("Lịch sử trả hàng")}</b>
                  </FormLabel>
                </GridItem>
              </GridContainer>
              {dataReturn.length > 0 ? 
                dataReturn.map(item => {
                  return(
                  <GridContainer style={{ width: "100%",   }}>
                    <GridItem xs={12}>
                      <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
                        <b className = 'ContentFormPaddingLeft'>{moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)}</b>
                        <a style={{cursor:"pointer"}} href={this.showInfor(item)} target="_blank" rel="noopener noreferrer" className='link-invoice' >{ item.code || ""}</a>
                        <b className = 'ContentFormPaddingLeft'>{t("Đã thanh toán") + ": " + ExtendFunction.FormatNumber(item.paidAmount || 0) }</b>
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                )})
                :
                <GridContainer style={{ width: "100%", }}>
                  <GridItem xs={12} >
                    <FormLabel className="ProductFormAddEdit" style={{ margin: 0}}>
                      <b className = 'ContentFormPaddingLeft' >{t("Chưa có lịch sử trả hàng")}</b>
                    </FormLabel>
                    
                  </GridItem>
                </GridContainer>
              }
            </CardBody>
          </Card>
        </GridItem>
    );
  }
}

export default connect()(
    withTranslation("translations")(
      withStyles(theme => ({
        ...regularFormsStyle
      }))(CreateInvoice)
    )
  );
