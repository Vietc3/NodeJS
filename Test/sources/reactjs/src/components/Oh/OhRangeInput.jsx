import { Input } from "antd";
import React, { Component } from "react";
import OhNumberInput from "./OhNumberInput";
import { withTranslation } from "react-i18next";
import _ from "lodash";

const InputGroup = Input.Group;

class OhRangeInput extends Component {
  constructor(props) {
    super(props);
    let defaultValue = this.props.defaultValue || {};
    this.state = {
      value: {
        from: defaultValue.from || '',
        to: defaultValue.to || '',
      }
    };
  }
  
  componentDidUpdate = (prevProps) => {
    if( this.props.defaultValue && !_.isEqual(prevProps.defaultValue, this.props.defaultValue) ) {
      this.setState({
        value: {
          ...this.props.defaultValue
        }
      });
    }
  }

  onChange = obj => {
    this.setState({ value: { ...this.state.value, ...obj } }, () => {
      this.props.onChange(this.state.value);
    });
  };

  render() {
    let {isNegative, isDecimal, t } = this.props;
    return (
      <InputGroup compact>
        <OhNumberInput
          onChange={value => this.onChange({ from: value })}
          style={{ width: 150 }}
          align={'center'}
          placeholder={t("Từ")}
          isNegative={isNegative}
          isDecimal={isDecimal}
          className="InputNumber"
        />
        <Input
          style={{
            width: 30,
            borderLeft: 0,
            pointerEvents: "none",
            backgroundColor: "#fff"
          }}
          placeholder="-"
          disabled
        />
        <OhNumberInput
          onChange={value => this.onChange({ to: value })}
          style={{ width: 150 }}
          align={'center'}
          placeholder={t("Đến")}
          isNegative={isNegative}
          isDecimal={isDecimal}
          className="InputNumber"
        />
      </InputGroup>
    );
  }
}

export default withTranslation("translations")(OhRangeInput)
