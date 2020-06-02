import React, { Component } from "react";
import { Image, View, TouchableHighlight, TouchableOpacity } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge,
	Accordion
} from "native-base";
import CustomLogo from "components/CustomLogo";
import styles from "./style";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const drawerCover = require("../../../assets/drawer-cover.png");
const drawerImage = require("../../../assets/logo-kitchen-sink.png");

import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
			collapse: {}
    };
  }

  render() {
		const datas = this.props.routes;
		const {collapse} = this.state;

    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <Image source={drawerCover} style={styles.drawerCover} />
          <CustomLogo style={styles.drawerImage} div={50}/>
					<List>
						{datas.map((data)=>{
							return !data.views?(
								<ListItem
									key={data.route}
									button
									noBorder
									onPress={() => this.props.navigation.navigate(data.route)}
								>
									<Left>
										<Icon
											active
											name={data.icon}
											style={{ color: "#777", fontSize: 26, width: 30 }}
										/>
										<Text style={styles.text}>
											{data.name}
										</Text>
									</Left>
									{data.types &&
										<Right style={{ flex: 1 }}>
											<Badge
												style={{
													borderRadius: 3,
													height: 25,
													width: 72,
													backgroundColor: data.bg,
													...data.style
												}}
											>
												<Text
													style={styles.badgeText}
												>{`${data.types} Types`}</Text>
											</Badge>
										</Right>}
								</ListItem>
								): (
								<Collapse 
									isCollapsed={collapse[data.route]?true:false}
									key={data.route}
								>
									<CollapseHeader>
										
										<View>
											<ListItem
												button
												noBorder
												onPress={(e) => this.setState((prev)=>({collapse: {[data.route]: !(prev.collapse[data.route]?true:false)}}))}
											>
												<Left>
													<Icon
														active
														name={data.icon}
														style={{ color: "#777", fontSize: 26, width: 30 }}
													/>
													<Text style={styles.text}>
														{data.name}
													</Text>
												</Left>
												<Right style={{ flex: 1 }}>
													<MaterialIcons 
														active
														name={collapse[data.route]?"keyboard-arrow-down":"keyboard-arrow-right"} 
														style={{ color: "#777", fontSize: 26, width: 30 }}
													/>
												</Right>
											</ListItem>
										</View>
									</CollapseHeader>
									<CollapseBody>
										<View>
											<Content
												bounces={false}
												style={{ flex: 1, backgroundColor: "#fff", top: -1, paddingLeft: 15 }}
											>
												<List
													dataArray={data.views}
													renderRow={data =>{
														return (
															<ListItem
																key={"child_"+data.route}
																button
																noBorder
																onPress={() => this.props.navigation.navigate(data.route)}
															>
																<Left>
																	<Icon
																		active
																		name={data.icon}
																		style={{ color: "#777", fontSize: 26, width: 30 }}
																	/>
																	<Text style={styles.text}>
																		{data.name}
																	</Text>
																</Left>
																{data.types &&
																	<Right style={{ flex: 1 }}>
																		<Badge
																			style={{
																				borderRadius: 3,
																				height: 25,
																				width: 72,
																				backgroundColor: data.bg,
																				...data.style
																			}}
																		>
																			<Text
																				style={styles.badgeText}
																			>{`${data.types} Types`}</Text>
																		</Badge>
																	</Right>}
															</ListItem>
														)
													}}
												/>
											</Content>
										</View>
									</CollapseBody>
								</Collapse>
							)
						})}
					</List>
          
        </Content>
      </Container>
    );
  }
}

export default SideBar;
