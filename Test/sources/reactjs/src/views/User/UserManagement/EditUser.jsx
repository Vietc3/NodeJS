import React, { Component } from "react";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import OhForm from "components/Oh/OhForm";
import BranchService from 'services/BranchService';
import UserService from "services/UserService";
import RoleService from "services/RoleService"
import Constants from "variables/Constants";
import { connect } from "react-redux";
import HttpService from "services/HttpService";
import _ from "lodash";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import { MdSave, MdCancel } from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';

class EditUser extends Component {
  constructor(props) {
    super(props);
    let path = this.props.location ? this.props.location.pathname.split('/') : [""];
    this.pathtoken = path[path.length - 1];
    this.defaultFormData = {
      email: "",
      address: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      confirm: "",
      note: "",
      birthday: 0,
      isActive: this.pathtoken !== "" && this.pathtoken !== Constants.ADD_USER_ROUTE ? [] : [1],
      branchId: [],
      dataBranch: []
    };
    
    this.state = {
      data: this.defaultFormData,
      roles: this.props.roles && this.props.roles.length ? this.props.roles : [],
      br: null,
      brerror: null,
      redirect: null
    };
    this.ohFormRef = null;
  }

  componentDidMount() {
    this.setData();
    this.getBranches();

  }

  async setData() {

    if (this.pathtoken !== "" && this.pathtoken !== Constants.ADD_USER_ROUTE) {
      let [ User, roles ] = await Promise.all([UserService.getUser(this.pathtoken), RoleService.getRoles()]);
      let infoUser = User.data;
      
      this.setState({
        roles: roles.data,
        data: { 
          ...this.state.data, 
          ...infoUser, 
          isActive: infoUser.isActive === true ? [1] : [],
          branchId: JSON.parse(infoUser.branchId),
          confirm: "" }
      })
    }
    else {
      let roles = await RoleService.getRoles();
      this.setState({
        roles: roles.data,
        data: { ...this.state.data, isActive: [1] }
      })
    }
  }

  getBranches = async()=>{
      let Branches = await BranchService.getBranches()

      if (Branches.status) {
        this.setState({ dataBranch: Branches.data})
      }
      else notifyError(Branches.message);
  }

  onChange = obj => {
    let data = {
      ...this.state.data,
      ...obj
    };

    this.setState({ data },
    );
  };

  success = (mess) => {
    this.setState({
      redirect: <Redirect to={{ pathname: Constants.MANAGE_USER_PATH }} />,
    })
    notifySuccess(mess)
  }

  error = (mess) => {
    notifyError(mess)
  }

  handleSubmit = () => {
    const { t } = this.props;    
    if ( this.ohFormRefRole.allValid() && this.ohFormRefInfor.allValid()){      
      this.doSubmit(this.state.data);
    } else {
      notifyError(t("Vui lòng điền các thông tin bắt buộc"))
    }
  };

  doSubmit(data) {
    const { t } = this.props;
      if(data.password.length < 6 && data.password !== ""){
        notifyError(t("Mật khẩu phải tối thiểu 6 ký tự"))
      }
      else if (data.password !== data.confirm) {
        notifyError(t("Xác nhận mật khẩu không chính xác"));
      }
      else if (this.pathtoken === "" || this.pathtoken === Constants.ADD_USER_ROUTE) {
          this.createUser(data);
      }
      else {
        this.updateUser(data);
      }
  }

  updateUser = async (data) => {
    const { t, currentUser } = this.props;
    
    let info = JSON.parse(JSON.stringify(data))
    delete info.avatar;

    info.isActive = info.isActive[0] === 1 ? 1 : 0;
    info.branchId = JSON.stringify(data.branchId);

    let checkBranchId = _.includes(data.branchId, parseInt(this.props.branchId))      

    let updateUser = await UserService.saveUser(info)

    if (updateUser.status) {  
      let checkArray = _.isEqual(data.branchId.sort(), JSON.parse(currentUser.user.branchId).sort())    
      this.success(t('Cập nhật người dùng thành công'));

      if (currentUser.user.id === updateUser.data.id){
        let index = this.state.dataBranch.findIndex(item => item.id === data.branchId[0]); 
             
        if (!checkBranchId) {
          HttpService.setBranch(data.branchId[0],false, this.state.dataBranch[index].name);
        }
        if (!checkArray) {
          await UserService.getCurrentUser();
        }
      }

    }
    else {
      notifyError(updateUser.error)
    }
  }

  createUser = async (data) => {
    const { t } = this.props;
    let info = JSON.parse(JSON.stringify(data))
    delete info.avatar;

    info.isActive = info.isActive[0] === 1 ? 1 : 0;
    info.branchId = JSON.stringify(data.branchId);
      
    let createUser = await UserService.register(info);
    if (createUser.status) {
      this.setState({
        idUser: createUser.data.id
      })
      if(this.props.isModal){
        this.handleCloseModal(false, createUser.data.id);
        notifySuccess(t('Tạo người dùng thành công'));
        this.setState({
          data: this.defaultFormData,
        });
      }
      else
        this.success(t('Tạo người dùng thành công'));
      }
    else {
      notifyError(createUser.message);
    }
  }

