import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import { connect } from "react-redux";
import { MdCancel, } from "react-icons/md";
import moment from "moment";
import { withTranslation } from "react-i18next";
import ProductForm from "views/StockTake/Components/ProductForm/ProductForm";
import "react-datepicker/dist/react-datepicker.css";
import "date-fns";
import ExtendFunction from "lib/ExtendFunction";
import Constants from "variables/Constants/";
import { Col, Row } from "react-bootstrap";
import { notifyError } from "components/Oh/OhUtils";
import "bootstrap/dist/css/bootstrap.min.css";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import { AiFillPrinter } from "react-icons/ai";
import stockCheckService from "services/StockCheckService";
import _ from "lodash";
import StoreConfig from 'services/StoreConfig';
import { printHtml } from "react-print-tool"
import OhForm from "components/Oh/OhForm";
import { MdSave} from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';

class FormIssue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        checkedAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        status: Constants.STOCKCHECK_STATUS.Temp
      },
      sumQty: 0,
      alert: null,
      redirect: null,
      editEnable: true,
      br: null,
      brerror: null,
      detailInfo: [],
      isSubmit: false,
      stockOptions: [],
    };
  }

  componentDidMount = () => {
    this.getStockList();
    this.getData();
  };


  getDataPrintTemplate = async () => {
    let { formData, sumQty } = this.state
    const { languageCurrent } = this.props
    let dataPrint = {
      created_on: moment(Number(formData.createdAt)).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      adjusted_on: moment(Number(formData.checkedAt)).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      code: formData.code,
      reason: formData.reason,
      total_quantity: ExtendFunction.FormatNumber(sumQty),
      note: formData.notes,
      stockCheckCardProducts: []
    };

    let { stockCheckCardProducts} = formData
    if ( stockCheckCardProducts ) {
      let count = 0;

      for ( let item of stockCheckCardProducts ) {
        dataPrint = {
          ...dataPrint,
          stockCheckCardProducts: dataPrint.stockCheckCardProducts.concat({
            line_stt: count+=1,
            line_variant_code: item.productCode,
            line_variant_name: item.productName ? ExtendFunction.languageName(item.productName)[languageCurrent] : "",
            line_after_quantity: ExtendFunction.FormatNumber(item.realQuantity), 
            line_change_quantity: ExtendFunction.FormatNumber(item.differenceQuantity),
            line_reason: item.reason && !isNaN(item.reason)? Constants.STOCKCHECK_REASONS[parseInt(item.reason)-1].name : item.reason ? item.reason :  ''
          }),
        }
      }
    }

    try {
      let printTemplate = await StoreConfig.printTemplate({ data: dataPrint, type: "stock_take" });
      if ( printTemplate.status ) 
       await printHtml(printTemplate.data)
      else throw printTemplate.error
    }
    catch(error) {
      if ( typeof error === "string" ) notifyError(error)
    }

  }

  getData = async () => {
    if (this.props.match.params.cardID !== undefined) {
      // Actions.loading.on();
      let getStockCheckCard = await stockCheckService.getStockCheckCard(this.props.match.params.cardID);
      if (getStockCheckCard.status) {
        let formData = getStockCheckCard.data;
        let productDataList = {};
        let detailInfo = {
          increaseQty: 0,
          increaseAmount: 0,
          decreaseQty: 0,
          decreaseAmount: 0,
          realQuantity: 0,
          realAmount: 0
        };
        formData.stockCheckCardProducts.map(item => {
          productDataList[item.productId] = item;
          if (formData.status === Constants.STOCKCHECK_STATUS.Temp) {            
            productDataList[item.productId].stockQuantity = productDataList[item.productId].product.stockQuantity;            
          } else {
            if (item.differenceQuantity > 0) {
              detailInfo.increaseQty += item.differenceQuantity;
              detailInfo.increaseAmount += item.differenceAmount;
            } else {
              detailInfo.decreaseQty += item.differenceQuantity;
              detailInfo.decreaseAmount += item.differenceAmount;
            }
            detailInfo.realQuantity += item.realQuantity;
            detailInfo.realAmount += item.realAmount;
          }

          return null;
        });

        let detailList = [
          { text: "Tổng thực tế", value: detailInfo.realQuantity},
          { text: "Tổng lệch tăng", value: detailInfo.increaseQty },
          { text: "Tổng lệch giảm", value: detailInfo.decreaseQty },
          {
            text: "Tổng chênh lệch",
            value: detailInfo.increaseQty + detailInfo.decreaseQty
          }
        ];

        this.setState({
          formData: formData,
          sumQty: detailInfo.realQuantity,
          productDataList: productDataList,
          editEnable: formData.status !== Constants.STOCKCHECK_STATUS.Finish,
          detailList: detailList
        });
      }
    }
  };

  actionButtons = () => {
    const { t } = this.props;
    let {isSubmit} = this.state;

    return  (
      <>
      <div style={{marginRight:5}}>
        <OhToolbar
          right={[
            {
              type: "button",
              label: t("Lưu"),
              onClick: () =>  this.handleSubmit(Constants.STOCKCHECK_STATUS.Finish),
              icon: <MdSave />,
              disabled: isSubmit,
              simple: true,
              typeButton:"add",
              permission: {
                name: Constants.PERMISSION_NAME.STOCK_CHECK,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }
            },
            {
              type: this.props.match.params.cardID  ? "button" : null,
              label: "In phiếu",
              icon: <AiFillPrinter />,
              typeButton: "add",
              onClick: () => this.getDataPrintTemplate()
            },
            {
              type: "button",
              label: "Thoát",
              icon: <MdCancel />,
              typeButton: "exit",
              onClick: () => this.setState({ redirect: <Redirect to="/admin/stocktake" /> })
            },
          ]}
        />
        </div>
      </>
    ) 
  };

  handleSubmit = async status => {
    let { formData } = this.state;
    let { t } = this.props;
    let stockCheckProducts = Object.values(this.productFormRef.state.productDataList).filter(
      item => item.realQuantity !== undefined
    )
    let stockCheckProductsEmpty = Object.values(this.productFormRef.state.productDataList).filter(
      item => item.realQuantity === undefined
    );
    let stockCheckCard = _.extend(formData, { status });
    
    if ( stockCheckProductsEmpty.length || stockCheckProducts.length === 0  ) {
      this.error(t("Thông tin chi tiết phiếu kiểm kho trống"));
    } else if (stockCheckProducts.length) {
      this.setState({isSubmit: true}, async () => {
        try {
          let saveStockCheckCard = await stockCheckService.saveStockCheckCard(stockCheckCard, stockCheckProducts);

          if (saveStockCheckCard.status) {
            this.success(() => {
              this.setState({ 
                isSubmit: false,
                redirect: (
                  <Redirect
                    to={{
                      pathname: "/admin/stocktake"
                    }}
                  />
                )
              });
            });
          } else {
            throw saveStockCheckCard.message;
          }
        }
        catch(error) {
          this.setState({ isSubmit: false })
          if (typeof error === "string") this.error(error);
        }
      })  
    }
  };

  onChange = data => {
    this.setState({
      formData: {
        ...this.state.formData,
        ...data
      }
    });
  };

  success = cb => {
    let { t } =  this.props;
    this.setState({
      br: (
        <NotificationSuccess
          closeNoti={() =>
            this.setState({ brsuccess: null }, () => {
              this.hideAlert();
            })
          }
          message= {this.props.match.params.cardID ? t("Cập nhật phiếu kiểm kho thành công") : t("Tạo phiếu kiểm kho thành công")}
        />
      )
    });
    if (cb) cb();
  };

  error = mess => {
    let {t} = this.props;
    notifyError(t(mess));
  };

  hideAlert = () => {
    this.setState(
      {
        alert: null
      },
      () => { }
    );
  };

  componentDidUpdate = (prevProps, prevState) => {
    
    if(prevProps.stockList !== this.props.stockList && this.props.stockList){
      this.getStockList();
    }
  }

  getStockList = () => {
    let {stockList} = this.props;
    let listStock = ExtendFunction.getSelectStockList(stockList, []);    

    this.setState({
      stockOptions: listStock,
    })
    
    if(this.props.match.params.cardID === undefined && listStock.length > 0){
      this.setState({
        formData: {
          ...this.state.formData,
          stockId: listStock[0].value
        }
      })
    }
  }
  
  render() {
    const { t, currentUser, stockList } = this.props;
    const { formData, alert, editEnable, redirect, detailList, sumQty, stockOptions } = this.state;
        
     formData.userName = formData.createdBy ? formData.createdBy.fullName : currentUser.user.fullName;
     formData.stockName= !editEnable && stockList[formData.stockId] ? stockList[formData.stockId].name : '';

     return (
      <Fragment>
        {alert}
        {redirect}
        {this.state.br}
        {this.state.brerror}
        <OhForm
          defaultFormData={
            _.extend({
              ...formData,
            }, {sumQty})
          }
          onRef={ref => this.ohFormRef = ref}
          columns={[
            [
              {
                name: "code",
                label: "Mã phiếu",
                ohtype: "input",
                placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
               
              },
              editEnable ?
                {
                  name: "stockId",
                  label: "Kho",
                  ohtype: stockOptions.length > 1 ? "select" : null,
                  options: stockOptions,
                }
              :
                {
                  name: "stockName",
                  label: "Kho",
                  ohtype: stockOptions.length > 1 ? "label" : null,
                },
              {
                name: Object.keys(this.props.match.params).length ? "createdAt" : "checkedAt" ,
                label: "Ngày kiểm",
                ohtype: "date-time-picker",
                validation: "required",
                formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
                disabled: !editEnable ? true : false
              },
            ],
            [
              {
              name: "userName",
              label: "Người tạo",
              ohtype: "label",
              },
              {
                name: "notes",
                label: "Ghi chú",
                placeholder: 'Ghi chú',
                ohtype: "textarea",
                maxRows: 5,
                minRows: 2,
              },
            ]
          ]}
          onChange={value => {
            this.onChange(value);
          }}
        />
          <GridContainer className={"Custom-MuiGrid-item"} style={{ paddingBottom: 20 }}>

            <GridItem xs={12} sm={12} md={12} lg={12}>
              <ProductForm
                onRef={ref => (this.productFormRef = ref)}
                actionButtons={this.actionButtons()}
                onChange={sumQty => {
                  this.setState({
                    sumQty: sumQty
                  });
                }} 
                defaultProductList={this.state.productDataList}
                editEnable={editEnable}
                stockId={formData.stockId}
                {...this.props}
              />
            </GridItem> 
          </GridContainer>
        
        <div>
          {!editEnable
            ? detailList.map(item => (
              <Row>
                <Col style={{ textAlign: "right" }}>{t(item.text) + ":"}</Col>
                <Col style={{ maxWidth: 150, textAlign: "right", fontWeight: 700 }}>
                  {ExtendFunction.FormatNumber(Number(item.value).toFixed(0))}
                </Col>
              </Row>
            ))
            : null}
        </div>
        <GridContainer justify="flex-end" >{ this.actionButtons() }</GridContainer>
      </Fragment>
    );
  }
}

export default connect(
  function(state) {
    return ({
      currentUser: state.userReducer.currentUser,
      languageCurrent: state.languageReducer.language,
      stockList: state.stockListReducer.stockList
    });
  }
)(withTranslation("translations")(withStyles(extendedFormsStyle)(FormIssue)));
