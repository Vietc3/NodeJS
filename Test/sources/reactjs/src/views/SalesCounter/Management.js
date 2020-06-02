import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withTranslation, } from 'react-i18next';
import withStyles from "@material-ui/core/styles/withStyles"
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import InforCustomer from "./Components/InforCustomer.jsx";
import TableSales from "./Components/TableSales.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import OhButton from 'components/Oh/OhButton';
import salesCounterService from 'services/SalesCounterService';
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import invoiceService from 'services/InvoiceService';
import _ from "lodash";
import Constants from 'variables/Constants/';
import ListProduct from "./Components/ListProduct.jsx";
import SplitPane, { Pane } from 'react-split-pane';
import ExtendFunction from "lib/ExtendFunction";
import moment from "moment";
import { trans } from "lib/ExtendFunction";
import Configuration from "services/StoreConfig";
import { printHtml } from "react-print-tool";

class Management extends React.Component {
  constructor(props) {
    super(props);
    this.onSumit = _.debounce(this.onSumit, Constants.UPDATE_TIME_OUT, {
      'leading': true,
      'trailing': false
    });
    this.onKeyDown = _.debounce(this.onKeyDown, Constants.UPDATE_TIME_OUT_SALES, {
      'leading': true,
      'trailing': false
    });
    this.state = {
      dataSource: {},
      key: "1",
      keyDeleteInvoice: 2,
      dataSalesCounter: {},
      data: {},
      isSubmit: false,

    };
    this.dataProduct = {};
  }

  onChangDataSales = (obj) => {

    let dataSalesCounter = {
      ...this.state.dataSalesCounter,
      ...obj
    }

    this.setState({
      dataSalesCounter,
    }, () => salesCounterService.setSalesCounterStorage({ ...this.state.dataSalesCounter, currentUser: this.props.currentUser.user.id }))
  }

  onChange = (obj, key) => {
    this.dataProduct = {
      ...this.dataProduct,
      ...obj
    }
    this.setChange(key);
  }

  setChange = (key) => {
    let { dataSalesCounter } = this.state;
    let dataSource = {
      ...this.state.dataSource,
      ...this.dataProduct
    }

    let data = dataSource.data || {};

    let index = dataSalesCounter.panes ? dataSalesCounter.panes.findIndex(item => item.key === key) : -1;

    if (index > -1) {
      data["products"] = dataSalesCounter && dataSalesCounter.panes[index] ? dataSalesCounter.panes[index].content : [];
      if (dataSalesCounter.panes[index].content.length === 0) {
        dataSource.data = {
          ...dataSource.data,
          totalAmount: 0,
          quantityProducts: 0,
          finalAmount: 0,
          paidAmount: 0
        }
      }
    }

    this.setState({
      dataSource: dataSource

    }, () => {
      this.dataProduct = this.state.dataSource;
      salesCounterService.setSalesCounterStorage({ ...this.state.dataSalesCounter})

    })
  }

  onSumit = () => {
    let { dataSource } = this.state;
    let { t } = this.props;
    let data = dataSource ? dataSource.data : {};
    let checkStockQuantity = false;

    if (data.products && data.products.length){
      checkStockQuantity = data.products && data.products.some(item => (item.stockQuantity === "" && item.type === Constants.PRODUCT_TYPES.id.merchandise) || (item.stockQuantity <= 0 && item.type === Constants.PRODUCT_TYPES.id.merchandise));
    }

    if (data && this.customerFormRef && this.customerFormRef.ohFormRef && this.customerFormRef.ohFormRef.allValid()) {
      if (!data.products || data.products.length === 0)
        notifyError(t("Vui lòng chọn ít nhất một sản phẩm"))
      else if (checkStockQuantity)
        notifyError(t("Số lượng tồn trong kho không đủ để thực hiện"))
      else if (data.deliveryType === 2 && !data.deliveryAddress)
        notifyError(t("Vui lòng điền địa chỉ nhận hàng"))
      else if (data.paidAmount > data.finalAmount)
        notifyError(t("Số tiền thanh toán lớn hơn số tiền khách phải trả"))
      else {
        this.setState({ isSubmit: true });
        this.saveSalesCounter(data);
      }
    }
  }

  saveSalesCounter = async (data) => {
    let { t } = this.props;    
    let saveSalesCounter = await invoiceService.saveInvoice(data);

    if (saveSalesCounter.status) {
      notifySuccess(t("Thanh toán hóa đơn thành công"))
      this.getDataPrint(data);
      this.setState({isSubmit: false})
      this.tableSalesRef.deleteSumit(this.state.key, this.state.keyDeleteInvoice)
      this.listProductRef.getData();
    }
    else {
      this.setState({isSubmit: false})
      notifyError(saveSalesCounter.message);
    }
  }
  onKeyDown = (event) =>{
    if (event.code === 'F8') {
      event.preventDefault();
      if (this.buttonRef.ref.props.disabled === false)this.buttonRef.ref.props.onClick();

    }
  }
  
