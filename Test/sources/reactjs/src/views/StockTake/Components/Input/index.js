import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import { connect } from "react-redux";
// multilingual
import { withTranslation } from "react-i18next";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import ExtendFunction from "lib/ExtendFunction";
import Input from "@material-ui/core/Input";
import Constants from "variables/Constants/";

class FormIssue extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.defaultValue };
    if (this.props.defaultValue) {
      this.props.onChange(this.state.value);
    }
    this.changeTimeout = null;
    this.props.onRef(this);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.changeTimeout) {
      clearTimeout(this.changeTimeout);
      this.changeTimeout = null;
    }

    this.changeTimeout = setTimeout(() => {
      if (prevState.value !== this.state.value) {
        this.props.onChange(this.state.value);
      }
    }, Constants.UPDATE_TIME_OUT);
  };

  updateValue = value => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Input
        className={classes.input}
        style={{ width: 100 }}
        inputProps={{
          disabled: this.props.disabled,
          
          onClick: e => e.target.select(),
          value: ExtendFunction.FormatNumber(value),
          onChange: e => {
            let value = ExtendFunction.UndoFormatNumber(e.target.value).replace(/[^0-9]/g, "");
            value = value !== "" ? parseFloat(value) : undefined;
            this.setState({ value: value });
          },
          style: { textAlign: "right" }
        }}
      />
    );
  }
}

export default connect()(
  withTranslation("translations")(
    withStyles({
      ...extendedFormsStyle,
      ...extendedTablesStyle
    })(FormIssue)
  )
);
