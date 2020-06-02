import { Select, Empty, ConfigProvider } from "antd";
import ExtendFunction from "lib/ExtendFunction";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";

const { Option } = Select;
const uuidv1 = require('uuid/v1');

class OhSelect extends Component {
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

  onChange = (value, record) => {
    this.setState({ value }, () => {
      this.props.onChange(value, record);
    });
  };

  customizeRenderEmpty = () => {
    const {t} = this.props;
    return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("Không có dữ liệu")} />)
  };

  render() {
    const { options, placeholder, disabled, className, formater, open } = this.props;
    let value = this.props.value !== undefined ? this.props.value : this.state.value;
    
    return (
      <ConfigProvider renderEmpty={this.customizeRenderEmpty}>
        <Select
          id={this.id}
          ref={ref =>this.ref = ref}
          showSearch
          placeholder={placeholder}
          {...(open === undefined ? {} : {
            open: open
          })}
          optionFilterProp="children"
          onChange={disabled ? null : ((value, elm) => this.onChange(value, elm.props.record))}
          value={value}
          filterOption={(input, option) => {
            return ExtendFunction.removeSign(option.props.record.title.toLowerCase()).indexOf(
                ExtendFunction.removeSign(input.toLowerCase())) >= 0 || ( option.props.record.code 
                  && ExtendFunction.removeSign(option.props.record.code.toString().toLowerCase()).indexOf(ExtendFunction.removeSign(input.toLowerCase())) >= 0) ?
                  true : false;
          }}
          disabled={disabled}
          style={{ width: "100%", minWidth: 150 }}
          className={className}
          getPopupContainer={() => document.getElementById(this.id)}
        >
          {options && options.map((item, index) => (

            <Option key={'opt_' + index} value={item.value} record={item}>
              {formater ? formater(item.title, item) : item.title}
            </Option>
          ))}
        </Select>
      </ConfigProvider>
    );
  }
}

OhSelect.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
};

export default withTranslation("translations")(OhSelect);