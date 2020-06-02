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
import cx from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Fingerprint from "@material-ui/icons/Fingerprint";

// core components
import Button from "components/CustomButtons/Button";

import authNavbarStyle from "assets/jss/material-dashboard-pro-react/components/authNavbarStyle.jsx";

import { withTranslation } from 'react-i18next';


import Vietnam from "assets/img/flags/VN.png";
import English from "assets/img/flags/GB.png";
import { connect } from 'react-redux'

class AuthNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.setState({ open: false });
    }
  }
  render() {
    const {t , i18n }= this.props;
    const changeLanguage = (lng) => {
      if(lng==="EN")  this.props.dispatch({ type: 'GETFLAG', flag: English });
      if(lng==="VN")  this.props.dispatch({ type: 'GETFLAG', flag: Vietnam })
      i18n.changeLanguage(lng);
      this.props.dispatch({ type: 'GETLANGUAGE', language: lng })
    }
    const { classes, color, brandText } = this.props;
    const appBarClasses = cx({
      [" " + classes[color]]: color
    });
    var list = (
      <List className={classes.list}>
        {
				// <ListItem className={classes.listItem}>
          // <NavLink to={"/admin/dashboard"} className={classes.navLink}>
            // <Dashboard className={classes.listItemIcon} />
            // <ListItemText
              // primary={t("Dashboard")}
              // disableTypography={true}
              // className={classes.listItemText}
            // />
          // </NavLink>
        // </ListItem>
        // <ListItem className={classes.listItem}>
          // <NavLink
            // to={"/auth/pricing-page"}
            // className={cx(classes.navLink, {
              // [classes.navLinkActive]: this.activeRoute("/auth/pricing-page")
            // })}
          // >
            // <MonetizationOn className={classes.listItemIcon} />
            // <ListItemText
              // primary={t("Pricing")}
              // disableTypography={true}
              // className={classes.listItemText}
            // />
          // </NavLink>
        // </ListItem>
				}
        <ListItem className={classes.listItem} style={{marginTop: 10}}>
          <NavLink
            to={"/auth/register-page"}
            className={cx(classes.navLink, {
              [classes.navLinkActive]: this.activeRoute("/auth/register-page")
            })}
          >
            <PersonAdd className={classes.listItemIcon} />
            <ListItemText
              primary={t("Register")}
              disableTypography={true}
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem>
        <ListItem className={classes.listItem} style={{marginTop: 10}}>
          <NavLink
            to={"/auth/login-page"}
            className={cx(classes.navLink, {
              [classes.navLinkActive]: this.activeRoute("/auth/login-page")
            })}
          >
            <Fingerprint className={classes.listItemIcon} />
            <ListItemText
              primary={t("Login")}
              disableTypography={true}
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem>
				{
        // <ListItem className={classes.listItem}>
          // <NavLink
            // to={"/auth/lock-screen-page"}
            // className={cx(classes.navLink, {
              // [classes.navLinkActive]: this.activeRoute(
                // "/auth/lock-screen-page"
              // )
            // })}
          // >
            // <LockOpen className={classes.listItemIcon} />
            // <ListItemText
              // primary={t("Lock")}
              // disableTypography={true}
              // className={classes.listItemText}
            // />
          // </NavLink>
        // </ListItem>
				}

        <ListItem className={classes.listItem}>
        <GridItem xs={6}>
            <CustomDropdown
             hoverColor="info"
            buttonText={<img alt="..." src={this.props.flag} />}
             buttonProps={{
               style: { marginBottom: "0", boxShadow: "none", backgroundColor: "inherit" }
             }}
             dropdownList={[
               <div 
                 onClick={() => {
                   changeLanguage('VN');
                   this.setState({ flag: Vietnam})
                 }}
                 style={{textAlign: "center"}}
                 ><img alt="..." src= {Vietnam} ></img> VN</div>,
               <div onClick={() => {
                   changeLanguage('EN');
                   this.setState({ flag: English})
                 }}
                 style={{textAlign: "center"}}
                 ><img alt="..." src= {English} ></img> EN</div>,
             ]}
           />
           </GridItem>
        </ListItem>
        
      </List>
    );
    return (
      <AppBar position="static" className={classes.appBar + appBarClasses} style={{boxShadow: "rgb(2, 29, 47) 0px 0px 10px 5px"}}>
        <Toolbar className={classes.container}>
          <Hidden smDown>
            <div className={classes.flex}>
              <Button href="#" className={classes.title} color="transparent">
                {t(brandText)}
              </Button>
            </div>
          </Hidden>
          <Hidden mdUp>
            <Button
              className={classes.sidebarButton}
              color="transparent"
              justIcon
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
            >
              <Menu />
            </Button>
          </Hidden>
          <Hidden mdUp>
            <div className={classes.flex}>
              <Button href="#" className={classes.title} color="transparent">
                {t(brandText)}
              </Button>
            </div>
          </Hidden>
          <Hidden smDown>{list}</Hidden>
          <Hidden mdUp>
            <Hidden mdUp>
              <Drawer
                variant="temporary"
                anchor={"left"}
                open={this.state.open}
                classes={{
                  paper: classes.drawerPaper
                }}
                onClose={this.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
              >
                {list}
              </Drawer>
            </Hidden>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

AuthNavbar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string
};

export default connect((state) => {
  return ({
    User: state.reducer_user.User,
    
    state: state,
    language:state.reducer_user.language,
    flag: state.reducer_user.flag
  })
})(withTranslation("translations")(withStyles(authNavbarStyle)(AuthNavbar)));
