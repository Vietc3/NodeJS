
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import Constants from "variables/Constants";
import OhForm from "components/Oh/OhForm";

const propTypes = {
  data: PropTypes.object,
  type: PropTypes.string
};

class InvoiceInfoForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invoices: [],
      InvoiceForm: {},
    };
  }

  componentDidUpdate = prevProps => {
    let { dataAdd } = this.props;
    if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.setData();
    }
    if (prevProps.dataAdd !== dataAdd && dataAdd) {
      this.setData();
    }
  };

  setData = () => {
    let dataSource = this.props.dataAdd ? this.props.dataAdd : (this.props.data || {});
    this.setState({
      InvoiceForm: {
        ...dataSource, 
        customerName: dataSource.customerId && dataSource.customerId.name ? dataSource.customerId.name : "",
        customerTel: dataSource.customerId && dataSource.customerId.tel ? dataSource.customerId.tel : "",
        customerAddress: dataSource.customerId && dataSource.customerId.address ?  dataSource.customerId.address : ""
      },
    }, () => this.props.onChangeInvoiceInfo(this.state.InvoiceForm));
  };

  handleOpen = (id) => {
    return window.location.origin + Constants.MANAGE_INVOICE + id
  }

  render() {
    const { t } = this.props;
    const { InvoiceForm } = this.state;

    let column = [
      {
        name: "code",
        label: t("Mã đơn hàng"),
        ohtype: "label",
        format: value => <a href={this.handleOpen(InvoiceForm.id)} target="_blank" rel="noopener noreferrer">{value}</a>
      },
      {
        name: "invoiceAt",
        label: t("Ngày bán"),
        ohtype: "label",
        format: value => value ? moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) : ""
      },
      {
        name: "customerName",
        label: t("Khách hàng"),
        ohtype: "label",        
      },
      {
        name: "customerTel",
        label: t("Số điện thoại"),
        ohtype: "label",        
      },
      {
        name: "customerAddress",
        label: t("Địa chỉ"),
        ohtype: "label",        
      }
    ]

    return (
      <>        
        <OhForm
          title= {t("Thông tin đơn hàng")}
          defaultFormData={InvoiceForm}
          onRef={ref => this.ohFormInvoiceRef = ref}
          columns={[column]}
        />
      </>
    );
  }
}
InvoiceInfoForm.propTypes = propTypes;

export default connect()(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(InvoiceInfoForm)
  )
);
