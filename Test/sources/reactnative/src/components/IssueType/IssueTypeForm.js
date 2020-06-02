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
class IssueTypeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IssueType: {}
    };
  }

  updateIssueType = async () => {
    await this.props.updateIssueType(this.state.IssueType);
    await this.props.closeModal(false, "", {});
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data)
    {
      if (this.props.title === "Edit Issue Type")
      {
        this.updataIssueType(this.props.data);
      } else {
        this.updataIssueType({
          Name: "",
          Color: "#",
          Description: ""
        });
      }
    }
  }

  updataIssueType = (data) => {
    this.setState({
      IssueType: data
    });
  }

  render() {
    var IssueType = this.state.IssueType;
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
                        <Input value={this.state.IssueType.Name} onChangeText={(e) => this.setState({IssueType:{...IssueType,Name:e}})}/>
                      </Item>
                      <Item floatingLabel>
                        <Label>Color</Label>
                        <Input value={this.state.IssueType.Color} onChangeText={(e) => this.setState({IssueType:{...IssueType,Color:e}})}/>
                      </Item>
                      <Item floatingLabel>
                          <Label>Description</Label>
                          <Input value={this.state.IssueType.Description} onChangeText={(e) => this.setState({IssueType:{...IssueType,Description:e}})}/>
                      </Item>
                    </Form>
                    <View style= {{flexDirection: "row", marginTop:10 , marginBottom:10}}>
                      <TouchableOpacity style={{backgroundColor:"#3775D1", alignContent:"center", alignItems:"center",width:80, marginLeft:width-230, marginRight:10}}
                          onPress={() => this.updateIssueType()}
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

export default IssueTypeForm;
