import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import OhForm from 'components/Oh/OhForm';
import "date-fns";
import React from "react";
// multilingual
import { withTranslation } from "react-i18next";
import customerService from "services/CustomerService";
import incomeExpenseTypeService from "services/IncomeExpenseTypeService";
import userService from 'services/UserService';
import Constants from "variables/Constants/";
import OhButton from "components/Oh/OhButton";
import { Icon } from "antd";
import AddIncomeExpenseTypeForm from "views/IncomeExpenseTypes/components/EditForm";
import ModalCreateCustomer from "views/Product/components/Product/ModalCreateCustomer";
import ModalCreateUser from "views/IncomeExpense/components/ModalCreateUser";

class CommonInfoForm extends React.Component {
  constructor(props) {
    super(props);

    let { defaultValue } = this.props;
    this.state = {
      customers: [],
      incomeExpenseTypes: [],
      visibleAddIncExpType: false,
      visibleAddCustomer: false,
      visibleAddUser: false,
      formData: defaultValue
        ? {
            customerId: defaultValue.customerId && defaultValue.customerId.id,
            incomeExpenseCardTypeId: defaultValue.incomeExpenseCardTypeId && defaultValue.incomeExpenseCardTypeId.id,
            type: defaultValue.type,
            customerType: defaultValue.customerType
          }
        : {
            type: this.props.typeId
          },
      arrCustomerTypes: []
    };
    this.props.onRef(this);
    this.sendChange()
  }

  componentDidMount = () => {
    this.getIncomeExpenseType();
  };

  componentDidUpdate = (prevProps, prevState) => {
    let newFormData = {};
    let newState = {};
    let {formData} = this.state;
    if(!this.props.isEdit){
      if (this.state.formData.customerType !== prevState.formData.customerType) {
        newFormData = {
          ...(newFormData || {}),
          customerId: undefined
        }
        
        this.getCustomer()
      }
      if (formData.incomeExpenseCardTypeId !== prevState.formData.incomeExpenseCardTypeId ) {
        let arrCustomerTypes = this.getArrCustomerTypes();
        this.getCustomer(arrCustomerTypes[0].id);
        newState = {
          ...(newState || {}),
          arrCustomerTypes
        }
        newFormData = {
          ...(newFormData || {}),
          customerType: arrCustomerTypes[0].id,
        }
      }
      
      if(Object.keys(newFormData).length) {
        this.setState({
          formData: {
            ...this.state.formData,
            ...newFormData
          }
        });
      }
      if(Object.keys(newState).length) {
        this.setState(newState);
      }
    }
    else{
      if(prevProps.defaultValue !== this.props.defaultValue){
        const {defaultValue} = this.props
        this.setState({
          formData: {
            customerId: defaultValue.customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.OTHER ? defaultValue.customerName : defaultValue.customerId,
            incomeExpenseCardTypeId: defaultValue.incomeExpenseCardTypeId.id,
            type: defaultValue.type,
            customerType: defaultValue.customerType ? defaultValue.customerType : null,
          },
        }, () => {
          this.getData();
          this.sendChange();
          if(defaultValue.customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER 
              || defaultValue.customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.CUSTOMER) {
                this.getCustomerInfo(defaultValue.customerId, defaultValue.customerType)
            }
        })
      }
    }
  };

  getCustomerInfo = async (id, type) => {
    let getCustomer;
  
    if (type === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER)
      getCustomer = await customerService.getSupplier(id)
    else getCustomer = await customerService.getCustomer(id)
    
    if (getCustomer.status) {
        this.setState({
        customerInfo: getCustomer.data
        }, () => this.sendChange())
      }
    }

  getData = () => {
    const { defaultValue } = this.props;
    let newState = {};
    let arrCustomerTypes = this.getArrCustomerTypes();
    this.getCustomer(defaultValue.customerType);
    newState = {
      ...(newState || {}),
      arrCustomerTypes
    }
    if(Object.keys(newState).length) {
      this.setState(newState);
    }
  }

  getArrCustomerTypes = () => {
    const { formData } = this.state;
    return (formData.incomeExpenseCardTypeId ? 
      Constants.INCOME_EXPENSE_CUSTOMER_TYPES.arr.filter(item => {
        if(formData.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE) {
          return item.id === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.CUSTOMER
        }
        if(formData.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT_RETURN) {
          return item.id === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER
        }
        if(formData.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.IMPORT) {
          return item.id === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER
        }
        if(formData.incomeExpenseCardTypeId === Constants.DEFAULT_INCOME_EXPENSE_CARD_TYPES.INVOICE_RETURN) {
          return item.id === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.CUSTOMER
        }
        return true;
      }) : []);
  }

  getIncomeExpenseType = async () => {
    let filter = {
      type: this.props.typeId
    };

    if (!this.props.isEdit){
      filter = {
        ...filter,
        deletedAt: 0
      }
    }
    let getIncomeExpenseTypes = await incomeExpenseTypeService.getIncomeExpenseTypes({
      filter: filter
    });

    this.setState({
      incomeExpenseTypes: getIncomeExpenseTypes.data
    });
  };

  getCustomer = async (customerType) => {
    let getCustomers;
    customerType = customerType || this.state.formData.customerType;

    if (customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.CUSTOMER)
      getCustomers = await customerService.getCustomers();

    else if (customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER)
      getCustomers = await customerService.getSuppliers();
    
    else if (customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.STAFF){
      getCustomers = await userService.getUserList();
    }

    let customers = getCustomers ? getCustomers.data : [];

    this.setState({
      customers: customers,
      formData: {...this.state.formData, customerType: customerType}
    });
  };

