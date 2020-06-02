/*!

=========================================================
* Material Dashboard PRO React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";

// material-ui icons
import Menu from "@material-ui/icons/Menu";
import MoreVert from "@material-ui/icons/MoreVert";

// core components
import AdminNavbarLinks from "./AdminNavbarLinks.jsx";
import Button from "components/CustomButtons/Button.jsx";

import adminNavbarStyle from "assets/jss/material-dashboard-pro-react/components/adminNavbarStyle.jsx";
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import OhButton from "components/Oh/OhButton.jsx";
import { MdArrowBack } from "react-icons/md";

function AdminNavbar({ ...props }) {
  const {t}= props;
  const { classes, color, rtlActive, brandText, miniActive } = props;
  const appBarClasses = cx({
    [" " + classes[color]]: color
  });
  const sidebarMinimize =
    classes.sidebarMinimize +
    " " +
    cx({
      [classes.sidebarMinimizeRTL]: rtlActive
    });
	const appBar = classes.appBar + appBarClasses + 
		" " +
		cx({
      [classes.appBarMobile]: miniActive,
      ['salesCounterPages']: window.location.pathname === "/admin/sales-counter",

		});
  return (
    <AppBar className={appBar} style={{boxShadow: "rgb(197, 197, 197) 0px 0px 10px 5px",padding:0}}>
      <Toolbar className={classes.container}>
      
          {window.location.pathname === "/admin/sales-counter" ? 
          <div className={sidebarMinimize} style={{paddingLeft:0}}>
              <OhButton 
                linkTo={"/admin/dashboard"}
                type="exit"
                icon={<MdArrowBack/>}
                >
                {t("Quay lại")}
              </OhButton>
          </div>
          :
      <Hidden smDown implementation="css">
      <div className={sidebarMinimize} style={{paddingLeft:0}}>
            {props.miniActive ? (
              <Button
                justIcon
                // round
                style={{background:'none',boxShadow:'none',color:'gray'}}
                onClick={props.sidebarMinimize}
              >
                <Menu className={classes.sidebarMiniIcon} />
              </Button>
            ) : (
              <Button
                justIcon
                // round
                onClick={props.sidebarMinimize}
                style={{background:'none',boxShadow:'none',color:'gray'}}
              >
                <MoreVert className={classes.sidebarMiniIcon} />
              </Button>
            )}
          </div>
        </Hidden> }
        <Hidden mdUp implementation="css">
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button href="#" className={classes.title} color="transparent">
            {t(brandText)}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <AdminNavbarLinks rtlActive={rtlActive} routerName={props.brandText}/>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

AdminNavbar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
  brandText: PropTypes.string,
  miniActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  sidebarMinimize: PropTypes.func
};

export default connect((state) => {
  return ({
    User: state.reducer_user.User,
    myChangeAvatar: state.reducer_user.changeAvatar,
    url: state.reducer_user.url,
    state: state,
    language: state.reducer_user.language,
    flag: state.reducer_user.flag
  })
})(withTranslation("translations")(withStyles(adminNavbarStyle)(AdminNavbar)));
