// @material-ui/core components
import FormLabel from "@material-ui/core/FormLabel";
import React, { Component } from "react";

class OhLabel extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      value: defaultValue !== undefined ? defaultValue : ""
    };
  }
  
  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.defaultValue !== undefined && prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({value: this.props.defaultValue}, () => this.sendChange())
    }
  }
  
  sendChange = () => {
    if(this.props.onChange) this.props.onChange(this.state.value);
  }

  render() {
    const { className, linkTo, disabled, onClick } = this.props;    
    const { value } = this.state;
    let enableProps = disabled ? {disabled} : {onClick};
    return (
      <FormLabel className={'oh-link'}>
        <a href={!disabled && linkTo ? linkTo : "#section"} className={className} {...enableProps}>
          {value}
        </a>
      </FormLabel>
      
    )
  }
}

export default OhLabel
