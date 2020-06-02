import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Button from "components/CustomButtons/Button.jsx";
import OhLanguage from "components/Oh/OhLanguage.jsx";
import avatar from "assets/img/new_logo.png";
import branchIcon from "assets/img/chinhanh-silb@0.5x.png";
import { connect } from "react-redux";
import adminNavbarLinksStyle from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.jsx";
import Constants from 'variables/Constants/';
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import userService from "services/UserService";
import UserProfileService from "services/UserProfileService.js";
import { Popover, Tooltip } from "antd";
import HttpService from "services/HttpService.js";
import UserService from "services/UserService.js";
import store from "store/Store.js";
import UserAction from "store/actions/UserAction.js";
import BranchService from 'services/BranchService.js';
import { notifySuccess, notifyError } from "components/Oh/OhUtils.js";
import Divider from "@material-ui/core/Divider";
import _ from "lodash";
import question from "assets/img/question.png";

class HeaderLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openNotification: false,
      openProfile: false,
      openLanguage: false,
      openBranch: false,
      redirect: false,
      url: avatar,
      branchIcon: branchIcon,
      path: "",
      language: this.props.language,
      Sum: "",
      Task: "",
      Mess: "",
      Proj: "",
      userName: "",
      dataBranch: [],
      branchName: {}
    };

  }
  componentWillMount() {
    this.setAvatar();
    this.getBranches();
  }

  getBranches = async()=>{
    let { currentUser } = this.props;
    let branchId = JSON.parse(currentUser.user.branchId);
    
    let Branches = await BranchService.getBranches({
      filter: { id:{ in: branchId }, deletedAt: 0, status: Constants.BRANCH_CARD_STATUS.ACTIVE },
      sort: 'createdAt ASC'
    })

    if (Branches.status) { 
      let branchName = {};

      _.forEach(Branches.data, item => {
        branchName[item.id] = item.name
      })
      
      this.setState({ 
        dataBranch: Branches.data,
        branchName: branchName
      })
    }
    else notifyError(Branches.message);
  }

  handleClickBranch = () => {
    this.setState({ openBranch: !this.state.openBranch });
  };
  handleCloseBranch = () => {
    this.setState({ openBranch: false });
  };
  handleVisibleBranch = visible => {
    this.setState({ openBranch: visible });
  };
  changeBranch = async branch => {
    let { t } = this.props;
    let branchId = branch.id;

    this.handleCloseBranch();
    HttpService.setBranch(branchId, false, branch.name);
    HttpService.getData();
    localStorage.removeItem("sales-counter");
    localStorage.removeItem("checkview"); 
    notifySuccess(t("Bạn vừa chuyển sang chi nhánh \"{{branchName}}\", màn hình \"{{routerName}}\" sẽ được tải lại theo chi nhánh mới.", {branchName: branch.name, routerName: t(this.props.routerName)}));
  };
  
  handleClickNotification = () => {
    this.setState({ openNotification: !this.state.openNotification });
  };
  handleCloseNotification = () => {
    this.setState({ openNotification: false });
  };
  handleClickProfile = () => {
    this.setState({ openProfile: !this.state.openProfile });
  };
 
  logOut = () => {
    userService.logout();
  };

  handleCloseProfile = () => {
    this.setState({ closeProfile: !this.state.closeProfile });
  };

  handleCloseProfile = () => {
    this.setState({ openProfile: false });
  };

  setRedirect = path => {
    this.setState({
      redirect: true,
      path: path
    });
  };
  async componentDidUpdate(prevProps, prevState) {
    if (this.props.User.Avatar !== prevProps.User.Avatar) {
      this.setAvatar();
    }
    if (this.props.currentUser.user.branchId !== prevProps.currentUser.user.branchId || (this.props.isGetBranch !== prevProps.isGetBranch)) {
      this.getBranches();
    }
    if (this.props.Language_Product !== prevProps.Language_Product) {
      if (this.props.Language_Product >= Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY) {
        let lang = "vn";
        if (this.props.currentUser && this.props.currentUser.user && this.props.currentUser.user.language) {
          lang = this.props.currentUser.user.language          
        }
        HttpService.setLanguage(lang)
      }
      else {
        HttpService.setLanguage("vn");
        let getUser = await UserService.getUser(this.props.currentUser.user.id)
        
        if (getUser.status && getUser.data) {
          let currentUser = {...this.props.User.currentUser, user: getUser.data }
          store.dispatch(UserAction.updateUserInfo({...this.props.User, ...currentUser }))
        }
      }
    }
  }
  setAvatar = async () => {
    let Avatar = await UserProfileService.getUserAvatar();

    if (Avatar.status) this.setState({ url: Avatar.data || avatar });
  };

  handleClickMyProfile = () => {
    if (this.state.redirect) {
      this.setState({ redirect: false, openProfile: false });
      return <Redirect to={this.state.path} />;
    } else {
      this.setState({ openProfile: false });
    }
  };

  userName(str) {
    let fullName = String(str);
    let name = fullName.split(" ");
    return name[name.length - 1] + " " + name[0];
  }

  onChangeBranchDefault =()=>{
    let { dataBranch } = this.state;    
    if (dataBranch.length){
      this.changeBranch(dataBranch[0]);
    } else {
      return null;
    }
  }

  render = () => {
    const { t, classes, rtlActive } = this.props;
    const { openNotification, dataBranch, branchName, openBranch} = this.state;

    let branchId = this.props.branchId;  
    const dropdownItem = classNames(classes.dropdownItem, classes.infoHover, { [classes.dropdownItemRTL]: rtlActive });

    const wrapper = classNames({
      [classes.wrapperRTL]: rtlActive
    });
    const managerClasses = classNames({
      [classes.managerClasses]: true
    });
    if (this.state.redirect) {
      this.setState({ redirect: false, openNotification: false });
      return <Redirect to={this.state.path} />;
    }
    const url = this.state.url ? this.state.url : avatar;
    
    return (
      <div className={wrapper + " customAvatar"}>
        <div className={managerClasses}>
        {window.location.pathname === "/admin/sales-counter" ? null :
        <Popover
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
          placement="bottomRight"
          visible={openBranch}
          onVisibleChange={(visible) => this.handleVisibleBranch(visible)}
          content={
            openBranch ? 
            <MenuList 
              role="menu"
              className={classNames({
                'list_branches_overflow': dataBranch.length > 1
              })}
            >
              {dataBranch.map((item, index) => {
                return (
                  <span key={'branch_' + index}>
                    <MenuItem className={dropdownItem} onClick={() => this.changeBranch(item)}>
                      {item.name}
                    </MenuItem>
                    {index < dataBranch.length - 1 && <Divider light />}
                  </span>
                );
              })}
            </MenuList> : null
          }
        >
            <Button
              color="transparent"
              aria-label={t("Person")}
              justIcon
              aria-owns={openNotification ? "profile-menu-list" : null}
              aria-haspopup="true"
              onClick={() => this.handleClickBranch()}
              className={classes.buttonLink}
              buttonRef={node => {
                this.anchorProfile = node;
              }}
              style={{ paddingTop: "4px", justifyContent: 'left', width:'unset' }}
            >
              <div >                
                <img src = {branchIcon} style={{ width: 30, height: 30, marginTop: -8 }}/>&nbsp;
                  <span className="branch_title" title={branchName[branchId]} style={{ marginTop: 7}} >{branchName[branchId]}</span>                  
              </div>
            </Button>
            </Popover> }
          <a href="https://ohstore.vn/user_guide" target="blank" style={{color: "inherit"}}>
              <Button
                color="transparent"
                justIcon
                aria-label={t("Person")}
                aria-haspopup="true"
                className={classes.buttonLink}
                title={"Hướng dẫn"}
                buttonRef={node => {
                  this.anchorProfile = node;
                }}
                style={{ paddingTop: "4px", justifyContent: 'left', width: 30 }}
              >
                <div >    
                  <img src = {question} style={{width: 25, height: 25, marginTop: 2 }}/>
                </div>
              </Button>
          </a>
          {this.props.Language_Product >= Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY ? <OhLanguage /> : null }          
          <Popover
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
            placement="bottomLeft"
            content={
              <MenuList 
                role="menu"
                
              >
                <MenuItem
                  className={dropdownItem}
                  onClick={() => { this.setRedirect("/admin/my-profile"); this.handleClickMyProfile() }}
                >
                  {t("Hồ sơ cá nhân")}
                </MenuItem>

                {/* <Divider light /> */}
                <MenuItem
                  onClick={this.logOut}
                  className={dropdownItem}
                >
                  {t("Đăng xuất")}
                </MenuItem>
              </MenuList>
            }
          >
            <Button
              color="transparent"
              aria-label={t("Person")}
              justIcon
              aria-owns={openNotification ? "profile-menu-list" : null}
              aria-haspopup="true"
              onClick={this.handleClickProfile}
              className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
              muiClasses={{
                label: rtlActive ? classes.labelRTL : ""
              }}
              buttonRef={node => {
                this.anchorProfile = node;
              }}
              style={{ paddingTop: "4px", justifyContent: 'left' }}
            >
              <div className="User">
                <img alt="Avatar"
                  src={url}
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                >
                </img>
              </div>
            </Button>
          </Popover>
        </div>
      </div>
    );
  };
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool,
  routerName: PropTypes.string,
};

export default connect(state => {
  return {
    User: state.reducer_user.User,
    myChangeAvatar: state.reducer_user.changeAvatar,
    url: state.reducer_user.url,
    state: state,
    language: state.languageReducer.language,
    currentUser: state.userReducer.currentUser,
    Language_Product: state.reducer_user.Language_Product,
    User: state.userReducer,
    branchId: state.branchReducer.branchId,
    isGetBranch: state.branchReducer.isGetBranch
  };
})(withTranslation("translations")(withStyles(adminNavbarLinksStyle)(HeaderLinks)));
