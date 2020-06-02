import React from "react";
import Card from "components/Card/Card.jsx";
import { connect } from "react-redux";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { trans } from "lib/ExtendFunction";
import { withTranslation } from "react-i18next";
import Constants from 'variables/Constants/';
import { Redirect } from 'react-router-dom';
import "date-fns";
import CustomerForm from './CustomerForm';
import InvoiceInfoForm from './InvoiceInfoForm';
import ProductForm from './ProductForm';
import PaymentForm from './PaymentForm';
import ReturnHistory from './ReturnHistory';
import PaymentHistory from './PaymentHistory';
import NotificationError from "components/Notification/NotificationError.jsx";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import invoiceService from 'services/InvoiceService';
import invoicePDF from '../Export/InvoicePDF';
import OhButton from "components/Oh/OhButton.jsx";
import { MdCached , MdCancel} from "react-icons/md";
import { AiFillPrinter ,AiOutlineSave, } from "react-icons/ai";
import ExtendFunction from "lib/ExtendFunction";
import moment from "moment";
import Configuration from "services/StoreConfig";
import _ from 'lodash';
import { printHtml } from "react-print-tool";
import AlertQuestion from "components/Alert/AlertQuestion";
import { notifyError } from 'components/Oh/OhUtils';

class CreateInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataInvoice: { invoiceAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING), },
      dataInvoiceReturn: [],
      brsuccess: null,
      brerror: null,
      products: [],
      printTemplate:"",
      dataEdit: {},
      isEdit: this.props.match && this.props.match.params && this.props.match.params.invoiceId ? true : false,
      alert: null,
      isSubmit: false,
      isChange: false
    };
    this.length = 0;
    this.setChange = _.debounce(this.setChange, Constants.UPDATE_TIME_OUT);
    this.dataInvoice = {};
  }

  handleSave = () => {
    const { dataInvoice, isEdit, dataEdit } = this.state;
    const { t } = this.props;

    let customerFormValid = this.customerFormRef.ohFormRef.allValid()
    if(isEdit && dataInvoice.finalAmount !== dataEdit.finalAmount && dataInvoice.paidAmount > dataInvoice.finalAmount){
      this.setState({
        alert: (
          <AlertQuestion
            hideAlert={() => this.hideAlert()}
            messege={t("Số tiền đã thanh toán lớn hơn số tiền phải thanh toán của đơn hàng. Bạn hãy điều chỉnh phiếu thu trước khi sửa đơn hàng")}
            buttonOk={null}
          />
        )
      });
    }
    else if(!isEdit && !customerFormValid){
      notifyError(t("Vui lòng chọn tên khách hàng"))        
      return;
    }
    else if (!dataInvoice.products || dataInvoice.products.length === 0){
      notifyError(t("Vui lòng chọn ít nhất một sản phẩm"))
      return;
    } else if (!dataInvoice.deliveryType){
      notifyError(t("Vui lòng chọn hình thức giao hàng"))
      return;
    } else{
      if((!isEdit && this.paymentFormRef.ohFormRef.allValid() )|| isEdit)
      this.setState({ isSubmit: true }, () => this.createInvoice());
    }
  }

  hideAlert = () => {
    this.setState(
      {
        alert: null
      },
      () => { }
    );
  };

  componentDidMount = () => {
    if (this.props.match && this.props.match.params && this.props.match.params.invoiceId) {
      this.getDataEdit(this.props.match.params.invoiceId);
    }
  }

  getDataPrint = async () => {
    let dataInvoice = this.state.dataEdit;
    let data = {
      customer_name: dataInvoice.customerId.name || "" ,
      customer_phone_number: dataInvoice.customerId.tel || "",
      customer_email: dataInvoice.customerId.email || "",
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
      created_on: moment(dataInvoice.invoiceAt).format(Constants.DISPLAY_DATE_FORMAT_STRING),
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
          line_price: ExtendFunction.FormatNumber(item.unitPrice) ,
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

  getDataEdit = async (invoiceId) => {
    let getInvoice = await invoiceService.getInvoice(invoiceId);
    if ( getInvoice.data ){
      getInvoice.data.customerId = getInvoice.data.customerId || {};
      this.setState({
        isEdit: true,
        dataInvoice: {
          ...getInvoice.data,
          products: getInvoice.invoiceProductArray,
          incomeCards: getInvoice.incomeCards
        },
        dataEdit: {
          ...getInvoice.data,
          products: getInvoice.invoiceProductArray,
          incomeCards: getInvoice.incomeCards
        },
        dataInvoiceReturn: getInvoice.invoiceReturns
      })
    }
    else {
      this.error(getInvoice.error);
      this.setState({
        redirect: <Redirect to={"/admin/invoice"} />,
      })
    }
  }

  createInvoice = async () => {
    let { dataInvoice } = this.state;
    if (dataInvoice.createdBy && dataInvoice.createdBy.id)
      dataInvoice.createdBy = dataInvoice.createdBy.id;
    if (dataInvoice.customerId) {
      if (dataInvoice.customerId.id)
        dataInvoice.customerId = dataInvoice.customerId.id;
    }
    else {
      delete dataInvoice.customerId;
    }
    if(this.isPayLater)
      dataInvoice.paidAmount = 0;
    else
      dataInvoice.paidAmount = dataInvoice.paidAmount ? dataInvoice.paidAmount : 0;
    dataInvoice.finalAmount = Math.round(dataInvoice.finalAmount || 0);
    this.saveInvoice(dataInvoice);
  }

  saveInvoice = async (dataInvoice) => {
    
    let { isEdit } = this.state;
    let { t } = this.props;

    let saveInvoice = await invoiceService.saveInvoice(dataInvoice);
    
    if (saveInvoice.status) {
      this.setState({
        idInvoice : this.props.match && this.props.match.params.invoiceId ? this.props.match.params.invoiceId : saveInvoice.data.newInvoice.id,
        isSubmit: false,
        isChange: false
      })
      if(isEdit)
        this.success(t("Cập nhật {{cardType}} thành công", {cardType: t('Đơn hàng')}))
      else
        this.success(t("Tạo đơn hàng thành công"))
      this.setState({redirect: <Redirect to={{
          pathname: Constants.ADMIN_LINK + "/invoice"
        }}/>
      });
    }
    else {
      this.error(saveInvoice.message);
      this.setState({
        isSubmit: false
      })
    }
  }

  handelCancel = () => {
    const {dataEdit} = this.state;
    const {t} = this.props;
    this.setState({
      alert: (
        <AlertQuestion
          hideAlert={() => this.hideAlert()}
          messege={t("Bạn muốn hủy đơn hàng {{cardCode}}?", {cardCode: dataEdit.code})}
          action={async () => {
            this.hideAlert()
            let cancelInvoice = await invoiceService.cancelInvoice(dataEdit.id);
            if (cancelInvoice.status) {
              this.success(t("Hủy đơn hàng thành công"))
              this.setState({redirect: <Redirect to="/admin/invoice" />});
            }
            else {              
              this.error(cancelInvoice.message);
            }
          }}
          buttonOk={t("Đồng ý")}
        />
      )
    });
  }

  success = (mess) => {
    const { t } = this.props;
    this.setState({
      brsuccess: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={t(mess)} />
    })
  }

  error = (mess) => {
    const { t } = this.props;
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={t(mess)} />
    })
  }
  
  onChange = (obj) => {
    this.dataInvoice = {
      ...this.dataInvoice,
      ...obj
    }
    this.setChange();
  }
  
  setChange = () => {
    this.setState({
      dataInvoice: {
        ...this.state.dataInvoice,
        ...this.dataInvoice
      }
    }, () => this.dataInvoice = this.state.dataInvoice)
  }

  exportPDF = () => {
    const { dataInvoice } = this.state;
    invoicePDF.invoicePDF(dataInvoice);
  }

  render() {
    const { t } = this.props;
    const { dataInvoice, dataEdit, dataInvoiceReturn, isEdit, isSubmit } = this.state;
  
    let isCanceledCard = dataEdit.status === Constants.INVOICE_STATUS.id.CANCELLED ? true : false;

    let isReturn = dataInvoiceReturn.length > 0 ? true : false;
    return (
      <>
        {this.state.brsuccess}
        {this.state.brerror}
        {this.state.redirect}
        {this.state.alert}
        
        <GridContainer>
          <CustomerForm
            onRef={(ref) => {
              this.customerFormRef = ref
            }}
            getCustomerInfo={(customer) => {
              this.onChange({
                customerId: customer.customerId,
                deliveryAddress: customer.deliveryAddress,
                deliveryType: customer.deliveryType
              })
            }}
            dataEdit={dataEdit ? dataEdit : undefined}
            isEdit={isEdit}
            isCanceledCard = {isCanceledCard}
          />

          <InvoiceInfoForm
            sendInvoiceInfo={(invoiveInfo) => {
              this.onChange({
                code: invoiveInfo.code,
                notes: invoiveInfo.notes,
                invoiceAt: invoiveInfo.invoiceAt
              })
            }}
            dataEdit={dataEdit ? dataEdit : undefined}
            isEdit={isEdit}
            isCanceledCard = {isCanceledCard}
            isReturn={isReturn}
          />
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <Card >
              <CardBody >

                <ProductForm
                  isReturn = {isReturn}
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
                  isCanceledCard = {isCanceledCard}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        {isEdit ? null : (
          <GridContainer>
            <GridItem xs={12}>
              <Card >
                <CardBody style={{ padding: 0 }}>
                  <GridItem xs={12}>
                    <PaymentForm
                      dataInvoice={dataInvoice}
                      onChange={(formData, isPayLater) => {
                        this.isPayLater = isPayLater;
                        this.onChange({
                          payType: formData.payType,
                          debtAmount: this.state.isEdit ? dataInvoice.debtAmount : (dataInvoice.totalAmount - Math.round(formData.payAmount*100)/100),
                          paidAmount: this.state.isEdit ? dataInvoice.paidAmount : Math.round(formData.payAmount*100)/100,
                          depositAmount: formData.depositAmount ? formData.depositAmount : 0,
                          incomeExpenseAt: formData.incomeExpenseAt ? formData.incomeExpenseAt : new Date().getTime(),
                          noteIncomeExpense: formData.noteIncomeExpense || ""
                        })
                      }}
                      onRef={ref => (this.paymentFormRef = ref)}
                      {...this.props}
                    />
                  </GridItem>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        )}
              
        <GridContainer>
          <GridItem xs={12} style={{textAlign: 'right'}}>
            {isCanceledCard || isReturn ? null :
              <OhButton
                type="add"
                disabled={isSubmit}
                icon={<AiOutlineSave />}
                onClick={() => this.handleSave()}
                permission={{
                  name: Constants.PERMISSION_NAME.INVOICE,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}>
                {t("Lưu")}
              </OhButton>
            }
            {isReturn || isCanceledCard ? null : dataEdit.id ?
              <OhButton
                type="add"
                icon={<MdCached/>}
                linkTo={"/admin/add-invoice-return/" + dataEdit.id}
                permission={{
                  name: Constants.PERMISSION_NAME.INVOICE,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}>
                {t("Trả hàng")}
              </OhButton>
              : null
            }
            { this.props.match && this.props.match.params && this.props.match.params.invoiceId === undefined ? null :
                <OhButton
                  type= "add"
                  icon= {<AiFillPrinter />}
                  onClick={() => this.getDataPrint()}
                >
                  {t("In phiếu")}
                </OhButton>
            }
            {isCanceledCard || !isEdit || isReturn ? null :
              <OhButton
                type="delete"
                icon={<MdCancel/>}
                onClick={() => {
                  this.handelCancel();
                }}
                permission={{
                  name: Constants.PERMISSION_NAME.INVOICE,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}>
                {t("Hủy")}
              </OhButton>
            }
              <OhButton
                type="exit"
                icon={<MdCancel/>}
                linkTo={"/admin/invoice"}
               >
                {t("Thoát")}
              </OhButton>
          </GridItem>
        </GridContainer>
        
        {!isEdit ? null : (
          <>
            <PaymentHistory
              isChange = {this.state.isChange}
              dataInvoice={dataInvoice}
              dataEdit={dataEdit}
              isCanceledCard = {isCanceledCard}
              checkUpdateForm = {(isUpdate) => {
                if(isUpdate){
                  this.getDataEdit(dataInvoice.id)
                }
              }}
            />
            <GridContainer>
              <ReturnHistory
                dataReturn={dataInvoiceReturn}
                cardType={Constants.PRINT_TEMPLATE_NAME.INVOICE_RETURN}
              />
            </GridContainer>
          </>
        )}
      </>
    );
  }
}

export default connect(function(state) {
  return ({
    stockList: state.stockListReducer.stockList
  });
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(CreateInvoice)
  )
);
