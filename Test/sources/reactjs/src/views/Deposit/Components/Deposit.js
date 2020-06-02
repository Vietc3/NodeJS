import React, { Component } from 'react';
import { connect } from "react-redux";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import OhForm from 'components/Oh/OhForm';
import { withTranslation } from "react-i18next";
import { Icon } from "antd";
import Constants from 'variables/Constants';
import OhButton from 'components/Oh/OhButton';
import { MdSave, MdCancel, MdDeleteForever } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import moment from "moment";
import { Redirect } from "react-router-dom";
import CustomerService from 'services/CustomerService.js';
import { notifySuccess, notifyError } from "components/Oh/OhUtils.js";
import AlertQuestion from 'components/Alert/AlertQuestion.jsx';
import ModalCreateCustomer from "views/Product/components/Product/ModalCreateCustomer.jsx";
import DepositService from 'services/DepositService.js';
import ExtendFunction from 'lib/ExtendFunction.js';
import writtenNumber from "written-number";
import { upperCaseFirst } from "upper-case-first";
import { printHtml} from "react-print-tool";
import StoreConfig from 'services/StoreConfig.js';


class Deposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: { totalDeposit: 0, group: Constants.CUSTOMER_TYPE.TYPE_CUSTOMER },
      dataInfoCard: {
        depositDate: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        userName: this.props.currentUser.fullName,
        status: Constants.DEPOSIT_STATUS.FINISHED
      },
      dataAmount: { amount: 0 },
      customers: [],
      isEdit: false,
      isCollect: true,
      redirect: null,
      alert: null,
      visibleAddCustomer: false,
      isSubmit: false
    };
  }

  componentDidMount() {   
    if ( this.props.match.params && this.props.match.params.typeId === Constants.WITHDRAW_DEPOSIT ) {
      this.setState({ isCollect: false })
    }

    if ( this.props.match.params && this.props.match.params.CardId ) {
      this.getDataEdit(this.props.match.params.CardId);
    }
    else this.getCustomer();
  }

  componentDidUpdate(prevProps, prevState) {
    if ( prevState.dataUser.group !== this.state.dataUser.group ) {
      if ( this.state.dataUser.group === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER  ) {
        this.getCustomer();
      }
      else this.getSupplier()
    }
  }

  getDataPrintTemplate = async () => {
    let { dataInfoCard, customers, dataUser, isCollect} = this.state
    let dataPrint = {
      receipt_voucher_code: dataInfoCard ? dataInfoCard.code : "",
      issued_on:  moment(parseInt(dataInfoCard.depositDate)).format(Constants.DISPLAY_DATE_FORMAT_STRING),
      object_name: "",
      object_address: "",
      amount: isCollect ? ExtendFunction.FormatNumber(dataUser.totalDeposit) : ExtendFunction.FormatNumber(dataUser.amount) ,
      total_text: isCollect ? ` ${upperCaseFirst(writtenNumber(dataUser.totalDeposit, { lang: 'vi' }))} đồng` : `${upperCaseFirst(writtenNumber(dataUser.amount, { lang: 'vi' }))} đồng` ,
      reason: isCollect ? Constants.DEPOSIT_REASON : Constants.DEPOSIT_WITHDRAW_REASON,
    }
    let findCustomer = customers.findIndex(item => item.id === dataUser.customerId);

    if ( findCustomer !== -1 ) {
      dataPrint.object_name =  customers[findCustomer].name 
    }   
    if ( findCustomer !== -1 ) {
      dataPrint.object_address = customers[findCustomer].address 
    }

    try {
      let printTemplate = await StoreConfig.printTemplate({ data: dataPrint, type: !isCollect ? "deposit_receipt" : "incomeexponse_receipt" });
      if ( printTemplate.status ) 
        await printHtml(printTemplate.data)
      else throw printTemplate.error
    }
    catch(error) {
      if ( typeof error === "string" ) notifyError(error)
    }

  }

  getDataEdit = async (id) => {
    
      let getDataEdit = await DepositService.getDeposit(id)

      if ( getDataEdit.status ) {
        let data = getDataEdit.data;
        this.setState({
          dataUser: { 
            customerId: data.customerId &&  data.customerId.id ? data.customerId.id : null, 
            totalDeposit: data.customerId && data.customerId.totalDeposit ? data.customerId.totalDeposit : 0,
            amount: data.amount,
            group: data.customerId && data.customerId.type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? Constants.CUSTOMER_TYPE.TYPE_CUSTOMER : Constants.CUSTOMER_TYPE.TYPE_SUPPLIER,
            originalVoucherId: data.originalVoucherId,
            originalVoucherCode: data.originalVoucherCode
          },
          dataInfoCard: {
            id: data.id,
            depositDate: Number(data.depositDate),
            status: data.status,
            type: data.type,
            userName: data.userName,
            code: data.code,
            notes: data.notes        
          },
          dataAmount: { amount: data.amount },
          isEdit: true
        }, () => this.state.dataUser.group === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? this.getCustomer() : this.getSupplier())
      }
      else {
        notifyError(getDataEdit.message)
        if (getDataEdit.isBranchId) 
          this.setState({
            redirect: <Redirect to={Constants.MANAGE_DEPOSIT_CARD_PATH} />
          })
      }
    
  }

  getSupplier = async () => {
    try {
      let getSupplier = await CustomerService.getSuppliers();
      if ( getSupplier.status ) {
        let dataSupplier;

        dataSupplier = getSupplier.data;
        dataSupplier.sort((a, b) => a.name.localeCompare(b.name));

        this.setState({customers: dataSupplier})
      }

      else throw getSupplier.error

    }
    catch(error) {
      if ( typeof error === "string" ) notifyError(error)  
    }
  }

  getCustomer = async () => {
    try {
      let getCustomer = await CustomerService.getCustomers();
      
      if ( getCustomer.status ) {
        let dataCustomer;

        dataCustomer = getCustomer.data;
        dataCustomer.sort((a, b) => a.name.localeCompare(b.name));

        this.setState({customers: dataCustomer})
      }
      else throw getCustomer.error

    }
    catch(error) {
      if ( typeof error === "string" ) notifyError(error)  
    }
  }

  onChangeUser = obj => {
    let { dataUser, customers } = this.state;
    
    if ( obj["customerId"] ) {
      customers.forEach(item => {
        if ( item.id === obj["customerId"] ) {
          obj["totalDeposit"] = item.totalDeposit
        }
      })
    }

    this.setState({
      dataUser: {
        ...dataUser,
        ...obj
      }
    })
  }

  onChangeInfoCard = obj => {
    let { dataInfoCard } = this.state;

    this.setState({
      dataInfoCard: {
        ...dataInfoCard,
        ...obj
      }
    })
    
  }

  onChangeAmount = obj => {
    let { dataAmount } = this.state;

    this.setState({
      dataAmount: {
        ...dataAmount,
        ...obj
      }
    })
  }

  getOptionsCustomer() {
    let { customers } = this.state;
    let arrOptions = [];

    customers.forEach(item => arrOptions.push({ value: item.id, title: item.name, code : item.code }))

    return arrOptions;
  }

  submitDeposit = async () => {
    let { t } = this.props;
    let { isCollect, dataUser, dataAmount, isEdit } = this.state;
    let allValid = true;
    allValid = this.ohFormAmountRef.allValid() && allValid;
    allValid = this.ohFormInfoCardRef.allValid() && allValid;
    allValid = this.ohFormCustomerRef.allValid() && allValid;
    if ( !allValid ) {
      dataUser.group === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? notifyError(t("Vui lòng điền tên khách hàng")) : notifyError(t("Vui lòng điền tên nhà cung cấp"))
    }
    else {
      if ( !isEdit && !isCollect && ( dataUser.totalDeposit < dataAmount.amount ) ) {
        notifyError(t("Số tiền rút nhiều hơn số tiền gửi"))
        return;
      }

      if ( parseFloat(dataAmount.amount) === 0 ) {
        notifyError(isCollect ? t("Nhập {{type}}", {type: t("Số tiền gửi").toLowerCase()}) : t("Nhập {{type}}", {type: t("Số tiền rút").toLowerCase()}))
        return;
      }     

      this.setState({ isSubmit: true }, () => this.saveDeposit())      
    }
  }

  async saveDeposit(){
    let { isCollect, dataUser, dataAmount, isEdit, dataInfoCard } = this.state;
    let { t } = this.props;

    let data = { ...dataUser, ...dataAmount, ...dataInfoCard };

    data.type = isCollect ? Constants.DEPOSIT_TYPE.COLLECT : Constants.DEPOSIT_TYPE.WITHDRAW;
    try {
      let saveDeposit = await DepositService.saveDeposit(data);
      if ( saveDeposit.status ) {
        let id = this.props.match.params && this.props.match.params.CardId ? this.props.match.params.CardId : saveDeposit.data.id;
        isEdit ? notifySuccess(isCollect ? t("Cập nhật phiếu thu ký gửi thành công") : t("Cập nhật phiếu rút ký gửi thành công")) :
          notifySuccess(isCollect ? t("Thêm phiếu thu ký gửi thành công") : t("Thêm phiếu rút ký gửi thành công"))
        this.setState({ 
          isSubmit: false,
          redirect: <Redirect to={{ pathname: Constants.MANAGE_DEPOSIT_CARD_PATH }} /> 
        })
      }
      else throw saveDeposit.message
    }
    catch(error) {
      this.setState({
        isSubmit: false
      })
      if ( typeof error === "string" ) notifyError(error)
    }
  } 

  cancelVote = () => {
    let { dataInfoCard } = this.state;
    let { t } = this.props;

    this.setState({
      alert: <AlertQuestion 
              messege={t("Bạn chắc chắn muốn hủy phiếu {{code}}?", {code: dataInfoCard.code})} 
              hideAlert={ this.hideAlert }
              action={() => {
                this.hideAlert()
                this.handleCancelVote();
              }}
              buttonOk={"Đồng ý"}
            />
    })
  }

  handleCancelVote = async () => {
    let { dataInfoCard, isCollect } = this.state;
    let { t } = this.props

    try {
      let cancelVote = await DepositService.deleteDeposit(dataInfoCard.id)

      if ( cancelVote.status ) {
        notifySuccess(isCollect ? t("Hủy phiếu {{cardType}} thành công", {type: t("Thu ký gửi").toLowerCase()}) : t("Hủy phiếu {{cardType}} thành công", {type: t("Rút ký gửi").toLowerCase()}))
        this.setState({redirect: <Redirect to="/admin/deposit-list" />});

      }
      else throw cancelVote.message
    }
    catch(error) {
      if ( typeof error === "string" ) notifyError(error)
    }

  }

  hideAlert = () => {
    this.setState({ alert: null })
  }

  render() {
    let { t } = this.props;
    
    let { dataUser, dataInfoCard, dataAmount, isEdit, isCollect, visibleAddCustomer, isSubmit } = this.state;
    let isCanceledCard = dataInfoCard.status === Constants.DEPOSIT_STATUS.CANCELLED ? true : false;

    let addCustomer = <OhButton 
        type="exit" 
        onClick={() => this.setState({ visibleAddCustomer: true })} 
        className="button-add-information" 
        icon={<Icon type="plus" className="icon-add-information" />} 
      />

    let columnCustomer = [
      {
        name: "group",
        label: t("Đối tượng"),
        ohtype: "select",
        options: [{ value: 1, title: t(Constants.CUSTOMER_TYPE_NAME[Constants.CUSTOMER_TYPE.TYPE_CUSTOMER]) }, { value: 2, title: t(Constants.CUSTOMER_TYPE_NAME[Constants.CUSTOMER_TYPE.TYPE_SUPPLIER]) }],
        disabled: isCanceledCard || isEdit
      },
      {
        name: "customerId",
        label: t("Tên"),
        ohtype: "select",
        options: this.getOptionsCustomer(),
        validation: "required",
        button: !isEdit && isCollect  ? addCustomer : "",
        disabled:  isCanceledCard || isEdit
      },
      !isCollect && isEdit ? 
      {
        name: "originalVoucherCode",
        label: t("Tham chiếu"),
        ohtype: "input",
        disabled: ( isEdit && dataUser.originalVoucherCode ) || isCanceledCard
      } : {},
      {
        name: "totalDeposit",
        label: t("Số dư"),
        ohtype: "label",
        format: value => ExtendFunction.FormatNumber(value)
      },

    ];

    let columnInfoCard = [
      {
        name: "code",
        label: t("Mã phiếu"),
        ohtype: "input",
        placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
        disabled: ( isEdit  && dataUser.originalVoucherCode ) || isCanceledCard
      },
      {
        name: "userName",
        label: t("Người tạo"),
        ohtype: "label"
      },
      {
        name: "depositDate",
        label: isCollect ? t("Ngày thu") : t("Ngày rút"),
        ohtype: "date-picker",
        placeholder: t("Chọn ngày nhập"),
        formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
        disabled: ( isEdit  && dataUser.originalVoucherCode ) || isCanceledCard || isEdit ? true : false
      },
      {
        name: "notes",
        label: t("Ghi chú"),
        ohtype: "textarea",
        minRows: 1,
        maxRows: 1,
        disabled: ( isEdit && dataUser.originalVoucherCode ) || isCanceledCard
      },
    ]

    let columnAmount = [
      {
        name: "amount",
        label: t("Số tiền"),
        ohtype: "input-number",
        isDecimal:false,
        isNegative:false,
        rowClassName: 'amount-input',
        validation: "required|integer|numeric|min:0,num",
        disabled: ( isEdit && dataUser.originalVoucherCode ) || isCanceledCard
      },
    ]

    return (
      <GridContainer>
        {this.state.redirect}
        {this.state.alert}
        <ModalCreateCustomer
          type={"add"}
          visible={visibleAddCustomer}
          customerType = {Constants.CUSTOMER_TYPES[0].id}
          title={"Tạo khách hàng"}
          onChangeVisible={(visible, customerId) => {
            this.setState({
              visibleAddCustomer: visible
            });

            if ( customerId )
              this.setState({
                dataUser: { ...dataUser, customerId: customerId.id },
                customers: [...this.state.customers, customerId]
              });
          }}
        />
        <GridItem md={6} sm={12}>
          <Card style={{ height: "100%" }}>
            <CardBody>
              <OhForm
                defaultFormData={dataUser}
                title={isCollect ? t("Thông tin người nộp") : t("Thông tin người rút")}
                onRef={ref => this.ohFormCustomerRef = ref}
                columns={[columnCustomer]}
                onChange={value => { this.onChangeUser(value) }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={6} sm={12}>
          <Card style={{ height: "100%" }}>
            <CardBody>
              <OhForm
                defaultFormData={dataInfoCard}
                title= {isCollect ? t("Thông tin phiếu thu") : t("Thông tin phiếu rút")}
                tag= { isCanceledCard ? Constants.DEPOSIT_STATUS_NAME[Constants.DEPOSIT_STATUS.CANCELLED] : null }
                onRef={ref => this.ohFormInfoCardRef = ref}
                columns={[columnInfoCard]}
                onChange={value => { this.onChangeInfoCard(value) }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={12} sm={12}>
          <Card>
            <GridItem md={6} sm={12}>
              <CardBody>
                <OhForm
                  defaultFormData={dataAmount}
                  title={t("Giá trị ghi nhận")}
                  onRef={ref => this.ohFormAmountRef = ref}
                  columns={[columnAmount]}
                  onChange={value => { this.onChangeAmount(value) }}
                />
              </CardBody>
            </GridItem>
          </Card>
        </GridItem>
        <GridContainer justify="flex-end" style={{ padding: 20 }}>
          {isCanceledCard || ( isEdit  && dataUser.originalVoucherCode ) ? null :
          <OhButton
            type="add"
            disabled={isSubmit}
            icon={<MdSave />}
            onClick={() => this.submitDeposit()}
            permission={{
              name: Constants.PERMISSION_NAME.DEPOSIT,
              type: Constants.PERMISSION_TYPE.TYPE_ALL
            }}
          >
            {t("Lưu")}
          </OhButton>}
          { (isCanceledCard || !isEdit) ? null :
           <OhButton
          type="add"
          icon={<AiFillPrinter />}
          onClick={() => this.getDataPrintTemplate()}
          >
            {t("In phiếu")}
          </OhButton>
          }
           {( isCanceledCard || (isEdit  && dataUser.originalVoucherCode) ) || !isEdit  ? null :
           <>
          <OhButton
            type="delete"
            icon={<MdDeleteForever />}
            onClick={() => isEdit ? this.cancelVote() : null}
            permission={{
              name: Constants.PERMISSION_NAME.DEPOSIT,
              type: Constants.PERMISSION_TYPE.TYPE_ALL
            }}
          >
            {t("Hủy")}
            </OhButton>
            </>
            }
            <OhButton
              type= "exit"
              icon= {<MdCancel />}
              onClick={() => this.setState({ redirect: <Redirect to={Constants.MANAGE_DEPOSIT_CARD_PATH} /> })}
            >
              {t("Thoát")}
            </OhButton>
        </GridContainer>
      </GridContainer>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user
  };
})(withTranslation("translations")(Deposit));