import React, { Component } from 'react';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux"
import Constants from 'variables/Constants/';
import { Redirect } from 'react-router-dom';
import "date-fns";
import { trans } from "lib/ExtendFunction";
import CustomerForm from './CustomerForm';
import OrderInfoForm from './OrderInfoForm';
import ProductForm from './ProductForm';
import OhButton from "components/Oh/OhButton.jsx";
import { MdCancel } from "react-icons/md";
import { AiFillPrinter, AiOutlineSave, } from "react-icons/ai";
import moment from "moment";
import _ from 'lodash';
import ExtendFunction from "lib/ExtendFunction";
import { printHtml } from "react-print-tool";
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import Configuration from "services/StoreConfig";
import OrderService from 'services/OrderCardService';
import AlertQuestion from "components/Alert/AlertQuestion";

class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataOrder: {
        type: this.props.match.params.type
      },
      products: [],
      printTemplate: "",
      dataEdit: {},
      isEdit: false,
      alert: null,
      isSubmit: false,
      isChange: false,
      redirect: null
    };
    this.length = 0;
    this.setChange = _.debounce(this.setChange, Constants.UPDATE_TIME_OUT);
    this.dataOrder = {};
  }

  componentDidMount = () => {
    if (this.props.match && this.props.match.params && this.props.match.params.cardID) {
      this.getDataEdit(this.props.match.params.cardID);
    }
  }

  async getDataEdit(id) {
    let isTypeImport = this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? true : false;

    let getOrder = await OrderService.getOrder(id);

    if ( getOrder.data ){
      getOrder.data.customerId = getOrder.data.customerId || {};
      this.setState({
        isEdit: true,
        dataOrder: {
          ...getOrder.data,
          products: getOrder.orderCardProductArray
        },
        dataEdit: {
          ...getOrder.data,
          products: getOrder.orderCardProductArray
        },
      })
    }
    else {
      notifyError(getOrder.message);
      if (getOrder.isBranchId) 
      this.setState({
        redirect: <Redirect to={isTypeImport ? "/admin/import-order-card/1" : "/admin/export-order-card/2"} />
      })
    }
  }

  
  getDataPrint = async() => {
    let { dataOrder } = this.state;
    let isTypeImport = this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? true : false;
    let data = {
      order_code: dataOrder.code,
      created_on:  moment(dataOrder.orderAt).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      customer_name: !isTypeImport ? dataOrder.customerName : undefined,
      supplier_name: dataOrder.customerName,
      supplier_address:  dataOrder.deliveryAddress,
      billing_address: !isTypeImport ? (dataOrder.deliveryAddress ? dataOrder.deliveryAddress : `&emsp;`) : undefined,
      shipping_address:!isTypeImport ? (dataOrder.deliveryAddress ? dataOrder.deliveryAddress : `&emsp;`) : undefined,
      customer_phone_number: !isTypeImport ? (dataOrder.mobile ? dataOrder.mobile : `&emsp;` ): undefined,
      customer_email: !isTypeImport ? (dataOrder.email ? dataOrder.email : `&emsp;`) : undefined,
      total: ExtendFunction.FormatNumber(Number(dataOrder.totalAmount).toFixed(0)) || "" ,
      total_tax: ExtendFunction.FormatNumber(Number(dataOrder.taxAmount).toFixed(0)) || "",
      order_discount_value: ExtendFunction.FormatNumber(Number(dataOrder.discountAmount).toFixed(0)) || "",
      delivery_fee: ExtendFunction.FormatNumber(Number(dataOrder.deliveryAmount).toFixed(0)) || "",
      total_amount: ExtendFunction.FormatNumber(Number(dataOrder.finalAmount).toFixed(0)) || "",
      total_price: ExtendFunction.FormatNumber(Number(dataOrder.finalAmount).toFixed(0)) || "",
      products: [],
      total_quantity: 0
    }
    let { products } = dataOrder

    if ( products) {
      let count = 0
    for (let item of dataOrder.products) {
      let name = trans(item.productName, true)
      data = {
        ...data,
        total_quantity: data.total_quantity + item.quantity,
          products: data.products.concat({
          line_stt: count += 1,
          line_variant_code: item.productCode,
          line_unit: item.unit || "",
          line_discount_rate: ExtendFunction.FormatNumber(Number(item.discount).toFixed(0)) || "",
          line_tax_rate:  ExtendFunction.FormatNumber(Number(item.discount).toFixed(0)) || "",
          line_amount: ExtendFunction.FormatNumber(Number(item.finalAmount).toFixed(0)) || "",
          line_variant: !isTypeImport ? name : undefined,
          line_variant_name: name,
          line_quantity: item.quantity,
          line_price: ExtendFunction.FormatNumber(Number(item.unitPrice).toFixed(0)) || "",
        }),
      }
    } 
  }

  data = _.pickBy(data, value => value !== undefined)

  let printTemplate = await Configuration.printTemplate({ data, type: isTypeImport ? "import_order" : "invoice_order" })
  if (printTemplate.status) {
    await printHtml(printTemplate.data)
  }
  }


  onChange = (obj) => {
    this.dataOrder = {
      ...this.dataOrder,
      ...obj
    }
    this.setChange();
  }

  setChange = () => {
    this.setState({
      dataOrder: {
        ...this.state.dataOrder,
        ...this.dataOrder
      }
    }, () => this.dataOrder = this.state.dataOrder)
  }

  handleSave = () => {
    const { dataOrder, isEdit } = this.state;

    if(!isEdit && !this.customerFormRef.ohFormRef.allValid())
      notifyError("Vui lòng chọn một khách hàng")        
    else if (!dataOrder.products || dataOrder.products.length === 0)
      notifyError("Vui lòng chọn ít nhất một sản phẩm")
    else if (!dataOrder.deliveryType)
      notifyError("Vui lòng chọn hình thức giao hàng")
    else{
      this.setState({ isSubmit: true }, () => this.createOrder());
    }
  }

  createOrder = async () => {
    let { dataOrder } = this.state;
    
    if ( dataOrder.orderAt) {
      if (typeof dataOrder.orderAt === "string" ) dataOrder.orderAt = parseInt(dataOrder.orderAt)
      else dataOrder.orderAt = moment(dataOrder.orderAt).format(Constants.DATABASE_DATE_TIME_FORMAT_STRING);
    }

    if ( dataOrder.expectedAt ) {
      if (typeof dataOrder.expectedAt === "string" ) dataOrder.expectedAt = parseInt(dataOrder.expectedAt)
      else dataOrder.expectedAt = moment(dataOrder.expectedAt).format(Constants.DATABASE_DATE_TIME_FORMAT_STRING);
    }

    if (dataOrder.createdBy && dataOrder.createdBy.id)
      dataOrder.createdBy = dataOrder.createdBy.id;
    if (dataOrder.customerId) {
      if (dataOrder.customerId.id)
        dataOrder.customerId = dataOrder.customerId.id;
    }
    else {
      delete dataOrder.customerId;
    }
    dataOrder.paidAmount = dataOrder.paidAmount ? dataOrder.paidAmount : 0;
    dataOrder.paidAmount = dataOrder.paidAmount ? dataOrder.paidAmount : 0;

    this.saveOrder();
  }

  saveOrder = async () => {
    let { t } = this.props;
    let { dataOrder, isEdit } = this.state;

    let saveOrder = await OrderService.saveOrder(dataOrder);
    
    if (saveOrder.status) {
      this.setState({
        isSubmit: false,
        isChange: false,
        redirect: <Redirect to={{
          pathname: this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? 
            Constants.ADMIN_LINK + "/import-order-card/1" : Constants.ADMIN_LINK + "/export-order-card/2"
        }}/>
      })
      if(isEdit)
        notifySuccess(t("Cập nhật đơn đặt hàng thành công"))
      else
        notifySuccess(t(t("Tạo đơn đặt hàng thành công")))
    }
    else {
      notifyError(saveOrder.message);
      this.setState({
        isSubmit: false
      })
    }
  }

  hideAlert = () => {
    this.setState({ alert: null });
  };

  handelCancel = () => {
    let { t } = this.props;
    const {dataEdit} = this.state;

    this.setState({
      alert: (
        <AlertQuestion
          hideAlert={() => this.hideAlert()}
          messege={t("Bạn muốn hủy đặt đơn hàng {{name}} ?", {name: dataEdit.code})}
          action={async () => {
            this.hideAlert()
            let cancelOrderCard = await OrderService.cancelOrder(dataEdit.id);
            if (cancelOrderCard.status) {
              notifySuccess(t("Hủy đơn đặt hàng thành công"))
              this.setState({
                redirect: 
                  <Redirect 
                    to= {this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? "/admin/import-order-card/1" : "/admin/export-order-card/2"} />
              });
            }
            else {              
              notifyError(cancelOrderCard.message);
            }
          }}
          buttonOk={"Đồng ý"}
        />
      )
    });
  }

  render() {
    const { t } = this.props;
    const { dataEdit, isEdit, isSubmit } = this.state;

    let isCanceledCard = dataEdit.status === Constants.ORDER_CARD_STATUS.CANCELLED ? true : false;
    let isTypeImport = this.props.match.params && parseInt(this.props.match.params.type) === Constants.ORDER_CARD_TYPE.IMPORT ? true : false;

    return (
      <>
        <GridContainer>
          {this.state.redirect}
          {this.state.alert}
          <CustomerForm
            onRef={(ref) => {
              this.customerFormRef = ref
            }}
            getCustomerInfo={(customer) => {
              this.onChange({
                customerId: customer.customerId,
                deliveryAddress: customer.deliveryAddress,
                deliveryType: customer.deliveryType,
                customerName: customer.customerName,
                mobile: customer.mobile,
                email: customer.email
              })
            }}
            dataEdit={dataEdit ? dataEdit : undefined}
            isEdit={isEdit}
            isCanceledCard={isCanceledCard}
            type={parseInt(this.props.match.params.type)}
          />

          <OrderInfoForm
            sendOrderInfo={(orderInfo) => {
              this.onChange({
                code: orderInfo.code,
                notes: orderInfo.notes,
                orderAt: orderInfo.orderAt,
                expectedAt: orderInfo.expectedAt,
                status: orderInfo.status
              })
            }}
            dataEdit={dataEdit ? dataEdit : undefined}
            isEdit={isEdit}
            isCanceledCard={isCanceledCard}
          />
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <Card >
              <CardBody>
                <ProductForm
                  sendProductsData={(ProductsForm, discountAmount, finalAmount, totalAmount, taxAmount, deliveryAmount, paidAmount, debtAmount, isChange) => {
                    this.onChange({
                      products: ProductsForm,
                      discountAmount: discountAmount,
                      finalAmount: finalAmount,
                      totalAmount: totalAmount,
                      taxAmount: taxAmount,
                      deliveryAmount: deliveryAmount,
                      paidAmount: isEdit ? dataEdit.paidAmount : paidAmount,
                      debtAmount: isEdit ? finalAmount - dataEdit.paidAmount : debtAmount,
                    })
                    this.setState({
                      isChange: isChange
                    })
                  }}
                  dataEdit={dataEdit ? dataEdit : undefined}
                  isEdit={isEdit}
                  isCanceledCard={isCanceledCard}
                  isTypeImport={isTypeImport}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} style={{ textAlign: 'right' }}>
            {isCanceledCard ? null :
              <OhButton
                type="add"
                disabled={isSubmit}
                icon={<AiOutlineSave />}
                onClick={() => this.handleSave()}
                permission={{
                  name: isTypeImport ? Constants.PERMISSION_NAME.IMPORT_ORDER_CARD : Constants.PERMISSION_NAME.INVOICE_ORDER_CARD,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}
              >
                {t("Lưu")}
              </OhButton>
            }
            {this.props.match && this.props.match.params && this.props.match.params.cardID === undefined ? null :
              <OhButton
                type="add"
                icon={<AiFillPrinter />}
                onClick={() => this.getDataPrint()}
              >
                {t("In phiếu")}
              </OhButton>
            }
            {isCanceledCard || !isEdit ? null :
              <OhButton
                type="delete"
                icon={<MdCancel />}
                onClick={() => {
                  this.handelCancel();
                }}
                permission={{
                  name: isTypeImport ? Constants.PERMISSION_NAME.IMPORT_ORDER_CARD : Constants.PERMISSION_NAME.INVOICE_ORDER_CARD,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}
              >
                {t("Hủy")}
              </OhButton>
            }
            <OhButton
              type="exit"
              icon={<MdCancel />}
              linkTo={isTypeImport ? "/admin/import-order-card/1" : "/admin/export-order-card/2"}
            >
              {t("Thoát")}
            </OhButton>
          </GridItem>
        </GridContainer>
      </>
    );
  }
}

export default 
connect(state => {
  return {
    languageCurrent: state.languageReducer.language
  };
})(withTranslation("translations")(CreateOrder));