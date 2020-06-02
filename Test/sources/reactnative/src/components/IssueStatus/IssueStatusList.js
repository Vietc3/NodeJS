import { connect } from "react-redux";
import React, { Component } from "react";
import {
  FlatList,
  View
} from "react-native";
import {
	Container,
	Header,
	Title,
	Content,
	Button,
	Icon,
	List,
	Left,
	Right,
	Body,
  Spinner
} from "native-base";
import IssueStatusItem from "./IssueStatusItem";
import IssueStatusForm from "./IssueStatusForm";
import Icon1 from "react-native-vector-icons/FontAwesome";
import { serverURL } from "../../../server/config/config";
import openSocket from "socket.io-client";

const socket = openSocket(serverURL);
class IssueStatusList extends Component {
  constructor(props) {
    super(props);
    this.page = 1;
    this.state = {
      isVisiable:false,
      title: "",
      data: {},
      isLoading: false,
      IssueStatus: []
  };
  }
  componentDidMount() {
    this.getData();
  }
  getDataFilter = () => {
    this.setState({ loading: true });
    this.setState({
      IssueStatus: this.props.listIssueStatuses.issueStatuses.slice(0,this.page * 10),
      isLoading: false
    });
  };

  getData = async () => {
    var data = {
      ref: "IssueStatus"
    };
    await this.props.fetchIssueStatuses(data);
    this.getDataFilter();
  }
  openModal = (status, title, data) =>{
    this.setState({
      isVisiable:status,
      title: title,
      data: data
    });
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };
  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
     if (!this.state.isLoading) {return null;}
     return (
       <Spinner
         style={{ color: "#000" }}
       />
     );
   };
   handleLoadMore = () => {
    console.log("1");
    if (!this.state.isLoading) {
      console.log("2");
      this.page = this.page + 1; // increase page by 1
      this.getDataFilter();
    }
  };
  render() {
    socket.on("changeIssueStatus", () => { this.getData(); });
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
            <Title>Issue Status</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.openModal(true, "Add Issue Status", {})}
            >
              <Icon1 style={{color:"white"}} size={20} name="plus" />
            </Button>
          </Right>
        </Header>
        <Container>
          {this.props.listIssueStatuses.loading ? (<Spinner />) : (
          <FlatList
            data={this.state.IssueStatus}
            renderItem={({ item,key }) => (
              <IssueStatusItem key={key} data={item} openModal={this.openModal} deleteIssueStatus={this.props.deleteIssueStatus}/>
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.1}
            onEndReached={this.handleLoadMore.bind(this)}
            initialNumToRender={10}
          />
          )}
        </Container>
        <IssueStatusForm
          title={this.state.title}
          data={this.state.data}
          isVisiable={this.state.isVisiable}
          closeModal={this.openModal}
          getData={this.getData}
          updateIssueStatus={this.props.updateIssueStatus}
        />
      </Container>
    );
  }
}

export default IssueStatusList;
