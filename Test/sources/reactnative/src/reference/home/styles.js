const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;

export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null
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
    left: Platform.OS === "android" ? 40 : 50,
    top: Platform.OS === "android" ? 35 : 60,
    width: 100,
    height: 100
  },
  text: {
    color: "#D8D8D8",
    bottom: 6,
    marginTop: 5
  },
  logoCompany: {
		position: "absolute",
    left: Platform.OS === "android" ? 150 : 160,
    top: Platform.OS === "android" ? 45 : 70,
    color: "#D8D8D8",
		fontSize: 30
  },
  logoProject: {
		position: "absolute",
    left: Platform.OS === "android" ? 150 : 160,
    top: Platform.OS === "android" ? 80 : 115,
    color: "#D8D8D8",
		fontSize: 40
  }
};
