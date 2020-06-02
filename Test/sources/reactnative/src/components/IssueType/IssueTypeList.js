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
import IssueTypeItem from "./IssueTypeItem";
import IssueTypeForm from "./IssueTypeForm";
import Icon1 from "react-native-vector-icons/FontAwesome";
import { serverURL } from "../../../server/config/config";
import openSocket from "socket.io-client";

const socket = openSocket(serverURL);
class IssueTypeList extends Component {
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
      ref: "IssueType"
    };
    this.props.fetchIssueTypes(data);
  }
  openModal = (status, title, data) =>{
    this.setState({
      isVisiable:status,
      title: title,
      data: data
    });
  }
  render() {
    socket.on("changeIssueType", () => { this.getData(); });
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
            <Title>Issue Type</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.openModal(true, "Add Issue Type", {})}
            >
              <Icon1 style={{color:"white"}} size={20} name="plus" />
            </Button>
          </Right>
        </Header>
        <Content>
          {this.props.listIssueTypes.loading ? (<Spinner />) : (
          <List>
            {this.props.listIssueTypes.issuetypes.length > 0 ?
              this.props.listIssueTypes.issuetypes.map((item,key)=>{
                return  <IssueTypeItem key={key} data={item} openModal={this.openModal} deleteIssueType={this.props.deleteIssueType}/>;
              })
            : null}
          </List>
          )}
        </Content>
        <IssueTypeForm
          title={this.state.title}
          data={this.state.data}
          isVisiable={this.state.isVisiable}
          closeModal={this.openModal}
          getData={this.getData}
          updateIssueType={this.props.updateIssueType}
        />
      </Container>
    );
  }
}

export default IssueTypeList;
