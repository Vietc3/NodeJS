import { Select } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {Tooltip } from "antd";

const uuidv1 = require('uuid/v1');

class OhSelectMaterial extends Component {
  constructor(props) {
    super(props);
    let { defaultValue, onRef } = this.props;
    this.state = {
      value: defaultValue !== undefined ? defaultValue : undefined
    };
    this.id = uuidv1();
    if(onRef) onRef(this)
  }

  componentDidUpdate = (prevProps, prevState) => {
    let newState = {};
    if (prevProps.defaultValue !== this.props.defaultValue) {
      newState = { ...newState, value: this.props.defaultValue };
    }
    if(Object.keys(newState).length) {
      this.setState(newState);
    }
  };

  onChange = (value) => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };

  render() {
    const { options, disabled, formater } = this.props;
    let value = this.props.value !== undefined ? this.props.value : this.state.value;
    let objTitle = {};

    if (options){
      options.map((item) => {
        objTitle[item.value] = item.title;
      })
    }        
    
    return (
      <Tooltip 
      placement="leftTop" 
      title={ objTitle[value] || ""} 
      mouseEnterDelay={disabled ? 0.2 : 0.5}
      >
      <Select
        native
        className = {"select-material"}
        value={value}
        disabled={disabled}
        onChange={disabled ? null : ((event) => this.onChange(event.target.value))}
        inputProps={{
          name: 'select' + this.id,
          id: this.id,
        }}

      >
        {options && options.map((item) => {
          return(
            <option
              key={item.value}
              value={item.value}
            >
              {formater ? formater(item.title, item) : item.title}
            </option>
          )
        })}
      </Select>
      </Tooltip>
    );
  }
}

OhSelectMaterial.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
};

export default OhSelectMaterial;