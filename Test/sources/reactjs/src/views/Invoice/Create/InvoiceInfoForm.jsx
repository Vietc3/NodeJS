import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

// multilingual
import { withTranslation } from "react-i18next";
import Constants from 'variables/Constants/';
import "date-fns";
import moment from "moment";
import _ from "lodash";
import OhForm from 'components/Oh/OhForm';

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceInfo: {
        invoiceAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING)
      },
    };

  }

  componentDidUpdate = (prevProps, prevState) => {
    const { dataEdit } = this.props;
    if (prevProps.dataEdit !== dataEdit && dataEdit)
      this.setState({
        invoiceInfo: {
          code: dataEdit.code,
          notes: dataEdit.notes,
          invoiceAt: dataEdit.invoiceAt
        }
      })
  }

  onChange = (value) => {

    if (value["code"]){      
      value["code"] = value["code"].trim();
    }    

    this.setState({
      invoiceInfo: value
    }, () => this.props.sendInvoiceInfo(this.state.invoiceInfo))
  }

  render() {
    const { t, dataEdit, isEdit, currentUser, isCanceledCard, isReturn } = this.props;    
    const { invoiceInfo } = this.state
    let sale = isEdit ? (dataEdit.createdBy || {}).fullName : currentUser.user.fullName;

    return (
      <GridItem float='right' xs={12} sm={12} md={6} lg={6}>
        <Card className = 'invoice-info-card' style={{height: "100%"}}>
          <CardBody xs={12} style={{ padding: 0 }}>
            <OhForm
              title={t("Thông tin đơn hàng")}
              defaultFormData={ _.extend(invoiceInfo, {sale}) }
              onRef={ref => this.ohFormRef = ref}
              tag={isCanceledCard ? Constants.INVOICE_STATUS.name[dataEdit.status] : null}
              columns={[
                [
                  {
                    name: "code",
                    label: t("Mã đơn hàng"),
                    ohtype: "input",
                    disabled: true,
                    placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
                  },
                  {
                    name: "sale",
                    label: t("Người tạo"),
                    ohtype: "label",
                  },
                  {
                    name: "invoiceAt",
                    label: t("Ngày bán"),
                    ohtype: "date-picker",
                    formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
                  },
                  {
                    name: "notes",
                    label: t("Ghi chú"),
                    ohtype: isCanceledCard ? "label" : "textarea",
                    minRows: 2,
                    maxRows: 2
                  },
                ],
              ]}
              onChange={value => {
                this.onChange(value);
              }}
            />
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default connect(function(state) {
  return ({
    currentUser: state.userReducer.currentUser
  });
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProductForm)
  )
);
