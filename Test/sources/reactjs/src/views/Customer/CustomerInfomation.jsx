import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import 'date-fns';
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import OhForm from "components/Oh/OhForm";
import Constants from 'variables/Constants';

const propTypes =
{
  type: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.object,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  customerType: PropTypes.array,
};

class CreateCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {},
      textAddError: "",
      alert: null,
      inputName: "",
      inputCode: "",
      inputTaxCode: "",
      inputAddress: "",
      inputRepName: "",
      inputNotes: "",
      inputEmail: "",
      selectGender: "Nam",
      inputCheck: true,
      visible: this.props.visible,
      br: null,
      brerror: null,
      value: 0,
      type: 1,
      display: "",
      isNotEdit: false
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (JSON.stringify(prevProps.customer) !== JSON.stringify(this.props.customer) && this.props.customer) {
      let gender;
      if (this.props.customer.gender === "Nam")
        gender = "0"
      else if (this.props.customer.gender === "Nữ")
        gender = "1"
      else gender = "2"
      this.setState({
        customer: { ...this.props.customer },
        isNotEdit: true
      }, () => this.onChange(this.state.customer));
    }
  }

  onChange = obj => {
    let gender;
    if(obj.gender !== undefined && obj.gender.toString().length && isNaN(obj.gender) === false)
      gender = Constants.OPTIONS_GENDER[obj.gender].value
    else
      gender = obj.gender

    if (obj["code"]){      
      obj["code"] = obj["code"].trim();      
    }

    let customer = {
      ...this.state.customer,
      ...obj,
      gender: gender
    };

    this.setState({ customer }, () => this.props.onChangeCustomer(customer, this.ohFormRef));
  };

  render() {
    const { t, display, readOnly } = this.props;
    const { customer } = this.state;
    const customerType = customer.type === 1 ? t("Khách hàng").toLowerCase() : t("Nhà cung cấp").toLowerCase();

    const column1 = [
      {
        name: "name",
        label: t("Tên"),
        ohtype: "input",
        readOnly: readOnly,
        validation: "required|max:150,string",
        message: t("Vui lòng điền tên {{type}}", { type: t(customerType) }),
        helpText: t("Tên {{type}} tương ứng mã {{type}}", { type: t(customerType) })
      },
      {
        name: "code",
        label: t("Mã"),
        ohtype: "input",
        readOnly: readOnly,
        placeholder: t("Mã {{type}} được sinh tự động", { type: t(customerType) }),
        helpText: t("Mã {{type}} là thông tin duy nhất", { type: t(customerType) })
      },
      {
        name: "email",
        label: t("Email"),
        ohtype: "input",
        readOnly: readOnly,
        helpText: t("Email {{type}}", { type: t(customerType) }),
        validation: "email",
      },
      {
        name: "address",
        label: t("Địa chỉ"),
        ohtype: "textarea",
        validation: "max:250,string",
        readOnly: readOnly,
        minRows: 4,
        maxRows: 6,
        helpText: t("Địa chỉ {{type}}", { type: t(customerType) })
      }
    ];

    const column2 = [
      display ? null :
        {
          name: "gender",
          label: t("Giới tính"),
          ohtype: "select",
          readOnly: readOnly,
          options: Constants.OPTIONS_GENDER.map(item => ({...item, title: t(item.title)})),
          helpText: t("Giới tính {{type}}", { type: t(customerType) })
        },
      {
          name: "tel",
          label: t("Điện thoại"),
          ohtype: "input",
          readOnly: readOnly,
          helpText: t("Số điện thoại {{type}}", { type: t(customerType) })
        },
      {
        name: "taxCode",
        label: t("Mã số thuế"),
        ohtype: "input",
        readOnly: readOnly,
        helpText: t("Mã số thuế {{type}}", { type: t(customerType) })
      },
      {
        name: "notes",
        label: t("Ghi chú"),
        ohtype: "textarea",
        validation: "max:250,string",
        placeholder: t("Ghi chú"),
        readOnly: readOnly,
        minRows: 4,
        maxRows: 6,
        helpText: t("Các thông tin khác")
      }
    ];

    const columns = [column1, column2];

    return (
      <OhForm
        title={t("")}
        totalColumns={2}
        columns={columns}
        defaultFormData={customer}
        onRef={ref => this.ohFormRef = ref}
        onChange={value => { this.onChange(value) }}
      />
    );
  }
}

CreateCustomer.propTypes = propTypes;

export default (withTranslation("translations")
  (
    withStyles(theme => ({
      ...regularFormsStyle
    }))(CreateCustomer)
  ));
