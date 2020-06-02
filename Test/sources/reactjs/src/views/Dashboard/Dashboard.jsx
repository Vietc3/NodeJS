import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Tooltip, Empty } from 'antd'
import { withTranslation } from 'react-i18next';
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.jsx";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction.js";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DonHangIcon from "assets/img/icons/menu/Donhang.png";
import TraHangIcon from "assets/img/icons/menu/Trahang.png";
import DoanhThuIcon from "assets/img/icons/menu/Giaodich.png";
import TonKhoIcon from "assets/img/icons/menu/Tonkho.png";
import QuanLyGiaIcon from "assets/img/icons/menu/Quanlygia.png";
import DonViTinhIcon from "assets/img/icons/menu/Donvitinh.png";
import ChartDashboard from "./ChartDashboard.jsx";
import DashboardService from 'services/DashboardService.js';
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Constants from "variables/Constants/index.js";
import { trans } from "lib/ExtendFunction.js";
import { connect } from "react-redux"
import OhDateTimePicker from 'components/Oh/OhDateTimePicker.jsx';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalStock: 0,
      countInvoice: 0,
      countInvoiceReturn: 0,
      Invoices: [],
      InvoiceReturn: [],
      TopProducts: [],
      AmountSale: 0,
      AmountStock: 0,
      countStockQuantityLow: 0,
      PriceLow: 0,
      InputValue: [moment().startOf('day'),moment().endOf('day')],
      dateTime: {
        start: new Date(moment().startOf('day')).getTime(),
        end: new Date(moment().endOf('day')).getTime()
      },
    }
  }

  componentDidMount() {
    let start = moment().startOf('day')
    let end = moment().endOf('day')
    this.getData(start, end)
  }

  async getData(start, end) {
    let dataReport = await DashboardService.getDashboardData({
      filter: {
        createdAt: { "<=": new Date(end).getTime(), ">=": new Date(start).getTime() }
      },
      startDate: new Date(start).getTime(),
      endDate: new Date(end).getTime()
    })
    this.setState({
      countInvoice: dataReport.countInvoice,
      countInvoiceReturn: dataReport.countInvoiceReturn,
      countStockQuantityLow: dataReport.countStockQuantityLow,
      AmountSale: dataReport.amountSale,
      AmountStock: dataReport.amountStock,
      totalStock: dataReport.totalStock,
      Invoices: dataReport.invoices,
      InvoiceReturn: dataReport.invoiceReturn,
      TopProducts: dataReport.TopProducts.rows,
    })
  }

  showProductList = () => {
    let type_permission = Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY;
    const { permissionsUser, t } = this.props
    let ListProduct = [];
    let count =  1;
    for (let i in this.state.TopProducts) {     
      ListProduct.push(
        <GridContainer key={'Product_'+i} style={{height:"60px"}}>
          <GridItem  xs={12} sm={12}>
            <div>
            <GridItem xs={12}>
              <Tooltip placement="topLeft" title ={trans(this.state.TopProducts[i].name)}>
              <Row>
                <Col className={"role-count"} style={{ maxWidth:  17 }}>
                  <span className={"ranking-item"} >
                  {count}
                  </span>
                  
                  </Col>
                  { permissionsUser.product >= type_permission ?
                    <Col className="role-item">
                    <Link to = {`/admin/edit-product/${this.state.TopProducts[i].productId}`}>
                      {trans(this.state.TopProducts[i].name)}
                  </Link>
                  </Col> :
                    <Col className="role-item">
                      {trans(this.state.TopProducts[i].name)}
                  </Col>  
                }
              </Row>
              </Tooltip>
              <GridItem className="best-selling-list" xs={12}>
              <GridContainer style = {{marginTop: 10}}>
                <GridItem xs={4}>
                  <p className="role-label" style={{ marginTop: "-35px", textAlign: "left"}}>
                    { t("quantityProduct", {quantity: this.state.TopProducts[i]["SUM(quantity)"]})}
                  </p>
                </GridItem>
                <GridItem xs={8}>
                  <p className="role-label" style={{ marginTop: "-35px", textAlign: "left" }}>
                    {t("{{amount}} đ", {amount: ExtendFunction.FormatNumber(this.state.TopProducts[i].finalAmount)})}
                  </p>
                </GridItem>
              </GridContainer>
            </GridItem>
            </GridItem>
            
            </div>
          </GridItem>
          </GridContainer>

      )
      count++;
    }
    return ListProduct;
  }
  render() {
    const { t, permissionsUser } = this.props;
    const { InputValue, Invoices, countInvoice, countInvoiceReturn, AmountSale, totalStock, AmountStock, InvoiceReturn, dateTime, countStockQuantityLow } = this.state;
    let type_permission = Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY;
    
    return (
      <div style={{marginTop: "-10px"}}>
        <Card className="dashboard-card-first">
          <GridContainer alignItems="center">
            <GridItem>
              <span className="TitleInfoForm">{t("Thời gian")}</span>
            </GridItem>
            <GridItem>
              <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                  let dateTime = {start: start, end: end};
                  this.setState({dateTime},() => this.getData(start,end))
                }}
              />
            </GridItem>
          </GridContainer>
        </Card>
        <GridContainer style={{ padding: '0px 5px' }}>
          <GridItem xs={12} sm={12} md={6}>
            <Card className="dashboard-card">
              <GridItem style={{ textAlign: 'center',height: "200px", paddingRight: "0px !important" }}>
                <h4 className="role-item-product" style={{ margin: "0px 0px"}}>{t("Bán hàng")}</h4>
                <GridContainer>
                  <GridItem xs={4}>
                    <img alt="Dashboard" className="ImgDashBoard" src={DonHangIcon}></img><br />
                    <b className="role-label">{t("Đơn hàng")}</b>
                  </GridItem>
                  <GridItem xs={4}>
                    <img alt="Dashboard" className="ImgDashBoard" src={TraHangIcon}></img><br />
                    <b className="role-label">{t("Trả hàng")}</b>
                  </GridItem>
                  <GridItem xs={4}>
                    <img alt="Dashboard" className="ImgDashBoard" src={DoanhThuIcon}></img><br />
                    <b className="role-label">{t("Doanh thu")}</b>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={4}>
                    <b className="dashboard-label label-fontSize17 label-blue">{countInvoice}</b>
                  </GridItem>
                  <GridItem xs={4}>
                    <b className="dashboard-label label-fontSize17 label-red">{countInvoiceReturn}</b>
                  </GridItem>
                  <GridItem xs={4}>
                    <b className="dashboard-label label-fontSize17 label-green">{ExtendFunction.FormatNumber(Number(AmountSale).toFixed(0))}</b>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card className="dashboard-card">
              <GridItem style={{ textAlign: 'center' }}>
                <h4 className="role-item-product" style={{ margin: "0px 0px"}}>{t("Tồn kho")}</h4>
                <GridContainer>
                  <GridItem xs={4}>
                    <img alt="Dashboard" className="ImgDashBoard" src={TonKhoIcon}></img><br />
                    <b className="role-label">{t("Tồn kho")}</b>
                  </GridItem>
                  <GridItem xs={4}>
                    <img alt="Dashboard" className="ImgDashBoard" src={QuanLyGiaIcon}></img><br />
                    <b className="role-label">{t("Giá trị")}</b>
                  </GridItem>
                  <GridItem xs={4}>
                    <img alt="Dashboard" className="ImgDashBoard" src={DonViTinhIcon}></img><br />
                    <b className="role-label">{t("SP dưới định mức")}</b>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={4}>
                    <b className="dashboard-label label-fontSize17 label-blue">{ExtendFunction.FormatNumber(Number(totalStock).toFixed(0))}</b>
                  </GridItem>
                  <GridItem xs={4}>
                    <b className="dashboard-label label-fontSize17 label-green">{ExtendFunction.FormatNumber(Number(AmountStock).toFixed(0))}</b>
                  </GridItem>
                  <GridItem xs={4}>
                    {permissionsUser.product >= type_permission ? 
                    <Link className="dashboard-label label-fontSize17 label-red" to={{ pathname:"/admin/product", state: {quota: Constants.LOW_STOCK_STATUS.LOW} }}>{ExtendFunction.FormatNumber(Number(countStockQuantityLow).toFixed(0))}</Link>
                   : 
                   <b className="dashboard-label label-fontSize17 label-red">{ExtendFunction.FormatNumber(Number(countStockQuantityLow).toFixed(0))}</b>
                   }
                    </GridItem>
                </GridContainer>
              </GridItem>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={7} lg={7}>
            <Card className="dashboard-card-chart">
              <ChartDashboard dataSource={Invoices} dateTime={dateTime} InvoiceReturn={InvoiceReturn} language={t("Thời gian")}/>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={5} lg={5}>
            <Card className="dashboard-card-chart best-selling-dash">
              <GridItem >
                <h4 className="role-item-product" style={{ textAlign: "center" }}>{t("Sản phẩm bán chạy")}</h4><br />
                <form style={{ 
                  height:  "calc(85vh - 320px)",
                  overflowY: this.state.TopProducts > 3 ? "scroll" : "", 
                  overflowX: "hidden", 
                  marginTop: "-20px" 
                  }}>
                  {
                    this.state.TopProducts.length > 0 ?
                      this.showProductList() :
                      <div>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t(Constants.NO_PRODUCT)} />
                      </div>
                  }
                </form>
              </GridItem>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(state => {
  return {
    permissionsUser: state.userReducer.currentUser.permissions
  };
})  (withTranslation("translations")(withStyles(dashboardStyle)(Dashboard)));
