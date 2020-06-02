import { ImageBackground, View } from "react-native";
import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text
} from "native-base";
import styles from "./styles";

const launchscreenLogo = require("assets/logo-kitchen-sink.png");

class Default extends Component {
  render() {
    return (
      <View style={{...styles.logoContainer, ...this.props.style}}>
				<ImageBackground source={launchscreenLogo} style={styles.logo} />
				<Text style={styles.logoCompany}>AITT</Text>
				<Text style={styles.logoProject}>OHTASK</Text>
			</View>
    );
  }
}

export default Default;
