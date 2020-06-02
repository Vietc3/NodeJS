import React from "react";
import PropTypes from "prop-types";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Redirect } from "react-router-dom";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { connect } from "react-redux";
import registerPageStyle from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";
import avatar from "assets/img/new_logo.png";
import { withTranslation } from "react-i18next";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      firstnameState: "",
      email: "",
      emailState: "",
      password: "",
      passwordState: "",
      file: null,
      imagePreviewUrl: avatar,
      check: false,
      m: "",
      showPass: false,
      isRedirect: false,
      br: null,
      brerror: null

    };
  }

  success = (m) => {
    this.setState({ br: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={m} /> }, () => this.hideAlert())
  }

  error = (mess) => {
    this.setState({ br: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={(mess)} /> })
  }

  showPassword = () => {
    this.setState({
      showPass: !this.state.showPass
    });
    var hidePass = document.getElementById("password");
    if (this.state.showPass) hidePass.type = "password";
    else hidePass.type = "text";
  };
  handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    if (file !== undefined) {
      reader.readAsDataURL(file);
    }
  };

  sendState = () => {
    return this.state;
  };
  // function that returns true if value is email, false otherwise
  verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  verifyCheck = (value, value1) => {
    if (value === value1) {
      return true;
    }
    return false;
  };
  change = event => {
    let id = event.target.id;
    let value = event.target.value;
    this.setState({
      check: false
    });
    switch (id) {
      case "firstname":
        if (value.length >= 3) {
          this.setState({ [id + "State"]: "success" });
        } else {
          this.setState({ [id + "State"]: "error" });
        }
        break;
      case "email":
        if (this.verifyEmail(value)) {
          this.setState({ [id + "State"]: "success" });
        } else {
          this.setState({ [id + "State"]: "error" });
        }
        break;
      case "password":
        if (value.length >= 6) {
          this.setState({ [id + "State"]: "success" });
        } else {
          this.setState({ [id + "State"]: "error" });
        }
        if (value === this.state.repassword) {
          this.setState({ repasswordState: "success" });
        } else {
          this.setState({ repasswordState: "error" });
        }
        break;
      default:
        break;
    }
    this.setState({ [id]: value });
  };
  isValidated = () => {
    if (
      this.state.firstnameState === "success" &&
      this.state.emailState === "success" &&
      this.state.passwordState === "success" &&
      this.state.repasswordState === "success"
    ) {
      return true;
    } else {
      if (this.state.firstnameState !== "success") {
        this.setState({ firstnameState: "error" });
      }
      if (this.state.emailState !== "success") {
        this.setState({ emailState: "error" });
      }
      if (this.state.passwordState !== "success") {
        this.sendState({ passwordState: "error" });
      }
    }
    return false;
  };
  hideAlert = e => {
    this.setState({
      notification: null,
      isRedirect: true

    });
  };
  submit = async event => {
    let { email, firstname, password } = this.state;
    let { t } = this.props;
    if (this.state.firstnameState !== "success") {
      this.setState({
        check: true,
      });
      return this.error("Tên phải có ít nhất 3 ký tự");
    }
    if (this.state.emailState !== "success") {
      if (email.length > 0) {
        this.setState({
          check: true,
        });
        return this.error("Định dạng Email không đúng")
      }
      else {
        this.setState({
          check: true,
        });
        return this.error("Vui lòng nhập Email")
      }
    }
    if (this.state.passwordState !== "success") {
      this.setState({
        check: true,
      });
      return this.error("Vui lòng nhập mật khẩu ít nhất 6 kí tự")
    }
    
    let data = {};
    data.email = email;
    data.firstname = firstname;
    data.password = password;
    data.file = this.state.file;
  };
  render() {
    const { t } = this.props;
    const { classes } = this.props;
    if (this.state.isRedirect)
      return <Redirect to="auth/login-page" />;
    return (
      <div className={classes.container}>
        {this.state.br}
        {this.state.brerror}
        <GridContainer justify="center">
          {this.state.notification}
          <GridItem xs={12} sm={12} md={6}>
            <Card className={classes.cardSignup}>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem xs={4} sm={4}>
                    <div className="picture-container">
                      <div className="picture">
                        <img
                          style={{ width: 100, height: 100 }}
                          src={this.state.imagePreviewUrl}
                          className="picture-src"
                          alt="..."
                        />
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.svg,.svgz,.gif"
                          onChange={e => this.handleImageChange(e)}
                        />
                      </div>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12}>
                    <CustomInput
                      autoFocus
                      success={this.state.firstnameState === "success"}
                      error={this.state.firstnameState === "error"}
                      labelText={
                        <span>
                          {t("Name")} <big>*</big>
                          <small>&nbsp;{t("(3-character minimum)")}</small>
                        </span>
                      }
                      id="firstname"
                      formControlProps={{
                        fullWidth: true,
                        style: { margin: 0 }
                      }}
                      inputProps={{
                        onChange: this.change,
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Face className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      success={this.state.emailState === "success"}
                      error={this.state.emailState === "error"}
                      labelText={
                        <span>
                          {t("Email")} <big>*</big>
                        </span>
                      }
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                        style: { margin: 0 }
                      }}
                      inputProps={{
                        onChange: this.change,
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                      }}
                    />

                    <CustomInput
                      success={this.state.passwordState === "success"}
                      error={this.state.passwordState === "error"}
                      labelText={
                        <span>
                          {t("Password")} <big>*</big>{" "}
                          <small>&nbsp;{t("(6-character minimum)")}</small>
                        </span>
                      }
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                        style: { margin: 0 }
                      }}
                      inputProps={{
                        onChange: this.change,
                        endAdornment: (
                          <InputAdornment
                            style={{ cursor: "pointer" }}
                            position="end"
                            className={classes.inputAdornment}
                            onClick={() => this.showPassword()}
                          >
                            {this.state.showPass ? (
                              <Visibility
                                className={classes.inputAdornmentIcon}
                              />
                            ) : (
                                <VisibilityOff
                                  className={classes.inputAdornmentIcon}
                                />
                              )}
                          </InputAdornment>
                        ),
                        type: "password",
                        autoComplete: "off"
                      }}
                    />
                  </GridItem>
                  <GridContainer justify="center">
                    <Button round color="rose" onClick={this.submit}>
                      {t("Register")}
                    </Button>
                  </GridContainer>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTranslation("translations")(
  connect()(withStyles(registerPageStyle)(RegisterPage))
);
