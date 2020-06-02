import React, { Suspense, lazy } from "react";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import pagesStyle from "assets/jss/material-dashboard-pro-react/layouts/authStyle.jsx";
import "assets/scss/material-dashboard-pro-react.scss?v=1.7.0";
import 'antd/dist/antd.css';
import "assets/css/style.css";
import "assets/css/fontSize.css";
import 'views/css/css.css';

import Constants from "variables/Constants/";
import NetworkDetector from "./network";
import StoreService from "services/StoreConfig";
import UserService from "services/UserService";
import HttpService from "services/HttpService";
import login from "assets/img/login.jpg";


const hist = createBrowserHistory();

const AuthLayout = lazy(() => import("layouts/Auth.jsx"));
const AdminLayout = lazy(() => import("layouts/Admin.jsx"));
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount = () => {
    this.props.i18n.changeLanguage(this.props.language);
    UserService.getCurrentUser();    
  };

  componentDidMount() {
    document.title = "Ohstore - Phần mềm quản lý kho bán hàng";

    if ( this.props.isAuth === null){
      HttpService.setBranch(Constants.DEFAULT_BRANCH_ID, false, Constants.DEFAULT_BRANCH_NAME );
    }
  }

  getStoreConfig = async () => {
    let promises = [
      StoreService.getConfig({
        types: ["manufacturing", "manufacturing_stock", "language_product"]
      })
    ];

    let responds = await Promise.all(promises);

    let configManufacture = responds[0];

    if (configManufacture.status) {
      this.props.dispatch({ type: "MANUFACTURE", Manufacture: configManufacture.data.manufacturing })
      this.props.dispatch({ type: "MANUFACTURE_STOCK", Manufacture_Stock: configManufacture.data.manufacturing_stock })
      this.props.dispatch({ type: "LANGUAGE_PRODUCT", Language_Product: configManufacture.data.language_product })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.language !== prevProps.language) {
      this.props.i18n.changeLanguage(this.props.language);
    }
    if (this.props.isAuth !== prevProps.isAuth && this.props.isAuth === true) {
      if (this.props.stockList && !Object.keys(prevProps.stockList).length) {
        HttpService.setBranch(Constants.DEFAULT_BRANCH_ID, false, Constants.DEFAULT_BRANCH_NAME);
      }
      this.getStoreConfig();
      HttpService.getData();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Router history={hist}>
        <Suspense fallback={<div className={classes.fullPage} style={{ backgroundImage: "url(" + login + ")" }} />}>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          {this.props.isAuth === null ?
            <></> : this.props.isAuth ? (
              <Switch>
                <Route path="/admin" component={AdminLayout} />
                <Redirect from="/auth/login-page" to="/admin/dashboard" />
                <Redirect from="/" to="/admin/dashboard" />
              </Switch>
            ) : (
                <Switch>
                  <Route path="/auth" component={AuthLayout} />
                  <Redirect from="/" to="/auth" />
                </Switch>
              )}
        </Suspense>
      </Router>
    );
  }
}

export default connect(function (state) {
  return {
    isAuth: state.userReducer.isAuth,
    User_Function: state.reducer_user.User_Function,
    language: state.reducer_user.language,
    stockList: state.stockListReducer.stockList

  };
})(withTranslation("translations")(NetworkDetector(withStyles(pagesStyle)(App))));