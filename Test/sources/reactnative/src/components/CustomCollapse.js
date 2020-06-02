import React, { Component } from "react";
import { Image, View, TouchableHighlight, TouchableOpacity } from "react-native";
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
  Text,
	ListItem
} from "native-base";
import styles from "./styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';

class Default extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapse: {}
		};
		this.dataArray = this.props.dataArray;
	}
  render() {
		console.log(this.props);
		const {collapse} = this.state;
    return (
			<View>
			{this.dataArray.map((data, index)=>{
				let itemKey = "item_"+index;
				return (
					<Collapse 
						isCollapsed={collapse[itemKey]?true:false}
						key={itemKey}
					>
						<CollapseHeader style={{backgroundColor: "#edebed"}}>
							<View>
								<ListItem
									button
									noBorder
									onPress={(e) => this.setState((prev)=>({collapse: {...prev.collapse, [itemKey]: prev.collapse[itemKey]?!prev.collapse[itemKey]:true}}))}
								>
									<Left>
										{data.icon?(
											<Icon
												active
												name={data.icon}
												style={{ color: "#777", fontSize: 26, width: 30 }}
											/>
										):null}
										<Text style={styles.text}>
											{data.title}
										</Text>
									</Left>
									<Right style={{ flex: 1 }}>
										<MaterialIcons 
											active
											name={collapse[itemKey]?"keyboard-arrow-down":"keyboard-arrow-right"} 
											style={{ color: "#777", fontSize: 26, width: 30 }}
										/>
									</Right>
								</ListItem>
							</View>
						</CollapseHeader>
						<CollapseBody >
							<View>
								{data.content || (<Text>{data.text}</Text>)}
							</View>
						</CollapseBody>
					</Collapse>
				)
			})}
				
			</View>
    );
  }
}

export default Default;
