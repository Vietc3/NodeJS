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
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import * as serviceWorker from './serviceWorker';
import { IconContext } from "react-icons";
import store from "store/Store";
import i18n from './i18n';
// import App from "./App.jsx";

import(/*webpackChunkName: 'src', webpackPrefetch: true */ './App.jsx')
.then( ({default: App})=>
  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <IconContext.Provider>
          <App />
        </IconContext.Provider>
      </Provider>
    </I18nextProvider>,
    document.getElementById("root")
  )
)
serviceWorker.register();
