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
import { Switch, Route, Redirect } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import withStyles from "@material-ui/core/styles/withStyles";
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import routes from "routes.js";
import appStyle from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.jsx";
import { connect } from "react-redux";
import Constants from "variables/Constants/";

var ps;

class Dashboard extends React.Component {
  state = {
    mobileOpen: false,
    miniActive: false,
    image: require("assets/img/sidebar-4.jpg"),
    color: "blue",
    bgColor: "black",
    hasImage: true,
    fixedClasses: "dropdown",
    logo: require("assets/img/logo-white.svg")
  };
  mainPanel = React.createRef();
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);

  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.mainPanel.current.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleBgColorClick = bgColor => {
    switch (bgColor) {
      case "white":
        this.setState({ logo: require("assets/img/logo.svg") });
        break;
      default:
        this.setState({ logo: require("assets/img/logo-white.svg") });
        break;
    }
    this.setState({ bgColor: bgColor });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return routes[i].name;
        }
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  getRoutes = routes => {
    let { currentUser } = this.props;
    
    return routes.map((prop, key) => {
      if (prop.permissionName) {
        let permissionName = prop.permissionName;

        for (let index in permissionName){
          let roles = permissionName[index];

          if (index === 'or') {
            if (roles.every(item => !currentUser.permissions[item] || currentUser.permissions[item] < Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY)) return null;
          } else if (index === 'and') {
            if (roles.some(item => !currentUser.permissions[item] || currentUser.permissions[item] < Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY)) return null;
          }
        }
      }

      if (prop.state && prop.state === "Manufacture" && parseInt(this.props.Manufacture) === Constants.MANUFACTURE_OPTIONS.OFF ) {
        return null;
      }

      if (prop.layout === "/admin") {
        if (prop.path === "/manufacturing_warehouse" && parseInt(this.props.Manufacture_Stock) === 0) {
          return null;
        }
        let route = [
          <Route path={prop.layout + prop.path + (prop.parameter_name || "")} component={prop.component} key={key} />
        ];
        if (prop.collapse) {
          route.push(this.getRoutes(prop.views));
        }
        return route;
      } else if (prop.collapse) {
        return this.getRoutes(prop.views);
      } else {
        return null;
      }
    });
  };
  sidebarMinimize = () => {
    this.setState({ miniActive: !this.state.miniActive });
  };
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };
  render() {
    const { classes, currentUser, render, dispatch, ...rest } = this.props;
    
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]: navigator.platform.indexOf("Win") > -1,
        ['salesCounterPages']: window.location.pathname === "/admin/sales-counter",
        
      });

    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"Creative Tim"}
          logo={this.state.logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          bgColor={this.state.bgColor}
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref={this.mainPanel}>
          <AdminNavbar
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            brandText={this.getActiveRoute(routes)}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          
          <div className={classes.map} key ={this.props.branchId}>
            <Switch>
              {this.getRoutes(routes)}
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </div>
          {this.getRoute() ? <Footer fluid /> : null}
          {/* <FixedPlugin
            handleImageClick={this.handleImageClick}
            handleColorClick={this.handleColorClick}
            handleBgColorClick={this.handleBgColorClick}
            handleHasImage={this.handleHasImage}
            color={this.state["color"]}
            bgColor={this.state["bgColor"]}
            bgImage={this.state["image"]}
            handleFixedClick={this.handleFixedClick}
            fixedClasses={this.state.fixedClasses}
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
          /> */}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(function (state) {
  return {
    isLoading: state.Summary.isLoading,
    currentUser: state.userReducer.currentUser,
    Manufacture_Stock: state.reducer_user.Manufacture_Stock,
    Manufacture: state.reducer_user.Manufacture,
    branchId: state.branchReducer.branchId,

  };
})(withStyles(appStyle)(Dashboard));
