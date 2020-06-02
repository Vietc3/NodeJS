// @material-ui/core components
import React, { Component } from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Button from "components/CustomButtons/Button.jsx";
import { connect } from "react-redux";
import adminNavbarLinksStyle from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.jsx";

import { withTranslation } from "react-i18next";
import userService from "services/UserService.js";
import Divider from "@material-ui/core/Divider";
import ExtendFunction from "lib/ExtendFunction.js";
import HttpService from "services/HttpService.js";
import { notifyError } from "components/Oh/OhUtils.js";
import { Popover } from "antd";
import vn from "assets/img/flags/VN.png";
import en from "assets/img/flags/EN.png";
import kr from "assets/img/flags/KR.png";

const flagImages =  { "VN": vn, "EN": en, "KR": kr};

class OhLanguage extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      openLanguage: false
    };
  }
  
  handleClickLanguage = () => {
    this.setState({ openLanguage: !this.state.openLanguage });
  };
  
  handleCloseLanguage = () => {
    this.setState({ openLanguage: false });
  };
  
  handleCloseLanguage = () => {
    this.setState({ openLanguage: !this.state.openLanguage });
  };
  
  changeLanguage = async lang => {
    const { i18n, currentUser } = this.props;
    
    this.handleCloseLanguage();

    if(currentUser.user && currentUser.user.id) {
      let saveUser = await userService.saveUser({
        id: currentUser.user.id,
        language: lang
      });
      
      if(!saveUser.status) {
        notifyError(saveUser.message);
      }
    }
    
    HttpService.setLanguage(lang);
  };
  
  handleVisibleChange = visible => {
    this.setState({ openLanguage: visible });
  };

  render() {
    const { classes, i18n, align, t, language, style } = this.props;
    const { openLanguage } = this.state;
    const dropdownItem = classNames(classes.dropdownItem, classes.infoHover);
    let arrLanguage = Object.keys(i18n.store.data).filter(item => item !== language);
    
    return (
      <Popover
        trigger="click"
        getPopupContainer={trigger => trigger.parentNode}
        placement="bottomLeft"
        visible={openLanguage}
        onVisibleChange={this.handleVisibleChange}
        content={
          <MenuList role="menu">
            {arrLanguage.map((item, index) => {              
              return (
                <span key={'lang_' + index}>
                  <MenuItem className={dropdownItem} onClick={() => this.changeLanguage(item)}>
                    <img
                      src={flagImages[item.toUpperCase()]}
                      style={{ width: 30, height: 20, marginRight: '10px' }}
                    />
                    {item.toUpperCase()}
                  </MenuItem>
                  {index < arrLanguage.length - 1 && <Divider light />}
                </span>
              );
            })}
          </MenuList>
        }
      >
        <Button
          color="transparent"
          aria-label={t("Language")}
          justIcon
          aria-haspopup="true"
          onClick={this.handleClickLanguage}
          className={classes.buttonLink}
          // muiClasses={{
            // label: rtlActive ? classes.labelRTL : ""
          // }}
          buttonRef={node => {
            this.anchorLanguage = node;
          }}
          style={{ ...style, paddingTop: "4px" }}
        >
          <div>
            <img src={flagImages[language.toUpperCase()]} style={{ width: 30, height: 20 }}></img>
          </div>
        </Button>
      </Popover>
    )
  }
}
export default connect(state => {
  return {
    User: state.reducer_user.User,
    myChangeAvatar: state.reducer_user.changeAvatar,
    url: state.reducer_user.url,
    state: state,
    language: state.languageReducer.language,
    currentUser: state.userReducer.currentUser 
  };
})(withTranslation("translations")(withStyles(adminNavbarLinksStyle)(OhLanguage)));
