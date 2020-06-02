import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text
} from "native-base";
import styles from "./styles";
import DateTimePicker from "react-native-modal-datetime-picker";
import { View } from 'react-native';
import { Grid, Col } from "react-native-easy-grid";
import HeaderBack from "components/HeaderBack";
import FormIssue from "screens/Issue/FormIssue/FormIssue";

class CreateIssue extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <HeaderBack {...this.props} title={"Add Issue"}/>
        <Content>
          <FormIssue />
					<View style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
						<View>
							<Button style={{ margin: 1, marginTop: 20 }}>
								<Text>Add</Text>
							</Button>
						</View>
						<View>
							<Button light style={{ margin: 1, marginTop: 20 }}>
								<Text>Cancel</Text>
							</Button>
						</View>
					</View>
        </Content>
      </Container>
    );
  }
}

export default CreateIssue;
