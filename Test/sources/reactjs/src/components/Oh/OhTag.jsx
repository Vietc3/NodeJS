import { Tag } from "antd";
import React, { Component } from "react";

class OhTag extends Component {

  render() {
    const { onClose, onClick, title, key } = this.props;

    return (
      <Tag key={key} closable onClose={onClose}>
        <span onClick={onClick} >{title}</span>
      </Tag>
    );
  }
}

export default OhTag
