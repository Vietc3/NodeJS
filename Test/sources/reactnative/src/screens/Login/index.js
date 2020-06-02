import * as React from "react";
import { Image, Platform, Linking  } from "react-native";
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Footer, Form, Item, Label, Input } from "native-base";
import CustomLogo from "components/CustomLogo";
import {signInUser, saveEmail} from "store/actions/user";
import { connect } from "react-redux";
//import styles from "./styles";


class Login extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: ""
		};
	}
	onLogin = ()=>{
		let {email, password} = this.state;
		saveEmail(email);
	}
	render() {
		const {email, password} = this.state;
		console.log(this.props.redux);
		return (
			<Container>
				<Header style={{ height: 100 }}>
					<Body style={{ alignItems: "center" }}>
						<CustomLogo 
							style={{
								position: "absolute",
								top: -150,
								left: -30
							}}
						/>
					</Body>
				</Header>
				<Content>
					<Form>
            <Item fixedLabel>
              <Label>Email</Label>
              <Input 
								onChangeText={text => this.setState({email: text})}
							/>
            </Item>
            <Item fixedLabel last>
              <Label>Password</Label>
              <Input 
								secureTextEntry 
								onChangeText={text => this.setState({password: text})}
							/>
            </Item>
          </Form>
					<View padder>
						<Button block onPress={() => this.onLogin()}>
							<Text>Login</Text>
						</Button>
					</View>
				</Content>
				<Footer style={{ backgroundColor: "#F8F8F8" }}>
					<View style={{ alignItems: "center", opacity: 0.5, flexDirection: "row" }}>
						<View padder>
							<Text style={{ color: "#000", fontSize: 12}}>© 2010 All rights reserved {'\n'} AITT Artificial Intelligence Technology Company </Text>
						</View>
					</View>
				</Footer>
			</Container>
		);
	}
}

export default connect((state)=>({redux: state}))(Login);
