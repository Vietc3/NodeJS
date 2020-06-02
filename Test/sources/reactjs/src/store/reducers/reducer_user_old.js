import avatar from "assets/img/new_logo.png";
import Vietnam from "../../assets/img/flags/VN.png";

const defaultState = {
  isAuth: null,
  isAdmin: false,
  User: {},
  User_Function: {},
  Project_Function: {},
  Manufacture: 1,
  Language_Product: 1,
  Manufacture_Stock: null,
  Priority: ["Low", "Normal", "High", "Urgent", "Immediate"],
  changeAvatar: 0,
  url: avatar,
  language: "VN",
  flag: Vietnam
};

var reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_AUTH":
      return { ...state, isAuth: action.auth };
    case "CHANGE_ISADMIN":
      return { ...state, isAdmin: action.isAdmin };
    case "CHANGE_USER_INFOR":
      return { ...state, User: action.user };
    case "SET_USER_FUNCTION":
      return { ...state, User_Function: action.User_Function };
    case "SET_PROJECT_FUNCTION":
      return { ...state, Project_Function: action.Project_Function };
    case "GETURL":
      return { ...state, url: action.url };
    case "MANUFACTURE":
        return { ...state, Manufacture: action.Manufacture };
    case "MANUFACTURE_STOCK":
        return { ...state, Manufacture_Stock: action.Manufacture_Stock };
    case "LANGUAGE_PRODUCT":
      return { ...state, Language_Product: action.Language_Product };
    case "GETLANGUAGE":
      return { ...state, language: action.language };
    case "GETFLAG":
      return { ...state, flag: action.flag };

    default:
      return state;
  }
};

export default reducer;
