import { Input } from "antd";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";

const { TextArea } = Input;

class OhTextArea extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      value: defaultValue || ""
    };
  }
  
  componentDidUpdate = (prevProps) => {
    if(prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({value: this.props.defaultValue})
    }
  }

  onChange = e => {
    this.setState({ value: e.target.value }, () => {
      this.sendChange();
    });
  };
  
  sendChange = () => {
    if(this.props.onChange) this.props.onChange(this.state.value);
  }

  render() {
    const { t, placeholder, minRows, maxRows, disabled, onFocus, autoFocus, onClick, onKeyDown, onBlur, readOnly } = this.props;
    const { value } = this.state;
    let enableProps = disabled ? {disabled} : {
      onFocus,
      autoFocus,
      onClick,
      onKeyDown,
      onBlur,
      onChange: this.onChange,
      readOnly
    };
    
    return (
      <TextArea 
        placeholder={t(placeholder)} 
        value={value} 
        disabled={disabled} 
        autoSize={{ minRows: minRows || 1, maxRows: maxRows || 3 }} 
        {...enableProps}
      />
    );
  }
}

export default withTranslation("translations")(OhTextArea)
