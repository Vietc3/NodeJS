import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

// multilingual
import { withTranslation } from "react-i18next";
import "date-fns";
import customerService from 'services/CustomerService';
import OhModal from "components/Oh/OhModal";
import CustomerInfo from "views/Customer/CreateCustomer.jsx";
import OhForm from 'components/Oh/OhForm';
import _ from 'lodash';
import Constants from 'variables/Constants/';
import OhButton from "components/Oh/OhButton";
import { Icon } from "antd";
import ModalCreateCustomer from "views/Product/components/Product/ModalCreateCustomer";

class CustomerForm extends React.Component {
  constructor(props) {
    super(props);
    let {dataEdit} = this.props;
    this.state = {
      customers: [],
      CustomerForm: {
        deliveryType: dataEdit.deliveryType === undefined ? Constants.INVOICE_PAYMENT_TYPES.id.cash : dataEdit.deliveryType,
      },
      open: false,
      visibleAddCustomer: false,
      totalQuantity: 0
    };
    if(this.props.onRef) this.props.onRef(this)
  }

  componentWillMount = () => {
    this.onChange(this.state.CustomerForm);
  }
  componentDidMount = () => {
    if (!this.props.isEdit)
      this.getData();
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { dataEdit } = this.props;
    if (prevProps.dataEdit !== dataEdit && dataEdit){
      this.setState({
        CustomerForm: {
          customerId: dataEdit.customerId.id,
          customerName: dataEdit.customerId.name,
          deliveryAddress: dataEdit.deliveryAddress,
          mobile: dataEdit.customerId.tel,
          totalOutstanding: dataEdit.customerId.totalOutstanding,
          deliveryType: dataEdit.deliveryType,
          email: dataEdit.customerId.email
        }
      }, () => this.props.getCustomerInfo(this.state.CustomerForm))

    }
  }

  getData = async () => {
    let { type } = this.props;
    let getCustomers;

    if ( type === Constants.ORDER_CARD_TYPE.IMPORT ) {
      getCustomers = await customerService.getSuppliers();
    }
    else getCustomers = await customerService.getCustomers();
    
    if (getCustomers.status)
      this.setData(getCustomers.data.sort((a, b) =>
        a.name ? a.name.toString().localeCompare(b.name) : ""
      ));
  }

  setData = (customers) => {
    this.setState({
      customers: customers,
    })
  }
  
