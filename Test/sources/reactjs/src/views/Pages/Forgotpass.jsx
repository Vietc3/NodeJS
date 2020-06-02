
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import userService from "services/UserService";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";

class Forgotpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      check: false,
      mes: "",
      br: null,
      brerror: null,
    };
    this.keyPress = this.keyPress.bind(this);
  }

  async componentDidMount() {

    this.timeOutFunction = setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );

  }

  verifyEmail = value => {
    let emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  keyPress(e){
    if(e.keyCode === 13)
      this.submit()
  }

  submit = async (e) => {
    const {t} = this.props;
    const email = document.getElementById('email').value;

    if(!email || !this.verifyEmail(email)){
      !email ? notifyError(t("Vui lòng nhập Email")) : notifyError(t("Email không đúng định dạng"));
      return;
    }

    let sendMail = await userService.resetPassword({ email: email})
    if (sendMail.status) {
      notifySuccess(t("Kiểm tra email để thay đổi mật khẩu!"));
    }
    else notifyError(t("Yêu cầu reset mật khẩu bị thất bại"))
  }
  success = (m) => {
    this.setState({ br: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={m} /> })
  }

  error = (m) => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={m} duration={2.5} />
    })
  }
  render() {
    const { t } = this.props;
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {this.state.br}
        {this.state.brerror}
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
              <Card login className={classes[this.state.cardAnimaton]} style={{ position: "relative", borderRadius: "18px 18px 18px 18px" }}>
                <CardBody>
                  <CustomInput
                    autoFocus={true}
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
                      onKeyDown: this.keyPress,
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
                </CardBody>
                <GridItem justify="right" style={{ color: "red", textAlign: "left" }} >
                  <Link to={"/auth/login-page"} style={{ fontSize: 12 }}>{t("Quay về trang đăng nhập")}</Link>
                </GridItem>
                <CardFooter className={classes.justifyContentCenter}>
                  <GridContainer justify="center" xs={5} sm={5}>
                    <Button round color="rose" style={{ height: "44px" }} onClick={(e) => this.submit(e)} block>
                      {t("Gửi email")}
                    </Button>
                  </GridContainer>
                </CardFooter>
              </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Forgotpage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTranslation("translations")(connect(function (state) {
  return ({})
})(withStyles(loginPageStyle)(Forgotpage)));
