import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Divider from "@material-ui/core/Divider";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import customDropdownStyle from "assets/jss/material-dashboard-pro-react/components/customDropdownStyle.jsx";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from "react";
import OhButton from "./OhButton";
import uuidv1 from 'uuid/v1';

class CustomDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.buttonClass = 'button-' + uuidv1();
  }

  componentDidMount = () => {
    this.setState({anchorEl: document.getElementsByClassName(this.buttonClass)[0]})
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };
  handleClose = event => {
    if (this.state.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };
  handleCloseMenu(param) {
    this.setState({ open: false });
    if (this.props && this.props.onClick) {
      this.props.onClick(param);
    }
  }
  render() {
    const { open, anchorEl } = this.state;
    const {
      classes,
      buttonText,
      color,
      type,
      permission,
      dropdownList,
      buttonProps,
      dropup,
      dropdownHeader,
      caret,
      hoverColor,
      dropPlacement,
      rtlActive,
      noLiPadding,
      innerDropDown,
      navDropdown,
      typePrint
    } = this.props;
    const caretClasses = classNames({
      [classes.caret]: true,
      [classes.caretDropup]: dropup && !open,
      [classes.caretActive]: open && !dropup,
      [classes.caretRTL]: rtlActive
    });
    const dropdownItem = classNames({
      [classes.dropdownItem]: true,
      [classes[hoverColor + "Hover"]]: true,
      [classes.noLiPadding]: noLiPadding,
      [classes.dropdownItemRTL]: rtlActive
    });
    const dropDownMenu = (
      <MenuList role="menu" className={[classes.menuList, "dropdown-menu-action"].join(" ")}>
        {dropdownHeader !== undefined ? (
          <MenuItem onClick={() => this.handleCloseMenu(dropdownHeader)} className={classes.dropdownHeader}>
            {dropdownHeader}
          </MenuItem>
        ) : null}
        {dropdownList.map((prop, key) => {
          if (prop.divider) {
            return (
              <Divider
                key={key}
                onClick={() => this.handleCloseMenu("divider")}
                className={classes.dropdownDividerItem}
              />
            );
          } else if (prop.props !== undefined && prop.props["data-ref"] === "multi") {
            return (
              <MenuItem key={key} className={dropdownItem} style={{ overflow: "visible", padding: 0 }}>
                {prop}
              </MenuItem>
            );
          }
          return (
            <MenuItem key={key} onClick={() => this.handleCloseMenu(prop)} className={dropdownItem}>
              {prop}
            </MenuItem>
          );
        })}
      </MenuList>
    );
    return (
      <>
        <OhButton
          aria-label="Notifications"
          aria-owns={open ? "menu-list" : null}
          aria-haspopup="true"
          {...buttonProps}
          onClick={this.handleClick}
          label={buttonText !== undefined ? buttonText : null}
          icon={this.props.buttonIcon}
          color = {color}
          className={this.buttonClass}
          permission={permission}
          type={type}
          typePrint={typePrint}

        >
          {caret ? <b className={caretClasses} /> : null}
        </OhButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          disablePortal
          placement={dropPlacement}
          className={classNames({
            [classes.popperClose]: !open,
            [classes.popperResponsive]: true,
            [classes.popperNav]: open && navDropdown
          })}
        >
          {() => (
            <Grow
              in={open}
              id="menu-list"
              style={dropup ? { transformOrigin: "0 100% 0" } : { transformOrigin: "0 0 0" }}
            >
              <Paper className={classes.dropdown}>
                {innerDropDown ? (
                  dropDownMenu
                ) : (
                  <ClickAwayListener onClickAway={this.handleClose}>{dropDownMenu}</ClickAwayListener>
                )}
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
}

CustomDropdown.defaultProps = {
  caret: true,
  dropup: false,
  hoverColor: "primary"
};

CustomDropdown.propTypes = {
  classes: PropTypes.object.isRequired,
  hoverColor: PropTypes.oneOf(["dark", "primary", "info", "success", "warning", "danger", "rose"]),
  buttonText: PropTypes.node,
  buttonIcon: PropTypes.object,
  dropdownList: PropTypes.array,
  buttonProps: PropTypes.object,
  dropup: PropTypes.bool,
  dropdownHeader: PropTypes.node,
  rtlActive: PropTypes.bool,
  caret: PropTypes.bool,
  dropPlacement: PropTypes.oneOf([
    "bottom",
    "top",
    "right",
    "left",
    "bottom-start",
    "bottom-end",
    "top-start",
    "top-end",
    "right-start",
    "right-end",
    "left-start",
    "left-end"
  ]),
  noLiPadding: PropTypes.bool,
  innerDropDown: PropTypes.bool,
  navDropdown: PropTypes.bool,
  // This is a function that returns the clicked menu item
  onClick: PropTypes.func
};

export default withStyles(customDropdownStyle)(CustomDropdown);
