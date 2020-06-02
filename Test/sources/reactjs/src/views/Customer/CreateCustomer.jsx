import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import 'date-fns';
import Constants from 'variables/Constants/';
import { Tabs, Spin } from "antd";
import { Redirect } from 'react-router-dom';
import CardBody from "components/Card/CardBody.jsx";
import Card from "components/Card/Card.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import CustomerService from "services/CustomerService";
import _ from "lodash";
import DebtCustomer from "./DebtCustomer.jsx";
import DepositCard from "./DepositCard.jsx";
import Transaction from "./Transaction.jsx";
import CustomerInfomation from "./CustomerInfomation.jsx";
import { MdSave, MdCancel, MdEdit } from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar.jsx';
import OhButton from 'components/Oh/OhButton.jsx';
import GridContainer from "components/Grid/GridContainer.jsx";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import AlertQuestion from "components/Alert/AlertQuestion";
import { connect } from "react-redux";
import ManualSortFilter from "MyFunction/ManualSortFilter.js";
import Actions from "store/actions/";
import store from "store/Store.js";

const { TabPane } = Tabs;
const propTypes =
{
  type: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.object,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  customerType: PropTypes.array,
};

class CreateCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {},
      textAddError: "",
      alert: null,
      inputCode: "",
      inputTaxCode: "",
      inputAddress: "",
      inputRepName: "",
      inputNotes: "",
      inputEmail: "",
      selectGender: "Nam",
      inputCheck: true,
      visible: this.props.visible,
      value: 0,
      type: 1,
      statusType: "add",
      gender: 0,
      display: "",
      isNotEdit: false,
      visibled:false,
      cards: [],
      loading: false
    };
    this.ohCustomerInfoRef = {}
  }

  componentDidMount = async () => {
    if (this.props.data)
      this.setState({
        customer: { ...this.props.data }
      });
    if (this.props.customerType)
      this.setState({
        type: this.props.customerType,
        display: parseInt(this.props.customerType) === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? "" : "none",
        customer: {
          type: this.props.customerType
        }
      });
    if (this.props.match && this.props.match.params && this.props.match.params.id) {
      this.setState({
        loading: true
      })
      this.getDataEdit();
    }

    if (this.props.customerId) {
      let getCustomer;
      if(this.props.customerType === Constants.CUSTOMER_TYPE.TYPE_SUPPLIER)
        getCustomer = await CustomerService.getSupplier(this.props.customerId);
      else
        getCustomer = await CustomerService.getCustomer(this.props.customerId);
      if (getCustomer.status) {
        this.setState({
          customer: getCustomer.data,
          display: getCustomer.data.type === 1 ? "" : "none",
          isNotEdit: true,
          statusType: "edit"
        })
      }
      else {
        if ( getCustomer.isBranchId ) 
          this.setState({redirect: <Redirect to={this.props.customerType === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? '/admin/Customer' : '/admin/Provider'} />});
      }
    }

    if (this.props.match && this.props.match.params && this.props.match.params.type) {
      this.setState({
        type: this.props.match.params.type,
        display: this.props.match.params.type === String(Constants.CUSTOMER_TYPE.TYPE_CUSTOMER) ? "" : "none",
        isNotEdit: true,
        customer: { ...this.state.customer, type: parseInt(this.props.match.params.type) }
      })

    }
  }

  getDataEdit = async () => {
    let getCustomer;
    parseInt(this.props.match.params.type) === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ?
      getCustomer = await CustomerService.getCustomer(this.props.match.params.id)
      :
      getCustomer = await CustomerService.getSupplier(this.props.match.params.id)

      if (getCustomer.status) {
        this.setState({
          customer: getCustomer.data,
          display: parseInt(this.props.match.params.type) === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? "" : "none",
          isNotEdit: true,
          statusType: "edit",
          cards: getCustomer.data.cards,
          loading: false
        })
      } else {
        if ( getCustomer.isBranchId ) 
          this.setState({redirect: <Redirect to={parseInt(this.props.match.params.type) === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? '/admin/Customer' : '/admin/Provider'} />});
      }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.visibleModal !== this.props.visibleModal && this.props.visibleModal)
      this.setState({
        type: this.props.customerType,
        display: "none",
        customer: {
          type: this.props.customerType
        }
      });
  }

  handleAdd = (customer) => {
    this.setState({ isSubmit: true }, () => this.updateCustomer(customer))    
  };
  updateCustomer = async (item) => {
      let { t } = this.props;
      let customerData = _.pick(item, ['name', 'address', 'taxCode', 'tel', 'mobile', 'gender', 'type', 'totalIn', 'totalOut', 'maxDeptAmount', 'maxDeptDays', 'totalDeposit', 'initialDeptAmount', 'fix', 'email', 'notes']);

      if (item.id) customerData.id = item.id;

      if (item.code) customerData.code = item.code;

      let saveCustomer;
      item.type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ?
        saveCustomer = await CustomerService.saveCustomer(customerData)
        :
        saveCustomer = await CustomerService.saveSupplier(customerData)
      
      if (saveCustomer.status) {
        let customerType = customerData.type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? t(Constants.CUSTOMER_TYPE_NAME[1]).toLowerCase() : t(Constants.CUSTOMER_TYPE_NAME[2]).toLowerCase();
        let idCustomer = this.props.match && this.props.match.params.id ? this.props.match.params.id : saveCustomer.data.id;
        let check = item.type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER;
        let dataUpdate =  _.cloneDeep(check ? this.props.customers : this.props.suppliers);

        if(this.state.statusType === "edit") {
          let foundIndex = dataUpdate.findIndex(item => item.id === +idCustomer)
              
          if (foundIndex > -1) {
            dataUpdate[foundIndex] = saveCustomer.data;
          }
        }
        else {         
          dataUpdate.concat(saveCustomer.data);                    
        }

        check ? store.dispatch(Actions.changeCustomerList(ManualSortFilter.sortArrayObject(dataUpdate, "name", "asc"))) : store.dispatch(Actions.changeSupplierList(ManualSortFilter.sortArrayObject(dataUpdate, "name", "asc")));

        this.setState({ isSubmit: false })
        this.setState(
          {
            customerData: saveCustomer.data,
          },
          () => {
            notifySuccess(this.state.statusType === "add" ? t('Tạo {{type}} thành công', {type: t(customerType)}) : t('Cập nhật {{type}} thành công', {type: t(customerType)}));
            this.onExit(idCustomer);
          }
        );
      }
      else {
      notifyError(saveCustomer.message) 
      this.setState({ isSubmit: false });

      }
  }

  onExit = (idCustomer) => {
    if (this.props.customerType || this.props.isModal) {
      this.setState({
        customer: {},
      }, () => this.props.onChangeVisible(false, this.state.customerData))
    }
    else
      this.setState({
        visible: false,
        redirect: <Redirect to={{ pathname: (this.state.customer.type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? 
          "/admin/Customer" : "/admin/Provider") }} />
      },
      )
  }

  handleSubmit = () => {
    let { t } = this.props;
    let customer = this.state.customer;
    if (customer.name && !this.ohCustomerInfoRef.allValid()) {
      notifyError(t("Thông tin không hợp lệ"))
    }
   else if (!customer.name) {
     let type = this.props.customerType ? this.props.customerType : Number(this.props.match.params.type);
     notifyError(t("Vui lòng điền tên {{type}}",{type: (type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER) ? t(Constants.CUSTOMER_TYPE_NAME[1]).toLowerCase() : t(Constants.CUSTOMER_TYPE_NAME[2]).toLowerCase()}))
  }
   else this.handleAdd(customer);

  };

  hideAlert = () => {
    this.setState({ alert: null });
  };

  onDelete = async (id, type) => {
    const {customer} = this.state;
    const { t } = this.props
    this.setState({
      alert: (
        <AlertQuestion
          hideAlert={() => this.hideAlert()}
          messege={
            "Bạn muốn xóa " + Constants.CUSTOMER_TYPE_NAME[type] + " " + customer.name + " ?"
          }
          messege = {
            type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ?
            t("Bạn muốn xóa khách hàng {{name}} ?", {name:customer.name})
            :
            t("Bạn muốn xóa nhà cung cấp {{name}} ?", {name:customer.name})
          }
          action={async () => {            
            this.hideAlert();

            let deleteCustomer;
            type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ?
              deleteCustomer = await CustomerService.deleteCustomer(id)
              :
              deleteCustomer = await CustomerService.deleteSupplier(id)
            
            if (deleteCustomer.status) {
              type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? 
              notifyError(t("Xóa khách hàng thành công")) 
              : 
              notifyError(t("Xóa nhà cung cấp thành công"))
              let check = type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER;

              let dataUpdate =  _.cloneDeep(check ? this.props.customers : this.props.suppliers);
              let foundIndex = dataUpdate.findIndex(item => item.id === +id)
              
              if (foundIndex > -1) {
                dataUpdate.splice(foundIndex, 1);
                check ? store.dispatch(Actions.changeCustomerList(dataUpdate)) : store.dispatch(Actions.changeSupplierList(dataUpdate))
              }

              this.setState({redirect: <Redirect to={type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? '/admin/Customer' : '/admin/Provider'} />});
            }
            else {
              notifyError(deleteCustomer.message);
            }
          }}
          buttonOk={"Đồng ý"}
        />
      )
    });
  }

  renderButton() {
    let { t, customerType } = this.props;
    let { isSubmit, customer, statusType } = this.state;

    return (
      <>
        {this.props.customerId ? null :
          <div align="right" style={{ marginRight: "30px" }}>
            <OhToolbar
              right={[
                {
                  type: "button",
                  label:  t("Lưu"),
                  disabled: isSubmit,
                  onClick: () => this.handleSubmit(),
                  icon: <MdSave />,
                  simple: true,
                  typeButton: "add",
                  permission: {
                    name: Constants.PERMISSION_NAME.CUSTOMER,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  }
                },
                {
                  type: customerType || statusType === "add"? null : "button",
                  onClick: () => this.onDelete(customer.id, customer.type),
                  label: t("Xóa"),
                  icon: <MdCancel />,
                  simple: true,
                  typeButton: "delete",
                  permission: {
                    name: Constants.PERMISSION_NAME.CUSTOMER,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
                {
                  type: this.props.isModal ? "button" : "link",
                  linkTo: this.state.customer.type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? '/admin/Customer' : '/admin/Provider',
                  onClick: () => this.onExit(false, undefined),
                  label: t("Thoát"),
                  icon: <MdCancel />,
                  simple: true,
                  typeButton: "exit",
                },
              ]}
            />
          </div>}
      </>
    )
  }
  createDebt = () =>{
    this.setState({
      visibled: true
    })
  }

  onCancel = () => {
    this.setState({
      visibled: false,
    });
  }
  
  render() {
    const { t, type, customerType } = this.props;
    const { customer, display } = this.state;
    return (

      <div >
        {this.state.redirect}
        {this.state.alert}
        <Card style={{ overflow: "hidden", marginRight: "10px", marginTop: customerType ? 0 : "" }} >
          <CardBody>
          <Spin spinning={this.state.loading}>
            <GridItem xs={12} sm={12} md={12} lg={12}>
                  {customerType ?
                    <>
                      <CustomerInfomation
                        customer={customer}
                        readOnly={this.props.customerId ? true : false}
                        type={type}
                        display={display}
                        onChangeCustomer={(customer, ref) => {
                          this.setState({
                            customer: customer
                          })                          
                          this.ohCustomerInfoRef = ref
                        }}
                      />
                      {this.renderButton()}
                    </>
                    :
                    <Tabs>
                      <TabPane tab={t("Thông tin")} key={0}>
                        <CustomerInfomation
                          customer={customer}
                          readOnly={this.props.customerId ? true : false}
                          type={type}
                          display={display}
                          onChangeCustomer={(customer, ref) => {
                            this.ohCustomerInfoRef = ref
                            this.setState({
                              customer: customer
                            })
                          }}
                        />
                        {this.renderButton()}
                      </TabPane>
                      {this.state.statusType === 'edit' ?
                        <TabPane tab={(this.state.type === String(Constants.CUSTOMER_TYPE.TYPE_CUSTOMER) ? t("Lịch sử mua hàng") : t("Lịch sử nhập hàng"))} key={1}>
                            <Transaction
                              customerId={customer.id}
                              type={this.state.type}
                              cards={this.state.cards}
                            />
                        </TabPane>
                        : null}
                      {this.state.statusType === 'edit' ?
                        <TabPane tab={t("Công nợ")} key={2}>
                            <DebtCustomer
                              customerId={customer.id} 
                              visibled = { this.state.visibled }
                              onCancel = {this.onCancel}
                              type = {this.state.type}
                              />
                          <GridContainer justify="flex-end" style={{ padding: 20 }}>
                          <OhButton
                            type="add"
                            icon={<MdEdit />}
                            onClick={() => this.createDebt()}
                            disabled={ false}
                          >
                            {t("Điều chỉnh công nợ")}
                          </OhButton>
                          </GridContainer>
                        </TabPane>
                        
                        : null}
                        {this.state.statusType === 'edit' ?
                        <TabPane tab={t("Tiền ký gửi")} key={3}>
                            <DepositCard 
                            customerId={customer.id}
                            customer={customer} 
                            />
                        </TabPane>
                        
                        : null}
                    </Tabs>
                  }
            </GridItem>
            </Spin>
          </CardBody>
        </Card>
      </div>
    );
  }
}

CreateCustomer.propTypes = propTypes;

export default connect(
  function (state) {
    return {
      suppliers: state.supplierListReducer.suppliers,
      customers: state.customerListReducer.customers
    };
  }
)(withTranslation("translations")
  (
    withStyles(theme => ({
      ...regularFormsStyle
    }))(CreateCustomer)
  ));
