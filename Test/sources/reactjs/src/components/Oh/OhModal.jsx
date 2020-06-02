import React, { Component } from "react";
import { Modal } from 'antd';

class OhModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      open: this.handleOpen,
      close: this.handleClose,
    }
  }

  handleOpen=()=>{
    this.setState({visible:true})
  }

  handleClose=()=>{
    this.setState({visible:false})
  }

  render() {
    const { onClose, onOk, title, key, content, onOpen, okText, cancelText, ClassName, footer,style,width } = this.props;

    return (
      <Modal
        footer={footer}
        className={ClassName}
        title={title}
        key={key}
        visible={onOpen}
        onOk={onOk}
        onCancel={onClose}
        onClose={onClose}
        maskClosable={false}
        okText={okText}
        cancelText={cancelText}
        width={width}
        style={style}
      >
        {content}
      </Modal>
    );
  }
}

export default OhModal
