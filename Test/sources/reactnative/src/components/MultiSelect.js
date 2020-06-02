import { ImageBackground, View } from "react-native";
import React, { Component } from "react";
import MultiSelect from 'react-native-multiple-select';
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
  Text
} from "native-base";
import styles from "./styles";

class Default extends Component {
	constructor(props) {
    super(props);
		this.state = {
			selectedItems : []
		};
  }
 
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };
  render() {
    const { selectedItems, multiSelect } = this.state;
    return (
      <View style={{ flex: 1 }} onPress={()=>console.log("abc")}>
        <MultiSelect
          hideTags
          items={this.props.data}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component}}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Watchers"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
					styleDropdownMenuSubsection={{paddingTop: 0, paddingBottom: 0}}
					itemFontSize={14}
					fontSize={17}
        />
        <View>
          {this.multiSelect?this.multiSelect.getSelectedItemsExt(selectedItems):null}
        </View>
      </View>
    );
  }
}

export default Default;
