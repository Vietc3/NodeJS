
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import "date-fns";
import React from "react";
import { withTranslation } from "react-i18next";
import { AiFillPrinter } from "react-icons/ai";
import { MdCancel, MdSave } from "react-icons/md";
import { Redirect } from "react-router-dom";
import incomeExpenseService from "services/IncomeExpenseService";
import Constants from "variables/Constants/";
import AmountInfoForm from "./AmountInfoForm";
import CardInfoForm from "./CardInfoForm";
import CommonInfoForm from "./CommonInfoForm";
import OhButton from "components/Oh/OhButton.jsx";
import ExtendFunction from "lib/ExtendFunction";
import moment from "moment";
import writtenNumber from "written-number";
import { upperCaseFirst } from "upper-case-first";
import StoreConfig from 'services/StoreConfig';
import CardList from "./CardList";
import { printHtml } from "react-print-tool"
import AlertQuestion from "components/Alert/AlertQuestion";
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import customerService from "services/CustomerService";
import userService from 'services/UserService';

class CreateIncomeExpense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brsuccess: null,
      brerror: null,
      printTemplate: "",
      commonInfo: {},
      amountInfoForm: {},
      cardList: {},
      cardInfoForm: {},
      isCancel: true,
      isSubmit: false,
      isCheck: false
    };
    this.isEdit = this.props.match.params.cardId !== undefined ? true : false;
    this.typeId = this.props.location.pathname.includes('income') ? Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME : Constants.INCOME_EXPENSE_TYPE.TYPE_EXPENSE;
  }

  cancelVote = () => {
    const {t} = this.props;
    this.setState({
      alert: <AlertQuestion
        messege={t(`Bạn chắc chắn muốn hủy phiếu {{code}}?`, {code: this.state.incomeExpenseCard.code } ) }
        hideAlert={this.hideAlert}
        action={() => {
          this.hideAlert()
          this.handleSave(true);
        }}
        buttonOk={t("Đồng ý")}
      />
    })
  }

  hideAlert = () => {
    this.setState({ alert: null })
  }

  handleSave = async (isCancel) => {
    let {t} = this.props;
    if(isCancel && this.state.incomeExpenseCard && this.state.incomeExpenseCard.id) {
      let cancelIncomeExpenseCard;
      parseInt(this.commonInfoFormRef.state.formData.type) === Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME ?
        cancelIncomeExpenseCard = await incomeExpenseService.cancelIncomeCard(this.state.incomeExpenseCard.id)
        :
        cancelIncomeExpenseCard = await incomeExpenseService.cancelExpenseCard(this.state.incomeExpenseCard.id)

      if (cancelIncomeExpenseCard.status) {
        notifySuccess(t("Hủy phiếu {{type}} thành công", {type: '$t(' + Constants.COST_TYPE_NAME[this.typeId] + ')'} ));

        this.setState({redirect: <Redirect to={Constants.ADMIN_LINK + Constants.MANAGE_INCOME_EXPENSE_CARD_ROUTE }/>
        });
      } else {
        this.error(cancelIncomeExpenseCard.message);
      }
    }
    else {
      let allValid = true;
      allValid = this.commonInfoFormRef.ohFormRef.allValid() && allValid;
      allValid = this.cardInfoFormRef.ohFormRef.allValid() && allValid;
      allValid = this.amountInfoFormRef.ohFormRef.allValid() && allValid;
      if (allValid && (!this.isEdit || (this.isEdit && this.state.incomeExpenseCard && this.state.incomeExpenseCard.id))) {
        let amount = 0;
        for(let index in this.state.cardList.paymentDetail) {
          amount += parseFloat(this.state.cardList.paymentDetail[index].payAmount)
        }

        if (parseFloat(this.state.amountInfoForm.amount) > amount && 
        (this.state.commonInfo && this.state.commonInfo.incomeExpenseCardTypeId && 
          (this.state.commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE
          || this.state.commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN
          || this.state.commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT
          || this.state.commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN
        )
          )) {
          this.error(t('Giá trị ghi nhận lớn hơn tổng giá trị thanh toán'));
          return;
        }

        if (this.amountInfoFormRef.state.formData.isGetDeposit[0] === 1 && (!this.state.amountInfoForm.depositAmount || this.state.amountInfoForm.depositAmount === 0 )) {
          this.error('Giá trị ký gửi phải lớn hơn 0');
          return;
        }

        if (this.amountInfoFormRef.state.formData.isGetDeposit[0] === 1 && (this.state.amountInfoForm.depositAmount > parseFloat(this.state.amountInfoForm.amount) )) {
          this.error('Tiền ký gửi không thể lớn hớn tổng giá trị thanh toán');
          return;
        }

        this.setState({isSubmit : true}, async () => {
          let formData = {
            ...this.state.commonInfo,
            ...this.state.cardInfoForm,
            ...this.state.amountInfoForm,
            ...this.state.cardList,
            id: this.isEdit ? this.state.incomeExpenseCard.id : undefined
          };
          try {
            let saveIncomeExpenseCard;
            parseInt(this.commonInfoFormRef.state.formData.type) === Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME ?
              saveIncomeExpenseCard = await incomeExpenseService.saveIncomeCard(formData)
              :
              saveIncomeExpenseCard = await incomeExpenseService.saveExpenseCard(formData)
            if (saveIncomeExpenseCard.status) {
              this.setState({isSubmit: false })
              this.success(
                (this.isEdit ? t("Cập nhật phiếu {{type}} thành công", {type: ('$t(' + Constants.COST_TYPE_NAME[this.typeId] + ')').toLowerCase()} ) 
                : t("Tạo phiếu {{type}} thành công", {type: '$t(' + Constants.COST_TYPE_NAME[this.typeId] + ')'} )
              ));
            } 
            else {
              throw saveIncomeExpenseCard.message;
            }
          }
          catch(error) {
            this.setState({isSubmit: false});
            if (typeof error === "string") this.error(error);
          }
        })        
      } 
       else {
        let errorCommonInfo = this.commonInfoFormRef.ohFormRef.validator.errorMessages;
        if(errorCommonInfo.incomeExpenseCardTypeId){
          notifyError(t("Nhập loại phiếu {{type}}", {type: '$t(' + Constants.COST_TYPE_NAME[this.typeId] + ')'} ));
        }
        else if(errorCommonInfo.customerType){
          notifyError(t("Nhập nhóm người {{type}}", {type: '$t(' + Constants.COST_TYPE_NAME.Customer[this.typeId] + ')'} ));
        }
        else if(errorCommonInfo.customerId){
          notifyError(t("Nhập tên người {{type}}", {type: '$t(' + Constants.COST_TYPE_NAME.Customer[this.typeId] + ')'} ));
        }
        else {
          notifyError(t("Số dư không đủ"));
        }
      }
    }
  };

  componentDidMount = () => {
    if (this.props.match.params.cardId) {
      this.getData();
    } else {
      this.setState({
        isCancel: false
      });
    }
  };

  getData = async (id) => {
    let getIncomeExpenseCard;
    parseInt(this.typeId) === Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME ?
      getIncomeExpenseCard = await incomeExpenseService.getIncomeCard(this.props.match.params.cardId || id)
      :
      getIncomeExpenseCard = await incomeExpenseService.getExpenseCard(this.props.match.params.cardId || id)

    if (getIncomeExpenseCard.status)
      this.setState({
        incomeExpenseCard: getIncomeExpenseCard.data.foundIncomeExpenseCard,
        incomeExpenseCardDetail: getIncomeExpenseCard.data.foundIncomeExpenseCardDetail,
        isCancel: getIncomeExpenseCard.data.foundIncomeExpenseCard.status === Constants.INCOME_EXPENSE_STATUS.id.CANCELED,
        isCheck: !this.state.isCheck
      });
    else { 
      this.error(getIncomeExpenseCard.message)
      if (getIncomeExpenseCard.isBranchId) 
      this.setState({
        redirect: <Redirect to={Constants.ADMIN_LINK + Constants.MANAGE_INCOME_EXPENSE_CARD_ROUTE} />
      })
    };
  };

  getCustomer = async (customerType, customerId) => {
    let getCustomers;

    if (customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.CUSTOMER)
      getCustomers = await customerService.getCustomers();

    else if (customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER)
      getCustomers = await customerService.getSuppliers();
    
    else if (customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.STAFF){
      getCustomers = await userService.getUserList();
    }

    let customers = getCustomers ? getCustomers.data : [];

    let customer = customers.filter(item => item.id === customerId)
    customer = customer[0];
    if(customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.STAFF){
      customer.name = customer.fullName;
      customer.mobile = customer.phoneNumber;
    }
    return customer;
  };

  getDataPrint = async () => {
    const { incomeExpenseCard } = this.state;
    let customer;
    if(incomeExpenseCard.customerId){
      customer = await this.getCustomer(incomeExpenseCard.customerType, incomeExpenseCard.customerId)
    }
    let data = {
      receipt_voucher_code: incomeExpenseCard ? incomeExpenseCard.code : "",
      issued_on: incomeExpenseCard ? moment(incomeExpenseCard.incomeExpenseAt).format(Constants.DISPLAY_DATE_FORMAT_STRING)  : "",
      object_name: customer ? customer.name : incomeExpenseCard.customerName,
      object_address: customer ? customer.address : "",
      object_phone_number: customer ? customer.mobile : "",
      total_text: incomeExpenseCard ? (incomeExpenseCard.amount === 0 ? "" : `${upperCaseFirst(writtenNumber(incomeExpenseCard.amount, { lang: 'vi' }))} đồng`) : "",
      amount: incomeExpenseCard ? ExtendFunction.FormatNumber(incomeExpenseCard.amount) : "",
      reason:  incomeExpenseCard.incomeExpenseCardTypeId.name,
      payment_voucher_code:  incomeExpenseCard ? incomeExpenseCard.code : ""
    }
    let printTemplate;

    parseInt(this.typeId) === Constants.INCOME_EXPENSE_TYPE.TYPE_INCOME ?

      printTemplate = await StoreConfig.printTemplate({ data, type: "incomeexponse_receipt" })
      :
      printTemplate = await StoreConfig.printTemplate({ data, type: "incomeexponse_payment" })

    if (printTemplate.status) {
     await printHtml(printTemplate.data) 
    }
  }

  getReturnRedirect = () => {
    let id = this.props.match && this.props.match.params.cardId ? this.props.match.params.cardId : this.state.idIncomeExpenseCard;
    return (
      <Redirect
        to={
          (Number(this.typeId) === Constants.COST_TYPE_NAME.Income
            ? Constants.EDIT_INCOME_CARD_PATH
            : Constants.EDIT_EXPENSE_CARD_PATH) + id
        }
      />
    );
  };

  success = mess => {
    const { t } = this.props;
    this.setState({
      redirect: <Redirect to={Constants.ADMIN_LINK + Constants.MANAGE_INCOME_EXPENSE_CARD_ROUTE} />,
      brsuccess: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={t(mess)} />
    });
  };

  error = mess => {
    const { t } = this.props;
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={t(mess || "Thất bại")} />
    });
  };

  render() {
    const { t } = this.props;
    const { incomeExpenseCard, incomeExpenseCardDetail, commonInfo, cardList, amountInfoForm, customerInfo, isCancel, isSubmit, isCheck } = this.state;
    const isCanceledCard = incomeExpenseCard && incomeExpenseCard.status === Constants.INCOME_EXPENSE_STATUS.id.CANCELED ? true : false;
    return (
      <div style={{ marginRight: "-25px" }}>
        {this.state.brsuccess}
        {this.state.brerror}
        {this.state.alert}
        {this.state.redirect}
            <GridContainer
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{
                marginTop: "-10px"
              }}
            >
              <CommonInfoForm
                defaultValue={incomeExpenseCard}
                onRef={ref => (this.commonInfoFormRef = ref)}
                {...this.props}
                typeId={this.typeId}
                sendCommonInfo={(commonInfo, customerInfo) => {
                  this.setState({
                    commonInfo: commonInfo,
                    customerInfo, 
                  })
                }}
                isEdit={this.isEdit}
                isCancel={isCancel}
              />

              <CardInfoForm
                defaultValue={incomeExpenseCard}
                onRef={ref => (this.cardInfoFormRef = ref)}
                onChange = {formData => {
                  let {code, incomeExpenseAt, notes} = formData;
                  this.setState({
                    cardInfoForm: {code, incomeExpenseAt, notes}
                  })
                }}
                {...this.props}
                typeId={this.typeId}
                isEdit={this.isEdit}
                isCancel={isCancel}
              />

              {commonInfo.customerId
                && (commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT
                  || commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN
                  || commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN
                  || commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE
                )
                ?
                <CardList
                  commonInfo={commonInfo}
                  amountInfoForm={amountInfoForm}
                  onChange = {(formData, amount, check) => {
                    this.setState({
                      cardList: formData,
                      amountInfoForm: isCheck === true ? amountInfoForm : {...amountInfoForm, amount},
                      isCheck: check
                    })
                  }}
                  defaultValue={incomeExpenseCardDetail}
                  onRef={ref => (this.cardListFormRef = ref)}
                  isEdit={this.isEdit}
                  isCancel={isCancel}
                  typeId={this.typeId}
                  isCheck={isCheck}
                />
                : null}
              
              <AmountInfoForm
                typeIncExp={this.typeId}
                defaultValue={incomeExpenseCard}
                onRef={ref => (this.amountInfoFormRef = ref)}
                {...this.props}
                commonInfo={commonInfo}
                customerInfo={customerInfo}
                cardList={cardList}
                onChange = {(formData, isCheck) => {
                  let {amount, depositAmount} = formData;
                  this.setState({
                    amountInfoForm: {amount, depositAmount},
                    isCheck
                  })
                }}
                isEdit={this.isEdit}
                isCancel={isCancel}
                typeId={this.typeId}                
              />
              
              <GridItem xs={12}>
                <GridContainer justify="flex-end">
                  <GridItem xs={12} style={{ textAlign: "right", marginRight: 10 }}>
                  { isCanceledCard ? null :   
                    <OhButton
                      type="button"
                      label={t("Lưu")}
                      disabled={isSubmit}
                      icon={<MdSave />}
                      onClick={() => this.handleSave()}
                      permission={{
                        name: Constants.PERMISSION_NAME.INCOME_EXPENSE,
                        type: Constants.PERMISSION_TYPE.TYPE_ALL
                      }}
                    />}
                    { isCanceledCard ||  !this.isEdit ? null : 
                    <>
                    <OhButton  
                      onClick={() => this.getDataPrint()} 
                      icon={<AiFillPrinter/>}
                      type="add"
                      typePrint="print"
                      >
                        {t("In phiếu")}
                    </OhButton>
                    <OhButton
                      type="delete"
                      icon={<MdCancel />}
                      onClick={() => { 
                        if(this.isEdit && !isCancel) this.cancelVote();
                      }}
                      permission={{
                        name: Constants.PERMISSION_NAME.INCOME_EXPENSE,
                        type: Constants.PERMISSION_TYPE.TYPE_ALL
                      }}
                    >
                      {t("Hủy")}
                    </OhButton>
                    </>
                    }
                    <OhButton
                    type="exit"
                    icon={<MdCancel />}
                    simple={true}
                    linkTo={Constants.ADMIN_LINK + Constants.MANAGE_INCOME_EXPENSE_CARD_ROUTE}>
                    {t("Thoát")}
                  </OhButton>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
      </div>
    );
  }
}

export default (
  withTranslation("translations")(
    CreateIncomeExpense
  )
);
