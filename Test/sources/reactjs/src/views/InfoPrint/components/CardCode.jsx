import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { withTranslation } from 'react-i18next';
import withStyles from "@material-ui/core/styles/withStyles"
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody";
import "react-datepicker/dist/react-datepicker.css";
import GridContainer from 'components/Grid/GridContainer';
import Constants from "variables/Constants";
import GridItem from 'components/Grid/GridItem';
import { Switch } from 'antd';
import StoreConfig from 'services/StoreConfig';
import { connect } from "react-redux";
import { notifyError, notifySuccess } from 'components/Oh/OhUtils';
import mark from 'assets/img/mark.png';
import OhForm from 'components/Oh/OhForm';
import OhCollapse from 'components/Oh/OhCollapse';
import OhButton from 'components/Oh/OhButton';
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel, MdDelete } from "react-icons/md";
import _ from 'lodash';

class ManufactureInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }
  
  componentDidMount() {
    this.getData();
  }
  
  getData = async () => {
    let getCardCode = await StoreConfig.getConfig({
      types: ["card_code"]
    })
    
    if (getCardCode.status) {
      this.setState({
        formData: JSON.parse(getCardCode.data.card_code || "{}")
      })
    }
    else notifyError(getCardCode.message)
  }

  toggle = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  checkPermission = () => {
    let { dataPermissions } = this.props;

    let name = Constants.PERMISSION_NAME.SETUP_STORE;
    let type = Constants.PERMISSION_TYPE.TYPE_ALL;

    if (!name || !type || (dataPermissions.permissions[name] || Constants.PERMISSION_TYPE.TYPE_NONE) >= type) {
      return true;
    } else {
      return false;
    }
  }

  changeManufacture = async(check) => {
    let { t } = this.props
    let value = check === true ? Constants.MANUFACTURE_OPTIONS.ON : Constants.MANUFACTURE_OPTIONS.OFF;

    let updateMANUFACTURE = await StoreConfig.saveConfig({configs: { manufacturing: value }})

    if (updateMANUFACTURE.status)    
      this.props.dispatch({type: "MANUFACTURE", Manufacture: value })
    else notifyError(t("Cập nhật tính năng quản lý sản xuất thất bại"))
  }

  changeLanguageProduct = async(check) => {
    let { t } = this.props
    let value = check === true ? Constants.LANGUAGE_PRODUCT_OPTIONS.ON : Constants.LANGUAGE_PRODUCT_OPTIONS.OFF;

    let updateLanguageProduct = await StoreConfig.saveConfig({configs: { language_product: value }})

    if (updateLanguageProduct.status)    
      this.props.dispatch({type: "LANGUAGE_PRODUCT", Language_Product: value })
    else notifyError(t("Cập nhật tính năng ngôn ngữ sản phẩm thất bại"))
  }
  
  onChange = (obj) => {
    this.setState({
      formData: obj
    })
  }

  onSubmit = async () => {
    let { t } = this.props
    if(Object.values(this.state.formData).every(item => {
      if(item && !item.includes("{prefix")) {
        notifyError(t("Mã phiếu phải có tiền tố"))
        return false;
      }
      if(item && !item.match(/{prefix?(\:([a-zA-Z0-9]+))?()}/gi)) {
        notifyError(t("Tiền tố không hợp lệ"))
        return false;
      }
      if(item && item.includes("{customer_counter_by")) {
        let str = "{customer_counter_by";
        let params = item.substring(
          item.indexOf(str) + str.length, 
          item.indexOf("}", item.indexOf(str))
        );
        params = params.replace(/\:/g, '') ;
        params = params.split(',');

        if(!params[0] || !isNaN(_.toNumber(params[0])) || (params[1] && isNaN(_.toNumber(params[1])))) {
          notifyError(t("Tham số customer_counter_by không hợp lệ"))
          return false;
        }
      }
      
      return true;
    })) {
      let updateCardCode = await StoreConfig.saveConfig({configs: { card_code: JSON.stringify(this.state.formData) }})

      if (updateCardCode.status)    
        notifySuccess(t("Cập nhật mã phiếu thành công"))
      else notifyError(updateCardCode.message)
    }
  }

  render() {
    let { t } = this.props;
    let { formData, activeKey } = this.state;
    let flagPermission = !this.checkPermission();

    return (
      <Card>
        <CardBody>
          <GridContainer>
            <GridItem xs={12}>
              <div style={{paddingRight: '20px'}}>
                <OhCollapse
                  onRef = {ref => this.collapseRef = ref}
                >
                {Object.keys(Constants.CARD_CODE_CONFIG).map(item => {
                  return <p>{"{" + item + "}"}: {Constants.CARD_CODE_CONFIG[item]}</p>
                })}
                </OhCollapse>
              </div>
              <img src={mark} onClick={() => this.collapseRef.toggle()} style={{cursor: "pointer", position: "absolute", right: 15, top: 30}}/>
            </GridItem>
            <GridItem xs={12}>
              <OhForm
                defaultFormData={ formData }
                onRef={ref => this.ohFormRef = ref}
                columns={[
                  [
                    {
                      name: "invoice",
                      label: t("Đơn hàng"),
                      ohtype: "input",
                      placeholder: "{prefix:DH}{ID}",
                    },
                    {
                      name: "invoiceReturn",
                      label: t("Trả hàng"),
                      ohtype: "input",
                      placeholder: "{prefix:NH}{ID}",
                    },
                    {
                      name: "import",
                      label: t("Nhập hàng"),
                      ohtype: "input",
                      placeholder: "{prefix:NH}{ID}",
                    },
                    {
                      name: "importReturn",
                      label: t("Trả hàng nhập"),
                      ohtype: "input",
                      placeholder: "{prefix:PX}{ID}",
                    },
                    {
                      name: "invoiceOrderCard",
                      label: t("Đặt hàng"),
                      ohtype: "input",
                      placeholder: "{prefix:DDH}{ID}",
                    },
                    {
                      name: "importOrderCard",
                      label: t("Đặt hàng nhập"),
                      ohtype: "input",
                      placeholder: "{prefix:DDH}{ID}",
                    },
                    {
                      name: "manufacturingCard",
                      label: t("Phiếu sản xuất"),
                      ohtype: "input",
                      placeholder: "{prefix:SX}{ID}",
                    },
                    {
                      name: "moveStock",
                      label: t("Phiếu chuyển kho"),
                      ohtype: "input",
                      placeholder: "{prefix:CH}{ID}",
                    },
                    {
                      name: "stockCheckCard",
                      label: t("Kiểm kho"),
                      ohtype: "input",
                      placeholder: "{prefix:KK}{ID}",
                    },
                    {
                      name: "income",
                      label: t("Phiếu thu"),
                      ohtype: "input",
                      placeholder: "{prefix:PT}{ID}",
                    },
                    {
                      name: "expense",
                      label: t("Phiếu chi"),
                      ohtype: "input",
                      placeholder: "{prefix:PC}{ID}",
                    },
                  ],
                ]}
                onChange={value => {
                  this.onChange(value);
                }}
              />
            </GridItem>
            <GridItem xs={12} style={{ textAlign: 'right' }}>
              <OhButton
                type="add"
                icon={<AiOutlineSave />}
                onClick={() => this.onSubmit()}    
                // permission={{
                  // name: Constants.PERMISSION_NAME.SETUP_BRANCH,
                  // type: Constants.PERMISSION_TYPE.TYPE_ALL
                // }}         
              >
                {t("Lưu")}
              </OhButton>
              <OhButton
                type="exit"
                icon={<MdCancel />}
                onClick={() => this.props.history.push("/admin/settings")}            
              >
                {t("Thoát")}
              </OhButton>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    )
  }
}

ManufactureInfo.propTypes = {
  classes: PropTypes.object
};

export default connect(function(state) {
  return {
    Manufacture: state.reducer_user.Manufacture,
    Language_Product: state.reducer_user.Language_Product,
    dataPermissions: state.userReducer.currentUser,
  };
})(withTranslation("translations")(withStyles((theme) => ({
  ...extendedTablesStyle,
  ...buttonsStyle
}))(ManufactureInfo)));