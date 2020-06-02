import { Select, Empty, ConfigProvider } from "antd";
import ExtendFunction from "lib/ExtendFunction";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Collapse } from 'antd';
const { Panel } = Collapse;

class OhSelect extends Component {
  constructor(props) {
    super(props);
    let { onRef } = this.props;
    this.state = {
      activeKey: []
    };
    if(onRef) onRef(this)
  }

  toggle = () => {
    this.setState({
      activeKey: this.state.activeKey.length ? [] : ["1"]
    })
  }

  open = () => {
    this.setState({
      activeKey: ["1"]
    })
  }
  
  close = () => {
    this.setState({
      activeKey: []
    })
  }

  render() {
    const { header, showArrow, hasHeader, content } = this.props;
    const { activeKey } = this.state;
    let value = this.props.value !== undefined ? this.props.value : this.state.value;
    
    return (
      <Collapse className={["oh-collapse", hasHeader ? "" : "oh-collapse-no-header"].join(' ')} activeKey={activeKey}>
        <Panel header={header} key="1">
          {this.props.children}
        </Panel>
      </Collapse>
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