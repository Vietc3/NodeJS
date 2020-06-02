import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import moment from "moment";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import Constants from "variables/Constants/";
import OhForm from "components/Oh/OhForm";

class InvoiceReturnForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invoiveReturns: {},
      today: false,
      InvoiReturnForm: {
        importedAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        status: 1,
        userName: this.props.currentUser.fullName,
      },

    };
  }
  componentDidUpdate = (prevProps) =>{
    if ( JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data) ) {
      this.setData();
    }
  }

  setData = () => {
    let dataSource = this.props.data || {};
    
    this.setState({
      InvoiReturnForm: {...dataSource },
    });
  };

  onChange = obj => {
    this.setState(
      {
        InvoiReturnForm: {
          ...this.state.InvoiReturnForm,
          ...obj
        }
      },
      () => this.props.getInvoiceReturnInfo(this.state.InvoiReturnForm)
    );
  };

  render() {
    const { t, isCancel } = this.props;
    const { InvoiReturnForm } = this.state;

    let column = [
      {
        name: "code",
        label: t("Mã phiếu"),
        ohtype: "input",
        placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
        disabled: true
      },
      {
        name: "importedAt",
        label: t("Ngày trả"),
        ohtype: "date-picker",
        formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
      },
      {
        name: "userName",
        label: t("Người tạo"),
        ohtype: "label"
      },
      {
        name: "notes",
        label: t("Ghi chú"),
        ohtype: "textarea",
        minRows: 2,
        maxRows: 3,
        disabled: isCancel
      },
    ]
    
    return (
      <>
        <OhForm
          title= {t("Thông tin trả hàng")}
          defaultFormData={InvoiReturnForm}
          onRef={ref => this.ohFormInvoiceReturnRef = ref}
          onChange={obj => this.onChange(obj)}
          columns={[column]}
          tag={InvoiReturnForm.status === Constants.INVOICE_RETURN_CARD_STATUS.CANCELLED ? t("Đã hủy") : null}
        />
      </>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user
  };
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(InvoiceReturnForm)
  )
);
