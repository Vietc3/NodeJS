import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Text as TextNB,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body
} from "native-base";

import styles from "./styles";
import { ApplicationProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { Input } from 'react-native-ui-kitten';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
	WebView
} from 'react-native';
import { ECharts } from "react-native-echarts-wrapper";

class Anatomy extends Component {
	state = {
    inputValue: '',
  };
  render() {
		const option = {
			xAxis: {
				type: "category",
				data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
			},
			yAxis: {
				type: "value"
			},
			series: [
				{
					data: [820, 932, 901, 934, 1290, 1330, 1320],
					type: "line"
				}
			]
		};
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
					
					<ApplicationProvider
						mapping={mapping}
						theme={lightTheme}>
						<View style={{
							height: 300
						}}>
							
							<ECharts
								option={option}
								backgroundColor="rgba(93, 169, 81, 0.3)"
							/>
						</View>
					</ApplicationProvider>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full>
              <TextNB>Footer</TextNB>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
export default Anatomy;
