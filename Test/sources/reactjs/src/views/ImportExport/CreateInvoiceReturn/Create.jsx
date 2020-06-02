import React from "react";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import invoiceReturnService from "services/InvoiceReturnService";
import Constants from "variables/Constants/";
import InvoiceReturnForm from "./InvoiceReturnForm";
import InvoiceInfoForm from "./InvoiceInfoForm";
import ProductForm from "./ProductForm";
import OhButton from "components/Oh/OhButton.jsx"
import { MdSave, MdCancel, MdDeleteForever } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import ExtendFunction from "lib/ExtendFunction";
import Configuration from "services/StoreConfig";
import { printHtml } from "react-print-tool";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import moment from "moment";
import { trans } from "lib/ExtendFunction";
import AlertQuestion from "components/Alert/AlertQuestion";
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';

class CreateInvoice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataInvoice: {
        status: 1,
        importedAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
      },
      dataInvoiceReturnProduct: {},
      type: "add",
      redirect: null,
      printTemplate: "",
      alert: null,
      isSubmit: false
    };
    this.dataInvoice_copy = {}
  }

  success = mess => {
    notifySuccess(mess)
  };

  error = mess => {
    notifyError(mess)
  };

  componentDidMount = () => {
    if (this.props.match.params && this.props.match.params.cardCode !== undefined) {
      this.getData();
    }
  };
  getData = async (id) => {
    let getinvoiceReturn = await invoiceReturnService.getInvoiceReturn(id || this.props.match.params.cardCode);
    if (getinvoiceReturn.status) {
      this.setData(getinvoiceReturn.data, getinvoiceReturn.invoiceReturnProductArray, getinvoiceReturn.expenseCards);
    }
    else this.error(getinvoiceReturn.message)
    if (getinvoiceReturn.isBranchId) 
      this.setState({
        redirect: <Redirect to={"/admin/list-invoice-return"} />
      })
  };

  getDataPrint = async () => {
    let { dataInvoice } = this.state;
    let data = {
      order_code: dataInvoice.code,
      products: [],
      customer_name: dataInvoice.invoice.customerId ? dataInvoice.invoice.customerId.name : "",
      customer_phone_number: dataInvoice.invoice.customerId ? dataInvoice.invoice.customerId.tel : "", 
      total_quantity: dataInvoice.totalQuantity,
      created_on: moment(dataInvoice.createdAt).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      total_amount: ExtendFunction.FormatNumber(dataInvoice.finalAmount) || "",
    }
    let count = 0

    if (dataInvoice.products) {
      for (let item of dataInvoice.products) {
        let name = trans(item.productName, true)
        count += 1;
        data = {
          ...data,
          products: data.products.concat({
            line_stt: count,
            line_variant_code: item.productCode,
            line_unit: item.unit,
            line_variant: name,
            line_quantity: item.quantity,
            line_discount_price: ExtendFunction.FormatNumber(item.finalAmount) || "",
            line_price: ExtendFunction.FormatNumber(item.unitPrice),
            line_amount: ExtendFunction.FormatNumber(item.finalAmount * item.quantity)
          })
        }
      }
    }

    let printTemplate = await Configuration.printTemplate({ data, type: "invoice_return" })

    if (printTemplate.status) {
      await printHtml(printTemplate.data)
    }

  }

  setData = async (invoiceReturn, InvoiceReturnProduct, expenseCards) => {
    if (invoiceReturn.invoice && invoiceReturn.invoice.invoiceProducts) {
      for (let item of invoiceReturn.invoice.invoiceProducts) {
        for (let elem of InvoiceReturnProduct) {
          if (elem.invoiceProductId === item.id) {
            elem.returnQuantity = item.returnQuantity;
            elem.invoiceQuantity = item.quantity;
            break;
          }
        }
      }
    }

    this.setState({
      dataInvoice: {...this.state.dataInvoice, ...invoiceReturn},
      dataInvoiceReturnProduct: InvoiceReturnProduct,
      type: "edit",
      dataInvoice_copy: JSON.parse(JSON.stringify(invoiceReturn)),
      expenseCards: expenseCards
    });
  };

  submit = () => {
    let { dataInvoice } = this.state;
    let { t } = this.props;
    
    if ( dataInvoice.finalAmount < dataInvoice.paidAmount ) {
      notifyError(t("Số tiền phải chi không được phép nhỏ hơn số tiền đã chi. Bạn nên cập nhật lại phiếu chi trước khi cập nhật phiếu trả hàng"))
    }
    else this.handleSubmit();
  }

  cancelVote = () => {
    const {t} = this.props;
    this.setState({
      alert: <AlertQuestion
              messege={t("Bạn chắc chắn muốn hủy phiếu {{code}}?", {code: this.state.dataInvoice.code })} 
              hideAlert={ this.hideAlert }
              action={() => {
                this.hideAlert()
                this.handleCancelVote();
              }}
              buttonOk={t("Đồng ý")} 
            />
    })
  }

  handleCancelVote = async () => {
    let { dataInvoice } = this.state;
    let { t } = this.props;

    try {
      let cancelInvoiceReturn = await invoiceReturnService.deleteInvoiceReturn(dataInvoice.id);

      if (cancelInvoiceReturn.status) {
        notifySuccess(t("Hủy phiếu {{cardType}} thành công", {cardType: t("Trả hàng").toLowerCase()}));
        this.setState({redirect: <Redirect to="/admin/list-invoice-return" />});

      }
      else throw cancelInvoiceReturn.message
    }
    catch(error) {
      if (typeof error === "string") notifyError(t(error))
    }
  }

  hideAlert = () => {
    this.setState({ alert: null })
  }

  async handleSubmit() {
    let { t } = this.props;
    let { dataInvoice } = this.state;
    if (!dataInvoice.products || dataInvoice.products.length === 0) {
      this.error(t("Vui lòng chọn ít nhất 1 sản phẩm"));
      return;
    }

    this.setState({ isSubmit: true }, () => this.saveInvoiceReturn())
  }

  async saveInvoiceReturn() {
    let { dataInvoice } = this.state;
    let { t } = this.props;
    let invoiceReturn = {
      id: this.props.match.params && this.props.match.params.cardCode ? dataInvoice.id : undefined,
      finalAmount: dataInvoice.finalAmount,
      totalAmount: dataInvoice.totalAmount,
      discountAmount: dataInvoice.discountAmount,
      customerId: dataInvoice.invoice.customerId && dataInvoice.invoice.customerId.id ? dataInvoice.invoice.customerId.id : dataInvoice.invoice.customerId,
      invoiceId: this.props.match.params && this.props.match.params.cardCode ? dataInvoice.invoice.id : dataInvoice.invoiceId,
      products: dataInvoice.products,
      notes: dataInvoice.notes,
      noteIncomeExpense: dataInvoice.noteIncomeExpense || '',
      code: dataInvoice.code,
      payAmount: this.isPayLater ? 0 : dataInvoice.payAmount,
      incomeExpenseAt: dataInvoice.incomeExpenseAt,
      importedAt: dataInvoice.importedAt
    }
    try {
      let savedataInvoiceReturn = await invoiceReturnService.saveInvoiceReturn(invoiceReturn);
      if (savedataInvoiceReturn.status) {

        if (!this.props.match.params.cardCode) {
          this.success(t("Tạo phiếu {{cardType}} thành công", {cardType: t("Trả hàng").toLowerCase()}));
        } else {
          this.success(t("Cập nhật {{cardType}} thành công", {cardType: t("Trả hàng").toLowerCase()}));
        }

        this.setState(
          {
            isSubmit: false,
            redirect: <Redirect to={{ pathname:"/admin/list-invoice-return" }} />
          });

      } else {
        throw savedataInvoiceReturn.message;
      }
    }
    catch(error) {
      this.setState({isSubmit: false})
      if (typeof error === "string") this.error(error);
    }
  }

  render() {
    const { t } = this.props;
    const { dataInvoice, type, dataInvoiceReturnProduct, alert, isSubmit, expenseCards } = this.state;
    let isCanceledCard = dataInvoice.status === Constants.INVOICE_RETURN_CARD_STATUS.CANCELLED ? true : false;
    let isReturn =  type === "edit" ? true : false;
    return (
      <GridContainer>
        {alert}
        {this.state.redirect}
        <GridItem md={6} sm={12} style={{ width: "100%" }}>
          <Card style={{ height: "100%" }}>
            <CardBody>
              <InvoiceInfoForm
                data={type === "edit" ? dataInvoice.invoice : undefined}
                isEdit={type === "edit" ? true : false}
                dataAdd={this.props.match.params.invoiceId ? dataInvoice.invoice : undefined}
                onChangeInvoiceInfo={data =>
                  this.setState({
                    dataInvoice: {
                      ...this.state.dataInvoice,
                      invoiceId: data.id
                    }
                  })
                }
                isCancel={isCanceledCard}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={6} sm={12}>
          <Card style={{ height: "100%" }}>
            <CardBody>
              <InvoiceReturnForm
                data={type === "edit" ? dataInvoice : []}
                isEdit={type === "edit" ? true : false}
                view={this.props.id ? true : false}
                getInvoiceReturnInfo={invoiceReturn => {
                  this.setState({
                    dataInvoice: {
                      ...dataInvoice,
                      ...invoiceReturn
                    }
                  });
                }}
                isCancel={isCanceledCard}
              />
            </CardBody>
          </Card>
        </GridItem>        
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <ProductForm
                data={type === "edit" ? dataInvoiceReturnProduct : []}
                dataInvoiceReturn={type === "edit" ? this.state.dataInvoice_copy : undefined}
                dataInvoice={type === "edit" ? this.state.dataInvoice : undefined}
                type={type}
                isEdit={type === "edit" ? true : false}
                onChangeInfoImport={data => {
                  data.payAmount = data.finalAmount;
                  this.setState({ dataInvoice: { ...this.state.dataInvoice, ...data } }) 
                }}
                invoiceId={this.props.match.params.invoiceId ? this.props.match.params.invoiceId : undefined}
                isCancel={isCanceledCard}
              />
            </CardBody>
          </Card>
        </GridItem>
        {type === "edit" ? null :
          <GridItem xs={12}>
            <Card>
              <CardBody>
                <PaymentForm
                  finalAmount={dataInvoice.finalAmount || 0}
                  customerId={dataInvoice && dataInvoice.invoice && dataInvoice.invoice.customerId ? dataInvoice.invoice.customerId.id : null}
                  noteIncomeExpense = {dataInvoice.noteIncomeExpense ||''} 
                  onChange={(formData, isPayLater) => {
                    this.isPayLater = isPayLater;
                    this.setState({
                      dataInvoice: {
                        ...dataInvoice,
                        payAmount: Number(formData.payAmount),
                        debtAmount: dataInvoice.finalAmount - Number(formData.payAmount),
                        incomeExpenseAt: formData.incomeExpenseAt ? formData.incomeExpenseAt : new Date().getTime(),
                        noteIncomeExpense: formData.noteIncomeExpense ||''
                      }
                    })
                  }}
                  onRef={ref => (this.paymentFormRef = ref)}
                  {...this.props}
                />
              </CardBody>
            </Card>
          </GridItem>
        }
        <GridContainer justify="flex-end" style={{ padding: 20 }}>
          { isCanceledCard ? null :
            <OhButton
              type="add"
              icon={<MdSave />}
              disabled={isSubmit}
              onClick={() => type === "edit" ? this.submit() : this.handleSubmit()}
              permission={{
                name: Constants.PERMISSION_NAME.INVOICE_RETURN,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }}>
              {t("Lưu")}
            </OhButton>
            }
            { !isReturn || isCanceledCard ? null :
            <>
            <OhButton
              type="add"
              icon={<AiFillPrinter />}
              onClick={() => this.getDataPrint()}
              permission={{
                name: Constants.PERMISSION_NAME.INVOICE_RETURN,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }}>
              {t("In phiếu")}
            </OhButton>
            <OhButton
              type="delete"
              icon={<MdDeleteForever />}
              onClick={() => type === "edit" ? this.cancelVote() : null}
              permission={{
                name: Constants.PERMISSION_NAME.INVOICE_RETURN,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }}>
              {t("Hủy")}
            </OhButton>
            </>
            }
            <OhButton
              type="exit"
              icon={<MdCancel />}
              simple={true}
              linkTo={"/admin/list-invoice-return"}>
              {t("Thoát")}
            </OhButton> 
        </GridContainer>
        {type === "edit" ?
          <PaymentHistory
            dataEdit = {this.state.dataInvoice_copy}
            dataImport = {this.state.dataInvoice}
            dataPayment = {{
              paidAmount: dataInvoice.paidAmount,
              debtAmount: Math.round(dataInvoice.finalAmount - dataInvoice.paidAmount),
              customerId: dataInvoice.recipientId,
              finalAmount: dataInvoice.finalAmount,
              cardID: dataInvoice.id,
              status: dataInvoice.status
            }}
            isCanceledCard={isCanceledCard}
            expenseCards={expenseCards}
            checkUpdateForm = {(isUpdate) => {
              if(isUpdate){
                this.getData();
              }
            }}
          />
        : null}
      </GridContainer>
    );
  }
}

export default (withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle
  }))(CreateInvoice)));
