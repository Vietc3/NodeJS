import React, { Component } from 'react';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from "react-i18next";
import CustomerService from 'services/CustomerService';
import NotificationError from "components/Notification/NotificationError.jsx";
import OhForm from 'components/Oh/OhForm';
import ModalCreateCustomer from "views/Product/components/Product/ModalCreateCustomer";
import OhButton from "components/Oh/OhButton";
import { Icon } from "antd";
import Constants from 'variables/Constants/';
import OhModal from "components/Oh/OhModal";
import CustomerInfo from "views/Customer/CreateCustomer.jsx";

class ProviderImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      dataProvider: {},
      brerror: null,
      visibleAddCustomer: false,
      open: false,
    };
    if(this.props.onRef) this.props.onRef(this)
  }


  componentDidMount = () => {
    this.getData();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.dataProvider !== prevProps.dataProvider)
      this.setState({
        dataProvider: {
          ...this.state.dataProvider,
          id: this.props.dataProvider.id,
          name: this.props.dataProvider.name,
          address: this.props.dataProvider.address,
          phone: this.props.dataProvider.tel
        }
      })

  }

  async componentDidMount() {
    this.getData()
  }

  async getData() {
    let Customers = await CustomerService.getCustomers()

    if (Customers.status === false) this.error(Customers.error)
    else {
      this.setState({
        customers: Customers.data
      })
    }
  }

  getCustomerInfo = (customerId) => {
    let customer = this.state.customers.find((item) => item.id === customerId.id)
    this.setState({
      dataProvider: {
        ...this.state.dataProvider,
        id: customerId.id,
        name: customer.name,
        address: customer.address,
        phone: customer.tel
      }
    }, () => this.props.onChange(this.state.dataProvider))
  }

  error = (mess) => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    })
  }

  onChange = (value) => {
    const { isEdit } = this.props;
    let dataProvider = value;

    if(!isEdit && value.id !== this.state.dataProvider.id) {
      dataProvider.address = this.ohFormRef.select.name.record.data.address;
      dataProvider.phone = this.ohFormRef.select.name.record.data.tel;
    }
    this.setState({dataProvider: {...this.state.dataProvider, ...dataProvider}}, () => this.props.onChange(this.state.dataProvider));
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  render() {
    const { t, isEdit } = this.props;
    const { dataProvider, visibleAddCustomer } = this.state;
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
      <GridItem xs={12} sm={6} md={6} lg={6}>
        {this.state.brerror}

        <ModalCreateCustomer
          type={"add"}
          visible={visibleAddCustomer}
          customerType = {Constants.CUSTOMER_TYPE.TYPE_CUSTOMER}
          title={t("Tạo khách hàng")}
          onChangeVisible={(visible, customerId) => {
            this.setState({
              visibleAddCustomer: visible
            });

            if(customerId)
              this.setState({
                dataProvider: { ...dataProvider, id: customerId.id },
                customers: [...this.state.customers, customerId]
              }, () => {this.getCustomerInfo(customerId)})
          }}
        />

        <OhModal
          ClassName="CustomerInfo"
          title={t("Thông tin khách hàng")}
          content={<CustomerInfo 
            customerType={Constants.CUSTOMER_TYPE.TYPE_CUSTOMER}
            customerId={dataProvider.id} />}
          onOpen={this.state.open}
          onClose={this.handleClose}
          footer={null}
        />

        <Card >
          <CardBody xs={12} style={{ padding: 0, height: 239 }}>
            <OhForm
              title={t("Thông tin khách hàng")}
              defaultFormData={dataProvider}
              onRef={ref => this.ohFormRef = ref}
              columns={[
                [
                  isEdit ? {
                    name: "name",
                    label: t("Khách hàng"),
                    ohtype: 'link',
                    onClick: this.handleOpen
                  } : 
                  {
                    name: "id",
                    label: t("Khách hàng"),
                    ohtype: "select",
                    validation: "required",
                    options: this.state.customers.map(item => ({value: item.id, title: item.name, data: item, code : item.code})),
                    button: addCustomer,
                    placeholder: t("Chọn một khách hàng")
                  },
                  {
                    name: "phone",
                    label: t("Số điện thoại"),
                    ohtype: "label",
                  },
                  {
                    name: "address",
                    label: "Địa chỉ",
                    ohtype: "label",
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

export default (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProviderImport)
  )
);;