  onChange = (value) => {
    const { isEdit } = this.props;
    let CustomerForm = value;

    if(!isEdit && value.customerId !== this.state.CustomerForm.customerId) {
      CustomerForm.deliveryAddress = this.ohFormRef.select.name.record.data.address;
      CustomerForm.mobile = this.ohFormRef.select.name.record.data.tel;
      CustomerForm.totalOutstanding = this.ohFormRef.select.name.record.data.totalOutstanding;
      CustomerForm.customerName = this.ohFormRef.select.name.record.data.name;
      CustomerForm.email = this.ohFormRef.select.name.record.data.email
    }
    this.setState({CustomerForm: {...this.state.CustomerForm, ...CustomerForm}}, () => this.props.getCustomerInfo(this.state.CustomerForm));
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  getCustomerInfo = (customerId) => {
    let customer = this.state.customers.find((item) => item.id === customerId.id)
    this.setState({
      CustomerForm: {
        ...this.state.CustomerForm,
        customerId: customerId.id,
        name: customer.name,
        deliveryAddress: customer.address,
        mobile: customer.tel
      }
    })
  }

  render() {
    const { t, dataEdit, isEdit, isCanceledCard, type } = this.props;
    const { customers, CustomerForm, visibleAddCustomer } = this.state;

    let addCustomer = 
    <OhButton 
      type="exit" 
      onClick={() => {
        this.setState({ visibleAddCustomer: true })
      }} 
      className="button-add-information" 
      icon={<Icon type="plus" className="icon-add-information" />} 
    />

    return (
      <GridItem xs={12} sm={12} md={6} lg={6}>
        <ModalCreateCustomer
          type={"add"}
          visible={visibleAddCustomer}
          customerType = {type === Constants.ORDER_CARD_TYPE.IMPORT ? Constants.CUSTOMER_TYPE.TYPE_SUPPLIER : Constants.CUSTOMER_TYPE.TYPE_CUSTOMER}
          title={t("Tạo khách hàng")}
          onChangeVisible={(visible, customerId) => {
            this.setState({
              visibleAddCustomer: visible
            });

            if(customerId)
              this.setState({
                CustomerForm: { ...CustomerForm, customerId: customerId.id, customerName: customerId.name, mobile: customerId.tel, email: customerId.email  },
                customers: [...this.state.customers, customerId]
              }, () => {this.getCustomerInfo(customerId);
                this.props.getCustomerInfo(this.state.CustomerForm)});
          }}
        />

        <OhModal
          ClassName="CustomerInfo"
          title={t("Thông tin khách hàng")}
          content={<CustomerInfo 
            customerType={type === Constants.ORDER_CARD_TYPE.IMPORT ? Constants.CUSTOMER_TYPE.TYPE_SUPPLIER : Constants.CUSTOMER_TYPE.TYPE_CUSTOMER}
            customerId={CustomerForm.customerId} />}
          onOpen={this.state.open}
          onClose={this.handleClose}
          footer={null}
        />
        <Card className = 'invoice-info-card' style={{height: "100%"}}>
          <CardBody xs={12} style={{ padding: 0 }}>
            <OhForm
              title={t("Thông tin khách hàng")}
              defaultFormData={isEdit ? _.extend(CustomerForm, {
                customerName: dataEdit.customerId && dataEdit.customerId.name ? dataEdit.customerId.name : '',
                mobile: dataEdit.customerId && dataEdit.customerId.tel ? dataEdit.customerId.tel : '',                
              }) : CustomerForm }
              onRef={ref => this.ohFormRef = ref}
              columns={[
                [
                  isEdit ? {
                    name: "customerName",
                    label: type === Constants.ORDER_CARD_TYPE.IMPORT ? t("NCC") : t("Khách hàng"),
                    ohtype: dataEdit.customerId && dataEdit.customerId.name ? 'link' : 'label',
                    onClick: this.handleOpen,
                  } : 
                  {
                    name: "customerId",
                    label: type === Constants.ORDER_CARD_TYPE.IMPORT ? t("NCC") : t("Khách hàng"),
                    ohtype: "select",
                    validation: "required",
                    options: customers.map(item => ({value: item.id, title: item.name, data: item, code : item.code})),
                    button: addCustomer,
                    placeholder: type === Constants.ORDER_CARD_TYPE.IMPORT ? t("Chọn {{type}}", {type: t("Nhà cung cấp").toLowerCase()}) : t("Chọn {{type}}", {type: t("Khách hàng").toLowerCase()}),
                  },
                  {
                    name: "mobile",
                    label: t("Số điện thoại"),
                    ohtype: "label",
                  },
                  {
                    name: "deliveryAddress",
                    label: t("Địa chỉ"),
                    ohtype: isCanceledCard ? "label" : "textarea",
                    minRows: 2,
                    maxRows: 2
                  },
                  type === Constants.ORDER_CARD_TYPE.IMPORT ? {} :
                  {
                    name: "deliveryType",
                    label: t("Nhận hàng"),
                    ohtype: isCanceledCard ? "label" : "select",
                    options: Constants.DELIVERY_TYPES.arr.map(item => ({value: item.id, title: t(item.name), data: item})),
                    format: value => Constants.DELIVERY_TYPES.name[value]
                  },
                ],
              ]}
              onChange={value => {
                this.onChange(value);
              }}
            />
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default connect()(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(CustomerForm)
  )
);
