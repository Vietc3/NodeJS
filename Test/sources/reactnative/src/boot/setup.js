import React, { Component } from "react";
import { StyleProvider } from "native-base";
import { Provider } from "react-redux";

import configureStore from "store/";
import Routes from "routes/index";
import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";

export default class Setup extends Component {
	constructor() {
    super();
    this.state = {
      isLoading: false,
      store: configureStore(() => this.setState({ isLoading: false }))
    };
  }
  render() {
    return (
      <StyleProvider style={getTheme(variables)}>
				<Provider store={this.state.store}>
          <Routes />
        </Provider>
      </StyleProvider>
    );
  }
}
