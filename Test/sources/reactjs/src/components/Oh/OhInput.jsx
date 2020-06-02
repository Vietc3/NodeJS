import { Input } from "antd";
import React, { Component } from "react";
import _ from "lodash";
import Constants from "variables/Constants/";

class OhInput extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      value: defaultValue || ""
    };
    this.sendChange = _.debounce(this.sendChange, Constants.UPDATE_TIME_OUT);
  }
  
  componentDidUpdate = (prevProps) => {
    let {autoFocus} = this.props;

    if((autoFocus || !this.onFocus) && prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({value: this.props.defaultValue})
    }
  }

  onChange = value => {
    this.setState({ value }, () => {
      this.sendChange()
    });
  };
  
  sendChange = () => {
    if(this.props.onChange) this.props.onChange(this.state.value);
  }

  render() {
    const { placeholder, disabled, type, style, readOnly, onFocus, onClick, onKeyDown, onBlur, autoFocus} = this.props;
    const { value } = this.state;

    let enableProps = disabled ? {disabled} : {
      onFocus: (e) => {
        this.onFocus = true;
        if(onFocus) onFocus(e)
      },
      onBlur: (e) => {
        this.onFocus = false;
        if(onBlur) onBlur(e)
      },
      autoFocus,
      onClick,
      onKeyDown,
      onChange: e => {
         this.onChange(e.target.value);
      },
      readOnly
    };
    
    return (
      type !== "password"?
        <Input
          placeholder={placeholder}
          type={type}
          value={value}
          style={style}
          {...enableProps}
        />:
        <Input.Password
          placeholder={placeholder}
          value={value}
          {...enableProps}
        />
    );
  }
}

export default OhInput
