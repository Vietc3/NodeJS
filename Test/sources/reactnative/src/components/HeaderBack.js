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

class Default extends Component {
  render() {
		console.log(this.props);
    return (
			<Header>
				<Left>
					<Button transparent onPress={() => this.props.navigation.goBack()}>
						<Icon name="arrow-back" />
					</Button>
				</Left>
				<Body>
					<Title>{this.props.title}</Title>
				</Body>
				<Right />
			</Header>
    );
  }
}

export default Default;
