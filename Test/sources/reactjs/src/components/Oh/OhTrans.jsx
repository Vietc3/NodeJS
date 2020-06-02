// @material-ui/core components
import React, { Component } from "react";
import { connect } from "react-redux"

class OhTrans extends Component {
  constructor(props) {
    super(props);
  }
  
   trans = (name, language) => {
    if (!name) return "";
    
    let isJson = JSON.isJson(name);
    let obj = {};
  
    if (isJson){
      obj = JSON.parse(name);
    } 
    return isJson ? (obj[language] || obj["vn"]) : name;
  }

  render() {
    const { value, languageCurrent } = this.props;
    return (
      this.trans(value, languageCurrent)
    )
  }
}

export default connect(state => {
  return {
    languageCurrent: state.languageReducer.language
  };
})(OhTrans)
