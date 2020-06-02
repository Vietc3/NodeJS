import { connect } from "react-redux";
import React, { Component } from "react";
import {
  ListView,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
	TouchableHighlight,
} from "react-native";
import {getData} from "../../api/api";
import {
	Container,
	Header,
	Title,
	Content,
	Button,
	Icon,
	List,
	ListItem,
	Text,
	Left,
	Right,
	Body,
  Spinner
} from "native-base";
import PriorityItem from "./PriorityItem";
import PriorityForm from "./PriorityForm";
import Icon1 from "react-native-vector-icons/FontAwesome";
import { serverURL } from "../../../server/config/config";
import openSocket from "socket.io-client";

const socket = openSocket(serverURL);
class PriorityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisiable:false,
      title: "",
      data: {}
  };
  }
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    var data = {
      ref: "Priority"
    };
    this.props.fetchPriorities(data);
  }
  openModal = (status, title, data) =>{
    this.setState({
      isVisiable:status,
      title: title,
      data: data
    });
  }
  render() {
    socket.on("changePriority", () => { this.getData(); });
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>Priority</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.openModal(true, "Add Priority", {})}
            >
              <Icon1 style={{color:"white"}} size={20} name="plus" />
            </Button>
          </Right>
        </Header>
        <Content>
          {this.props.listPriorities.loading ? (<Spinner />) : (
          <List>
            {this.props.listPriorities.Priorities.length > 0 ?
              this.props.listPriorities.Priorities.map((item,key)=>{
                return  <PriorityItem key={key} data={item} openModal={this.openModal} deletePriority={this.props.deletePriority}/>;
              })
            : null}
          </List>
          )}
        </Content>
        <PriorityForm
          title={this.state.title}
          data={this.state.data}
          isVisiable={this.state.isVisiable}
          closeModal={this.openModal}
          getData={this.getData}
          updatePriority={this.props.updatePriority}
        />
      </Container>
    );
  }
}

export default PriorityList;
