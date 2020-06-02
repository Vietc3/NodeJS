const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const { StyleSheet } = React;

export default {
  container: {
    backgroundColor: "#FFF"
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "center",
    marginTop: 10
  },
  mb15: {
    marginBottom: 20
  },
  mt15: {
    marginTop: 15
  },
  mb20: {
    marginBottom: 20
  },
  iconButton: {
    color: "#007aff"
  },
  margin: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#FFF"
  },
  mf: {
    flexGrow: 1,
    alignSelf: "center",
    alignItems: "center"
  },
	logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 8,
    marginBottom: 30,
		flexDirection:'row', 
		flexWrap:'wrap'
  },
  logo: {
    position: "absolute",
    left: Platform.OS === "android" ? 60 : 70,
    top: Platform.OS === "android" ? 45 : 70,
    width: 70,
    height: 70
  },
  logoCompany: {
		position: "absolute",
    left: Platform.OS === "android" ? 150 : 160,
    top: Platform.OS === "android" ? 55 : 80,
    color: "#D8D8D8",
		fontSize: 20,
		color: '#ffffff'
  },
  logoProject: {
		position: "absolute",
    left: Platform.OS === "android" ? 150 : 160,
    top: Platform.OS === "android" ? 80 : 115,
    color: "#D8D8D8",
		fontSize: 25,
		color: '#ffffff'
  }
};