  onChange = obj => {
    let formData = {
      ...this.state.formData,
      ...obj
    };
    this.setState(
      {
        formData: formData
      },
      () => this.sendChange()
    );
  };
  
  sendChange = () => {
    if(this.props.sendCommonInfo) this.props.sendCommonInfo(this.state.formData, this.state.customerInfo);
  }

  render() {
    const { t, isEdit } = this.props;
    const { customers, incomeExpenseTypes, formData, visibleAddIncExpType, visibleAddCustomer, visibleAddUser, arrCustomerTypes } = this.state;
    let customerType = formData.customerType;
    let addIncomeExpenseType = (
      <OhButton 
        type="exit" 
        onClick={() => this.setState({ visibleAddIncExpType: true })} 
        className="button-add-information" 
        icon={<Icon type="plus" className="icon-add-information" />} 
      />
    );

    let addCustomer = (
      <OhButton 
        type="exit" 
        onClick={() => {
          if(customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.STAFF)
            this.setState({ visibleAddUser: true })
          else
            this.setState({ visibleAddCustomer: true })
        }} 
        className="button-add-information" 
        icon={<Icon type="plus" className="icon-add-information" />} 
      />
    );

    return (
      <GridItem xs={12} md={6}>
        <AddIncomeExpenseTypeForm 
          visible={visibleAddIncExpType} 
          type={this.props.typeId}
          onRef={ref => (this.refIncomeExpenseType = ref)} 
          onCancel={()=> this.setState({ visibleAddIncExpType: false })}
          onSuccess={data => {
            this.setState({ formData: { ...formData, incomeExpenseCardTypeId: data.id }, 
              visibleAddIncExpType: false,
              incomeExpenseTypes: [...incomeExpenseTypes, data]
            }, () => this.sendChange())
          }}
        />

        <ModalCreateCustomer
          type={"add"}
          visible={visibleAddCustomer}
          customerType = {customerType}
          title={customerType === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER ? "Tạo khách hàng" :'Tạo nhà cung cấp'}
          onChangeVisible={(visible, customerId) => {
            this.setState({
              visibleAddCustomer: visible
            });

            if(customerId)
              this.setState({
                formData: { ...formData, customerId: customerId.id },
                customers: [...customers, customerId],
                customerInfo: customerId
              }, () => {
                this.sendChange();
              });
          }}
        />

        <ModalCreateUser
          visible={visibleAddUser}
          onChangeVisible={(visible, customerId) => {
            this.setState({
              visibleAddUser: visible
            });

            if(customerId)
              this.setState({
                formData: { ...formData, customerId: customerId }
              }, () => {
                this.getCustomer();
                this.sendChange();
              });
          }}
        />

        <Card className = 'income-expense-info-card'>
          <CardBody xs={12} style={{ padding: 0 }}>
            <OhForm
              title={t("Thông tin người " + Constants.COST_TYPE_NAME.Customer[this.props.typeId].toLowerCase())}
              defaultFormData={formData }
              onRef={ref => this.ohFormRef = ref}
              columns={[
                [
                  {
                    name: "incomeExpenseCardTypeId",
                    label: t("Loại phiếu " + Constants.COST_TYPE_NAME[this.props.typeId].toLowerCase()),
                    placeholder: t("Chọn loại {{type}}", {type: '$t(' + Constants.COST_TYPE_NAME[this.props.typeId] + ')'} ),
                    ohtype: "select",
                    validation: "required",
                    button: isEdit ? "" : addIncomeExpenseType,
                    options: incomeExpenseTypes.sort((a, b) => a.id - b.id).map(item => ({value: item.id, title: t(item.name), code: item.code})),
                    disabled: isEdit
                  },
                  {
                    name: "customerType",
                    label: t("Nhóm người " + Constants.COST_TYPE_NAME.Customer[this.props.typeId].toLowerCase()),
                    ohtype: "select",
                    validation: "required",
                    options: arrCustomerTypes.map(item => ({value: item.id, title: t(item.name)})),
                    placeholder: t("Chọn nhóm người {{type}}", {type: '$t(' + Constants.COST_TYPE_NAME.Customer[this.props.typeId] + ')'} ),
                    defaultValue: Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.SUPPLIER,
                    disabled: isEdit
                  },
                  {
                    name: "customerId",
                    label: t("Tên người " + Constants.COST_TYPE_NAME.Customer[this.props.typeId].toLowerCase()),
                    ohtype: customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.OTHER ? "input" : "select",
                    validation: "required",
                    placeholder: customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.OTHER ? 
                                  t("Nhập tên người {{type}}", {type: '$t(' + Constants.COST_TYPE_NAME.Customer[this.props.typeId] + ')'} )
                                :t("Chọn người {{type}}", {type: '$t(' + Constants.COST_TYPE_NAME.Customer[this.props.typeId] + ')'} ),
                    button: (isEdit || customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.OTHER || formData.customerType === undefined) ? "" : addCustomer,
                    options: (customerType ? customers : []).map(item => (
                      {
                        value: item.id, 
                        title: customerType === Constants.INCOME_EXPENSE_CUSTOMER_TYPES.id.STAFF ? item.fullName : item.name,
                        data: item,
                        code : item.code
                      })),
                    disabled: isEdit,
                    onChange: (value, record) => this.setState({customerInfo: record.data})
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
    CommonInfoForm
  )
);
