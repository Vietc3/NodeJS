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

class HeaderMenu extends Component {
  render() {
		console.log(this.props);
    return (
			<Header>
				<Left>
					<Button
						transparent
						onPress={() => this.props.navigation.openDrawer()}
					>
						<Icon name="menu" />
					</Button>
				</Left>
				<Body>
					<Title>List</Title>
				</Body>
				<Right />
			</Header>
    );
  }
}

export default HeaderMenu;
