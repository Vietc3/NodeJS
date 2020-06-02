import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Container, Col, Row } from "react-bootstrap";
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { Popover, Tooltip } from "antd";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import invoiceService from "services/InvoiceService";
import ExtendFunction, { trans } from "lib/ExtendFunction";
import OhTable from "components/Oh/OhTable";
import DiscountForm from "./DiscountForm";
import TextField from '@material-ui/core/TextField';
import { notifyError } from "components/Oh/OhUtils";
import _ from "lodash";
import Constants from 'variables/Constants/';
class ProductForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invoice: {},
      InvoiceProductsForm: [],
      dataInvoiceProduct: [],
      InvoiceProductsForm_copy: [],
      totalAmount: 0,
      totalQuantity: 0,
      discountAmount: 0,
      finalAmount: 0,
      isPopover: false,
      isPercent: true,
      discount: 0,
      visiblePopDiscount: false,
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.data.length !== prevProps.data.length || JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.setData();
    }

  };

  componentDidMount = () => {
    if (this.props.invoiceId) {
      this.getData();
    }
  };

  getData = async () => {

    let getInvoice = await invoiceService.getInvoice(this.props.invoiceId);

    if (getInvoice.status) {
      this.setData(getInvoice.data, getInvoice.invoiceProductArray);
    }
    else this.error(getInvoice.error)
  };

  error = mess => {
    notifyError(mess)
  };

  setData = async (invoiceData, invoices) => { 
    let { stockList } = this.props;
    let stock_List = Object.keys(stockList).map( key =>{
      return Number(key);
    });  
    let dataInvoice = [];

    let dataSource = invoices ? invoices : (this.props.data || []);

    for (let i in dataSource) {

      let checkStock =  stockList[dataSource[i].stockId] && stockList[dataSource[i].stockId].deletedAt !== 0;
      let checkStockKeys =  _.includes(stock_List, dataSource[i].stockId);

      if (checkStock || !checkStockKeys) {
        dataSource[i].stockQuantity = 0;
      } else {
        dataSource[i].stockQuantity = dataSource[i].productId[stockList[dataSource[i].stockId].stockColumnName] || 0;
      }

      dataInvoice.push({
        ...dataSource[i],
        finalAmount: invoices ? dataSource[i].unitPrice - dataSource[i].discount - dataSource[i].taxAmount : dataSource[i].finalAmount,
        unitPrice: invoices ? dataSource[i].unitPrice - dataSource[i].discount - dataSource[i].taxAmount : dataSource[i].unitPrice,
        quantity: invoices ? dataSource[i].quantity - dataSource[i].returnQuantity : dataSource[i].quantity,
        productId: dataSource[i].productId && dataSource[i].productId.id ? dataSource[i].productId.id : dataSource[i].productId,
        invoiceProductId: dataSource[i].invoiceProductId ? dataSource[i].invoiceProductId : dataSource[i].id,
        type: dataSource[i].productId && dataSource[i].productId.type ? dataSource[i].productId.type : dataSource[i].type,
      });
    }
    this.setState({
      invoice: invoices ? invoiceData : this.props.dataInvoiceReturn.invoice,
      InvoiceProductsForm: dataInvoice,
      InvoiceProductsForm_copy: JSON.parse(JSON.stringify(dataInvoice)),
      discount: invoices ? 0 : this.props.dataInvoiceReturn && this.props.dataInvoiceReturn.totalAmount ? 
        ((this.props.dataInvoiceReturn.totalAmount-this.props.dataInvoiceReturn.finalAmount) / this.props.dataInvoiceReturn.totalAmount) * 100 : 0,
    }, () => this.calculationPrice());

  };

  calculationPrice() {
    let { InvoiceProductsForm, isPercent, discount } = this.state;

    let totalAmount = 0,
        discountAmount = 0,
        finalAmount = 0,
        totalQuantity = 0;

    InvoiceProductsForm.forEach(item => {

      if (item.total) {
        totalAmount += item.total;
      } else if (item.finalAmount) {
        totalAmount += item.quantity * item.finalAmount;
      } else {
        totalAmount += item.quantity * item.unitPrice;
      }
      totalQuantity += item.quantity;
    });

    discountAmount = isPercent ? totalAmount * discount / 100 : discount

    finalAmount = Math.round(totalAmount - discountAmount);
    
    let dataSend = {
      totalAmount,
      totalQuantity,
      discountAmount,
      finalAmount,
      products: this.state.InvoiceProductsForm,
      InvoiceProductsForm_copy: this.state.InvoiceProductsForm_copy,
      invoice: this.state.invoice
    };

    this.setState(
      {
        totalAmount,
        totalQuantity,
        discountAmount,
        finalAmount
      },
      () => {
        this.props.onChangeInfoImport(dataSend);
      }
    );
  }

  getInputDiscount = () => {
    const { t } = this.props;
    return (
      this.props.isCancel ? ExtendFunction.FormatNumber(this.state.discountAmount) :
        <Popover
          trigger="click"
          placement="bottomRight"
          visible={this.state.visiblePopDiscount}
          onVisibleChange={ (e) => this.visiblePopoverDiscountChange(e) }
          content={
            <DiscountForm
              discount={this.state.discount}
              onChangeDiscount = {(isPercent, value) => {
                this.setState({
                  isPercent,
                  discount: value
                }, () => this.calculationPrice())
              }}
              discountAmount={this.state.discountAmount} 
              totalAmount={this.state.totalAmount}
              title={t("Chiết khấu")}
              isPercent={this.state.isPercent}
              onChangeVisible={ (e) => this.visiblePopoverDiscountChange(e) }
            />
          }
          title=""
          getPopupContainer={trigger => trigger.parentNode}
        >
          <TextField
            value={ExtendFunction.FormatNumber(Math.round(this.state.discountAmount) || 0)}
            InputProps={{
              readOnly: true,
              inputProps: {
                style: { textAlign: "right", marginBottom: -5 }
              }
            }}
            disabled={this.props.isCancel}
          />
        </Popover>
    )
  }

  visiblePopoverDiscountChange = (e) => {
    this.setState({visiblePopDiscount: e});
  }

  render() {
    const { t, isEdit, isCancel, stockList } = this.props;
    const { InvoiceProductsForm, InvoiceProductsForm_copy } = this.state;

    let columns = [
      {
        title: t("Mã"),
        dataIndex: "productCode",
        key: "productCode",
        width: "13%",
        align: "left",
        sortDirections: ["descend", "ascend"]
      },
      {
        title: t("Tên"),
        dataIndex: "productName",
        key: "productName",
        width: "13%",
        align: "left",
        sortDirections: ["descend", "ascend"],
        render: (value, record) => trans(record.productName)
      },
      {
        title: t("Kho"),
        dataIndex: "stockId",
        key: "stockId",
        width: "10%",
        align: "left",
        render: (value, record, index) => {
          if(record.type === Constants.PRODUCT_TYPES.id.merchandise){
            let nameStock = stockList[value] ? t(stockList[value].name) : t("Kho đã bị xóa");
            return (
            <Tooltip 
              placement="leftTop" 
              title={ nameStock || ""} 
              mouseEnterDelay={0.5}
              ><span className="ellipsis-not-span">{nameStock}</span></Tooltip>
            );
          }
        }
      },
      {
        title: t("Số lượng"),
        dataIndex: "quantity",
        key: "quantity",
        width: "12%",
        align: "left",
        sortDirections: ["descend", "ascend"],
        render: (value, record, index) => {
          let check_Stock =  stockList[InvoiceProductsForm[index].stockId] && stockList[InvoiceProductsForm[index].stockId].deletedAt === 0;

          return (
            <div className="ellipsis-not-span">
              <Tooltip placement="leftTop"
                title={ !isEdit && InvoiceProductsForm_copy[index].quantity === 0 ? t("Mặt hàng này đã được trả hết") : 
                isEdit && InvoiceProductsForm_copy[index].invoiceQuantity + InvoiceProductsForm_copy[index].quantity - InvoiceProductsForm_copy[index].returnQuantity === 0 ? t("Mặt hàng này đã được trả hết") :
                  t("Nhập số lượng nhỏ hơn hoặc bằng") + " " + (!isEdit ? ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].quantity)
                   : isCancel ? ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].invoiceQuantity - InvoiceProductsForm_copy[index].returnQuantity)
                  : ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].invoiceQuantity + InvoiceProductsForm_copy[index].quantity - InvoiceProductsForm_copy[index].returnQuantity))
                }>
                <span>
                  <CustomInput
                    id={"Input_" + record.id}
                    formControlProps={{
                      fullWidth: true,
                      style: { paddingTop: 0, maxWidth: "45%" },
                    }}
                    inputProps={{
                      type: "text",
                      name: "Quantity",
                      disabled: isCancel || !check_Stock,
                      multiline: ((record.quantity > ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].quantity)) && !isEdit )
                      || (isEdit && (record.quantity > (ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].invoiceQuantity + InvoiceProductsForm_copy[index].quantity - InvoiceProductsForm_copy[index].returnQuantity))))
                      ? true : false,
                      value: value ? ExtendFunction.FormatNumber(value) : 0,
                      onChange: e => {

                        for (let item of InvoiceProductsForm) {
                          if (item.id === record.id) {
                            if (isNaN(ExtendFunction.UndoFormatNumber(e.target.value)) === false) {
                              let value = parseInt(ExtendFunction.UndoFormatNumber(e.target.value));
                              if ( (value > ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].quantity) && !isEdit) 
                              || (isEdit && (value > (ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].invoiceQuantity + InvoiceProductsForm_copy[index].quantity - InvoiceProductsForm_copy[index].returnQuantity))))
                              ) {
                                item.total = item.finalAmount;
                              }
                              else {
                                item.quantity = value;
                                item.total = value * item.finalAmount;
                              }
                            }
                            if (e.target.value === "" || e.target.value === 0) {
                              item.quantity = 0;
                              item.total = 0;
                            }

                          }
                        }

                        this.setState({ InvoiceProductsForm }, () => this.calculationPrice());
                      },
                      inputProps: {
                        style: {
                          textAlign: "right"
                        }
                      }
                    }}
                  />
                </span>
              </Tooltip>
              <span style={{ color: "black"}}>
                <b>{"/"} </b>
                {(!isEdit ? ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].quantity) : isCancel ? ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].invoiceQuantity - InvoiceProductsForm_copy[index].returnQuantity)
                : ExtendFunction.FormatNumber(InvoiceProductsForm_copy[index].invoiceQuantity + InvoiceProductsForm_copy[index].quantity - InvoiceProductsForm_copy[index].returnQuantity))}
              </span>
            </div>
          );
        }
      },
      {
        title: t("Giá bán"),
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: "12%",
        align: "right",
        sortDirections: ["descend", "ascend"],
        render: value => {
          return (
            <div className="ellipsis-not-span">
              {value ? ExtendFunction.FormatNumber(value) : 0}
            </div>
          );
        }
      },
      {
        title: t("Giá nhập lại"),
        dataIndex: "finalAmount",
        key: "finalAmount",
        width: "13%",
        align: "right",
        sortDirections: ["descend", "ascend"],
        render: (value, record, index) => {
          let check_Stock =  stockList[InvoiceProductsForm[index].stockId] && stockList[InvoiceProductsForm[index].stockId].deletedAt === 0;

          return (
            <div className="ellipsis-not-span">
              <span>
                <CustomInput
                  id={"Input_" + record.id}
                  formControlProps={{
                    fullWidth: true,
                    style: { paddingTop: 0, maxWidth: "80%" },
                  }}
                  inputProps={{
                    type: "text",
                    name: "FinalAmount",
                    disabled: isCancel || !check_Stock,
                    value: value ? ExtendFunction.FormatNumber(value) : 0,
                    onChange: e => {
                      for (let item of InvoiceProductsForm) {
                        if (item.id === record.id) {
                          if (isNaN(ExtendFunction.UndoFormatNumber(e.target.value)) === false) {
                            let value = parseInt(ExtendFunction.UndoFormatNumber(e.target.value));
                            item.finalAmount = value;
                            item.total = value * item.quantity;
                          }
                          if (e.target.value === "" || e.target.value === 0) {
                            item.finalAmount = item.unitPrice;
                            item.total = item.unitPrice * item.quantity;
                          }
                        }
                      }
                      this.setState({ InvoiceProductsForm }, () => this.calculationPrice());
                    },
                    inputProps: {
                      style: { textAlign: "right", color: "black" },
                    }
                  }}
                /></span>
            </div>

          );
        }
      },
      {
        title: t("Thành tiền"),
        dataIndex: "total",
        key: "total",
        width: "13%",
        align: "right",
        sortDirections: ["descend", "ascend"],
        render: (value, record) => {
          return (
            <div className="ellipsis-not-span" align="right">
              {record.finalAmount
                ? ExtendFunction.FormatNumber(record.quantity * record.finalAmount)
                : ExtendFunction.FormatNumber(record.quantity * record.unitPrice)}
            </div>
          );
        }
      }
    ];

    return (
      <>
        <GridContainer>
          <GridItem xs={12}>
            <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className="HeaderForm">{t("Thông tin sản phẩm")}</b>
            </FormLabel>
          </GridItem>
        </GridContainer>

        <GridContainer >
          <GridItem xs={12}>
            <OhTable
              id="import-return-products"
              columns={columns}
              dataSource={InvoiceProductsForm}
              isNonePagination
            />
          </GridItem>
        </GridContainer>

        <GridContainer justify="flex-end">
          <GridItem md={5} sm={12}>
            <Container style={{ paddingBottom: 20 }}>
              <Row>
                <Col style={{ textAlign: "right" }}>{t("Tổng số lượng") + " :"}</Col>
                <Col className="Columns" style={{ maxWidth: 150, }}>{ExtendFunction.FormatNumber(this.state.totalQuantity)}</Col>
              </Row>

              <Row>
                <Col style={{ textAlign: "right" }}>{t("Tổng tiền") + " :"}</Col>
                <Col className="Columns" style={{ maxWidth: 150, }}>{ExtendFunction.FormatNumber(this.state.totalAmount)}</Col>
              </Row>

              <Row>
                <Col style={{ textAlign: "right" }}>{t("Chiết khấu") + " :"}</Col>
                <Col className="Columns" style={{ maxWidth: 150, marginTop: -5 }}>{this.getInputDiscount()}</Col>
              </Row>

              <Row>
                <Col style={{ textAlign: "right", fontWeight: "bold" }}>{t("Phải trả khách hàng") + " :"}</Col>
                <Col className="Columns" style={{maxWidth: 150, }}>{ExtendFunction.FormatNumber(Math.round(this.state.finalAmount) || 0)}</Col>
              </Row>
            </Container>
          </GridItem>
        </GridContainer>
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
    }))(ProductForm)
  )
);
