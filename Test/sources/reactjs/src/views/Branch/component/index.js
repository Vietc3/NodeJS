import React, { Component } from 'react';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import OhForm from 'components/Oh/OhForm.jsx';
import Constants from 'variables/Constants/index.js';
import { withTranslation } from "react-i18next";
import Card from 'components/Card/Card.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import OhButton from 'components/Oh/OhButton.jsx';
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel, MdDelete } from "react-icons/md";
import { notifySuccess, notifyError } from 'components/Oh/OhUtils.js';
import BranchService from 'services/BranchService.js';
import { Redirect } from 'react-router-dom';
import AlertQuestion from 'components/Alert/AlertQuestion.jsx';
import { connect } from "react-redux";
import UserService from "services/UserService.js";
import HttpService from 'services/HttpService.js';
import userAction from "store/actions/UserAction.js";
import store from "store/Store.js";

class index extends Component {
  constructor(props){
    super(props);
    this.state = {
      formData: {
        status: 1
      },
      isSubmit: false,
      isEdit: this.props.match && this.props.match.params && this.props.match.params.cardId ? true : false,
      redirect: null,
      dataBranch: [],
      alert: null,
    }
    this.formData = {}
  }

  componentDidMount() {
    if (this.state.isEdit) {
      this.getData(this.props.match.params.cardId);
    }
    this.getDataBranch();  
  }

  async getData(id) {
    let getBranch = await BranchService.getBranch(id)

    if (getBranch.status) {
      this.setState({
        formData: getBranch.data
      })
      this.formData = JSON.parse(JSON.stringify(getBranch.data))
    }
    else notifyError(getBranch.message)
  }

  getDataBranch = async()=>{
    let getBranches = await BranchService.getBranches();

      if (getBranches.status) {
        let data = getBranches.data;
        let dataBranch = [];

        if (data.length){
          data.map(item =>{
            if (item.status === Constants.BRANCH_STATUS_OPTIONS[0].value && item.id !== Number(this.props.branchId)) {
              dataBranch.push(item);
            }
          })
        }
        
        this.setState({
          dataBranch: dataBranch
        })
      } else notifyError(getBranches.message);
  }

  onChange(obj) {
    this.setState({
      formData: {
        ...this.state.formData,
        ...obj
      }
    })
  }

  hideAlert = () => {
    this.setState({ alert: null })
  }

  cancelVote = () => {      
    this.setState({
      alert: (
        <AlertQuestion 
          messege={`Bạn có chắc chắn ngừng chi nhánh cuối cùng này không?`} 
          hideAlert={ this.hideAlert }
          action={() => {
            this.hideAlert()
            this.submit();
          }}
          buttonOk={"Đồng ý"}
        />
      )
    })
  }

  submit = () => {
    let { formData, isEdit, dataBranch } = this.state;
    let { t } = this.props;
    
    if (this.ohFormRef.allValid()) {
      this.setState({
        isSubmit: true
      }, async () => {
        let branch = await BranchService.saveBranch(formData);

        if (branch.status) {         
          
          let id = isEdit ? this.props.match.params.cardId : branch.data.id;

          if (!isEdit) {
            let user = this.props.currentUser.user;
            let branchId = JSON.parse(user.branchId);

            branchId.push(id);

            let saveUser = await UserService.saveUser({id: user.id, email: user.email, branchId: JSON.stringify(branchId) })

            if (saveUser.status) {
              store.dispatch(userAction.updateUserInfo({ ...this.props.currentUser, user: saveUser.data }));
            }
            
          }
          else {            
            if (Number(branch.data.status) === Constants.BRANCH_STATUS_OPTIONS[1].value && branch.data.id === Number(this.props.branchId) ){
              if (dataBranch.length){
                HttpService.setBranch(dataBranch[0].id, !this.props.isGetBranch, dataBranch[0].name);
              } else {
                UserService.logout();
              }

            } else {
              HttpService.setBranch(this.props.branchId, !this.props.isGetBranch, this.props.nameBranch);

            }
          }    

          notifySuccess(isEdit ? t("Cập nhật {{type}} thành công", {type: t("Chi nhánh").toLowerCase()}) : t("Tạo {{type}} thành công", {type: t("Chi nhánh").toLowerCase()}));      

          this.setState({
            isSubmit: false,
            redirect: <Redirect to={"/admin/branch_management"} />
          })
        }
        else {
          notifyError(branch.message);

          this.setState({
            isSubmit: false
          })
        }
      })      
    }
  }

