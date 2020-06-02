import React, { Component } from "react";
import ExtendFunction from "lib/ExtendFunction";
import { Select } from "antd";

const { Option } = Select;

class OhMultiSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { options, onChange, defaultValue, placeholder, disabled, ...rest } = this.props;
    return (
      <Select
        mode="multiple"
        placeholder={placeholder}
        defaultValue={["a10", "c12"]}
        onChange={onChange}
        filterOption={(input, option) => {
          return option.props.children
            ? ExtendFunction.removeSign(option.props.children.toLowerCase()).indexOf(
                ExtendFunction.removeSign(input.toLowerCase())
              ) >= 0
            : false;
        }}
        {...rest}
      >
        {options.map(item => (
          <Option key={item.value}>{item.title}</Option>
        ))}
      </Select>
    );
  }
}

OhMultiSelect.propTypes = {
  options: PropTypes.array,
  defaultValue: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
};

export default OhMultiSelect;
