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
/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { NavLink, Link } from "react-router-dom";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";

// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.jsx";

import sidebarStyle from "assets/jss/material-dashboard-pro-react/components/sidebarStyle.jsx";

import avatar from "assets/img/new_logo.png";
import logoEmpty from "assets/img/empty.png";

import { connect } from "react-redux";
import { withTranslation, Translation } from "react-i18next";
import Constants from "variables/Constants/";
import { objectProperty } from "@babel/types";
import { arrayIncludes } from "@material-ui/pickers/_helpers/utils";
import StoreService from "services/StoreConfig";

var ps;
// We've created this component so we can have a ref to the wrapper of the links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we didn't have access to
// the links, and couldn't initialize the plugin.
class SidebarWrapper extends React.Component {
  sidebarWrapper = React.createRef();
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebarWrapper.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const { className, user, headerLinks, links } = this.props;
    return (
      <div className={className} ref={this.sidebarWrapper}>
        {user}
        {headerLinks}
        {links}
      </div>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      miniActive: true,
      ...this.getCollapseStates(props.routes),
      url: Constants.LOGO
    };
  }

  componentDidMount() {
    this.getLogo();
  }

  async getLogo() {
    let logoStore = await StoreService.getConfig({ types: ["store_logo"] })
    if (logoStore.status && (Object.keys(logoStore.data).length > 0 && Object.values(logoStore.data)[0] !== "")) {
      this.setState({
        url: logoStore.data["store_logo"]
      })
    }
    else {
      this.setState({
      url: Constants.LOGO
    })
  }
  }

  mainPanel = React.createRef();
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = routes => {
    let initialState = {};
    routes.map(prop => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: prop.expandDefault ? true : this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute = routeName => {
    return window.location.href.indexOf(routeName) > -1 ? "active" : "";
  };
  openCollapse(collapse) {
    var st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = routes => {
    let { currentUser } = this.props;
    const { classes, color, rtlActive } = this.props;
    return routes.map((prop, key) => {
      if (prop.permissionName) {
        let permissionName = prop.permissionName;

        for (let index in permissionName){
          let roles = permissionName[index];

          if(index === 'or') {
            if (roles.every(item => !currentUser.permissions[item] || currentUser.permissions[item] < Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY)) return null;
          } else if (index === 'and') {
            if (roles.some(item => !currentUser.permissions[item] || currentUser.permissions[item] < Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY)) return null;
          }
        }
      }
      if (prop.redirect) {
        return null;
      }
      if (prop.path === "/manufacturing_warehouse" && parseInt(this.props.Manufacture_Stock) === 0) {
        return null;
      }

      if (((prop.state && prop.state === "Manufacture") || (prop.path && prop.path === "/finished-estimates-report" )) && parseInt(this.props.Manufacture) === Constants.MANUFACTURE_OPTIONS.OFF ) {
        return null;
      }

      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !this.state[prop.state];
        const navLinkClasses =
          classes.itemLink +
          " " +
          cx({
            [" " + classes.collapseActive]: this.getCollapseInitialState(prop.views),
            [" " + classes[color]]: this.activeRoute(prop.layout + prop.path)
          });
        const itemText =
          classes.itemText +
          " " +
          cx({
            [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
            [classes.itemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
            [classes.itemTextRTL]: rtlActive
          });
        const collapseItemText =
          classes.collapseItemText +
          " " +
          cx({
            [classes.collapseItemTextMini]: this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextRTL]: rtlActive
          });
        const itemIcon =
          classes.itemIcon +
          " " +
          cx({
            [classes.itemIconRTL]: rtlActive
          });
        const caret =
          classes.caret +
          " " +
          cx({
            [classes.caretRTL]: rtlActive
          });
        const collapseItemMini =
          classes.collapseItemMini +
          " " +
          cx({
            [classes.collapseItemMiniRTL]: rtlActive
          });
        const { t, i18n } = this.props;
        const hasIcon = prop.icon !== undefined || prop.iconImage !== undefined;        
        return (
          <ListItem key={key} className={cx({ [classes.item]: hasIcon }, { [classes.collapseItem]: !hasIcon })}>
            <NavLink
              to={prop.path && prop.layout ? prop.layout + prop.path + (prop.parameter_value ? "/" + prop.parameter_value.join("/") : "") : "#"}
              className={navLinkClasses}
              onClick={e => {
                prop.path && prop.layout ? null : e.preventDefault();
                // thu gọn menu
                // Object.entries(st).forEach(([key, value])=>{
                //     this.setState(st);
                //     this.state.prevId===key?null:(
                //         this.setState({prevId:key}),
                //         this.setState({[this.state.prevId]:false}))
                // });
                this.setState(st);
              }}
            >
              {prop.icon !== undefined ? (
                typeof prop.icon === "string" ? (
                  <Icon className={itemIcon}>{prop.icon}</Icon>

                ) : (
                    <prop.icon className={itemIcon} />
                  )
              ) : prop.iconImage !== undefined ? (
                <img
                  className={itemIcon}
                  src={prop.iconImage}
                  style={{
                    position: "inherit",
                    float: "left",
                    width: 25,
                    height: 25
                  }}
                ></img>
              ) : (
                    <span className={collapseItemMini}>{rtlActive ? prop.rtlMini : prop.mini}</span>
                  )}
              <ListItemText
                primary={rtlActive ? prop.rtlName : t(prop.name)}
                secondary={(prop.views || []).filter(item => !item.redirect).length ? <b className={caret + " " + (this.state[prop.state] ? classes.caretActive : "")} /> : null}
                disableTypography={true}
                className={cx(
                  { [itemText]: hasIcon },
                  {
                    [collapseItemText]: !hasIcon
                  }
                )}
              />
            </NavLink>
            <Collapse in={this.state[prop.state]} unmountOnExit>
              <List className={classes.list + " " + classes.collapseList} style={{ paddingLeft: "15px" }}>
                {this.createLinks(prop.views)}
              </List>
            </Collapse>
          </ListItem>
        );
      }

      const innerNavLinkClasses =
        classes.collapseItemLink +
        " " +
        cx({
          [" " + classes[color]]: this.activeRoute(prop.layout + prop.path)
        });
      const collapseItemMini =
        classes.collapseItemMini +
        " " +
        cx({
          [classes.collapseItemMiniRTL]: rtlActive
        });
      const navLinkClasses =
        classes.itemLink +
        " " +
        cx({
          [" " + classes[color]]: this.activeRoute(prop.layout + prop.path)
        });
      const itemText =
        classes.itemText +
        " " +
        cx({
          [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
          [classes.itemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
          [classes.itemTextRTL]: rtlActive
        });
      const collapseItemText =
        classes.collapseItemText +
        " " +
        cx({
          [classes.collapseItemTextMini]: this.props.miniActive && this.state.miniActive,
          [classes.collapseItemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
          [classes.collapseItemTextRTL]: rtlActive
        });
      const itemIcon =
        classes.itemIcon +
        " " +
        cx({
          [classes.itemIconRTL]: rtlActive
        });
      const { t, i18n } = this.props;
      const hasIcon = prop.icon !== undefined || prop.iconImage !== undefined;
      
      return (
        <ListItem key={key} className={cx({ [classes.item]: hasIcon }, { [classes.collapseItem]: !hasIcon })}>
          <NavLink
            to={prop.layout + prop.path + (prop.parameter_value ? "/" + prop.parameter_value.join("/") : "")}
            className={cx({ [navLinkClasses]: hasIcon }, { [innerNavLinkClasses]: !hasIcon })}
          >
            {prop.icon !== undefined ? (
              typeof prop.icon === "string" ? (
                <Icon className={itemIcon}>{prop.icon}</Icon>
              ) : (
                  <prop.icon className={itemIcon} />
                )
            ) : prop.iconImage !== undefined ? (
              <img
                className={itemIcon}
                src={prop.iconImage}
                style={{
                  position: "inherit",
                  float: "left",
                  width: 25,
                  height: 25
                }}
              ></img>
            ) : (
                  <span className={collapseItemMini}>{rtlActive ? prop.rtlMini : prop.mini}</span>
                )}
            <ListItemText
              primary={rtlActive ? prop.rtlName : t(prop.name)}
              disableTypography={true}
              className={cx({ [itemText]: hasIcon }, { [collapseItemText]: !hasIcon })}
            />
          </NavLink>
        </ListItem>
      );
    });
  };
  render() {
    const { t, i18n } = this.props;

    const { classes, logo, image, logoText, routes, bgColor, rtlActive } = this.props;
    const itemText =
      classes.itemText +
      " " +
      cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
        [classes.itemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.itemTextRTL]: rtlActive
      });
    const collapseItemText =
      classes.collapseItemText +
      " " +
      cx({
        [classes.collapseItemTextMini]: this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextRTL]: rtlActive
      });
    const userWrapperClass =
      classes.user +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    const caret =
      classes.caret +
      " " +
      cx({
        [classes.caretRTL]: rtlActive
      });
    const collapseItemMini =
      classes.collapseItemMini +
      " " +
      cx({
        [classes.collapseItemMiniRTL]: rtlActive
      });
    const photo =
      classes.photo +
      " " +
      cx({
        [classes.photoRTL]: rtlActive
      });

    var user = (
      <div></div>
      // <div className={userWrapperClass}>
      //   <div className={photo}>
      //     <img src={this.state.url} className={classes.avatarImg} alt="..." />
      //   </div>
      //   <List className={classes.list}>
      //     <ListItem className={classes.item + " " + classes.userItem}>
      //       <NavLink
      //         to={"#"}
      //         className={classes.itemLink + " " + classes.userCollapseButton}
      //         onClick={() => this.openCollapse("openAvatar")}
      //       >
      //         <ListItemText
      //           primary={rtlActive ? "تانيا أندرو" : this.props.User.FullName}

      //           disableTypography={true}
      //           className={itemText + " " + classes.userItemText}
      //         />
      //       </NavLink>

      //     </ListItem>
      //   </List>
      // </div>
    );
    var links = <List className={classes.list}>{this.createLinks(routes)}</List>;

    const logoNormal =
      classes.logoNormal +
      " " +
      cx({
        [classes.logoNormalSidebarMini]: this.props.miniActive && this.state.miniActive,
        [classes.logoNormalSidebarMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.logoNormalRTL]: rtlActive
      });
    const logoMini =
      classes.logoMini +
      " " +
      cx({
        [classes.logoMiniRTL]: rtlActive
      });
    const logoClasses =
      classes.logo +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    var brand = (
      <div className={logoClasses}>
        <a href="/" target="_self" className={logoMini}>

         <h1 style={{marginTop:-10}}> <img src={this.state.url} alt="logo" style={{ width: 'auto', height: 65}} /></h1>
        </a>
        <div style={{marginBottom:15}}/>
      </div>
      
    );
    const drawerPaper =
      classes.drawerPaper +
      " " +
      cx({
        [classes.drawerPaperMini]: this.props.miniActive && this.state.miniActive,
        [classes.drawerPaperRTL]: rtlActive
      });
    const sidebarWrapper =
      classes.sidebarWrapper +
      " " +
      cx({
        [classes.drawerPaperMini]: this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]: navigator.platform.indexOf("Win") > -1
      });
    return (
      window.location.pathname === "/admin/sales-counter" ? null :
      <>
      <div ref={this.mainPanel}>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={"left"}
            open={this.props.open}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              headerLinks={<AdminNavbarLinks rtlActive={rtlActive} />}
              links={links}
            />
            <div className={classes.background}/>
          </Drawer>
        </Hidden>
        {/* below */}
        <Hidden smDown implementation="css">
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? "right" : "left"}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
          >
            {brand}
            {/* below */}
            <SidebarWrapper className={sidebarWrapper} user={user} links={links} />
          </Drawer>
        </Hidden>
      </div>
      </>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: "blue"
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(["white", "black", "blue"]),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf(["white", "red", "orange", "green", "blue", "purple", "rose"]),
  logo: PropTypes.string,
  logoText: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  miniActive: PropTypes.bool,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

SidebarWrapper.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  headerLinks: PropTypes.object,
  links: PropTypes.object
};

export default connect(state => {
  return {
    User: state.reducer_user.User,
    currentUser: state.userReducer.currentUser,
    Manufacture_Stock: state.reducer_user.Manufacture_Stock,
    Manufacture: state.reducer_user.Manufacture
  };
})(withTranslation("translations")(withStyles(sidebarStyle)(Sidebar)));
