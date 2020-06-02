import React from "react";
import PropTypes from "prop-types";
import clsx from 'clsx';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// material ui icons
import { Icon, notification } from "antd";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import { connect } from "react-redux";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import userProfileStyles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.jsx";
import SweetAlert from "react-bootstrap-sweetalert";

import { Redirect } from 'react-router-dom';
import avatar from "assets/img/new_logo.png";
import { withTranslation } from 'react-i18next';

import OhForm from "components/Oh/OhForm";
import OhModal from "components/Oh/OhModal";
import OhButton from "components/Oh/OhButton";
import Constants from 'variables/Constants/';
import UserProfileService from "services/UserProfileService";

import { notifySuccess, notifyError } from "components/Oh/OhUtils";

class MyAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      redirect: false,
      notification: null,
      valueFullname: "",
      dataUser: [],
      file: null,
      imagePreviewUrl: avatar,
      url: null,
      check: false,
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
      userDetail: {},
      br: null,
      brerror: null,
      errors: {},
      checkpassword: false,
      data: {
        fullName: "",
        address: "",
        phoneNumber: "",
        birthday: 0,
        gender: "0",
        email: "",
        avatar: avatar
      },
      changePassword: {
        password: "",
        newpassword: "",
        confirm: "",
      }
    };
    this.ohFormRef = null;
  }
  showPassword = (id) => {
    let hidePassword = document.getElementById(id);

    this.setState({
      [id]: !this.state[id]
    })

    if (this.state[id])
      hidePassword.type = "password"
    else
      hidePassword.type = "text"

  }

  success = (mess) => {
    this.setState({
      redirect: true
    })
    notifySuccess(mess)
  }

  error = (mess) => {
    notifyError(mess)
  }

  closeNotification = () => {
    this.setState({ br: null, brerror: null })
    notification.destroy();
  }
  failLengthNotification = () => {
    const { t } = this.props;
    this.setState({
      notification: (
        <SweetAlert
          style={{ display: "block", marginLeft: 0, marginTop: 0, top: `${(window.innerHeight / 2 - 85) * 100 / window.innerHeight}%`, left: `${(window.innerWidth / 2 - 150) * 100 / window.innerWidth}%` }}
          title={
            <div style={{ fontSize: "18px", lineHeight: "1.5em" }}>
              <Icon type="exclamation-circle" style={{ color: "#f44336", marginLeft: "-5px" }} />
              <span style={{ color: "black", marginLeft: "10px" }}>
                {t("Password must be at least 6 characters !")}
              </span>
            </div>
          }
          onConfirm={() => this.hideAlert()}
          showConfirm={false}
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
        >
          <div style={{ textAlign: "center" }}>
            <Button
              className={clsx(this.props.classes.marginRight, "button-danger")}
              onClick={() => this.hideAlert()}
            >
              {t("Ok")}
            </Button>
          </div>
        </SweetAlert>
      )
    });
  }

  async setData() {
    let User = await UserProfileService.getUserProfile();
    let data = User.data;
    let avatar = data.avatar ? data.avatar : this.state.data.avatar;

    this.setState({
      data: { ...data, avatar: avatar }
    })
  }
  
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />
    }
  }

  handleSubmitInfo = (e) => {
    const { t } = this.props;
    const { fullName, email } = this.state.data;
    let uncheck = fullName !== "" && email !== "" && !this.state.check;

    if (this.ohFormRef.allValid() || uncheck){
      this.doSubmit(this.state.data);
    }
  };

  doSubmit(data) {
    this.updateUserInfo(data);
  }

  updateUserInfo = async (data) => {
    const { t } = this.props;
    const { id, email, fullName, gender, birthday, phoneNumber, address } = data
    let newAvatar = this.state.data.avatar === avatar ? "" : this.state.data.avatar;
    let info = { id, email, fullName, gender, birthday, phoneNumber, address, avatar: newAvatar }



    let updateUserInfo = await UserProfileService.saveUserProfile(info)
    if (updateUserInfo.status) {
      this.success(t("Cập nhật thành công"))
    }
    else {
      this.error(updateUserInfo.error)
    }
  }

  updateUserPassword = async () => {
    const { t } = this.props;
    const { id } = this.state.data;
    const { password, newpassword, confirm } = this.state.changePassword;

    if (!newpassword || newpassword.length < 6) {
      this.error(t("Mật khẩu mới tối thiểu 6 ký tự"))
      return;
    }
    else if (!confirm || newpassword !== confirm) {
      this.error(t("Xác nhận mật khẩu không chính xác"))
      return;
    }
    else {
      let changePassword = await UserProfileService.changePassword({ id, password, newpassword })

      if (changePassword.status) {
        notifySuccess(t("Đổi mật khẩu thành công"))
        this.handleClose();
      }
      else this.error(changePassword.error)
    }
  }

  componentDidMount() {
    this.setData();
  }

  onChange = obj => {
    let data = {
      ...this.state.data,
      ...obj
    };

    this.setState({ data },
    );
  };

  onChangePassword = obj => {
    let changePassword = {
      ...this.state.changePassword,
      ...obj
    };
    this.setState({ changePassword });
  };

  handleImageChange = e => {
    e.preventDefault();
    let { t } = this.props;
    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file) {
      this.setState({ file: this.state.file || undefined });
      return;
    }
    if (file.type.indexOf("image/") !== -1) {
      reader.onloadend = () => {
        this.setState({
          file: file,
          data: { ...this.state.data, avatar: reader.result }
        });
      };
      reader.readAsDataURL(file);
    }
    else
      this.error(t("Vui lòng chọn file có định dạng {{type}}", {type: ".jpg,.jpeg,.png,.svg,.svgz,.gif"}))
  };

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({open: false, changePassword:{}})
  }

  handleOk = () => {
    this.updateUserPassword();
  }

  removeAvatar = () => {
    this.setState({data: {...this.state.data, avatar: avatar}})
  }


  render() {
    const { t, classes } = this.props;
    const { data, errors, changePassword } = this.state;

    const column1 = [
      {
        name: "fullName",
        label: t("Tên"),
        ohtype: "input",
        validation: "required",
        message: t("Vui lòng điền tên")
      },
      {
        name: "email",
        label: t("Email"),
        ohtype: "input",
        validation: "required|email", // Rules https://www.npmjs.com/package/simple-react-validator#rules
        message: t("Vui lòng điền email")
      },
      {
        name: "phoneNumber",
        label: t("Số điện thoại"),
        ohtype: "input",
      },
      {
        name: "address",
        label: t("Địa chỉ"),
        ohtype: "input",
      },
      {
        name: "gender",
        label: t("Giới tính"),
        ohtype: "radio",
        isHorizontal: true,
        options: Constants.OPTIONS_GENDER,
      },
      {
        name: "birthday",
        label: t("Ngày sinh"),
        ohtype: "date-picker",
        placeholder:t("Chọn ngày sinh"),
        formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
      },      
    ];

    const column2 = [
      {
        name: "password",
        label: t("Mật khẩu"),
        ohtype: "input",
        placeholder: t("Mật khẩu hiện tại"),
        validation: "required",
        type: 'password',
        message: t("Vui lòng điền mật khẩu hiện tại")
      },
      {
        name: "newpassword",
        label: t("Mật khẩu mới"),
        ohtype: "input",
        placeholder: t("Mật khẩu mới"),
        validation: "required",
        type: 'password',
        message: t("Vui lòng điền mật khẩu mới")
      },
      {
        name: "confirm",
        label: t("Nhập lại"),
        ohtype: "input",
        placeholder: t("Xác nhận mật khẩu"),
        validation: "required",
        message: t("Vui lòng điền mật khẩu xác nhận"),
        type: 'password',
      },
    ];

    return (
      <>
        {this.state.notification}
        {this.renderRedirect()}
        {this.state.br}
        {this.state.brerror}
        <OhModal
          title={t("Đổi mật khẩu")}
          footer={[
            <OhButton key="submit" onClick={this.handleOk}>
              {t("Lưu")}
            </OhButton>,
            <OhButton key="back" type="exit" onClick={this.handleClose}>
              {t("Hủy")}
            </OhButton>,
          ]}
          content={
            <div>
            <OhForm
              onRef={ref => this.ohFormPasswordRef = ref}
              defaultFormData={changePassword}
              columns={[column2]}
              onChange={this.onChangePassword}
              validator={this.validator}
              errors={errors}
              style={{ textAlign: 'start' }}
            />
            <Card style={{ padding: 20, background: 'lightgray' }}>
              <span>{t("Lưu ý")}: {t("Mật khẩu phải thỏa mãn các điều kiện sau")}</span>
              <span>{t("* Có độ dài ít nhất 6 ký tự")}</span>
              <span>{t("* Không được trùng với mật khẩu hiện tại")}</span>
            </Card>
            </div>
          }
          onOpen={this.state.open}
          onClose={this.handleClose}
        />
        <Card>
          <CardBody>
            <GridContainer direction="row-reverse">
              <GridItem xs={12} sm={4} md={4} style={{ marginTop: -18 }}>
                <br />
                <div className="picture-container-profile" style={{ marginTop: 50 }}>
                  <div className="picture">
                    <img
                      className="img"
                      style={{ width: 140, height: 140, marginLeft: -5 }}
                      src={this.state.data.avatar}
                      alt="..."
                    />
                    <input type="file" name="myFile" accept=".jpg,.jpeg,.png,.svg,.svgz,.gif" onChange={e => this.handleImageChange(e)} />
                    {this.state.data.avatar !== avatar ? <span className="button" onClick={this.removeAvatar} style={{cursor: "pointer"}}><Icon type="close-square" style={{ fontSize: '32px' }} theme="filled"/></span>:null}
                  </div>
                </div>
                  <div className={classes.checkboxAndRadio} style={{ textAlign: "center" }}>
                    <span style={{ color: "#007bff", cursor:"pointer" }} onClick={this.handleOpen}>
                      {t("Đổi mật khẩu")}
                    </span>
                  </div>
              </GridItem>
              <GridItem xs={12} sm={8} md={8}>
                <OhForm
                  title={t("Thông tin của tôi")}
                  defaultFormData={data}
                  onRef={ref => this.ohFormRef = ref}
                  totalColumns={1}
                  columns={[column1]}
                  onChange={value => { this.onChange(value) }}
                  validator={this.validator}
                  errors={errors}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardHeader style={{ textAlign: "end" }}>
              <OhButton onClick={this.handleSubmitInfo}>{t("Cập nhật")}</OhButton>
          </CardHeader>
        </Card>
      </>
    );
  }
}


MyAccount.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTranslation("translations")(connect(function (state) {
  return {
    User: state.reducer_user.User,
    user: state.user
  }
},
)(
  withStyles(theme => ({
    ...buttonsStyle,
    ...regularFormsStyle,
    ...extendedTablesStyle,
    ...sweetAlertStyle,
    ...userProfileStyles,
    inlineChecks: {
      marginTop: "20px"
    }
  }))(MyAccount)));

