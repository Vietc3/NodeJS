import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal } from "antd";
import GridItem from "components/Grid/GridItem.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from "react-i18next";
import productUnitService from "services/ProductUnitService";
import _ from "lodash";
import Constants from "variables/Constants/";
import { MdSave,  MdCancel} from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';
import OhForm from "components/Oh/OhForm";
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';

const propTypes = {
  type: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.object,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  onCancel: PropTypes.func
};
class AddProductUnit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      title: this.props.title,
      ProductUnit: {},
      dataSource: [],
      alert: "",
      br: null,
      brerror: null,
      checkedBoxProduct: false,
      error: '',
      isSubmit: false
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.visible !== this.props.visible)
      this.setState({
        visible: this.props.visible
      });

  }

  componentDidMount = () => {
    if (this.props.data)
      this.setState({ ProductUnit: this.props.data })
  }
  async setData(ProductUnits) {
    let dataProductUnit = [];
    if (ProductUnits.length > 0) {
      ProductUnits.reverse();
      for (let i in ProductUnits) {
        dataProductUnit.push({ ...ProductUnits[i], key: ProductUnits[i].id })
      }
      this.setState({
        ProductType: { ...this.props.data },
        dataSource: dataProductUnit,

      });
    }
  }
  getData = async () => {

    let getProductUnits = await productUnitService.getProductUnits();
    this.setData(getProductUnits.data);
  }
  handleSubmit = () => {
    let ProductUnit = this.state.ProductUnit;

    if (this.ohFormRef.allValid() && ProductUnit.name)
      this.updateProductUnit(ProductUnit);
  };

  updateProductUnit = async item => {
    let {t} = this.props;
    let productUnitData = _.pick(item, ['id', 'name']);
    this.setState({isSubmit: true}, async () => {
      try {
        let saveProductUnit = await productUnitService.saveProductUnit(productUnitData);

        if (saveProductUnit.status) {
          this.setState({
            isSubmit: false,
            productUnitId: saveProductUnit.data
          },
            () => {
              this.success(t(productUnitData.id ? Constants.ACTION_MESS.update : Constants.ACTION_MESS.create) + t(" đơn vị tính thành công"))
            }
          );
        } else {
          throw saveProductUnit.error
        }
      }
      catch(error){
        this.setState({ isSubmit: false })
        if (typeof error === "string") {
          notifyError(error)
          return;
        }
        notifyError();
      }
    })
  }

  success = (mess) => {
    notifySuccess(mess)
    this.onCancel();
  }

  onCancel = () => {
    this.setState({
      visible: false,
      ProductUnit: {},
      isSubmit: false
    }, () => this.props.onChangeVisible(false, this.state.productUnitId))
  }

  onChange = obj => {
    let ProductUnit = {
      ...this.state.ProductUnit,
      ...obj
    };

    this.setState({ ProductUnit },
    );
  }
  
  keyPress = e => {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  render() {
    const { title, t, type } = this.props;
    const { ProductUnit, visible } = this.state;

    return (
      <div>
        {this.state.br}
        {this.state.brerror}
        <Modal
          className="ProductUnit"
          title={t(title)}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.onCancel}
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
                  permission:{
                    name: Constants.PERMISSION_NAME.PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  }
                },
                {
                  type: "button",
                  label: t("Thoát"),
                  icon: <MdCancel />,
                  onClick: () => this.onCancel(),
                  simple: true,
                  typeButton:"exit"
                },
              ]}
            />

          ]}
          width={500}
        >
          <GridItem xs={12} sm={12} md={12} style={{ marginTop: "-45px" }}>
            <OhForm
              title={t("")}
              totalColumns={1}
              defaultFormData ={ProductUnit}
              onRef={ref => this.ohFormRef = ref}
              
              columns={[[
                {
                  name: "name",
                  label: t("Tên"),
                  ohtype: "input",
                  validation: "required",
                  message: "Vui lòng nhập tên đơn vị tính",
                  rowClassName: 'nameUnit-input',
                  autoFocus: true,
                  onKeyDown: this.keyPress
                },
              ]]}
              onChange={value => { this.onChange(value) }}
            />
          </GridItem>
        </Modal>
      </div>
    );
  }
}

AddProductUnit.propTypes = propTypes;

export default connect()(withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle
  }))(AddProductUnit)
));
