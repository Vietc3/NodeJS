// @material-ui/core components
import FormLabel from "@material-ui/core/FormLabel";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class OhLabel extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      value: defaultValue === undefined ? '' : defaultValue
    };
  }
  
  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.defaultValue !== undefined && prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({value: this.props.defaultValue}, () => this.sendChange())
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
    const { className, align, t } = this.props;
    const { value } = this.state;

    return (
      <FormLabel className={[className, 'oh-label'].join(' ')} style={{textAlign: align, width: '100%'}}>
        {value}
      </FormLabel>
    )
  }
}

export default withTranslation("translations")(OhLabel);
