import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import withStyles from "@material-ui/core/styles/withStyles"
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody";
import "react-datepicker/dist/react-datepicker.css";
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import ThongTinMauInIcon from "assets/img/icons/menu/Infprint-blue@0.5x.png";
import ThongTinCuaHangIcon from "assets/img/icons/menu/Infstore-blue@0.5x.png";
import CauHinhChucNangIcon from "assets/img/icons/menu/Cauhinhchucnang.png";
import QuanLyChiNhanhIcon from "assets/img/icons/quanlychinhanh@0.5x.png";
import QuanLyKhoIcon from "assets/img/icons/menu/manage-warehouse.png";
import MaPhieu from "assets/img/icons/formcodecogf.png";
import FormLabel from "@material-ui/core/FormLabel";
import Constants from "variables/Constants/";
import { Redirect } from 'react-router-dom';

class InfoPrint extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  checkToPage = (link) => {
    this.setState({
      redirect: <Redirect to={link} />
    })
  }

  getDataInfoPrint = (dataSource) => {
    let dataInfoPrint = [];

    if (dataSource) {
      dataSource.map((item) => {
        dataInfoPrint.push(
          < >
            <GridContainer >
              <GridItem xs={12} sm={2}>
                <GridContainer style={{ width: "100%" }}>
                  <GridItem xs={12} sm={12} style={{ textAlign: "right", cursor: "pointer" }} onClick={() => this.checkToPage(item.link)} >
                    <img src={item.icon}
                      alt="Logo Thông tin"
                      width="65px"
                      height="65px"
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>

              <GridItem xs={12} sm={10}>
                <GridContainer style={{ width: "100%" }}>
                  <GridItem xs={12} >
                    <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
                      <p style={{ fontSize: 16, cursor: "pointer", color: "#1890ff", fontWeight: "bold" }} onClick={() => this.checkToPage(item.link)}>{item.title}</p>
                    </FormLabel>
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ width: "100%" }}>
                  <GridItem xs={12} >
                    <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
                      <p style={{ fontSize: 14, color: "black", cursor: "pointer" }} onClick={() => this.checkToPage(item.link)}>{item.content}</p>
                    </FormLabel>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
            <hr style={{ marginTop: "4px", marginBottom: "2px" }} />
          </>
        )
        return null;
      });
    } return dataInfoPrint;

  }
  render() {
    let {t, permissionsUser} = this.props;
    let type_permission = Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY;
    let rows = [
      {
        icon: ThongTinCuaHangIcon,
        title: t("Thông tin cửa hàng"),
        content: t("Quản lý thông tin liên hệ và địa chỉ của cửa hàng"),
        link: "/admin/store_info"
      },
      {
        icon: CauHinhChucNangIcon,
        title: t("Cấu hình chức năng"),
        content: t("Tùy chỉnh các chức năng của hệ thống"),
        link: "/admin/store_options"
      },
      {
        icon: MaPhieu,
        title: t("Cấu hình mã phiếu"),
        content: t("Tùy chỉnh mã phiếu"),
        link: "/admin/card-codes"
      },
      {
        icon: ThongTinMauInIcon,
        title: t("Thông tin mẫu in"),
        content: t("Thiết lập và tùy chỉnh mẫu in cho các chi nhánh"),
        link: "/admin/print-templates"
      },

      {
        icon: QuanLyChiNhanhIcon,
        title: t("Quản lý chi nhánh"),
        content: t("Thêm và điều chỉnh thông tin các chi nhánh"),
        link: "/admin/branch_management"
      },
      {
        icon: QuanLyKhoIcon,
        title: t("Quản lý kho"),
        content: t("Thêm và điều chỉnh thông tin các kho"),
        link: "/admin/stock_management"
      },
    ];

    if (permissionsUser.setup_branch < type_permission && permissionsUser.setup_stock < type_permission && permissionsUser.setup_store >= type_permission){
      rows.splice(3,2);
    } 

    if (permissionsUser.setup_branch < type_permission && permissionsUser.setup_stock >= type_permission && permissionsUser.setup_store >= type_permission){
      rows.splice(3,1);
    }

    if (permissionsUser.setup_stock < type_permission && permissionsUser.setup_branch >= type_permission && permissionsUser.setup_store >= type_permission){
      rows.splice(4,1);
    }

    if (permissionsUser.setup_store < type_permission && permissionsUser.setup_stock >= type_permission && permissionsUser.setup_branch < type_permission){
      rows.splice(0,4);
    }

    if (permissionsUser.setup_store < type_permission && permissionsUser.setup_stock >= type_permission && permissionsUser.setup_branch >= type_permission){
      rows.splice(0,3);
    }

    if (permissionsUser.setup_store < type_permission && permissionsUser.setup_stock < type_permission && permissionsUser.setup_branch >= type_permission){
      rows.splice(0,3);
      rows.splice(1,1); 

    }

    let listInfoPrint = this.getDataInfoPrint(rows);

    return (
      <Fragment>
        {this.state.redirect}
        <Card>
          <CardBody>
            <div >
              <hr style={{ marginTop: "5px", marginBottom: "1px" }} />
              {listInfoPrint}
            </div>
          </CardBody>
        </Card>
      </Fragment>
    )
  }
}

InfoPrint.propTypes = {
  classes: PropTypes.object
};

export default connect(
  function (state) {
    return {
      permissionsUser: state.userReducer.currentUser.permissions,
    };
  }
)(
  withTranslation("translations")(
    withStyles(theme => ({
      ...extendedTablesStyle,
  ...buttonsStyle
    }))(InfoPrint)
  )
);