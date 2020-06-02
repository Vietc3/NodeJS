import React, { Component } from 'react';
import PropTypes from "prop-types";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from "react-i18next";
import { Redirect } from 'react-router-dom';
import ProviderImport from './ProviderImport';
import InfoImport from './InfoImport';
import ProductImport from './ProductImport';
import ImportService from 'services/ImportService';
import OhButton from "components/Oh/OhButton.jsx"
import Constants from "variables/Constants/";
import { MdSave, MdCancel, MdCached } from "react-icons/md";
import ExtendFunction from "lib/ExtendFunction";
import { AiFillPrinter, } from "react-icons/ai";
import Configuration from "services/StoreConfig";
import { printHtml } from "react-print-tool";
import { connect } from "react-redux";
import moment from "moment";
import PaymentForm from "./PaymentForm";
import PaymentHistory from "./PaymentHistory";
import AlertQuestion from "components/Alert/AlertQuestion";
import ReturnHistory from 'views/Invoice/Create/ReturnHistory';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { trans } from "lib/ExtendFunction";
import ImportExportReportService from 'services/ImportExportReportService';
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import _ from "lodash";

class CreateImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataImport: { importedAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING), importReturnedAt: new Date(), status: Constants.STATUS.TEMP },
      datacustomers: [],
      dataProduct: [],
      br: null,
      brerror: null,
      redirect: null,
      type: this.props.match && this.props.match.params && this.props.match.params.cardID ? "edit" : "add",
      isSubmit: false,
      printTemplate: "",
      expenseCards: [],
      alert: null,
      isChange: false,
      dataImportReturns: []
    }
  }

  componentDidMount() {

    if (this.props.match && this.props.match.params && this.props.match.params.cardID) {
      this.getDataEdit(this.props.match.params.cardID);
    }
  }

  getDataEdit = async (cardID) => {
    let getData = await ImportService.getImport(cardID);  
    if (getData.status) {            
      getData.data.products = getData.importProductArray;
      getData.data.customerId = getData.data.recipientId;
      this.setState({
        dataImport: getData.data || [],
        type: "edit",
        expenseCards: getData.expenseCards,
        dataEdit: getData.data || [],
        dataImportReturns: getData.importReturns
      });
    }
    else{
      this.error(getData.error);
      this.setState({
        redirect: <Redirect to={"/admin/import-card"} />
      })
    }
  }
  
  getDataPrint = async () => {
    let { dataImport } = this.state;
    let totalQuantity = 0;
    dataImport.products.forEach(item => {
      totalQuantity += item.quantity;
    });
    let data = {
      refund_code: dataImport.code,
      total_discounts: 0,
      total_landed_costs: 0,
      transaction_refund_amount: 0,
      transaction_refund_method_amount: ExtendFunction.FormatNumber(Number(dataImport.finalAmount).toFixed(0)) || "",
      transaction_refund_method_name: "Tiền mặt",
      account_name: dataImport.createdBy ? dataImport.createdBy.fullName : "" ,
      reference: ExtendFunction.FormatDateTime(dataImport.importedAt),
      supplier_phone_number: dataImport.customerId ? dataImport.customerId.mobile : "",
      purchase_order_code: dataImport.code || "",
      supplier_name: dataImport.customerId ? dataImport.customerId.name : "" ,
      supplier_address: dataImport.customerId ? dataImport.customerId.address : "",
      order_code: dataImport.code,
      total_tax: dataImport.taxAmount ? ExtendFunction.FormatNumber(Number(dataImport.taxAmount).toFixed(0)) : "",
      created_on: moment(dataImport.createdAt).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      total_quantity: ExtendFunction.FormatNumber(totalQuantity),
      total_price:  ExtendFunction.FormatNumber(Number(dataImport.finalAmount).toFixed(0)) || "",
      received_on: ExtendFunction.FormatDateTime(dataImport.importedAt),
      location_name: "",
      location_address: "Địa chỉ mặc định",
      total: ExtendFunction.FormatNumber(dataImport.totalAmount),
      order_discount_value: ExtendFunction.FormatNumber(dataImport.discountAmount),
      total_amount: ExtendFunction.FormatNumber(Number(dataImport.finalAmount).toFixed(0))  || "",
      products: []
    }
    let { products } = dataImport
    
    if ( products) {
      let count = 0
    for (let item of dataImport.products) {
      let name = trans(item.productName, true)
      data = {
        ...data,
          products: data.products.concat({
          line_stt: count += 1,
          line_variant_sku: item.productCode,
          line_unit: item.unit || "",
          line_discount_amount: item.discount,
          line_tax_rate: item.discount ? ExtendFunction.FormatNumber(item.discount) :  "",
          line_amount: ExtendFunction.FormatNumber(Number(item.finalAmount || 0).toFixed(0) * Number(item.quantity || 0).toFixed(0)) || "",
          line_variant_name: name,
          line_quantity: item.quantity ? ExtendFunction.FormatNumber(item.quantity) :  "",
          line_price: ExtendFunction.FormatNumber(Number(item.finalAmount).toFixed(0)) || "",
        }),
      }
    } 
  }
      let printTemplate = await Configuration.printTemplate({ data, type: "import" })
      if (printTemplate.status) {
        await printHtml(printTemplate.data)
      }
  }
  success = (mess) => {
    let { t } = this.props;
    notifySuccess(t(mess));
  }

  error = (mess) => {
    let { t } = this.props;
    notifyError(t(mess));
  }

  hideAlert = () => {
    this.setState({ alert: null });
  };

  async saveImport() {
    let { dataImport, type } = this.state;

    let saveData = await ImportService.saveImport(dataImport);
      if (saveData.status) {
        let idImport = this.props.match && this.props.match.params.cardID ? this.props.match.params.cardID : saveData.data.newImportCard.data.id;
        if (this.props.match && this.props.match.params && this.props.match.params.cardID)
          this.success("Cập nhật phiếu nhập thành công");
        else
          this.success("Tạo phiếu nhập thành công");

        this.setState({
          isSubmit: false,
          isChange: false,
          redirect: <Redirect to={{ pathname:"/admin/import-card" }} />
        })

      }
      else {
        this.error(saveData.error);
        this.setState({ isSubmit: false })
      }
  }

  checkStock = (data) =>{
  let checkStock = true;

  _.forEach(data, item =>{
      if(item.oldStock !== parseInt(item.stockId) && item[item.oldStock] < item.quantity && item.oldStock !== 0 )        
        return checkStock = false;

    })
    return checkStock;
  }

  async savedataImport() {
    let { dataImport, type } = this.state;
    let { t  } = this.props;

    if (!dataImport.customerId) {
      this.error(t("Vui lòng chọn nhà cung cấp"))
      return;
    } else if (!dataImport.products || dataImport.products.length === 0) {
      this.error(t("Vui lòng chọn ít nhất 1 sản phẩm"))
      return;

    } else if (this.checkStock(dataImport.products) === false) {
      this.error(t("Số lượng sản phẩm đổi kho lớn hơn số lượng tồn kho"))
      return;

    }else if(type === "edit" && parseInt(dataImport.paidAmount) > parseInt(dataImport.finalAmount)){
      this.setState({
        alert: (
          <AlertQuestion
            hideAlert={() => this.hideAlert()}
            messege={"Số tiền đã thanh toán lớn hơn số tiền phải thanh toán của phiếu nhập. Bạn hãy điều chỉnh phiếu chi trước khi sửa phiếu nhập"}
            buttonOk={null}
          />
        )
      });
    }
    else {
      if((type === "add" && this.paymentFormRef.ohFormRef.allValid()) || type === 'edit'){
        if (dataImport.createdBy && dataImport.createdBy.id)
          dataImport.createdBy = dataImport.createdBy.id;
        if (dataImport.customerId && dataImport.customerId.id) {
          dataImport.customerId = dataImport.customerId.id; 
        }
        dataImport.recipientId  = dataImport.customerId;

        if(this.isPayLater)
          dataImport.paidAmount = 0;
        else
          dataImport.paidAmount = dataImport.paidAmount || 0;
        dataImport.depositAmount = dataImport.depositAmount || 0;
        dataImport.reason = Constants.IMPORT_CARD_REASON.IMPORT_PROVIDER;
        dataImport.finalAmount = Math.round(dataImport.finalAmount || 0);
        this.setState({
          isSubmit: true
        }, () => this.saveImport())
      }
    }
  }

  handelCancel = async () => {
    const {dataImport} = this.state;
    const {t} = this.props;
    this.setState({
      alert: (
        <AlertQuestion
          hideAlert={() => this.hideAlert()}
          messege={t("Bạn muốn hủy phiếu nhập {{cardCode}} ?", {cardCode: dataImport.code})}
          action={async () => {            
            this.hideAlert();

            let cancelImportCard = await ImportService.cancelImport(dataImport.id);
            
            if (cancelImportCard.status) {
              this.success("Hủy phiếu nhập thành công")
              this.setState({redirect: <Redirect to="/admin/import-card" />});
            }
            else {
              this.error(cancelImportCard.message);
            }
          }}
          buttonOk={t("Đồng ý")}
        />
      )
    });
  }

  render() {
    const { t } = this.props;
    const { dataImport, type, expenseCards, isChange, dataImportReturns, dataEdit } = this.state;
    let isCanceledCard = dataImport.status === Constants.IMPORT_STATUS.CANCELED ? true : false;
    let isReturn = dataImportReturns.length > 0 ? true : false;
    
    console.log(dataImport);
    
    return (
      <div style={{ marginRight: '-25px' }}>
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        {this.state.alert}
        <GridContainer
          style={{
            height: window.innerHeight < 900 ? 'calc(100vh - 10%)' : null,
            marginTop: '-10px',
            paddingRight: "25px",
          }}
        >
          <ProviderImport
            onChange={async (data) => {
              this.setState({
                dataImport: { ...dataImport, customerId: data }
              })
            }}
            isEdit={type === "edit" || isCanceledCard ? true : false}
            dataProvider={type === "edit" ? dataImport.customerId : undefined}
            onRef={(ref) => {
              this.productFormRef = ref
            }}
            dataEdit={dataEdit? dataEdit : undefined}
          />

          <InfoImport
            onChangeInfoImport={data => {
              this.setState({
                dataImport: { ...dataImport, ...data }
              })
            }}
            isEdit={type === "edit" || isCanceledCard ? true : false}
            dataInfoImport={type === "edit" ?
              {
                code: dataImport.code,
                status: dataImport.status,
                importedAt: dataImport.importedAt,
                notes: dataImport.notes,
              }
              : undefined}
            type={type}
            isCanceledCard = {isCanceledCard}
            isReturn={isReturn}
            dataEdit={dataEdit? dataEdit : undefined}
          />
          <ProductImport
            onChangeInfoImport={(data, isChange) =>
               
              this.setState({
                dataImport: { ...dataImport, ...data },
                isChange: isChange,
              }
            )}
            isEdit={type === "edit" && dataImport.status === 2 ? true : false}
            dataInfoProductImport={type === "edit" ? dataImport.products : undefined}
            totalAmount={type === "edit" ? dataImport.totalAmount : undefined}
            finalAmount={type === "edit" ? dataImport.finalAmount : undefined}
            taxAmount={type === "edit" ? dataImport.taxAmount : undefined}
            deliveryAmount={type === "edit" ? dataImport.deliveryAmount : undefined}
            discountAmount={type === "edit" ? dataImport.discountAmount : undefined}
            paidAmount={type === "edit" ? dataImport.paidAmount : undefined}
            type={type}
            error={this.error}
            status={dataImport.status}
            isCanceledCard = {isCanceledCard}
            isReturn={isReturn}
            dataEdit={dataEdit? dataEdit : undefined}
          />

          {type === "edit" ? null :
            <GridItem xs={12}>
              <Card >
                <CardBody style={{ padding: 0 }}>
                  <GridItem xs={12}>
                    <PaymentForm
                      finalAmount={dataImport.finalAmount || 0}
                      customerId={dataImport.customerId ? dataImport.customerId.id : null}
                      noteIncomeExpense = {dataImport.noteIncomeExpense ||''}
                      onChange={(formData, isPayLater) => {
                        this.isPayLater = isPayLater;
                        this.setState({
                          dataImport: {
                            ...dataImport,
                            paidAmount: Number(formData.payAmount),
                            debtAmount: dataImport.finalAmount - Number(formData.payAmount),
                            depositAmount: formData.depositAmount ? Number(formData.depositAmount) : 0,
                            incomeExpenseAt: formData.incomeExpenseAt ? formData.incomeExpenseAt : new Date().getTime(),
                            noteIncomeExpense: formData.noteIncomeExpense ||''
                          }
                        })
                      }}
                      onRef={ref => (this.paymentFormRef = ref)}
                      {...this.props}
                    />
                  </GridItem>
                </CardBody>
              </Card>
            </GridItem>
          }

          <GridContainer justify='flex-end'>
            <GridItem xs={12} style={{ textAlign: 'right', marginRight: 10 }}>
            {isCanceledCard || isReturn ? null :
              <OhButton
                type="add"
                onClick={() => this.savedataImport()}
                icon={<MdSave />}
                disabled={this.state.isSubmit}
                permission={{
                  name: Constants.PERMISSION_NAME.IMPORT,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}>
                {t("Lưu")}
              </OhButton>
            }
            { type==="add" ? null :
              <OhButton
                  type= "add"
                  icon= {<AiFillPrinter />}
                  onClick={() => this.getDataPrint()}
                >
                  {t("In phiếu")}
                </OhButton>
            }

            {type === "edit" && !isReturn && !isCanceledCard ?
              <OhButton
                type="delete"
                icon={<MdCancel />}
                onClick={() => {
                  this.handelCancel();
                }}
                permission={{
                  name: Constants.PERMISSION_NAME.IMPORT,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}>
                {t("Hủy")}
              </OhButton>
            : null }
              <OhButton
                type="exit"
                icon={<MdCancel />}
                linkTo={"/admin/import-card"}
               >
                {t("Thoát")}
              </OhButton>
            
            </GridItem>
          </GridContainer>

          {type === "edit" ?
          <>
            <PaymentHistory
              dataEdit = {this.state.dataEdit || {}}
              dataImport = {this.state.dataImport}
              dataPayment = {{
                paidAmount: dataImport.paidAmount,
                debtAmount: Math.round(dataImport.debtAmount),
                customerId: dataImport.customerId,
                finalAmount: dataImport.finalAmount,
                cardID: dataImport.id,
                status: dataImport.status
              }}
              isChange={isChange}
              isCanceledCard={isCanceledCard}
              expenseCards={expenseCards}
              checkUpdateForm = {(isUpdate) => {
                if(isUpdate){
                  this.getDataEdit(dataImport.id)
                }
              }}
            />
            <ReturnHistory
              dataReturn={dataImportReturns}
              cardType={Constants.PRINT_TEMPLATE_NAME.IMPORT_RETURN}
            />
          </>
          : null}
        </GridContainer>
      </div>
    );
  }
}

CreateImport.propTypes = {
  classes: PropTypes.object
};

export default (
  connect(function (state) {
    return {
      stockList: state.stockListReducer.stockList
    };
  })
) (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(CreateImport)
  )
);