  remove = async () => {
    let { t } = this.props;
    this.setState({
      alert: <AlertQuestion
        messege={t("Bạn chắc chắn muốn xóa chi nhánh {{nameBranch}}?",{nameBranch: this.formData.name})}
        hideAlert={() => this.setState({ alert: null })}
        buttonOk= "Xóa"
        action={async () => {
          let removeBranch = await BranchService.deleteBranch(this.props.match.params.cardId);

          if (removeBranch.status) {

            HttpService.setBranch(this.props.branchId, !this.props.isGetBranch, this.props.nameBranch);
            HttpService.getData();
            this.setState({ 
              alert: null,
              redirect: <Redirect to="/admin/branch_management" />
            })
            
            notifySuccess(t("Xóa chi nhánh {{type}} thành công", { type: this.formData.name }))
                    
          }
          else {
            notifyError(removeBranch.message);
            this.setState({ 
              alert: null
            })
          }
        }}
      />
    })
  }

  render() {
    let { formData, isSubmit, isEdit, redirect, alert, dataBranch } = this.state;
    let { t } = this.props;
    
    return (
      <GridContainer>
        {redirect}
        {alert}
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <OhForm
                defaultFormData={ formData }
                onRef={ref => this.ohFormRef = ref}
                columns={[
                  [
                    {
                      name: "name",
                      label: t("Tên CN"),
                      ohtype: "input",
                      placeholder: t("Nhập {{type}} chi nhánh", {type: t("Tên").toLowerCase()}),
                      validation: "required",
                      message: t("Vui lòng nhập tên chi nhánh")
                    },
                    {
                      name: "phoneNumber",
                      label: t("Điện thoại"),
                      ohtype: "input",
                      placeholder: t("Nhập {{type}} chi nhánh", {type: t("Điện thoại").toLowerCase()})
                    },
                    {
                      name: "email",
                      label: t("Email"),
                      validation: "email",
                      ohtype: "input",
                      placeholder: t("Nhập {{type}} chi nhánh", {type: t("Email").toLowerCase()}),
                    },
                    {
                      name: "address",
                      label: t("Địa chỉ"),
                      ohtype: "textarea",
                      minRows: 2,
                      maxRows: 3,
                      placeholder: t("Nhập {{type}} chi nhánh", {type: t("Địa chỉ").toLowerCase()})
                    },
                    {
                      name: "status",
                      label: t("Trạng thái"),
                      ohtype: "select",
                      options: Constants.BRANCH_STATUS_OPTIONS.map(item => ({...item, title: t(item.title)}))
                    },
                  ],
                ]}
                onChange={value => {
                  this.onChange(value);
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} style={{ textAlign: 'right' }}>
          <OhButton
            type="add"
            disabled={isSubmit}
            icon={<AiOutlineSave />}
            onClick={() => formData.status === Constants.BRANCH_STATUS_OPTIONS[1].value && isEdit && !dataBranch.length ? this.cancelVote() : this.submit()}    
            permission={{
              name: Constants.PERMISSION_NAME.SETUP_BRANCH,
              type: Constants.PERMISSION_TYPE.TYPE_ALL
            }}         
          >
            {t("Lưu")}
          </OhButton>
          { 
            isEdit ? 
              <OhButton
                type="delete"
                icon={<MdDelete />}
                onClick={() => this.remove()} 
                permission={{
                  name: Constants.PERMISSION_NAME.SETUP_BRANCH,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}            
              >
                {t("Xóa")}
              </OhButton>
              : null 
          }
          <OhButton
            type="exit"
            icon={<MdCancel />}
            onClick={() => this.setState({
              redirect: <Redirect to="/admin/branch_management" />
            })}            
          >
            {t("Thoát")}
          </OhButton>
        </GridItem>
      </GridContainer>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser,
    branchId: state.branchReducer.branchId,
    isGetBranch: state.branchReducer.isGetBranch,
    nameBranch: state.branchReducer.nameBranch
  };
})(withTranslation("translations")(index));