import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Lock from "@material-ui/icons/Lock";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import userService from "services/UserService";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";


class NewPasswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardAnimaton: "cardHidden",
            message: "",
            check: false,
            m: "",
            isRedirect: false,
        };
    }

    componentDidMount() {
        this.timeOutFunction = setTimeout(
            function () {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
       
        
    }

    change = (event) => {
        let id = event.target.id;
        let value = event.target.value;

        this.setState({ check: false });

        switch (id) {
            case "confirmpassword":
                if (value.length >= 6) {
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
                break;
            default:
                break;
        }
        this.setState({ [id]: value, message: "" });
    }

    async changeNewPassword() {
        let { t } = this.props;
        let path = this.props.location.pathname.split("/");
        let resetPasswordToken = path[path.length -1];
        let password = document.getElementById("password").value;
        let confirmpassword = document.getElementById("confirmpassword").value;
        
        if ( this.state.confirmpasswordState === "success" && this.state.passwordState === "success" && password === confirmpassword ) {
           let changePassword = await userService.saveChangePassword({ resetPasswordToken, password ,confirmpassword});
           
           if (changePassword.status) {
                    notifySuccess(t("Đổi mật khẩu thành công"));
                    this.setState({
                        isRedirect: true
                    });
            }
            else notifyError(changePassword.error)
        }
        else if ( this.state.confirmpasswordState === "success" && this.state.passwordState === "success" ) {
            this.messageChangePassword(t("Xác nhận mật khẩu không chính xác"));
        }
        else this.messageChangePassword(t("Mật khẩu hoặc xác nhận mật khẩu không chính xác"));

    }

    messageChangePassword = message => {
        const { t } = this.props;
        this.setState({
            check: true,
            m: t(message)
        });
    }

    render() {
        const { t, classes } = this.props;
        if ( this.state.isRedirect ) {
            return <Redirect to="/auth/login-page" />
        }
        return (
            <div className={classes.container}>

                <GridContainer justify="center">
                    <GridItem xs={12} sm={6} md={4}>
                        <form >
                            <Card login className={classes[this.state.cardAnimaton]} style={{ position: "relative" , borderRadius: "18px 18px 18px 18px"}}>

                                <CardBody>

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
                                            style: { margin: 0 }
                                        }}
                                        inputProps={{
                                            onChange: this.change,
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    className={classes.inputAdornment}
                                                >
                                                    <Lock className={classes.inputAdornmentIcon} />
                                                </InputAdornment>
                                            ),
                                            type: "password",
                                            autoComplete: "off"
                                        }}
                                    />
                                    <CustomInput

                                        success={this.state.confirmpasswordState === "success"}
                                        error={this.state.confirmpasswordState === "error"}
                                        labelText={
                                            <span>
                                                {t("Nhập lại mật khẩu")} <big>*</big>
                                            </span>
                                        }
                                        id="confirmpassword"
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
                                                    <Lock className={classes.inputAdornmentIcon} />
                                                </InputAdornment>
                                            ),
                                            type: "password",
                                            autoComplete: "off"
                                        }}
                                    />
                                </CardBody>
                                {(this.state.check) ?
                                    <GridItem justify="center" style={{ color: "red", textAlign: "center" }} >
                                        <br />
                                        {t(this.state.m) + "!"}
                                    </GridItem>
                                    : null}

                                <CardFooter className={classes.justifyContentCenter}>
                                    <GridContainer justify="center" sm="4">
                                        <Button round color="rose" onClick={(e) => this.changeNewPassword(e)} block>
                                            {t("Thay đổi")}
                                        </Button>
                                    </GridContainer>

                                </CardFooter>
                            </Card>
                        </form>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

NewPasswordPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withTranslation("translations")(connect(function (state) {
    return ({})
  })(withStyles(loginPageStyle)(NewPasswordPage)));