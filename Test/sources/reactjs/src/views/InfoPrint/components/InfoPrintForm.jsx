import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { withTranslation } from 'react-i18next';
import withStyles from "@material-ui/core/styles/withStyles"
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import TinyEditor from "components/TinyEditor/TinyEditor";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody";
import "react-datepicker/dist/react-datepicker.css";
import Constants from "variables/Constants/";
import ExtendFunction from "lib/ExtendFunction";
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import OhToolbar from "components/Oh/OhToolbar";
import { MdSave, MdCached } from "react-icons/md";
import StoreService from "services/StoreConfig";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import logo from 'assets/img/ohstore_logo.png';

import { Select, Checkbox } from "antd";
const { Option } = Select;

const SELECT_NAME = "selects";
const SELECT_OPTIONS = "options";

class InfoPrintForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      print: "",
      selects: Constants.PRINT_SIZE.A4,
      dataSource: "",
      options: Constants.PRINT_TEMPLATE_NAME.INVOICE,
      checkBox: false,
      defaultPrint: Constants.PRINT_SIZE.A4,
      datacConfig: {},
      type: "",
      dataImages: "",
      flag: false

    };
  }

  async componentDidMount() {
    let configLogo = await StoreService.getConfig({ types: ["store_logo"] });
    if (configLogo.status) {
      this.setState({
        dataImages: configLogo.data && configLogo.data.store_logo ? configLogo.data.store_logo.slice(1, -1) : logo,
      })
    }
    this.getData()
  }

  async getData() {
    let { t } = this.props
    let nameTemplate = "print_template_" + this.state.options;

    this.setState({
      print: "",
    })

    let config = await StoreService.getPrintTemplate({ namePrintTemplate: nameTemplate, printSize: this.state.selects });

    if (config.status) {
      this.setState({
        print: config.data,
        datacConfig: config.configCheckCard,
        type: nameTemplate,
        defaultPrint: config.configCheckCard.value.default === this.state.selects ? this.state.selects : config.configCheckCard.value.default,
        checkBox: config.configCheckCard.value.default === this.state.selects ? true : false
      }, () => {
        this.getPrintExample();
      });

      if (!config.data) {
        notifyError(t("Mẫu in không hỗ trợ khổ in {{type}}" , {type: this.state.selects} ));
        this.setState({
          flag: true
        })
      }

    }
  }

  getPrintExample() {
    let data = {store_logo: `<img style="max-width: 100%;float: left;"alt="" src=${this.state.dataImages} />` }

    switch (this.state.options) {
      case Constants.PRINT_TEMPLATE_NAME.INVOICE:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_INOICE, ...data }
        break;
      case Constants.PRINT_TEMPLATE_NAME.INVOICE_RETURN:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_INVOICE_RETURN, ...data }
        break;
      case Constants.PRINT_TEMPLATE_NAME.IMPORT:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_IMPORT, ...data }
        break;
      case Constants.PRINT_TEMPLATE_NAME.IMPORT_RETURN:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_IMPORT_RETURN, ...data }
        break;
      case Constants.PRINT_TEMPLATE_NAME.INCOME_EXPENSE_RECEIPT:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_INCOME_EXPONSE_RECEIPT, ...data }
        break;
      case Constants.PRINT_TEMPLATE_NAME.INCOME_EXPENSE_PAYMENT:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_INCOME_EXPONSE_PAYMENT, ...data }
        break;
      case Constants.PRINT_TEMPLATE_NAME.IMPORT_STOCK:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_IMPORT_STOCK, ...data }
        break;
      case Constants.PRINT_TEMPLATE_NAME.EXPORT_STOCK:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_EXPORT_STOCK, ...data }
        break;
      case Constants.PRINT_TEMPLATE_NAME.MANUFACTURING_STOCK:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_MANUFACTURING_STOCK, ...data }
        break;
        case Constants.PRINT_TEMPLATE_NAME.STOCK_TAKE:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_STOCK_TAKE, ...data }
        break;
        case Constants.PRINT_TEMPLATE_NAME.DEPOSIT_RECEIPT:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_DEPOSIT_RECEIPT, ...data }
        break;
        case Constants.PRINT_TEMPLATE_NAME.INVOICE_ORDER:
        data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_INOICE_ORDER, ...data }
        break;
        case Constants.PRINT_TEMPLATE_NAME.IMPORT_ORDER:
          data = { ...Constants.PRINT_TEMPLATE_EXAMPLE_DATA.TEMPLATE_IMPORT_ORDER, ...data }
          break;
      default:
        break;
    }


    let printExample = "";
    
    if (this.state.print)
      printExample = ExtendFunction.exportPrintTemplate(this.state.print, data);

    this.setState({
      dataSource: printExample,
      flag: false,
    })

  }

  onChangeDefault = async () => {
    let nameTemplate = "print_template_" + this.state.options + "_default";

    let printTemplateDefault = await StoreService.getPrintTemplate({ namePrintTemplate: nameTemplate, printSize: this.state.selects });

    if (printTemplateDefault.status) {
      if (printTemplateDefault.data) {
        this.setState({
          print: printTemplateDefault.data,
        }, () => {
          this.getPrintExample();
          this.handleSubmit();
        });
      } else {
        notifyError("Mẫu in không hỗ trợ khổ in " + this.state.defaultPrint);
      }
    }
  }

  onChangeCheckBox = () => {
    let { selects, checkBox } = this.state;
    switch (selects) {
      case Constants.PRINT_SIZE.A4:
        this.setState({
          defaultPrint: Constants.PRINT_SIZE.A4,
          checkBox: !checkBox
        })
        break;
      case Constants.PRINT_SIZE.A5:
        this.setState({
          defaultPrint: Constants.PRINT_SIZE.A5,
          checkBox: !checkBox
        })
        break;
      case Constants.PRINT_SIZE.K57:
        this.setState({
          defaultPrint: Constants.PRINT_SIZE.K57,
          checkBox: !checkBox
        })
        break;
      case Constants.PRINT_SIZE.K80:
        this.setState({
          defaultPrint: Constants.PRINT_SIZE.K80,
          checkBox: !checkBox
        })
        break;
      default:
        break;
    }
  }

  handleSubmit = async () => {
    let { datacConfig, defaultPrint, type, selects, print } = this.state;
    let { t } = this.props;

    let value = { A4: datacConfig.value.A4, A5: datacConfig.value.A5, K57: datacConfig.value.K57, K80: datacConfig.value.K80, default: defaultPrint }

    switch (selects) {
      case Constants.PRINT_SIZE.A4:
        value = { ...value, A4: print }
        break;
      case Constants.PRINT_SIZE.A5:
        value = { ...value, A5: print }
        break;
      case Constants.PRINT_SIZE.K57:
        value = { ...value, K57: print }
        break;
      case Constants.PRINT_SIZE.K80:
        value = { ...value, K80: print }
        break;
      default:
        break;
    }
    
    let data = JSON.stringify(value) ;
    let updateConfig = await StoreService.saveConfig({ configs: { [type]: data }});

    if (updateConfig) {
      notifySuccess(t("Cập nhật mẫu in thành công"));
    } else {
      notifyError(t("Thất bại"));
    }
  }

  onChange = async (value, name) => {
    this.setState({
      [name]: value,
    }, () => {
      this.getData();
    });
  }

  render() {
    const { t } = this.props;
    let { dataSource, print, options, selects } = this.state;
      
    const selectInfoForm = [
      <Option value={Constants.PRINT_TEMPLATE_NAME.INVOICE} >{t("Hóa đơn")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.INVOICE_RETURN} >{t("Phiếu trả hàng")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.IMPORT} >{t("Phiếu nhập hàng")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.IMPORT_RETURN} >{t("Phiếu trả hàng nhập")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.INCOME_EXPENSE_RECEIPT} >{t("Phiếu thu")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.INCOME_EXPENSE_PAYMENT} >{t("Phiếu chi")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.IMPORT_STOCK} >{t("Phiếu nhập kho")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.EXPORT_STOCK} >{t("Phiếu xuất kho")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.MANUFACTURING_STOCK} >{t("Phiếu sản xuất")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.STOCK_TAKE} >{t("Phiếu kiểm kho")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.DEPOSIT_CHECKED} >{t("Tiền ký gửi")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.DEPOSIT_RECEIPT} >{t("Rút tiền ký gửi")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.INVOICE_ORDER} >{t("Đơn đặt hàng")}</Option>,
      <Option value={Constants.PRINT_TEMPLATE_NAME.IMPORT_ORDER} >{t("Đơn đặt hàng nhà cung cấp")}</Option>,
    ];
    const selectInfoSize = [
      <Option value={Constants.PRINT_SIZE.A4} >{t("Khổ in A4")}</Option>,
      <Option value={Constants.PRINT_SIZE.A5} >{t("Khổ in A5")}</Option>,
      <Option value={Constants.PRINT_SIZE.K57} >{t("Khổ in K57")}</Option>,
      <Option value={Constants.PRINT_SIZE.K80} >{t("Khổ in K80")}</Option>,
    ];

    return (
      <Fragment>
        <Card>
          <CardBody>
            <GridContainer alignItems="center" style={{ marginLeft: 10 }} >
              <GridItem>
                <span className="TitleInfoForm">{t("Chọn mẫu in")}</span>
              </GridItem>
              <GridItem style={{ width: "210px" }}>
                <Select
                  disabled={false}
                  style={{ width: 200 }}
                  size={"large"}
                  placeholder={t("Chọn mẫu in")}
                  optionFilterProp="children"
                  onChange={(e) => this.onChange(e, SELECT_OPTIONS)}
                  name="options"
                  value={options}
                  filterOption={(input, option) => {
                    return option.props.children
                      ? ExtendFunction.removeSign(option.props.children
                        .toLowerCase())
                        .indexOf(ExtendFunction.removeSign(input.toLowerCase())) >= 0
                      : false;
                  }}
                >
                  {selectInfoForm}
                </Select>
              </GridItem>

              <GridItem>
                <span className="TitleInfoForm">{t("Khổ in")}</span>
              </GridItem>
              <GridItem style={{ width: "170px" }}>
                <Select
                  disabled={false}
                  style={{ width: 200 }}
                  size={"large"}
                  placeholder={t("Khổ in")}
                  optionFilterProp="children"
                  onChange={(e) => this.onChange(e, SELECT_NAME)}
                  name="selects"
                  value={selects}
                  filterOption={(input, option) => {
                    return option.props.children
                      ? ExtendFunction.removeSign(option.props.children
                        .toLowerCase())
                        .indexOf(ExtendFunction.removeSign(input.toLowerCase())) >= 0
                      : false;
                  }}
                >
                  {selectInfoSize}
                </Select>
              </GridItem>
              <GridItem>
                <Checkbox
                  onChange={this.onChangeCheckBox}
                  checked={this.state.checkBox}
                  disabled={this.state.flag}
                >{t("Đặt làm mặc định in")}
                </Checkbox>
              </GridItem>
            </GridContainer>
            <GridContainer alignItems="center" >
              <GridItem xs={12} sm={6}
                style={{
                  height: window.innerHeight < 900 ? 'calc(100vh - 30vh)' : "530px"
                }}>
                <GridContainer
                  style={{
                    marginLeft: "10px",
                    width: "97%",
                    marginBottom: "10px"
                  }}
                >
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <TinyEditor
                      content={print}
                      isDisabled={this.state.flag}
                      height={window.innerHeight < 900 ? 'calc(100vh - 35vh)' : null}
                      id="task_editor"
                      onEditorChange={content => this.setState({ print: content }, () => {
                        this.getPrintExample();
                      })}
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>

              <GridItem xs={12} sm={6} style={{ height: window.innerHeight < 900 ? 'calc(100vh - 30vh)' : "530px" }}>

                <GridContainer style={{ width: "99%", }}>
                  <GridItem
                    xs={12} sm={12}
                    style={{
                      textAlign: "center",
                      backgroundColor: "#cfc7c7",
                      marginTop: "11px"
                    }}>
                    <span style={{
                      fontSize: 14,
                      color: "black",
                      fontWeight: "bold"
                    }}>
                      {t("Xem trước mẫu in")}</span>
                  </GridItem>
                </GridContainer>

                <GridContainer
                  style={{
                    width: "99%",
                    overflowY: "scroll",
                    maxHeight: window.innerHeight < 900 ? 'calc(100vh - 40vh)' : "455px"
                  }}>
                  <GridItem xs={12}>
                    {!dataSource ? null :
                      <div dangerouslySetInnerHTML={{ __html: dataSource }} />
                    }
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
            <div>
              <OhToolbar
                right={[
                  {
                    type: "button",
                    label: t("Về mặc định"),
                    onClick: () => this.onChangeDefault(),
                    icon: <MdCached />,
                    simple: true,
                    typeButton: "exit",
                    permission: {
                      name: Constants.PERMISSION_NAME.SETUP_STORE,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }

                  },
                  {
                    type: "button",
                    label: "Lưu",
                    onClick: () => this.handleSubmit(),
                    icon: <MdSave />,
                    simple: true,
                    typeButton: "add",
                    permission: {
                      name: Constants.PERMISSION_NAME.SETUP_STORE,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }
                  }
                ]}
              />
            </div>
          </CardBody>
        </Card>
      </Fragment>
    )
  }
}

InfoPrintForm.propTypes = {
  classes: PropTypes.object
};

export default (withTranslation("translations")(withStyles((theme) => ({
  ...extendedTablesStyle,
  ...buttonsStyle
}))(InfoPrintForm)));