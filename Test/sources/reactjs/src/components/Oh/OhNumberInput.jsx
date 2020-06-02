import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Constants from "variables/Constants/";
import DynamicNumber from 'react-dynamic-number';

class OhNumberInput extends Component {
  constructor(props) {
    super(props);
    if (this.props.onRef) this.props.onRef(this);
    let { defaultValue, valueDecimal, isDecimal } = this.props;
    this.state = {
      value: defaultValue !== undefined ? (isDecimal === true || isDecimal === undefined) ? Math.round(this.props.defaultValue * (valueDecimal || 100))/(valueDecimal || 100) : defaultValue : ""
    };
    this.sendChange = _.debounce(this.sendChange, Constants.UPDATE_TIME_OUT);
    this.prevValue = ""
  }

  
  componentDidUpdate = (prevProps, prevState) => {
    const { isDecimal, autoFocus, valueDecimal} = this.props;
    if((autoFocus || !this.onFocus) && this.props.defaultValue !== undefined && prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: (isDecimal === true || isDecimal === undefined) ? Math.round(this.props.defaultValue * (valueDecimal || 100))/(valueDecimal || 100) : Math.round(this.props.defaultValue)
      })
    }
  }
  
  onChange = (e, modelValue , viewValue ) => {
    let value = e.target.value;
    let {max, min} = this.props;
    
    if((max === undefined || modelValue <= max) && (min === undefined || modelValue >= min)) {
      this.preViewValue = viewValue;
      this.prevModelValue = modelValue;
      this.setState({ value: viewValue, modelValue }, () => this.sendChange());
    } else {
      this.setState({ value: this.preViewValue }, () => this.sendChange());
    }
  };

  checkPermission = () => {
    let { dataPermissions } = this.props;
    let { name, type } = this.props.permission || {};

    if (!name || !type || (dataPermissions.permissions[name] || Constants.PERMISSION_TYPE.TYPE_NONE) >= type) {
      return true;
    } else {
      return false;
    }
  }

  sendChange = () => {
    if(this.props.onChange) {
      this.props.onChange(this.state.modelValue);
    }
  }

  render() {
    const { placeholder, style, className, align, onClick, autoFocus, onKeyDown, readOnly, onKeyUp, size, onBlur, onFocus, isNegative, isDecimal, fraction, max, min, integer  } = this.props;
    const { value } = this.state;
    let flagPermission = this.checkPermission();
    let disabled = !flagPermission || this.props.disabled;
    let enableProps = disabled ? {disabled} : {
      onBlur: (e) => {
        this.onFocus = false;
        if (onBlur) onBlur(e)
      },
      onFocus: (e) => {
        this.onFocus = true;
        if (onFocus) onFocus(e);
      },
      autoFocus,
      size,
      onClick,
      onKeyDown,
      onKeyUp,
      onChange: this.onChange,
      integer,
      readOnly
    };

    return (
      <DynamicNumber 
        style={{...style, textAlign: align || 'right', width: "100% !important" }}
        className={["ant-input", className].join(' ')}
        placeholder={placeholder} 
        value={value}
        separator={''}
        thousand={true}
        negative={isNegative === true}
        fraction={(isDecimal === true || isDecimal === undefined) ? (fraction !== undefined ? fraction : 5) : 0}
        integer={integer || Constants.MAX_LENGTH_NUMBER_INPUT}
        ref={ref=>this.numberInputRef = ref}
        disabled={disabled}
        {...enableProps}
      />
    );
  }
}

export default connect(state => {
  return {
    dataPermissions: state.userReducer.currentUser
  };
})(OhNumberInput);
