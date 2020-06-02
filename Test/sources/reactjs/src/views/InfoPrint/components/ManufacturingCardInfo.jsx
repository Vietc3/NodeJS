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
import { notifyError } from 'components/Oh/OhUtils';

class ManufactureInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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


  render() {
    let { t } = this.props;
    let flagPermission = !this.checkPermission();

    return (
      <Fragment>
        <Card>
          <CardBody>
            <GridContainer>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <span className = "title-manufacturing-setting">{t("Quản lý sản xuất")}</span>
              </GridItem>
              <GridItem xs={6} sm={6} md={6} lg={6} style={{ textAlign: '-webkit-center' }}>
              <Switch 
              onChange = {value => this.changeManufacture(value)} 
              checked={parseInt(this.props.Manufacture) === Constants.MANUFACTURE_OPTIONS.ON ? true : false}
              disabled={flagPermission}
               />
              </GridItem>
            </GridContainer>
            <hr style={{ marginTop: "3px", marginBottom: "3px" }} />
            <GridContainer>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <span className = "title-manufacturing-setting">{t("Hỗ trợ đa ngôn ngữ")}</span>
              </GridItem>
              <GridItem xs={6} sm={6} md={6} lg={6} style={{ textAlign: '-webkit-center' }}>
              <Switch 
              onChange = {value => this.changeLanguageProduct(value)} 
              defaultChecked={parseInt(this.props.Language_Product) === Constants.LANGUAGE_PRODUCT_OPTIONS.ON ? true : false}
              disabled={flagPermission}
               />
              </GridItem>
            </GridContainer>

          </CardBody>
        </Card>
      </Fragment>
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