import { Button, Icon } from "antd";
import React, { Component } from "react";
// @material-ui/core components
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Constants from "variables/Constants/";
import "./css.css";

class OhButton extends Component {
  constructor(props) {
    super(props);

    let { defaultValue , onRef} = this.props;
    if(onRef) onRef(this)
    this.state = {
      value: defaultValue || "",
      buttonColor:"primary",

    };
  }

  onChange = value => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };

  checkPermission = () => {
    let { dataPermissions } = this.props;
    let { name, type } = this.props.permission || {};

    if (!name || !type || (dataPermissions.permissions[name] || Constants.PERMISSION_TYPE.TYPE_NONE) >= type) {
      return true;
    } else {
      return false;
    }
  }
  getColorButton = () => {
    let { type } = this.props;

    let submitColor = "success";
    let addColor = "primary";
    let deleteColor = "danger";
    let exitColor = "default";
    let colorDefault = "primary";
    let exportColor = undefined;
    let typeButton = Constants.COLOR_BUTTON[type];

    if (type && typeButton === Constants.COLOR_BUTTON.submit) {
      return submitColor;
    }
    if (type && typeButton === Constants.COLOR_BUTTON.add) {
      return addColor;
    }
    if (type && typeButton === Constants.COLOR_BUTTON.delete) {
      return deleteColor;
    }
    if (type && typeButton === Constants.COLOR_BUTTON.exit) {
      return exitColor;
    }
    if (type && typeButton === Constants.COLOR_BUTTON.export) {
      return exportColor;
    }
    if ((type || !type) && typeButton === undefined) {
      return colorDefault;
    }
  }

  render() {
    const { t, icon, onClick, target, linkTo, label, children, loading, shape, simple, className, simpleDelele, style, params, typePrint, url  } = this.props;
    let flagPermission = this.checkPermission();
    let disabled = !flagPermission || this.props.disabled;
    let color = this.getColorButton();

    let button = (
      typePrint !== 'print' ?
      <Button
        onClick={ disabled ? null : onClick}
        shape={shape}
        loading={loading}
        target={target}
        ref={ref =>this.ref = ref}
        disabled={disabled}
        {...(simple || "")}
        className={[className, 'oh-button', 'oh-color-' + color].join(' ')}
        style={style}
      >
        {icon || ''}&nbsp;
          {label ? (typeof label === 'string' ? t(label) : label) : ''}
        {children}
      </Button> 
      :
      <button
        onClick={ disabled ? null : onClick}
        disabled={disabled}
        ref={ref =>this.ref = ref}
        {...(simple || "")}
        className={['oh-button-print', 'oh-button', 'oh-color-' + color].join(' ')}
        style={style}
      >
        {icon || ''}&nbsp;
          {label ? (typeof label === 'string' ? t(label) : label) : ''}
        {children}
      </button>
    );
      
    if(url)
      return <a href={url} >{button}</a>;
    else if (linkTo)
      return <Link to={{ pathname: linkTo === '#' ? window.location.pathname : linkTo, state: params }} >{button}</Link>;
    else if (simpleDelele)
      return <Icon onClick={disabled ? null : onClick} type="close" className="remove" style={{ alignSelf: "center", color: "red" }} />
    else
      return button;
  }
}

export default connect(state => {
  return {
    dataPermissions: state.userReducer.currentUser
  };
})(withTranslation("translations")(OhButton));
