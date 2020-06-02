import { Select } from "antd";
import ExtendFunction from "lib/ExtendFunction";
import PropTypes from "prop-types";
import React, { Component } from "react";

const { Option, OptGroup } = Select;
const uuidv1 = require('uuid/v1');

class OhSelectGroup extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      value: defaultValue !== undefined ? defaultValue : undefined
    };
    this.id = uuidv1();
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

  onChange = (value, record) => {
    this.setState({ value }, () => {
      this.props.onChange(value, record);
    });
  };

  options = (arr) => {
    const {formater} = this.props;
    return(
      arr && arr.map(item => {
        return <Option key={item.value} value={item.value} record={item}>
          {formater ? formater(item.title, item) : item.title}
        </Option>
      })
    )
  }

  render() {
    const { options, placeholder, disabled, className, formater } = this.props;
    let value = this.props.value !== undefined ? this.props.value : this.state.value;
    return (
      <Select
        id={this.id}
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={disabled ? null : ((value, elm) => this.onChange(value, elm.props.record))}
        value={value}
        filterOption={(input, option) => {
          if(option.props.record)
            return ExtendFunction.removeSign(option.props.record.title.toLowerCase()).indexOf(
                ExtendFunction.removeSign(input.toLowerCase())) >= 0 || ( option.props.record.code 
                  && ExtendFunction.removeSign(option.props.record.code.toLowerCase()).indexOf(ExtendFunction.removeSign(input.toLowerCase())) >= 0) ?
                  true : false;
        }}
        disabled={disabled}
        style={{ width: "100%", minWidth: "150px" }}
        className={className}
        getPopupContainer={() => document.getElementById(this.id)}
      >
        {options && options.map(group => (
          group.groupName ?
          <OptGroup label={group.groupName}>
              {this.options(group.array)}
          </OptGroup>
          :
            this.options(group.array)
        ))}
      </Select>
    );
  }
}

OhSelectGroup.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
};

export default OhSelectGroup;