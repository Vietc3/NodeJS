import { connect } from "react-redux";
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid
} from "react-native";
import {Text} from "native-base";
import { SwipeRow } from "react-native-swipe-list-view";
import Icon2 from "react-native-vector-icons/Entypo";
import { serverURL } from "../../../server/config/config";
import axios from "axios";
class PriorityItem extends Component {
  constructor(props) {
    super(props);
  }
  deleteSectionRow = async (key) => {
	var data = {
		ref: "Issue",
		child: "TypeId",
		childValue: key
	};
	const request = axios.post(serverURL + "/getData", data);
    try {
		const response = await request;
		if (response.data.length !== 0) {
			ToastAndroid.showWithGravity("Priority have " + response.data.length + " Issue. Can't delete.", ToastAndroid.SHORT, ToastAndroid.CENTER);
			return true;
		}
		this.props.deletePriority(key);
		ToastAndroid.showWithGravity("Priority deleted.", ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
    catch (err) {
		ToastAndroid.showWithGravity(err, ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  }
  render() {
	console.log(this.props.data);
    return (
        <SwipeRow
            rightOpenValue={-120}
        >
            <View style={styles.standaloneRowBack}>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={ _ => this.props.openModal(true, "Edit Priority", this.props.data) }>
					<Icon2 name="edit" size={24} style={styles.backTextWhite}/>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteSectionRow(this.props.data.Key) }>
					<Icon2 name="trash" size={24} style={styles.backTextWhite}/>
				</TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.standaloneRowFront} activeOpacity={1}>
                <Text style={{fontSize: 13}}>{this.props.data.Value}</Text>
            </TouchableOpacity>
        </SwipeRow>
    );
  }
}

export default PriorityItem;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		flex: 1
	},
	standalone: {
		marginTop: 30,
		marginBottom: 30,
	},
	standaloneRowFront: {
		backgroundColor: "white",
		justifyContent: "center",
		height: 60,
		paddingLeft: 30,
	},
	standaloneRowBack: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 15
	},
	backTextWhite: {
		color: "#FFF"
	},
	rowFront: {
		alignItems: "center",
		backgroundColor: "#CCC",
		borderBottomColor: "black",
		borderBottomWidth: 1,
		justifyContent: "center",
		height: 60,
	},
	rowBack: {
		alignItems: "center",
		backgroundColor: "#DDD",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: "center",
		bottom: 0,
		justifyContent: "center",
		position: "absolute",
		top: 0,
		width: 60
	},
	backRightBtnLeft: {
		backgroundColor: "blue",
		right: 60
	},
	backRightBtnRight: {
		backgroundColor: "red",
		right: 0
	},
	controls: {
		alignItems: "center",
		marginBottom: 30
	},
	switchContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 5
	},
	switch: {
		alignItems: "center",
		borderWidth: 1,
		borderColor: "black",
		paddingVertical: 10,
		width: Dimensions.get("window").width / 4,
	},
	trash: {
		height: 25,
		width: 25,
	}
});
