import { Checkbox } from "antd";
import React, { Component } from "react";
import _ from "lodash";
import { withTranslation } from "react-i18next";

class OhCheckBox extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      value: defaultValue || [],
      checkAll: false,
      indeterminate: true
    };
  }

  onChange = (data, name) => {
    let { value } = this.state;
    let { isHorizontal } = this.props;

    if(isHorizontal) {
      value = data;
    } else {
       if(data.target.checked) {
        value.push(name);
      } else {
        let index = value.findIndex(item => item === name);
        value.splice(index, 1);
      }
    }
    this.setState({ 
      value, 
      indeterminate: !!value.length && value.length < this.props.options.length,
      checkAll: value.length === this.props.options.length 
    }, () => {
      this.sendChange()
    });
  };
  
  componentDidUpdate = (prevProps) => {
    if(this.props.defaultValue && prevProps.defaultValue && (prevProps.defaultValue.length !== this.props.defaultValue.length)) {
      let value = this.props.defaultValue;
      this.setState({
        value,
        indeterminate: !!value.length && value.length < this.props.options.length,
        checkAll: value.length === this.props.options.length
      })
    }
  }
  
  onCheckAll = (e) => {
    let { options } = this.props;

    const values= options.map(record => record.value)

    this.setState({
      value: e.target.checked ? values : [],
      indeterminate: false,
      checkAll: e.target.checked
      },() => { 
      this.sendChange()
    });
  }

  sendChange = () => {
    if(this.props.onChange) this.props.onChange(this.state.value);
  }

  render() {
    const { isHorizontal, disabled, labelAlign, hasCheckAll, defaultValue , t} = this.props;
    const options = this.props.options || [];
    const { value } = this.state;
    let isLabelAlignLeft = labelAlign === 'left';
    
    if(isHorizontal) {
      return (
        <Checkbox.Group options={options || []} value={value} onChange={this.onChange} />
      )
    } else {
      return (
        <>{ hasCheckAll === true && options.length ? 
          <span key={'checkbox_all'}>
            {isLabelAlignLeft ? <><span className={'ant-checkbox'}/><span>{t("Tất cả")}</span></> : null}
            <Checkbox 
              disabled={disabled}
              indeterminate={ this.state.indeterminate}
              onChange={this.onCheckAll}
              checked={this.state.checkAll}
            >{isLabelAlignLeft ? null : t("Tất cả")}</Checkbox>
            <br/>
          </span> 
          : null}
        {
        options.map((item, index) => {
          let label = item.label || '';
          return (
            <span key={'checkbox_' + index}>
              {isLabelAlignLeft ? <><span className={'ant-checkbox'}/><span>{label}</span></> : null}
              <Checkbox 
                checked={value.includes(item.value)}
                disabled={disabled || item.disabled}
                onChange={e => this.onChange(e, item.value)}
              >{isLabelAlignLeft ? null : label}</Checkbox>
              {index !== (options.length - 1) && <br/>}
            </span> 
          )
        })}
        </>
      )
    }
  }
}

export default withTranslation("translations")(OhCheckBox)
