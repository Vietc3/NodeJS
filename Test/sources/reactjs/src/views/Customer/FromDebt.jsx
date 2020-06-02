import React from "react";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import 'date-fns';
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import OhForm from "components/Oh/OhForm";
import { Modal } from "antd";
import GridItem from "components/Grid/GridItem.jsx";
import OhToolbar from 'components/Oh/OhToolbar.jsx';
import { MdSave,  MdCancel} from "react-icons/md";
import DebtService from "services/DebtService.js";
import moment from "moment";
import Constants from 'variables/Constants';
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import Actions from "store/actions/";
import store from "store/Store.js";
import { connect } from "react-redux";
import _ from "lodash";

class CreateDebt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDebt: {
        createdAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        customerId: this.props.customerId ,
      },
      alert: null,
      visibled: this.props.visibled,
      isSubmit: false
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.visible !== this.props.visible)
      this.setState({
        visible: this.props.visible,
    });

  }

  componentDidMount = () => {
    if (this.props.data){
      
    let dataDebt = this.props.data || {}
      this.getData(dataDebt)
    }
  }

  getData = (dataDebt) =>{;
    
    let remainingValue ;
    remainingValue = dataDebt.length > 0 ? dataDebt[0].remainingValue : 0;
    
    this.setState({
      remainingValue: remainingValue,
    })
    
  }

  onChange = obj => {

    let dataDebt = {
      ...this.state.dataDebt,
      ...obj,
    };

    this.setState({ 
        dataDebt 
    });
  };

  handleSubmit = async () => {
    let { t } = this.props;
    let { dataDebt } = this.state;
    
    if ( this.ohFormRef.allValid() && dataDebt ) {

        this.setState({ isSubmit: true }, async () => {
          let saveDebt = await DebtService.saveDebtCard(dataDebt);

          if ( saveDebt.status ) {
            notifySuccess( t("Cập nhật công nợ thành công"));
            let check = this.props.type === Constants.CUSTOMER_TYPE.TYPE_CUSTOMER;
            let dataUpdate = _.cloneDeep(check ? this.props.customers : this.props.suppliers);
            let foundIndex = dataUpdate.findIndex(item => item.id === +this.props.customerId);

            if (foundIndex > -1) {
              dataUpdate[foundIndex].totalOutstanding = (dataUpdate[foundIndex] && dataUpdate[foundIndex].totalOutstanding || 0) + dataDebt.changeValue;

              check ? store.dispatch(Actions.changeCustomerList(dataUpdate)) : store.dispatch(Actions.changeSupplierList(dataUpdate))
            }

            this.props.onChangeVisible(false, this.props.customerId);
            this.props.onCancel();
            this.setState({ isSubmit: false })
          }
          else {
            notifyError(saveDebt.message)
            this.setState({ isSubmit: false })
          }
        })        
    }
  }

  render() {
    const { t } = this.props;
    const { dataDebt, visibled, isSubmit } = this.state;
    
    const column1 = [
      
      {
        name: "changeValue",
        label: t("Số tiền"),
        ohtype: "input-number",
        validation: "required",
        message: "Vui lòng nhập số tiền công nợ",
        isDecimal: false,
        isNegative: true,
      },
      {
        name: "notes",
        label: t("Ghi chú"),
        ohtype: "input",
      },
    ];

    const columns = [column1];

    return (
        <div>
        <Modal
         
          title={t("Điều chỉnh công nợ")}
          visible={visibled}
          onOk={this.handleOk}
          onCancel={this.props.onCancel}
          maskClosable={false}
          footer={[
            <OhToolbar
              right={[
                {
                  type: "button",
                  label: t("Lưu"),
                  onClick: () => this.handleSubmit(),
                  icon: <MdSave />,
                  simple: true,
                  typeButton:"add",
                  disabled: isSubmit
                },
                {
                  type: "button",
                  label: t("Thoát"),
                  icon: <MdCancel />,
                  onClick: () => this.props.onCancel(),
                  simple: true,
                  typeButton:"exit",
                },
              ]}
            />

          ]}
          width={700}
        >
        <GridItem sm={12} md={12}>
            <OhForm
                title={t("")}
                totalColumns={1}
                columns={columns}
                defaultFormData={dataDebt}
                onRef={ref => this.ohFormRef = ref}
                onChange={value => { this.onChange(value) }}
            />
        </GridItem>
        </Modal>
      </div>
    );
  }
}


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
    }))(CreateDebt)
  ));
