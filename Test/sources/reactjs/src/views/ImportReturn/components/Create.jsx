import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from "react-i18next";
import { Redirect } from 'react-router-dom';
import ProviderImport from './ProviderImport';
import InfoImport from './InfoImport';
import ProductImport from './ProductImport';
import ImportReturnService from 'services/ImportReturnService';
import OhButton from "components/Oh/OhButton.jsx"
import Constants from "variables/Constants/";
import { MdSave, MdCancel, MdCached } from "react-icons/md";
import ExtendFunction from "lib/ExtendFunction";
import { AiFillPrinter, } from "react-icons/ai";
import Configuration from "services/StoreConfig";
import { printHtml } from "react-print-tool";
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
      dataImport: { exportedAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING) },
      datacustomers: [],
      dataProduct: [],
      br: null,
      brerror: null,
      redirect: null,
      type: "add",
      isSubmit: false,
      printTemplate: "",
      incomeCards: [],
      alert: null,
      isChange: false,
      dataEdit: {}
    }
  }

  componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.cardCode) {
      this.getDataEdit(this.props.match.params.cardCode);
    }
  }

  getDataEdit = async (cardID) => {
    let getData = await ImportReturnService.getImportReturn(cardID); 
    if (getData.status) {            
      getData.data.products = getData.importReturnProductArray;
      this.setState({
        dataImport: getData.data || [],
        type: "edit",
        incomeCards: getData.incomeCards,
        dataEdit: getData.data || [],
      });
    }
    else{
      notifyError(getData.error);
      this.setState({
        redirect: <Redirect to={"/admin/export-card"} />
      })
    }
  }
  
  getDataPrint = async () => {
    let { dataImport } = this.state;
    let data = {
      order_code: dataImport.code || '',
      refund_code: dataImport.code  || '',
      products: [],
      total_quantity: dataImport.totalQuantity || '',
      location_address: dataImport.customerId.address || '',
      account_name: dataImport.createdBy.fullName || '',
      supplier_name: dataImport.customerId.name || '',
      supplier_phone_number:dataImport.customerId.tel|| '',
      created_on: moment(dataImport.exportedAt).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      total_amount: ExtendFunction.FormatNumber(Number(dataImport.totalAmount).toFixed(0)),
      total_price: ExtendFunction.FormatNumber(Number(dataImport.finalAmount).toFixed(0)),
      transaction_refund_method_name: Constants.INCOME_EXPENSE_TRANSFORM_NAME,
      order_discount_value: dataImport.discountAmount ?  ExtendFunction.FormatNumber(Number(dataImport.discountAmount).toFixed(0)) : "" ,
      transaction_refund_method_amount: ExtendFunction.FormatNumber(Number(dataImport.finalAmount).toFixed(0)) || "",
    }
    let count = 0

    if (dataImport.products) {
      for (let item of dataImport.products) {
        let name = trans(item.productName, true)
        count += 1;
        data = {
          ...data,
          products: data.products.concat({
            line_stt: count,
            line_variant_sku: item.productCode,
            line_variant_code: item.productCode,
            line_unit: item.unit,
            line_variant_name: name,
            line_quantity: item.quantity,
            line_price: ExtendFunction.FormatNumber(item.unitPrice),
            line_amount: ExtendFunction.FormatNumber(item.finalAmount * item.quantity),
            line_discount_amount: ExtendFunction.FormatNumber(item.finalAmount),
          })
        }
      }
    }

    let printTemplate = await Configuration.printTemplate({ data, type: "import_return" })

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
    let { dataImport } = this.state;
    let { t } = this.props;

    let saveData = await ImportReturnService.saveImportReturn(dataImport);
      if (saveData.status) {
        if (this.props.match && this.props.match.params && this.props.match.params.cardCode)
          notifySuccess(t("Cập nhật phiếu trả hàng nhập thành công"));
        else
          notifySuccess(t("Tạo phiếu trả hàng nhập thành công"));

        this.setState({
          isSubmit: false,
          isChange: false,
          redirect: <Redirect to={{ pathname:"/admin/export-card" }} />
        })

      }
      else {
        notifyError(t(saveData.message));
        this.setState({ isSubmit: false })
      }
  }

  async savedataImport() {
    let { dataImport, type } = this.state;

    let { t } = this.props;

    if (!dataImport.customerId) {
      notifyError(t("Vui lòng chọn nhà cung cấp"))
      return;
    } else if (!dataImport.products || dataImport.products.length === 0) {
      notifyError(t("Vui lòng chọn ít nhất 1 sản phẩm"))
      return;
    } else if(type === "edit" && parseInt(dataImport.paidAmount) > parseInt(dataImport.finalAmount)){
      this.setState({
        alert: (
          <AlertQuestion
            hideAlert={() => this.hideAlert()}
            messege={t("Số tiền đã thanh toán lớn hơn số tiền phải thanh toán của phiếu nhập. Bạn hãy điều chỉnh phiếu chi trước khi sửa phiếu nhập")}
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
          messege={t("Bạn muốn hủy phiếu trả hàng nhập {{cardCode}} ?", {cardCode: dataImport.code})}
          action={async () => {            
            this.hideAlert();

            let cancelImportCard = await ImportReturnService.deleteImportReturn(dataImport.id);
            
            if (cancelImportCard.status) {
              notifySuccess(t("Hủy phiếu trả hàng nhập thành công"))
              this.setState({redirect: <Redirect to="/admin/export-card" />});
            }
            else {
              notifyError(cancelImportCard.message);
            }
          }}
          buttonOk={t("Đồng ý")}
        />
      )
    });
  }

  render() {
    const { t } = this.props;
    const { dataImport, type, incomeCards, isChange, dataEdit } = this.state;
    let isCanceledCard = dataImport.status === Constants.IMPORT_STATUS.CANCELED ? true : false;
    
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
                exportedAt: dataImport.exportedAt,
                notes: dataImport.notes,
              }
              : undefined}
            type={type}
            isCanceledCard = {isCanceledCard}
          />
          <ProductImport
            dataEdit={dataEdit ? dataEdit : undefined}
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
            status={dataImport.status}
            isCanceledCard = {isCanceledCard}
          />

          {type === "edit" ? null :
            <GridItem xs={12}>
              <Card >
                <CardBody style={{ padding: 0 }}>
                  <GridItem xs={12}>
                    <PaymentForm
                      finalAmount={dataImport.finalAmount || 0}
                      noteIncomeExpense= {dataImport.noteIncomeExpense || ""}
                      customerId={dataImport.customerId ? dataImport.customerId.id : null}
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
            {isCanceledCard ? null :
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

            {type === "edit" && !isCanceledCard ?
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
                linkTo={"/admin/export-card"}
                >
                {t("Thoát")}
              </OhButton>
            
            </GridItem>
          </GridContainer>

          {type === "edit" ?
          <>
            <PaymentHistory
              dataEdit = {this.state.dataEdit}
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
              incomeCards={incomeCards}
              checkUpdateForm = {(isUpdate) => {
                if(isUpdate){
                  this.getDataEdit(dataImport.id)
                }
              }}
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