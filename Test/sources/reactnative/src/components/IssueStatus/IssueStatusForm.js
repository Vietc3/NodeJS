import { connect } from "react-redux";
import React, { Component } from "react";
import { 
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";
import {
  Text,
  Form,
  Input,
  Item,
  Label
} from "native-base";
import Modal from 'react-native-modal';

const {width ,height} = Dimensions.get("window");
class IssueStatusForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IssueStatus: {}
    };
  }

  updateIssueStatus = async () => {
    await this.props.updateIssueStatus(this.state.IssueStatus);
    await this.props.closeModal(false, "", {});
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data)
    {
      if (this.props.title === "Edit Issue Status")
      {
        this.updataIssueStatus(this.props.data);
      } else {
        this.updataIssueStatus({
          Name: "",
          Color: "#",
          Description: ""
        });
      }
    }
  }

  updataIssueStatus = (data) => {
    this.setState({
      IssueStatus: data
    });
  }

  render() {
    var IssueStatus = this.state.IssueStatus;
    return (
        <Modal
            isVisible={this.props.isVisiable}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={100}
            animationOutTiming={100}
            backdropTransitionInTiming={100}
            backdropTransitionOutTiming={100}
            onBackdropPress={async () =>
                this.props.closeModal(false, "", {})
            }
        >
                <View style={{backgroundColor:"white",borderRadius:25, padding:10, width:0.9*width}}>
                    <View style= {{flexDirection: 'row',borderBottomColor: 'black', borderBottomWidth: 1}}>
                      <Label style={{marginLeft:width/2-80}}>{this.props.title}</Label>
                    </View>
                    <Form>
                      <Item floatingLabel>
                        <Label>Name</Label>
                        <Input value={this.state.IssueStatus.Name} onChangeText={(e) => this.setState({IssueStatus:{...IssueStatus,Name:e}})}/>
                      </Item>
                      <Item floatingLabel>
                        <Label>Color</Label>
                        <Input value={this.state.IssueStatus.Color} onChangeText={(e) => this.setState({IssueStatus:{...IssueStatus,Color:e}})}/>
                      </Item>
                      <Item floatingLabel>
                          <Label>Description</Label>
                          <Input value={this.state.IssueStatus.Description} onChangeText={(e) => this.setState({IssueStatus:{...IssueStatus,Description:e}})}/>
                      </Item>
                    </Form>
                    <View style= {{flexDirection: "row", marginTop:10 , marginBottom:10}}>
                      <TouchableOpacity style={{backgroundColor:"#3775D1", alignContent:"center", alignItems:"center",width:80, marginLeft:width-230, marginRight:10}}
                          onPress={() => this.updateIssueStatus()}
                      >
                          <Text style={{color:"white"}}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{backgroundColor:"gray", alignContent:"center", alignItems:"center",width:80}}
                          onPress={() => this.props.closeModal(false, "", {})}
                      >
                          <Text style={{color:"white"}}>Close</Text>
                      </TouchableOpacity>
                  </View>
                </View>
        </Modal>
    );
  }
}

export default IssueStatusForm;
