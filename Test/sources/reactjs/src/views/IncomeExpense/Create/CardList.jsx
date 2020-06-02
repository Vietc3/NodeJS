import "date-fns";
import React from "react";
import Constants from "variables/Constants/";
import OhTable from 'components/Oh/OhTable';
import OhNumberInput from 'components/Oh/OhNumberInput';
import InvoiceService from 'services/InvoiceService';
import ImportService from 'services/ImportService';
import ImportReturnService from 'services/ImportReturnService';
import moment from 'moment';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { Row } from "react-grid-system";
import FormLabel from "@material-ui/core/FormLabel";
import { connect } from "react-redux"
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";

class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      title: "",
      cardList: []
    };

    if(this.props.onRef) this.props.onRef(this);
    this.sendChange();
    this.defaultValue = {};
    (this.props.defaultValue || []).map(item => this.defaultValue[item.paidCardId.id] = item)
  }
  
  onChange = (obj) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [obj.cardId]: {
          ...(this.state.formData[obj.cardId] || {}),
          ...obj
        }
      }
    }, () => this.sendChange(true));
  }
  
  sendChange = (isChangeCardList) => {
    let amount = 0;

    for (let item in this.state.formData ) {
      amount += (parseFloat(this.state.formData[item].payAmount) || 0);
    }

    if(this.props.onChange && (isChangeCardList || (!isChangeCardList && Number(this.props.amountInfoForm.amount) <= amount)))
      this.props.onChange({paymentDetail: Object.values(this.state.formData)}, amount, false)
  }

  getColunms = () => {
    const { t, isCancel, isEdit } = this.props;
    let { cardList } = this.state;

    let columns = [
      {
        title: t("Mã"),
        align: "left",
        dataIndex: "code",
        key: "code",
      },
      {
        title: t("Thời gian"),
        align: "left",
        dataIndex: "createdAt",
        key: "createdAt",
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)
      },
      {
        title: t("Tổng cộng"),
        align: "right",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: value => ExtendFunction.FormatNumber(Math.round(value))
      },
      {
        title: this.props.commonInfo.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE 
              ? t("Đã thu trước") : t("Đã chi trước"),
        align: "right",
        dataIndex: "paidAmount",
        key: "paidAmount",
        render: value => ExtendFunction.FormatNumber(Math.round(value))
      },
      {
        title: t("Còn lại"),
        align: "right",
        dataIndex: "debtAmount",
        key: "debtAmount",
        render: value => ExtendFunction.FormatNumber(Math.round(value))
      },
      {
        title: t("Giá trị thanh toán"),
        align: "right",
        dataIndex: "amount",
        width: "130px",
        type: "number",
        key: "amount",
        render: (value, record, index) => {
          return <OhNumberInput
            defaultValue={ (this.state.formData[record.id] || {}).payAmount}
            onChange={value => this.onChange({payAmount: value, cardId: record.id})}
            disabled={isCancel}
            onFocus={(e) => {
              e.target.select()
            }}
            isDecimal={false}
            isNegative = {false}
            onClick={(e) => {
              e.target.select()
            }}
            max={isEdit ? record.debtAmount + cardList[index].amount : record.debtAmount}
          />
        }
      },
    ];

    return columns
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.commonInfo !== this.props.commonInfo) {
      this.getCardList();
    }

    if (JSON.stringify(prevProps.defaultValue) !== JSON.stringify(this.props.defaultValue)) {
      (this.props.defaultValue || []).map(item => this.defaultValue[item.paidCardId.id] = item)
    }

    if(prevProps.amountInfoForm.amount !== this.props.amountInfoForm.amount &&
      (prevProps.isCheck !== this.props.isCheck || this.props.isCheck === true) ) {
      this.calPaymentAmount()
    }
  }
  
  calPaymentAmount = () => {
    let {cardList, formData} = this.state;
    let {isEdit} = this.props;
    let liveAmount = this.props.amountInfoForm.amount;
    let newFormData = {};
    for(let card of cardList) {
      let {id, totalAmount} = card;
      let debtAmount = card.debtAmount + (isEdit ? this.defaultValue[id].paidAmount : 0);
      if(liveAmount){ 
        if(formData[id] === totalAmount) continue
        newFormData[id] = {cardId: id, payAmount: liveAmount > debtAmount ? debtAmount : liveAmount };
        liveAmount -= newFormData[id].payAmount;
      }
      else newFormData[id] = {cardId: id, payAmount: 0 };
    }
    this.setState({
      formData: {
        ...this.state.formData,
        ...newFormData
      }
    }, () => this.sendChange());
  }

  componentDidMount = () => {
    this.getCardList();
  }

  getCardList = async () => {
    let getCards, title;
    let cards = [];
    let {isEdit, t} = this.props;
    let newFormData = this.state.formData;
    let {incomeExpenseCardTypeId, customerId} = this.props.commonInfo;
    if(customerId && !isEdit) {
       if (incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE) {
        getCards = await InvoiceService.getInvoices({
          filter: { customerId: customerId, debtAmount: {'>': 0}, status: {'!=': Constants.INVOICE_STATUS.id.CANCELLED} },
          select: ["id", "code", "createdAt", "finalAmount", "paidAmount", "debtAmount"],
          sort: "createdAt ASC"
        })

        cards = getCards.data;

        title = t("Thanh toán đơn hàng");
      }

      if (incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN) {
        getCards = await ImportReturnService.getImportReturnList({
          filter: { recipientId: customerId, debtAmount: {'>': 0}, status: {'!=': Constants.IMPORT_RETURN_CARD_STATUS.CANCELLED} },
          select: ["id", "code", "createdAt", "finalAmount", "paidAmount", "debtAmount"],
          sort: "createdAt ASC"
        })

        cards = getCards.data;

        title = t("Thu tiền trả hàng nhập từ NCC");
      }

      if (incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT) {
        getCards = await ImportService.getImportList({
          filter: { recipientId: customerId, debtAmount: {'>': 0}, reason: Constants.IMPORT_CARD_REASON.IMPORT_PROVIDER, status: {'!=': Constants.IMPORT_STATUS.CANCELED} },
          select: ["id", "code", "createdAt", "finalAmount", "paidAmount", "debtAmount"],
          sort: "createdAt ASC"
        })

        getCards.data.forEach((item) => {
          cards.push({
            ...item,
            customerId: item.recipientId
          });
        })
        
        title = t("Thanh toán phiếu nhập hàng từ NCC");
      }

      if (incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN) {
        getCards = await ImportService.getImportList({
          filter: { recipientId: customerId, debtAmount: {'>': 0}, reason: Constants.IMPORT_CARD_REASON.INVOICE_RETURN, status: {'!=': Constants.INVOICE_RETURN_CARD_STATUS.CANCELLED} },
          select: ["id", "code", "createdAt", "finalAmount", "paidAmount", "debtAmount"],
          sort: "createdAt ASC"
        })

        getCards.data.forEach((item) => {
          cards.push({
            ...item,
            customerId: item.recipientId
          });
        })
        
        title = t("Thanh toán phiếu trả hàng");
      }
      
      cards.map(item => {
        item.totalAmount = item.finalAmount;
        return item;
      })

    } else if(isEdit) {
      if (incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE) {
        title = t("Thanh toán đơn hàng");
      }

      if (incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN) {
        title = t("Thu tiền trả hàng nhập từ NCC");
      }

      if (incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT) {
        title = t("Thanh toán phiếu nhập hàng từ NCC");
      }

      if (incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN) {
        title = t("Thanh toán phiếu trả hàng");
      }
      newFormData = {};
      cards = this.props.defaultValue.map(item => {
        let {id, code, createdAt, finalAmount, paidAmount, debtAmount} = (item.paidCardId || {});
        newFormData[id] = {cardId: id, payAmount: item.paidAmount};
        return ({
          id,
          code, 
          createdAt,
          totalAmount: finalAmount,
          paidAmount: paidAmount, 
          debtAmount: debtAmount,
          amount: item.paidAmount
        });
      })
    }

    this.setState({
      cardList: cards,
      title: title,
      formData: newFormData
    }, () => this.sendChange())
  }

  render() {
    const { title, cardList } = this.state;
    const { t } = this.props;

    let totalDebtAmount = 0;

    if(cardList.length > 0){
      for (let item of cardList ) {
        totalDebtAmount += (parseFloat(item.debtAmount) || 0);
      }
    }
    

    return (
      <GridItem xs={12}>
        <Card>
          <CardBody xs={12} style={{ padding: 0 }}>
            <Row className={"oh-row"}>
              <FormLabel className="ProductFormAddEdit">
                <b className="HeaderForm">{t(title)}</b>
              </FormLabel>
            </Row>
            {cardList.length > 0 ?
            <CardBody>
              <OhTable
                id="card-list"
                columns={this.getColunms()}
                dataSource={cardList}
                isNonePagination={true}
                onRef={ref => this.ohFormRef = ref}
              />
              <GridItem style={{float: "right"}}>
                <FormLabel className="ProductFormAddEdit">
                  <b className="HeaderForm">{t("Tổng tiền còn lại") + " : " +  ExtendFunction.FormatNumber(Math.round(totalDebtAmount))}</b>
                </FormLabel>
              </GridItem>
              </CardBody>
            : 
              <FormLabel className="ProductFormAddEdit">
                <b className="ContentFormPaddingLeft">{t("Không có phiếu")}</b>
              </FormLabel>
            }
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default connect()(withTranslation("translations")(CardList));
