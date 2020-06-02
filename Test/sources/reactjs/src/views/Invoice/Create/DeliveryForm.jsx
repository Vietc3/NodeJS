import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

// multilingual
import { withTranslation } from "react-i18next";
import Constants from 'variables/Constants/';
import "date-fns";
import OhForm from "components/Oh/OhForm";


class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    let {dataInvoice} = this.props;
    this.state = {
      formData: {
        deliveryType: dataInvoice.deliveryType === undefined ? Constants.INVOICE_PAYMENT_TYPES.id.cash : dataInvoice.deliveryType,
      }
    };
  }
  
  componentWillMount = () => {
    this.props.onChange(this.state.formData)
  }

  onChange = (value) => {
    this.setState({
      formData: value
    }, () => this.props.onChange(this.state.formData))
  }

  render() {
    const { t } = this.props;
    const { formData } = this.state;

    return (
      <OhForm
        title={t("Giao hàng")}
        defaultFormData={ formData }
        onRef={ref => this.ohFormRef = ref}
        columns={[
          [
            {
              name: "deliveryType",
              label: t("Hình thức giao hàng"),
              ohtype: "select",
              validation: "required",
              options: Constants.DELIVERY_TYPES.arr.map(item => ({value: item.id, title: item.name, data: item})),
            }
          ],
          []
        ]}
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
