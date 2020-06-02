import React from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import { withTranslation } from "react-i18next";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import { notifyError, notifySuccess } from 'components/Oh/OhUtils';


import userService from "services/UserService";
import StoreService from "services/StoreConfig";
import Constants from "variables/Constants/";


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    let {email, password} = this.props.match.params || {};
    email = email || "";
    password = password || "";
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      showPass: false,
      check: false,
      m: "",
      email: email,
      emailState: email ? this.verifyEmail(email) : "",
      password: password,
      passwordState: password ? this.verifyPassword(password) : "",
      br: null,
      brerror: null,
      url: Constants.LOGO
    };
  }

  async getLogo() {
    let logoStore = await StoreService.getStoreLogo();

    if (logoStore.status) {
      this.setState({
        url: logoStore.data
      })
    }
    else {
      this.setState({
      url: Constants.LOGO
      })
    }
  }

  showPassword = () => {
    this.setState({
      showPass: !this.state.showPass
    });
    let hidePass = document.getElementById("password");
    if (this.state.showPass) hidePass.type = "password";
    else hidePass.type = "text";
  };
  componentDidMount() {
    this.getLogo();
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    // this.timeOutFunction = setTimeout(
    //   function() {
    //     this.setState({ cardAnimaton: "" });
    //   }.bind(this),
    //   100
    // );
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  change = event => {
    let id = event.target.id;
    let value = event.target.value;
    this.setState({
      check: false
    });
    switch (id) {
      case "email":
        this.setState({ [id + "State"]: this.verifyEmail(value) });
        break;
      case "password":
        this.setState({ [id + "State"]: this.verifyPassword(value) });
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
  
  login = async e => {
    let {t} = this.props;

    let email = document.getElementById("email");
    let password = document.getElementById("password");
    if (this.state.emailState === "success") {
      if (this.state.passwordState === "success") {
        let data = {};
        data.email = email.value;
        data.password = password.value;

        userService.login(email.value, password.value, async res => {
          if (!res.status) {
            notifyError(t(res.error));
          }
          else {
            let configManufacture = await StoreService.getConfig({
              types: ["manufacturing","manufacturing_stock","language_product"]
            })
            if (!configManufacture.status) {
              notifyError(t(res.error));
            }
            else {
              this.props.dispatch({type: "MANUFACTURE", Manufacture: configManufacture.data.manufacturing })
              this.props.dispatch({type: "MANUFACTURE_STOCK", Manufacture_Stock: configManufacture.data.manufacturing_stock })
              this.props.dispatch({type: "LANGUAGE_PRODUCT", Language_Product: configManufacture.data.language_product })

            }
          }
        });
      } else {
        if (password.value.length > 0) {
          notifyError(t("Mật khẩu phải tối thiểu 6 ký tự"));
        } else {
          notifyError(t("Vui lòng điền mật khẩu"));
        }
      }
    } else {
      console.log(email.value);
      if (email.value.length > 0) {
        notifyError(t("Định dạng Email không đúng"));
      } else {
        notifyError(t("Vui lòng nhập Email"));
      }
    }
  };

  verifyEmail = value => {
    let emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return "success";
    }
    return "error";
  };

  verifyPassword = value => {
    if (value.length >= 6) {
      return "success";
    }
    return "error";
  };

  verifyPassword = value => {
    if (value.length >= 6) {
      return "success";
    }
    return "error";
  };
  keyPress = e => {
    if (e.keyCode === 13) {
      this.login();
    }
  };
  success = m => {
    let { t } = this.props;
    notifySuccess(t(m));
  };

  error = m => {
    let { t } = this.props;
    notifyError(t(m));
  };
  render() {
    let { t } = this.props;
    const { classes } = this.props;

    if (this.props.isAuth === true) {
      return <Redirect to="/admin/dashboard" />;
    }

    let lenghtWidth = window.innerWidth;

    return (
      <>
        <div className={classes.container}>
          <h1 
            style={{ 
              textAlign: "center",
              height: lenghtWidth < 420 ? "150px" : "160px",
              width: "100%",
              marginTop: lenghtWidth < 420 ?"-15%" : "-3%",
              marginLeft:lenghtWidth < 420 ?"0px" : "-2%",
              }}>
            <img style={{width: 'auto'}} src={this.state.url} 
              alt="Logo Aitt"
              width={ lenghtWidth < 420 ? "335px" : "445px"} 
              height={ lenghtWidth < 420 ? "110px" : "150px"}
            />
          </h1>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <form
                onSubmit={e => this.login(e)}
              >
                <Card login style={{ position: "relative" ,borderRadius:"18px 18px 18px 18px",height:"320px",width:"340px"}}>
                  <CardBody style={{padding:"5px 20px 0px 20px"}}>
                    <CustomInput
                      autoFocus={true}
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
                        style: { margin: 0,paddingTop:27 }
                      }}
                      inputProps={{
                        value: this.state.email,
                        onKeyDown: this.keyPress,
                        onChange: this.change,
                        endAdornment: (
                          <InputAdornment position="end" className={classes.inputAdornment}>
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
                          {t("Mật khẩu")} <big>*</big>
                        </span>
                      }
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                        style: { margin: 0,paddingTop:27 }
                      }}
                      inputProps={{
                        value: this.state.password,
                        onKeyDown: this.keyPress,
                        onChange: this.change,
                        endAdornment: (
                          <InputAdornment
                            style={{ cursor: "pointer" }}
                            position="end"
                            className={classes.inputAdornment}
                            onClick={() => this.showPassword()}
                          >
                            {this.state.showPass ? (
                              <Visibility className={classes.inputAdornmentIcon} />
                            ) : (
                              <VisibilityOff className={classes.inputAdornmentIcon} />
                            )}
                          </InputAdornment>
                        ),
                        type: "password",
                        autoComplete: "off"
                      }}
                    />
                  </CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={5} ms={5} lg={5} style={{ textAlign: "right" ,marginRight:"8px"}}>
                      <Link to={"/auth/forgot-password-page"} style={{ fontSize: 12 }}>
                        {t("Quên mật khẩu")}?
                      </Link>
                    </GridItem>
                  </GridContainer>
                  <CardFooter className={classes.justifyContentCenter}>
                    <GridContainer justify="center" xs={5} sm={5}>
                      <Button round color="rose" style={{height: "44px"}}onClick={e => this.login(e)} block>
                        {t("Đăng nhập")}
                      </Button>
                    </GridContainer>
                  </CardFooter>
                  <CardFooter  style={{backgroundColor:"#C4BFBF",margin:"10px 0px 0px 0px",borderRadius:"0px 0px 18px 18px"}}>
                    <GridContainer justify="center" xs={12} style={{margin:"5px 0px 0px 0px"}} >
                      <p align="center" style={{fontSize:13}}>{t("Tổng đài hỗ trợ khách hàng") + ":"}<span style={{ fontWeight:"bold", cursor: "pointer" }}> 1900 888698</span></p>
                      <p align="center"style={{fontSize:13 ,marginTop:"-10px"}}>{t("Hỗ trợ khách hàng từ 8h00 - 22h00 hàng ngày")}</p>
                    </GridContainer>
                  </CardFooter>
                </Card>
              </form>
            </GridItem>
          </GridContainer>
        </div>
      </>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withTranslation("translations")(
  connect(function(state) {
    return {
      isAuth: state.userReducer.isAuth
    };
  })(withStyles(loginPageStyle)(LoginPage))
);
