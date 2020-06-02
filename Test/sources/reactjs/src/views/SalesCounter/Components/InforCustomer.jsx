import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withTranslation, } from 'react-i18next';
import { Popover } from "antd";
import withStyles from "@material-ui/core/styles/withStyles";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import OhForm from 'components/Oh/OhForm';
import customerService from 'services/CustomerService';
import { notifyError } from 'components/Oh/OhUtils';
import Constants from 'variables/Constants/';
import ExtendFunction from "lib/ExtendFunction";
import DiscountForm from './DiscountForm';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { Container, Col, Row } from "react-bootstrap";
import TextField from '@material-ui/core/TextField';
import FormLabel from "@material-ui/core/FormLabel";
import Input from '@material-ui/core/Input';
import ModalCreateCustomer from "views/Product/components/Product/ModalCreateCustomer";
import OhButton from "components/Oh/OhButton";
import { Icon } from "antd";

class InfoCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.dataSales = localStorage.getItem("sales-counter") || "";
    this.isJson = JSON.isJson(this.dataSales);
    this.dataCustomers = this.isJson ? JSON.parse(this.dataSales) : {} ;

    this.state = {
      customers: [],
      selectDiscount: false,
      visiblePopTax: false,
      visibleAddCustomer: false,
      data: this.dataCustomers.dataSalesCounter ||  {
        [this.props.keyActive]: {
          totalAmount: 0,
          discountAmount: 0,
          finalAmount: 0,
          taxAmount: 0,
          payType: 0,
          deliveryAmount: 0,
          paidAmount: 0,
          debtAmount: 0,
          quantityProducts: 0
        }
      },
      prevCustomer: 0,
    };
    this.addressCustomer= '';

    this.props.onRef(this);
    this.filters = {};

  }

  componentDidMount = () => {
    
    this.getCustomer();
    document.addEventListener("keydown",(event) =>{
      if(event.code === 'F4') {
        event.preventDefault();
        this.selectRef.ref.focus();
         
      }

      if(event.code === 'F6') {
          event.preventDefault();
          
          this.setState({
            selectDiscount: !this.state.selectDiscount
        },()=>{
          if (this.discountRef){
            this.discountRef.ohnumberinputRef.numberInputRef.focus()
          }
        })
      }

      if(event.code === 'F7') {
        event.preventDefault();
        this.inputRef.focus();
        this.inputRef.select();
      }
    }, false);
  }

  componentDidUpdate = (prevProps, prevState) => {
    let { dataCustomer } = this.props;
    
    if (prevProps.keyDelete !== this.props.keyDelete) {
      delete this.state.data[this.props.keyDelete];
      
      this.setState({
        data: this.state.data
      }, () => this.sendData())
    }

    if (prevProps.keyActive !== this.props.keyActive || (dataCustomer && JSON.stringify(prevProps.dataCustomer) !== JSON.stringify(dataCustomer))) {
      let totalAmount = dataCustomer.totalAmount || 0;
      if (dataCustomer.data) {
        if (dataCustomer.data.discountAmount) totalAmount = totalAmount - dataCustomer.data.discountAmount;
        if (dataCustomer.data.taxAmount) totalAmount = totalAmount + dataCustomer.data.taxAmount;
        if (dataCustomer.data.deliveryAmount) totalAmount = totalAmount + dataCustomer.data.deliveryAmount;
         
      }

      this.setState({
        discount: dataCustomer && dataCustomer.data ? dataCustomer.data.discountAmount  : 0,
        isPercentDiscount: false,
        data: {
          ...this.state.data,
          [this.props.keyActive]: {
            ...this.state.data[this.props.keyActive],
            totalAmount: dataCustomer.totalAmount,
            quantityProducts: dataCustomer.quantityProducts,
            finalAmount: Math.round(totalAmount),
            paidAmount:  dataCustomer.data && dataCustomer.data.payment ? Number(this.state.payment) : Math.round(totalAmount)
          },          
        },
        tax: dataCustomer.data ? dataCustomer.data.taxAmount : 0,
        isPercentTax: false,
        delivery: dataCustomer.data ? dataCustomer.data.deliveryAmount : 0,
        payment: dataCustomer.data && dataCustomer.data.payment ? dataCustomer.data.payment : null
      }, () => this.sendData())

      if (dataCustomer && dataCustomer.totalAmount === 0){
        this.setState({
            tax:  0,
            isPercentTax: false,
            delivery: 0,
            payment:  null,
            discount:  0,
            isPercentDiscount: false,
            data: {
              ...this.state.data,
              [this.props.keyActive]: {
                ...this.state.data[this.props.keyActive],
                totalAmount: 0,
                discountAmount: 0,
                finalAmount: 0,
                taxAmount: 0,
                payType: 0,
                deliveryAmount: 0,
                paidAmount: 0,
                debtAmount: 0,
                quantityProducts: 0,
                deliveryType: this.state.data[this.props.keyActive] && this.state.data[this.props.keyActive].deliveryType || 1
              }
            }
          }, () => this.sendData()
        )
      }

    }

    if ( prevProps.totalAmount !== this.props.totalAmount && prevProps.keyActive === this.props.keyActive && dataCustomer && dataCustomer.data) {
      this.setState({
        discount: prevProps.totalAmount ? (this.state.discount/prevProps.totalAmount)*this.props.totalAmount : dataCustomer && dataCustomer.data ? dataCustomer.data.discountAmount : 0,
        tax: prevProps.totalAmount ? (this.state.tax/prevProps.totalAmount)*this.props.totalAmount : dataCustomer && dataCustomer.data ? dataCustomer.data.taxAmount : 0,
      }, () => this.getAmounts())
    }
  }

  getAmounts = () => {
    let { data, discount, isPercentDiscount, tax, isPercentTax, delivery, payment } = this.state;
    let dataCustomer = data[this.props.keyActive] || {};
    let discountTotal = isPercentDiscount ? dataCustomer.totalAmount * discount / 100 : discount;
    let taxTotal = isPercentTax ? dataCustomer.totalAmount * tax / 100 : tax;
    let finalTotal = dataCustomer.totalAmount;

    if (discountTotal)
      finalTotal -= discountTotal;

    if (taxTotal)
      finalTotal += taxTotal;
      
    delivery = Number(delivery);
    if (delivery)
      finalTotal += delivery;
    
    this.setState({
      data: {
        ...this.state.data,
        [this.props.keyActive]: {
          ...this.state.data[this.props.keyActive],
          discountAmount: !isNaN(discountTotal) ? discountTotal : 0,
          taxAmount: !isNaN(taxTotal) ? taxTotal : 0,
          deliveryAmount: Number(delivery) || 0,
          finalAmount: Math.round(finalTotal),
          paidAmount: Number(payment) || Math.round(finalTotal),
          debtAmount: 0,
          totalAmount: dataCustomer.totalAmount,
          payment: payment ? Number(payment) : null
        }
      }
    }, () => this.sendData())
  }

  sendData = () => {
    let { data } = this.state;
    this.props.sendProductsData(data[this.props.keyActive], this.state.data)
  }

  getCustomer = async () => {
    
    const query = {
      sort: "name ASC"
    };    

    let getCustomer = await customerService.getCustomers(query);

    if (getCustomer.status) {

      this.setState({ customers: getCustomer.data })
    }
    else notifyError(getCustomer.message)
  }

  onChangeNotes = (value) => {
    let { data } = this.state;

    this.setState({
      data: {
        ...data,
        [this.props.keyActive]: {
          ...data[this.props.keyActive],
          notes: value,
        }
      },
    }, () => this.sendData())
  }

  onChange = (obj) => {    
    let { data, customers, prevCustomer } = this.state;
    let dataCustomer = this.ohFormRef && this.ohFormRef.select && this.ohFormRef.select.name.record.code  ? this.ohFormRef.select.name.record.data : undefined;
    if(prevCustomer !== obj.customerId){
      obj.deliveryAddress = this.addressCustomer;
      this.setState({
        prevCustomer: obj.customerId
      })
    }

    if ( dataCustomer ) {
      
      obj["totalDeposit"] = dataCustomer.totalDeposit
      obj["mobile"] = dataCustomer.tel || "";
      obj["customerName"]= dataCustomer.name || "";
      obj["email"] = dataCustomer.email || "";
    }
    obj.deliveryAddress = obj.deliveryAddress ? obj.deliveryAddress.trim() : '';
    this.setState({
      data: {
        ...data,
        [this.props.keyActive]: {
          ...obj,
        }
      },
    }, () => this.sendData())
  }

  getTextFieldDiscount = (value, readOnly) => {
    
    return (
      <TextField
        value={value ? ExtendFunction.FormatNumber(parseInt(value)) : 0}
        InputProps={{
          readOnly: readOnly,
          inputProps: {
            style: { textAlign: "right", width: 115, padding: 0 }
          },
        }}
      />
    )
  }
  handleVisibleChange = visible => {
    this.setState({ selectDiscount : visible });
  };
  visiblePopoverTaxChange = (e) => {
    this.setState({visiblePopTax: e});
  }

  render() {
    let { t } = this.props;
    let { customers, data, visibleAddCustomer } = this.state;
    let dataCustomer = data[this.props.keyActive] || {};
    let addCustomer = 
    <OhButton 
      type="exit" 
      onClick={() => {
        this.setState({ visibleAddCustomer: true })
      }} 
      className="button-add-information" 
      icon={<Icon type="plus" className="icon-add-information" />} 
    />
    const column1 = [
      {
        name: "customerId",
        label: t("Khách hàng") + " (F4)",
        ohtype: "select",
        onRef: ref => this.selectRef = ref,
        validation: "required",
        labelClassName: "label-sales-counter",
        options: customers.length ? customers.map((item) => ({ value: item.id, title: item.name, data: item, code: item.code})) : [],
        autoFocus: true,
        button: addCustomer,
        rowClassName: "customer-input",
        placeholder: t("Chọn một khách hàng"),
        message: t("Vui lòng chọn tên khách hàng"),
        tooltipClassName: "customer-tooltip",
        onChange: (value, record) => {
          this.addressCustomer = record.data ? record.data.address : '';
        }
      },
      {
        name: "mobile",
        label: t("Điện thoại"),
        labelClassName: "label-sales-counter",
        ohtype: "label",
      },
      {
        name: "deliveryAddress",
        label: t("Địa chỉ"),
        ohtype: "textarea",
        labelClassName: "label-sales-counter",
        minRows: 2,
        maxRows: 2
      },
      {
        name: "deliveryType",
        label: t("Nhận hàng"),
        ohtype: "select",
        labelClassName: "label-sales-counter",
        options: Constants.DELIVERY_TYPES.arr.map(item => ({ value: item.id, title: t(item.name), data: item })),
        format: value => t(Constants.DELIVERY_TYPES.name[value]),
        validation: "required",
        placeholder: t("Chọn nơi nhận hàng"),
        message: t("Vui lòng chọn hình thức giao hàng")
      },
    ];

    return (
      <Fragment>
        <ModalCreateCustomer
          type={"add"}
          visible={visibleAddCustomer}
          customerType = {Constants.CUSTOMER_TYPE.TYPE_CUSTOMER}
          title={t("Tạo khách hàng")}
          onChangeVisible={(visible, customerId) => {
            this.setState({
              visibleAddCustomer: visible
            });

            if(customerId){                            
            this.setState({
              data: {
                ...this.state.data,
                [this.props.keyActive]: {
                  ...this.state.data[this.props.keyActive],
                  customerId: customerId.id,
                  totalDeposit: customerId.totalDeposit,
                  deliveryAddress: customerId.address.trim(),
                  mobile: customerId.tel,
                  customerName: customerId.name,
                  email: customerId.email
                }
              },
              customers:[
                ...this.state.customers,
                customerId
              ]
            }, () =>  this.sendData())
            }
          }}
        />
        <OhForm
          title={t("Thông tin khách hàng")}
          defaultFormData={{ ...dataCustomer, mobile: dataCustomer.mobile || "" }}
          onRef={ref => {
            this.ohFormRef = ref;

          }}
          columns={[column1]}
          labelRow={35}
          onChange={value => { this.onChange(value) }}
        />
        <GridContainer style={{ padding: "5px 15px 5px 10px", width: "100%" }}>
          <GridItem xs={12} >
            <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className='HeaderForm'>{t("Thanh toán nhanh")}</b>
            </FormLabel>
          </GridItem>
          <GridItem xs={12} >
            <Container>
              <Row>
                <Col style={{ textAlign: "left", fontSize: "12px" }}>{t("Tổng tiền")+" (" + (dataCustomer && dataCustomer.quantityProducts ? dataCustomer.quantityProducts : 0) +" "+ t("Sản phẩm")+ " )"}</Col>
                <Col style={{ maxWidth: 155, textAlign: "right", fontWeight: 700 }}>
                  {ExtendFunction.FormatNumber(Math.round(dataCustomer && dataCustomer.totalAmount ? dataCustomer.totalAmount : 0))}
                </Col>
              </Row>

              <Row className='row-product-sales'>

                <Col style={{ textAlign: "left", fontSize: "12px" }}>
                  {t("Chiết khấu") + " (F6)"}
                </Col>

                <Col style={{ maxWidth: 155, textAlign: "right", fontWeight: 700 }}>
                  <Popover
                    trigger="click"
                    placement="bottomRight"
                    visible={this.state.selectDiscount}
                    onVisibleChange={this.handleVisibleChange}
                    getPopupContainer={trigger => trigger.parentNode}
                    content={ 
                      <DiscountForm
                        title={t('Chiết khấu thường')}
                        onChangeDiscount={(isPercent, discount) => {
                          this.setState({
                            discount: Number(discount),
                            isPercentDiscount: isPercent,
                          }, () => this.getAmounts())
                        }}
                        discountAmount={dataCustomer ? dataCustomer.discountAmount : 0}
                        totalAmount={dataCustomer ? dataCustomer.totalAmount : 0}
                        onRef ={ ref => this.discountRef = ref}
                        onChangeVisible={ (e) => this.handleVisibleChange(e) }

                      /> 
                    }
                  >
                    {this.getTextFieldDiscount(dataCustomer ? dataCustomer.discountAmount : 0, true)}
                  </Popover>
                </Col>
              </Row>

              <Row className='row-product-sales'>
                <Col style={{ textAlign: "left", fontSize: "12px" }}>
                  {t("Thuế")}
                </Col>
                <Col style={{ maxWidth: 155, textAlign: "right", fontWeight: 700 }}>
                  <Popover
                    trigger="click"
                    placement="bottomRight"
                    visible={this.state.visiblePopTax}
                    onVisibleChange={ (e) => this.visiblePopoverTaxChange(e) }
                    getPopupContainer={trigger => trigger.parentNode}
                    content={
                      <DiscountForm
                        title={t('Thuế GTGT')}
                        onChangeDiscount={(isPercent, tax) => {
                          this.setState({
                            tax: dataCustomer ? Number(tax) : 0,
                            isPercentTax: dataCustomer ? isPercent : 0,
                          }, () => this.getAmounts())
                        }}
                        discountAmount={dataCustomer ? dataCustomer.taxAmount : 0}
                        totalAmount={dataCustomer ? dataCustomer.totalAmount : 0}
                        onChangeVisible={ (e) => this.visiblePopoverTaxChange(e) }

                      />
                    }
                  >
                    {this.getTextFieldDiscount(dataCustomer ? dataCustomer.taxAmount : 0, true)}
                  </Popover>
                </Col>
              </Row>

              <Row className='row-product-sales'>
                <Col style={{ textAlign: "left", fontSize: "12px" }}>
                  {t("Phí giao hàng")}
                </Col>
                <Col style={{ maxWidth: 155, textAlign: "right", fontWeight: 700 }}>
                  <TextField
                    value={dataCustomer && dataCustomer.deliveryAmount ? ExtendFunction.FormatNumber(parseInt(dataCustomer.deliveryAmount)) : 0}
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "right", width: 115, padding: 0 },
                      },
                      onChange: (e) => {
                        let value = e.target.value.replace(/[^0-9]/g, "");
                        this.setState({
                          delivery: value,
                        }, () => this.getAmounts())
                      },
                      onClick: (e) => {
                        e.target.select()
                      },
                      readOnly: false
                    }}
                  />
                </Col>
              </Row>
              <Row className='row-product-sales'>
                <Col style={{ textAlign: "left" }}>{t("Khách phải trả")}</Col>
                <Col style={{ maxWidth: 160, textAlign: "right", fontWeight: 700 }} className={'total-amount'}>
                  {dataCustomer && dataCustomer.finalAmount ? ExtendFunction.FormatNumber((dataCustomer.finalAmount < 0) ? 0 : Math.round(dataCustomer.finalAmount)) : 0}
                </Col>
              </Row>
              <Row className='row-product-sales'>
                <Col style={{ textAlign: "left" }}>{t("Thanh toán nhanh") + " (F7)"}</Col>
                <Col style={{ maxWidth: 155, textAlign: "right", fontWeight: 700 }} className={'total-amount'}>
                  <TextField
                    value={dataCustomer && dataCustomer.paidAmount ? ExtendFunction.FormatNumber(parseInt((dataCustomer.paidAmount < 0) ? 0 : dataCustomer.paidAmount)) : 0}
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "right", width: 115, maxWidth: 160, padding: 0 },
                      },
                      onChange: (e) => {
                        let value = e.target.value.replace(/[^0-9]/g, "");
                        this.setState({
                          payment: value,
                        }, () => this.getAmounts())
                      },
                      onClick: (e) => {
                        e.target.select()
                      },
                      readOnly: false
                    }}
                    inputRef= {ref => this.inputRef = ref}
                  />
                </Col>
              </Row>
              <Input
                placeholder={t("Ghi chú")}
                value={dataCustomer && dataCustomer.notes ? dataCustomer.notes : ""}
                onChange={(e) => this.onChangeNotes(e.target.value)}
                style={{ display: 'flex', flexWrap: 'wrap', margin: "8px 0px", }}
                inputProps={{
                  'aria-label': 'Description',
                  style: { color: "black" }

                }}
              />
            </Container>
          </GridItem>
        </GridContainer>
      </Fragment>
    );
  }
}

export default (
  connect(function (state) {
    return {
      currentUser: state.userReducer.currentUser
    };
  })
)(withTranslation("translations")

  (withStyles((theme) => ({
    ...extendedTablesStyle,
    ...buttonsStyle
  }))(InfoCustomer)));;
