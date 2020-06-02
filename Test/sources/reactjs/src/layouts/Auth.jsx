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
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Footer from "components/Footer/Footer.jsx";

import routes from "routes.js";

import pagesStyle from "assets/jss/material-dashboard-pro-react/layouts/authStyle.jsx";
import { withTranslation } from 'react-i18next';

import login from "assets/img/login.jpg";
import OhLanguage from "components/Oh/OhLanguage";
import StoreService from "services/StoreConfig";

class Pages extends React.Component {
  constructor(props){
    super(props);
    this.state={
      expired: false,
    }
  }
  wrapper = React.createRef();
  componentDidMount() {
    document.body.style.overflow = "unset";
    this.checkExpiredStore();
  }

  async checkExpiredStore(){
    let expiredStore = await StoreService.getStoreExpired()
    if(expiredStore.status){
      this.setState({expired: expiredStore.data !== "" && expiredStore.data < new Date().getTime()})
    }
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path + (prop.parameter_name || "")}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBgImage = () => {
    if (window.location.pathname.indexOf("/auth/register-page") !== -1) {
      return login;
    } else if (window.location.pathname.indexOf("/auth/login-page") !== -1) {
      return login;
    } else if (window.location.pathname.indexOf("/auth/ForgotPage") !== -1) {
      return login;
    } else if (window.location.pathname.indexOf("/auth/pricing-page") !== -1) {
      return login;
    } else if (window.location.pathname.indexOf("/auth/lock-screen-page") !== -1) {
      return login;
    } else if (window.location.pathname.indexOf("/auth/error-page") !== -1) {
      return login;
    }else if (window.location.pathname.indexOf("/auth/forgot-password-page") !== -1) {
      return login;
    }else if (window.location.pathname.indexOf("/auth/forgot-password") !== -1) {
      return login;
    }

  };
  getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.wrapper + ' dad'} ref={this.wrapper}>
        <OhLanguage style={{position: 'absolute', zIndex: 3, right: '10px'}}/>
        <div
          className={classes.fullPage}
          style={{ backgroundImage: "url(" + this.getBgImage() + ")" }}
        >
          {this.state.expired ? 
            <div className={classes.expired}>
              <h3>{t("Hết hạn dùng thử cửa hàng.")}</h3>
              <h3>{t("Vui lòng gọi 1900 888698 để OhStore tiếp tục đồng hành cùng bạn.")}</h3>
            </div> :
            <Switch>
              {this.getRoutes(routes)}
              <Redirect from="/auth" to="/auth/login-page" />
            </Switch>
          }
          <Footer white />
        </div>
      </div>
    );
  }
}

Pages.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTranslation("translations")(withStyles(pagesStyle)(Pages));
