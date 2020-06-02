import React, { Component } from "react";
import { Radio } from "antd";
import { withTranslation } from 'react-i18next';

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};

class OhRadio extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      value: defaultValue || ""
    };
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.defaultValue && prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({value: this.props.defaultValue}, () => this.onChange(this.props.defaultValue))
    }
  }

  onChange = (value) => {
    this.setState( {value}, () => {
      this.props.onChange(value);
    });
  };

  render() {
    const { options, isHorizontal, disabled, t} = this.props;

    return (
      <Radio.Group disabled={disabled} value={this.props.defaultValue} onChange={(e) => this.onChange(e.target.value)} >
          {options && options.map(item => (
            <Radio key={item.value} true style={isHorizontal ? null : radioStyle} value={item.value}>
              {t(item.name)}
            </Radio>
          ))}
        </Radio.Group>
    );
  }
}

export default withTranslation("translations")(OhRadio);