  async getRole() {
    let roles = await RoleService.getRoles();
    this.setState({ roles: roles.data });
  }

  handleCloseModal = (visible, userId) => {
    if(this.props.isModal)
      this.props.onChangeVisible(visible, userId);
    else this.setState({
      redirect: <Redirect to={{ pathname: Constants.MANAGE_USER_PATH }} />,
    })
  }

  render() {
    const { data, roles, dataBranch } = this.state;
    let isAdmin = this.pathtoken && data.id && data.id === 1 ? true : false;
    const { t } = this.props;
    const roleOptions = [];
    const branchs = dataBranch ? dataBranch : [];

    const branchOptions = [];

    roles.map(item => roleOptions.push({ title: item.name, value: item.id }));
    branchs.map(item => branchOptions.push({ label: item.name, value: item.id }));


    const column1 = [
      {
        name: "fullName",
        label: t("Tên nhân viên"),
        ohtype: "input",
        validation: "required",
        message: t("Vui lòng điền tên {{type}}", {type: t("Nhân viên").toLowerCase()}),
      },
      {
        name: "email",
        label: t("Email"),
        ohtype: "input",
        validation: "required|email", // Rules https://www.npmjs.com/package/simple-react-validator#rules
        placeholder: "example@ohstore.vn",
        message: t("Vui lòng điền email"),
      },
      {
        name: "phoneNumber",
        label: t("Số điện thoại"),
        ohtype: "input",
      },
      {
        name: "isActive",
        label: t("Đang hoạt động"),
        ohtype: "checkbox",
        options: [{ value: 1 }],
        disabled: isAdmin
      }
    ];

    const column2 = [
      {
        name: "password",
        label: t("Mật khẩu"),
        ohtype: "input",
        validation: this.pathtoken === "" ? "required" : null,
        message: t("Vui lòng điền mật khẩu"),
        type: 'password',
        helpText: this.pathtoken === "" ? null : t("Không đổi mật khẩu thì để trống"),
      },
      {
        name: "confirm",
        label: t("Nhập lại mật khẩu"),
        ohtype: "input",
        validation: this.pathtoken === "" ? "required" : null,
        message: t("Vui lòng điền xác nhận mật khẩu"),
        type: 'password',
        helpText: this.pathtoken === "" ? null: t("Không đổi mật khẩu thì để trống"),
      },
      {
        name: "address",
        label: t("Địa chỉ"),
        ohtype: "input",
      },
      {
        name: "birthday",
        label: t("Ngày sinh"),
        ohtype: "date-picker",
        placeholder: t("Chọn ngày sinh"),
        formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
      }
    ];
    const column3 = [
      {
        name: "roleId",
        label: t("Bộ phận"),
        ohtype: "select",
        validation: "required",
        placeholder: t("Bộ phận"),
        message: t("Vui lòng điền tên {{type}}", {type: t("Bộ phận").toLowerCase()}),
        options: roleOptions,
        onChange: (value) => this.setState({ data: { ...data, roleId: value } }, () => this.getRole()),
        disabled: isAdmin
      },
      {
        name: "branchId",
        label: t("Chi nhánh"),
        ohtype: "checkbox",
        hasCheckAll: true,
        options: branchOptions,
        validation: "required",
        message: t("Vui lòng chọn ít nhất một chi nhánh"),
      },
    ];
    const columns = [column1, column2];

    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            {this.state.br}
            {this.state.brerror}
            {this.state.redirect}
            <CardBody>
              <OhForm
                title={t("Thông tin người dùng")}
                totalColumns={2}
                defaultFormData ={data}
                onRef={ref => this.ohFormRefInfor = ref}
                columns={columns}
                onChange={value => { this.onChange(value) }}
                validator={this.validator}
              />
              <OhForm
                title={t("Phân quyền")}
                defaultFormData ={data}
                onRef={ref => this.ohFormRefRole = ref}
                columns={[column3,[]]}
                onChange={value => { this.onChange(value) }}
                validator={this.validator}
              />
            </CardBody>
            <CardFooter>
              <GridContainer justify="flex-end" style={{ padding: 10 }}>
                <OhToolbar
                  right={[
                    {
                      type: "button",
                      label: t("Lưu"),
                      onClick: () => this.handleSubmit(),
                      icon: <MdSave />,
                      simple: true,
                      typeButton: "add",
                      permission: {
                        name: Constants.PERMISSION_NAME.SETUP_USER,
                        type: Constants.PERMISSION_TYPE.TYPE_ALL
                      }
                    },
                    {
                      type: this.props.isModal ? "button" : "link",
                      onClick: () => this.handleCloseModal(false, undefined),
                      label: t("Thoát"),
                      icon: <MdCancel />,
                      linkTo: Constants.MANAGE_USER_PATH,
                      simple: true,
                      typeButton: "exit"
                    },
                  ]}
                />
              </GridContainer>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser,
    branchId: state.branchReducer.branchId,

  };
})(withTranslation("translations")(EditUser));
