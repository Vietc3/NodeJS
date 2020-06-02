import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

import FormLabel from "@material-ui/core/FormLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Close from "@material-ui/icons/Close";
import 'date-fns';
import InputM from '@material-ui/core/Input';
import Constants from 'variables/Constants/index.js';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';
import { Modal, Select, Input } from "antd";

import CardBody from "components/Card/CardBody.jsx";
import Card from "components/Card/Card.jsx";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import ExtendFunction from "lib/ExtendFunction.js";
import AlertSuccess from "components/Alert/AlertSuccess.jsx";
import AlertError from "components/Alert/AlertError.jsx";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import CustomerService from "services/CustomerService.js";
import _ from "lodash";

const { TextArea } = Input;
const { Option } = Select;
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

class IssueStatusForm extends React.Component {
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
      type: 2,
      gender: 0

    };
  }

  componentDidMount = () => {
    if (this.props.data)
      this.setState({
        customer: { ...this.props.data }
      });
  }

  handleAdd = (customer) => {
    this.updateCustomer(customer)
  };

  updateCustomer = async (item) => {
    let customerData = _.pick(item, ['name', 'code', 'type', 'address', 'taxCode', 'tel', 'mobile', 'gender', 'totalIn', 'totalOut', 'maxDeptAmount', 'maxDeptDays', 'totalDeposit', 'initialDeptAmount', 'fix', 'email', 'notes']);

    if (item.id) customerData.id = item.id;

    let saveCustomer = await CustomerService.saveCustomer(customerData);
    if (saveCustomer.status) {
      this.setState(
        {
          idCustomer: saveCustomer.data.id
        },
        () => {
          this.success(customerData.type === 1 ? 'Tạo khách hàng thành công' : 'Tạo nhà cung cấp thành công');
        }
      );
    } else if (saveCustomer.status === undefined) {
      this.error(customerData.type === 1 ? 'Tạo khách hàng thất bại' : 'Tạo nhà cung cấp thất bại');
    }
    this.props.onChangeVisible(false, this.state.idCustomer);
  }
  success = (mess) => {
    this.setState({ br: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={mess} /> })
  }
  error = (mess) => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    })
  }
  showAlertSuccess = () => {
    this.setState({
      alert: <AlertSuccess />
    });
    setTimeout(this.hideAlertAdd, 1000);
  };

  showAlertError = () => {
    this.setState({
      alert: <AlertError />
    });
    setTimeout(this.hideAlert, 1000);
  };

  onCancel = () => {
    this.setState({
      visible: false,
      customer: {},
    },
      () => this.props.onChangeVisible(false, this.state.idCustomer))
  }

  handleSubmit = () => {
    if (this.props.type === "add") {
      let customer = this.state.customer;
      if (customer.name) {
        this.setState({
          customer:
          {
            ...customer,
            fix: customer.fix ? 1 : 0,
            name: customer.name,
            code: customer.code,
            address: customer.address ? customer.address : "",
            tel: customer.tel ? customer.tel : "",
            mobile: customer.mobile ? customer.mobile : "",
            email: customer.email ? customer.email : "",
            fax: customer.fax ? customer.fax : "",
            gender: customer.gender ? customer.gender : "Nam",
            birthday: customer.birthday ? customer.birthday : 0,
            notes: customer.notes ? customer.notes : "",
            type: customer.type ? customer.type : 2,
            totalIn: customer.totalIn ? customer.totalIn : 0,
            totalOut: customer.totalOut ? customer.totalOut : 0,
            totalOutstanding: customer.totalOutstanding ? customer.totalOutstanding : 0,
            maxDeptAmount: customer.maxDeptAmount ? customer.maxDeptAmount : 0,
            maxDeptDays: customer.maxDeptDays ? customer.maxDeptDays : 0,
            taxCode: customer.taxCode ? customer.taxCode : 0,
            totalDeposit: 0,
            initialDeptAmount: 0,
            province: "",
            district: "",
            commune: "",
          }
        },
          () => {
            this.handleAdd(this.state.customer);
          })
      }
      else {
        this.handleChangeState(customer);
      }
    }
  }

  updateCustomer = async (item) => {
    let customerData = _.pick(item, ['name', 'code', 'type', 'address', 'taxCode', 'tel', 'mobile', 'gender', 'totalIn', 'totalOut', 'maxDeptAmount', 'maxDeptDays', 'totalDeposit', 'initialDeptAmount', 'fix', 'email', 'notes']);

    if (item.id) customerData.id = item.id;

    let saveCustomer = await CustomerService.saveCustomer(customerData);
    if (saveCustomer.status) {
      this.setState({ idCustomer: saveCustomer.data.id }, () => {
        this.success('Tạo nhà sản xuất thành công');
      });
    } else if (saveCustomer.status === undefined) {
      this.error('Tạo nhà sản xuất thất bại');
    }
  }

  success = (mess) => {
    this.setState({
      customer: {},
      br: <NotificationSuccess
        closeNoti={() => this.setState({ brsuccess: null })}
        message={mess} />
    }, () => this.onCancel())
  }

  error = (mess) => {
    this.setState({
      customer: {},
      brerror: <NotificationError
        closeNoti={() => this.setState({ brerror: null })}
        message={mess} />
    }, () => this.onCancel())
  }

  onCancel = () => {
    this.props.onChangeVisible(false, this.state.idCustomer);
  }

  handleSubmit = () => {
    let customer = this.state.customer;
    if (customer.name) {
      this.setState({
        customer:
        {
          ...customer,
          fix: customer.fix ? 1 : 0,
          name: customer.name,
          code: customer.code ? customer.code : undefined,
          address: customer.address ? customer.address : "",
          tel: customer.tel ? customer.tel : "",
          mobile: customer.mobile ? customer.mobile : "",
          email: customer.email ? customer.email : "",
          fax: customer.fax ? customer.fax : "",
          gender: customer.gender ? customer.gender : "Nam",
          birthday: customer.birthday ? customer.birthday : 0,
          notes: customer.notes ? customer.notes : "",
          type: 3,
          totalIn: customer.totalIn ? customer.totalIn : 0,
          totalOut: customer.totalOut ? customer.totalOut : 0,
          totalOutstanding: customer.totalOutstanding ? customer.totalOutstanding : 0,
          maxDeptAmount: customer.maxDeptAmount ? customer.maxDeptAmount : 0,
          maxDeptDays: customer.maxDeptDays ? customer.maxDeptDays : 0,
          taxCode: customer.taxCode ? customer.taxCode : 0,
          totalDeposit: 0,
          initialDeptAmount: 0,
          province: "",
          district: "",
          commune: "",
        }
      },
        () => {
          this.handleAdd(this.state.customer);
        })
    }
    else {
      this.handleChangeState(customer);
    }
  };

  handleChangeState = (customer) => {
    if (customer.name === undefined) {
      this.error("Vui lòng điền các thông tin bắt buộc (*)")
      this.setState({
        inputName: "error",
      })
    }
    if (customer.code === undefined) {
      this.setState({
        inputCode: "error"
      })
      this.error("Vui lòng điền các thông tin bắt buộc (*)")
    }
  }

  handleNumberChange = (name, value) => {
    this.setState({
      customer: {
        ...this.state.customer,
        [name]: value,
      }
    });
  }

  handleInputChange = (event, type) => {
    this.setState({
      customer: {
        ...this.state.customer,
        [event.target.name]: event.target.value,
      },
    }, () => {
      this.handChangeError(type)
    }
    );
  }
  handChangeError = (type) => {
    switch (type) {
      case "name":
        this.setState({
          inputName: "success",
        });
        break;

      case "code":
        this.setState({
          inputCode: "success",
        });
        break;

      case "taxCode":
        this.setState({ inputTaxCode: "success" });
        break;

      case "RepName":
        this.setState({ inputRepName: "success" });
        break;

      case "notes":
        this.setState({ inputNotes: "success" });
        break;

      case "address":
        this.setState({ inputAddress: "success" });
        break;
      case "email":
        this.setState({ inputEmail: "success" });
        break;
      default:
        break;
    }

  }
  handleDateChange = date => {
    var customer = this.state.customer;
    this.setState({
      customer: {
        ...customer,
        MaxDebtDay: date
      }
    })
  };
  handleSelectChange = (value, type) => {
    switch (type) {
      case "type": {
        this.setState({ type: value }, () => {
          var customer = this.state.customer;
          this.setState({
            customer: {
              ...customer,
              [type]: value
            }
          })
        })
        break;
      }
      case "gender": {
        if (value === 0) {
          this.setState({ gender: 0 }, () => {
            var customer = this.state.customer;
            this.setState({
              customer: {
                ...customer,
                [type]: "Nam"
              }
            })
          })
        } else if (value === 1) {
          this.setState({ gender: 1 }, () => {
            var customer = this.state.customer;
            this.setState({
              customer: {
                ...customer,
                [type]: "Nữ"
              }
            })
          })
        } else {
          this.setState({ gender: 2 }, () => {
            var customer = this.state.customer;
            this.setState({
              customer: {
                ...customer,
                [type]: "Khác"
              }
            })
          })
        }
        break;
      }
      default:
        break;
    }
  }
  render() {
    const { classes, title, visible, t, type } = this.props;
    const { customer, alert } = this.state;

    return (
      <div>
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.onCancel}
          footer={[
            <ButtonTheme
              key="submit"
              onClick={this.handleSubmit}
              className={"button-success"}

              style={{ margin: ".3125rem 1px", width: 100, marginRight: "5px", padding: 10 }}
            >
              {type === "add" ? <><AddCircleIcon style={{ marginTop: "1px" }} />{t("Create")}</> : <><SaveIcon />{t("Save")}</>}
            </ButtonTheme>,

            <ButtonTheme
              style={{ margin: ".3125rem 1px", width: 100, padding: 10 }}
              key="cancel"
              onClick={this.onCancel}

              className={"button-danger"}
            >
              <><BlockIcon />{t("Cancel")}</>
            </ButtonTheme>
          ]}
          width={window.innerWidth > 900 ? 900 : 800}
        >
          {this.state.alert}

          <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              {alert}
              <Card className="modal-card" style={{ overflow: "hidden", marginRight: "10px" }} >
                <CardBody>
                  <form onKeyDown={(e) => { if (e.keyCode === 13) { this.handleSubmit(e) } }} style={{ marginRight: "20px" }}>
                    <GridContainer style={{ marginTop: "-35px" }}>
                      <GridItem xs={3} sm={3} md={3} lg={3}>
                        <FormLabel className={classes.labelHorizontal}>
                          <b style={{ fontWeight: "bold" }}>{this.props.typeCustomer === 1 ? 'Tên khách hàng' : 'Tên nhà cung cấp'}</b>
                          <span style={{ color: 'red' }}>&nbsp;*</span>
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={9} sm={9} md={9} lg={9}>
                        <CustomInput
                          autoFocus={true}
                          id="name"
                          success={this.state.inputName === "success"}
                          error={this.state.inputName === "error"}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: "name",
                            type: "text",
                            value: customer.name ? customer.name : '',
                            onChange: (e) => e.target.value.length > Constants.InputCustomer.Name || e.target.value.length === 0 ?
                              this.setState({
                                inputName: "error",
                                customer: { ...customer, name: "" }
                              }) :
                              this.handleInputChange(e, "name"),
                            endAdornment:
                              this.state.inputName === "error" ? (
                                <InputAdornment position="end">
                                  <Close style={{ color: 'red' }} />
                                </InputAdornment>
                              ) : (
                                  undefined
                                )
                          }}
                          helpText={t("Name")}
                        /> {this.state.inputName === "error" && customer.name !== undefined ? <span style={{ color: 'red' }}>{`( ${Constants.InputCustomer.Name}` + t("-character maximum )")}</span> : ''}
                      </GridItem>
                    </GridContainer>
                    <GridContainer style={{ marginTop: "-35px" }}>
                      <GridItem xs={3} sm={3} md={3} lg={3}>
                        <FormLabel className={classes.labelHorizontal}>
                          <b style={{ fontWeight: "bold" }}>{(this.props.typeCustomer === 1 ? 'Mã khách hàng' : 'Mã nhà cung cấp')}</b>
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={9} sm={9} md={9} lg={9}>
                        <CustomInput
                          id="code"
                          success={this.state.inputCode === "success"}
                          error={this.state.inputCode === "error"}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "Mã nhà sản xuất được sinh tự động ",
                            name: "code",
                            type: "text",
                            value: customer.code ? customer.code : '',
                            onChange: (e) => e.target.value.length > Constants.InputCustomer.Code || e.target.value.length === 0 ?
                              this.setState({
                                inputCode: "error",
                                customer: { ...customer, code: "" }
                              }) :
                              this.handleInputChange(e, "code"),
                            endAdornment:
                              this.state.inputCode === "error" ? (
                                <InputAdornment position="end">
                                  <Close style={{ color: "red" }} />
                                </InputAdornment>
                              ) : (
                                  undefined
                                )
                          }}
                          helpText={t("Customer code")}
                        />
                      </GridItem>
                      <GridItem xs={4} sm={4} md={4} lg={4}>
                        <GridContainer>
                          <GridItem xs={5} sm={5} md={5} lg={5}>
                            <FormLabel className={classes.labelHorizontal}>
                              <b style={{ fontWeight: "bold" }}>{"Loại"}</b>
                              <span style={{ color: 'red' }}>&nbsp;*</span>
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={7} sm={7} md={7} lg={7} style={{ padding: "-10px", marginTop: "auto" }}>
                            <Select value={customer.type ? 2 : 2} onChange={(value) => this.handleSelectChange(value, "type")} disabled={true}>
                              <Option value={1}>Khách hàng</Option>
                              <Option value={2}>Nhà cung cấp</Option>
                            </Select>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                    <GridContainer style={{ marginTop: "-30px" }}>
                      <GridItem xs={3} sm={3} md={3} lg={3}>
                        <FormLabel className={classes.labelHorizontal}>
                          <b style={{ fontWeight: "bold" }}>{t("Tax Code")}</b>
                        </FormLabel>
                      </GridItem>

                      <GridItem xs={9} sm={9} md={9} lg={9}>
                        <CustomInput
                          id="taxCode"
                          success={this.state.inputTaxCode === "success"}
                          error={this.state.inputTaxCode === "error"}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: "taxCode",
                            type: "text",
                            value: customer.taxCode ? customer.taxCode : '',
                            onChange: (e) => e.target.value.length < Constants.InputCustomer.TaxCode ? this.handleInputChange(e, "taxCode") : this.setState({ inputTaxCode: "error" }),
                            endAdornment:
                              this.state.inputTaxCode === "error" ? (
                                <InputAdornment position="end">
                                  <Close style={{ color: 'red' }} />
                                </InputAdornment>
                              ) : (
                                  undefined
                                )
                          }}
                          helpText={t("Tax Code")}
                        />{this.state.inputTaxCode === "error" ? <span style={{ color: 'red' }}>{`( ${Constants.InputCustomer.TaxCode}` + t(" -character maximum )")}</span> : null}
                      </GridItem>
                    </GridContainer>
                    <GridContainer style={{ marginTop: "-30px" }}>
                      <GridItem xs={3} sm={3} md={3} lg={3}>
                        <FormLabel className={classes.labelHorizontal}>
                          <b style={{ fontWeight: "bold" }}>{"Địa chỉ"}</b>
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={9} sm={9} md={9} lg={9}>
                        <CustomInput
                          id="address"
                          success={this.state.inputAddress === "success"}
                          error={this.state.inputAddress === "error"}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: "address",
                            type: "text",
                            value: customer.address ? customer.address : '',
                            onChange: (e) => e.target.value.length < Constants.InputCustomer.Address ? this.handleInputChange(e, "address") : this.setState({ inputAddress: "error" }),
                            endAdornment:
                              this.state.inputAddress === "error" ? (
                                <InputAdornment position="end">
                                  <Close style={{ color: 'red' }} />
                                </InputAdornment>
                              ) : (
                                  undefined
                                )
                          }}
                          helpText={t("Address")}
                        />{this.state.inputAddress === "error" ? <span style={{ color: 'red' }}>{`( ${Constants.InputCustomer.Address}` + t(" -character maximum )")}</span> : null}
                      </GridItem>
                    </GridContainer>

                    <GridContainer style={{ marginTop: "-30px" }}>
                      <GridItem xs={3} sm={3} md={3} lg={3}>
                        <FormLabel className={classes.labelHorizontal}>
                          <b style={{ fontWeight: "bold" }}>{"Email"}</b>
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={9} sm={9} md={9} lg={9}>
                        <CustomInput
                          id="email"
                          success={this.state.inputEmail === "success"}
                          error={this.state.inputEmail === "error"}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            name: "email",
                            type: "text",
                            value: customer.email ? customer.email : '',
                            onChange: (e) => e.target.value.length > 250 || e.target.value.length === 0 ?
                              this.setState({
                                inputCode: "error",
                                customer: { ...customer, email: "" }
                              }) :
                              this.handleInputChange(e, "email"),
                            endAdornment:
                              this.state.inputEmail === "error" ? (
                                <InputAdornment position="end">
                                  <Close style={{ color: 'red' }} />
                                </InputAdornment>
                              ) : (
                                  undefined
                                )
                          }}

                        />
                        {this.state.inputEmail === "error" && customer.email !== undefined ? <span style={{ color: 'red' }}>{"( 250" + t("-character maximum )")}</span> : null}
                      </GridItem>
                    </GridContainer>
                    <GridContainer style={{ marginTop: "-30px" }}>
                      <GridItem xs={6} sm={6} md={6} lg={6}>
                        <GridContainer>
                          <GridItem xs={6} sm={6} md={6} lg={6}>
                            <FormLabel className={classes.labelHorizontal}>
                              <b style={{ fontWeight: "bold" }}>{t("Tel")}</b>
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6} lg={6}>
                            <CustomInput
                              id="tel"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: "tel",
                                type: "text",
                                value: customer.tel ? customer.tel : '',
                                onChange: e => {
                                  let value = e.target.value.replace(/[^0-9 +]/g, "");
                                  if (value.length <= Constants.InputCustomer.Tel)
                                    this.handleNumberChange("tel", value);
                                },
                              }}
                              helpText={t("Tel")}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={6} sm={6} md={6} lg={6}>
                        <GridContainer>
                          <GridItem xs={6} sm={6} md={6} lg={6}>
                            <FormLabel className={classes.labelHorizontal}>
                              <b style={{ fontWeight: "bold" }}>{t("Mobile")}</b>
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6} lg={6}>
                            <CustomInput
                              id="mobile"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                name: "mobile",
                                type: "text",
                                value: customer.mobile ? customer.mobile : '',
                                onChange: e => {
                                  let value = e.target.value.replace(/[^0-9 +]/g, "");
                                  if (value.length <= Constants.InputCustomer.Mobile)
                                    this.handleNumberChange("mobile", value);
                                },
                              }}
                              helpText={t("Mobile")}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                    <GridContainer style={{ marginTop: "-30px" }}>
                      <GridItem xs={6} sm={6} md={6} lg={6}>
                        <GridContainer>
                          <GridItem xs={6} sm={6} md={6} lg={6}>
                            <FormLabel className={classes.labelHorizontal}>
                              <b style={{ fontWeight: "bold" }}>{t("Max Debt Amount")}</b>
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6} lg={6}>
                            <InputM
                              className={classes.input}
                              inputProps={{
                                type: "text",
                                value: customer.maxDeptAmount ? ExtendFunction.FormatNumber(customer.maxDeptAmount) : 0,
                                onClick: e => {
                                  let value = e.target.value;
                                  e.target.value = value === "0" ? "" : value;
                                },
                                onChange: e => {
                                  let value = e.target.value.replace(/[^0-9]/g, "");
                                  value = value.slice(0, 1) === "0" ? value.slice(1, value.length) : value;
                                  if (value.length <= Constants.InputCustomer.MaxDebtAmount)
                                    this.handleNumberChange("maxDeptAmount", value);
                                },
                                style: { textAlign: 'right', paddingTop: "30px" },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={6} sm={6} md={6} lg={6}>
                        <GridContainer>
                          <GridItem xs={6} sm={6} lg={6}>
                            <FormLabel className={classes.labelHorizontal}>
                              <b style={{ fontWeight: "bold" }}>{"Số ngày nợ"}</b>
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6} lg={6}>
                            <InputM
                              className={classes.input}
                              id="maxDeptDays"
                              formControlProps={{
                                fullWidth: true
                              }}
                              inputProps={{
                                type: "text",
                                value: this.state.value,
                                onChange: e => {
                                  if (isNaN(e.target.value) === false && e.target.value >= 0) {
                                    this.setState({ value: e.target.value })
                                  }
                                },
                                style: { textAlign: 'right', paddingTop: "30px" },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                    <GridContainer style={{ marginTop: "-25px", marginBottom: "5px" }}>
                      <GridItem xs={3} sm={3} md={3} lg={3}>
                        <FormLabel className={classes.labelHorizontal}>
                          <b style={{ fontWeight: "bold" }}>{t("Notes")}</b>
                        </FormLabel>
                      </GridItem>
                      <GridItem xs={9} sm={9} md={9} lg={9}>
                        <TextArea
                          id="notes"
                          name="notes"
                          value={customer.notes ? customer.notes : ''}
                          onChange={(e) => this.handleInputChange(e, "notes")}
                          placeholder={t("Notes")}
                          autoSize={{ minRows: 4, maxRows: 5 }}
                          style={{ marginTop: "30px" }}
                        />
                      </GridItem>
                    </GridContainer>
                  </form>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Modal>
      </div>
    );
  }
}

IssueStatusForm.propTypes = propTypes;

export default
  (withTranslation("translations")
    (
      withStyles(theme => ({
        ...regularFormsStyle
      }))(IssueStatusForm)
    ));
