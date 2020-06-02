// CODE BY THIEN BAO

import React, { Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import { connect } from "react-redux";
import moment from "moment";
import { Select as SelectAnt, Input } from "antd";
import { withTranslation } from "react-i18next";
import ProductForm from "views/StockTake/Components/ProductForm/ProductForm";
import "react-datepicker/dist/react-datepicker.css";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Constants from 'variables/Constants/';

const { TextArea } = Input;
const { Option } = SelectAnt;

const completePercent = [];
for (let i = 0; i <= 100; i += 5) {
  completePercent.push(i.toString());
}
const styles = {
  label: {
    xs: 4,
    sm: 3,
    md: 2,
    lg: 2
  },
  selectLabel: {
    xs: 4,
    sm: 3,
    md: 2,
    lg: 2
  },
  input: {
    xs: 8,
    sm: 9,
    md: 4,
    lg: 4
  },
  select: {
    xs: 8,
    sm: 9,
    md: 4,
    lg: 4
  },
  checkbox: {
    xs: 12,
    sm: 9,
    md: 1,
    lg: 1
  },
  break: {
    xs: false,
    sm: false,
    md: 6,
    lg: 6
  },
  note: {
    xs: 8,
    sm: 9,
    md: 10,
    lg: 10
  },
  datePicker: {
    xs: 8,
    sm: 9,
    md: 4,
    lg: 4
  }
};

Object.filter = function (obj, predicate) {
  let result = {},
    key;

  for (key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key];
    }
  }

  return result;
};

class FormIssue extends React.Component {
  constructor(props) {
    super(props);
    let defaultFormData = (this.props.defaultFormData && this.props.defaultFormData.formData) ? this.props.defaultFormData.formData : {
      Time: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
      Code: "",
      Amount: "0",
      QtyIn: "0",
      IsReturn: this.props.isReturn ? 1 : 0,
      Notes: "",
      CustomerID: "",
      ...(this.props.isExport && !this.props.isReturn ? { SaleID: "" } : {})
    };
    let defaultProductData = (this.props.defaultFormData && this.props.defaultFormData.productData) ? this.props.defaultFormData.productData : {};

    this.state = {
      formData: defaultFormData,
      productData: defaultProductData,
      productValidation: '',
    };
    this.sendChange();
    this.changeTimeout = null
  }

  componentDidMount = () => {
    if (this.props.getFunction) this.props.getFunction({ clearForm: this.clearForm, clearProductForm: this.clearProductForm });
  };

  onChange = data => {
    let formData = {
      ...this.state.formData,
      ...data
    };
    let splitCode = formData.Code.split("-");

    if (data.Time !== undefined && splitCode[0].length) {
      splitCode[splitCode.length - 1] = moment(data.Time, Constants.DATABASE_DATE_TIME_FORMAT_STRING).format(Constants.CODE_DATE_FORMAT_STRING);
      formData = {
        ...formData,
        Code: splitCode.join("-")
      };
    }

    this.setState(
      {
        formData: formData
      },
      this.sendChange
    );
  };

  validate = () => {
    let { isExport, isReturn, t } = this.props;
    if (
      this.state.formData.Amount.length &&
      this.state.formData.QtyIn.length &&
      this.state.formData.CustomerID.length &&
      (isReturn ||
        (!isExport || (isExport && this.state.formData.SaleID.length)))
    ) {
      if (this.state.productValidation.length)
        return this.state.productValidation;
      return "";
    } else return t("You must fill all the required (*) information");
  };

  getAmount = () => {
    let { productData } = this.state;
    let Amount = 0;

    for (let i in productData) {
      Amount += parseInt(productData[i].Amount);
    }

    return Amount;
  };

  sendChange = () => {
    if (this.changeTimeout) {
      clearTimeout(this.changeTimeout);
      this.changeTimeout = null
    }
    this.changeTimeout = setTimeout(() => this.props.onChange({
      formData: this.state.formData,
      productData: this.state.productData,
      validation: this.validate()
    }), Constants.UPDATE_TIME_OUT);
  };

  render() {
    const {
      classes,
      t,
      onChange,
      Customer_Customer,
      Customer_Manufacturer_Provider,
      SaleMan,
      ProductUnit,
      isExport,
      isReturn,
      type,
      Store,
      Product
    } = this.props;
    const { formData, productData, rowsCount } = this.state;
    let Customer = [];

    if (isExport) {
      if (Customer_Customer.length > 0) Customer = Customer.concat(Customer_Customer);
    } else {
      if (Customer_Manufacturer_Provider.length > 0) Customer = Customer.concat(Customer_Manufacturer_Provider);
    }

    let Amount = this.getAmount();

    return (
      <div>
        <GridContainer className={'Custom-MuiGrid-item'} >
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <ProductForm
              getFunction={(functionList) => {
                this.clearProductForm = functionList.clearForm;
              }}
              isExport={isExport}
              isReturn={isReturn}
              defaultFormData={this.props.defaultFormData}
              onChange={data => {
                let amount = 0;

                for (let i in data.productData) {
                  amount += parseInt(
                    data.productData[i].Amount
                  );
                }

                this.setState(
                  {
                    productData: data.productData,
                    formData: {
                      ...formData,
                      Amount: amount.toString()
                    },
                    productValidation: data.validation
                  },
                  this.sendChange
                );
              }}
              Amount={Amount}
            />
          </GridItem>
        </GridContainer>
        <GridContainer justify="center">
          {this.validate().length ? (<GridItem style={{ color: "red" }}> {t(this.validate())} </GridItem>) : null}
        </GridContainer>
      </div>
    );
  }
}

export default connect()(withTranslation("translations")(withStyles(extendedFormsStyle)(FormIssue)));