  componentWillMount = () => {
    document.addEventListener("keydown", this.onKeyDown, false);
  }

  getDataPrint = async (dataInvoice) => {
    
    let data = {
      customer_name: dataInvoice.customerName || "" ,
      customer_phone_number: dataInvoice.mobile || "",
      customer_email: dataInvoice.email || "",
      order_code: dataInvoice.code || "",
      billing_address: dataInvoice.deliveryAddress || "",
      shipping_address: dataInvoice.deliveryAddress || "",
      total_quantity: 0,
      products: [],  
      total_amount: ExtendFunction.FormatNumber(dataInvoice.finalAmount),
      total_tax: ExtendFunction.FormatNumber(dataInvoice.taxAmount),
      order_discount_value: ExtendFunction.FormatNumber(dataInvoice.discountAmount),
      delivery_fee: ExtendFunction.FormatNumber(dataInvoice.deliveryAmount),
      payment_customer: ExtendFunction.FormatNumber(dataInvoice.paidAmount),
      money_return: ExtendFunction.FormatNumber(dataInvoice.debtAmount),
      created_on: moment(dataInvoice.createdAt).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      total: ExtendFunction.FormatNumber(dataInvoice.totalAmount),
    }

    let { products } = dataInvoice

    if ( products ) {
      let count = 0
      for ( let item of dataInvoice.products ) {
        let name = trans(item.productName, true)
        data = {
          ...data,
          total_quantity: data.total_quantity += item.quantity,
          products: data.products.concat({
            line_stt: count += 1,
          line_discount_rate: item.discount && item.discount > 0 ? ExtendFunction.FormatNumber(item.discount) : 0 ,
          line_unit: item.unit,
          line_variant_code:item.productCode ,
          line_variant: name,
          line_quantity: item.quantity,
          line_price: ExtendFunction.FormatNumber(item.sellPrice) ,
          line_amount: ExtendFunction.FormatNumber(item.finalAmount)
          }),
        }
      } 
    }
    let printTemplate = await Configuration.printTemplate({data, type: "invoice" })
    if (printTemplate.status) {
      await printHtml(printTemplate.data)
    }
  }

  render() {
    let { t } = this.props;
    let { dataSource, key, keyDelete, isSubmit } = this.state;

    return (
      <Fragment>
        <CardBody className="sales-counter-card">
          <GridContainer >
            <GridItem xs={12} sm={8} >
              <SplitPane split="horizontal" minSize={100}>
                <Card style={{ minHeight: 290 }}>
                  <br />
                  <TableSales
                    onChangProduct={(quantityProducts, totalAmount, key, panes, TabIndex) => {
                      this.setState({
                        key,
                      }, () => this.onChangDataSales({
                        panes,
                        TabIndex
                      }))

                      this.onChange({
                        quantityProducts,
                        totalAmount
                      }, key)
                    }}

                    deleteInvoice={(keyDelete) => {
                      this.setState({
                        keyDelete
                      })
                    }}
                    onRef={ref => this.tableSalesRef = ref}
                  />
                  <div />
                </Card>
                <Card>
                  <ListProduct
                    onClickProduct={(record) => {
                      this.tableSalesRef.onClickProduct(record.id, record)
                    }}
                    onChangDataProduct={(objCheckKeys) => {
                      this.onChangDataSales({
                        objCheckKeys
                      })
                    }}
                    onRef={ref => this.listProductRef = ref}
                  />
                  <div />
                </Card>
              </SplitPane>
            </GridItem>
            <GridItem xs={12} sm={4} style={{ marginBottom: 10 }}>
              <Card>
                <CardBody >
                  <InforCustomer
                    onRef={(ref) => {
                      this.customerFormRef = ref
                    }}
                    sendProductsData={(data, dataSalesCounter) => {
                      this.onChange({
                        data
                      }, this.state.key)
                      this.onChangDataSales({
                        dataSalesCounter
                      })
                    }}
                    totalAmount = {dataSource ? dataSource.totalAmount : 0}
                    dataCustomer={dataSource || {}}
                    keyActive={key}
                    keyDelete={keyDelete || undefined}
                  />
                  <div align="center">

                    <OhButton
                      type="add"
                      id="sales-counter"
                      onClick={() => this.onSumit()}
                      disabled={isSubmit }
                      className="button-payment-sales"
                      permission={{
                        name: Constants.PERMISSION_NAME.SALES_COUNTER,
                        type: Constants.PERMISSION_TYPE.TYPE_ALL
                      }}
                      onRef ={ref => this.buttonRef = ref}
                    >
                      {t("Thanh toán") + " (F8)"}
                    </OhButton>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Fragment>
    );
  }
}


export default (
  connect(function (state) {
    return {
      currentUser: state.userReducer.currentUser,
    };
  })
)(withTranslation("translations")

  (withStyles((theme) => ({
    ...extendedTablesStyle,
    ...buttonsStyle
  }))(Management)));;
