import React from "react";
import PropTypes from "prop-types";
import { Modal} from "antd";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import _ from "lodash";
import { withTranslation } from "react-i18next";

import productTypeService from 'services/ProductTypeService';
import { MdSave, MdCancel } from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';
import Constants from 'variables/Constants/';
import OhForm from "components/Oh/OhForm";
import { notifyError, notifySuccess } from "components/Oh/OhUtils";


const propTypes = {
  type: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.object,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  updateProductType: PropTypes.object
};

class ProductTypeForm extends React.Component {
  constructor(props) {
    super(props);
    let { t } = this.props;
    this.state = {
      visible: this.props.visible,
      title: t("Tạo nhóm sản phẩm"),
      ProductType: {},
      displayColorPicker: false,
      status: false,
      uploading: false,
      MessageError: "",
      dataSource: [],
      checkedBoxProduct: false,
      error: "",
      isSubmit: false
    };
  }

  componentDidMount = () => {
    if (this.props.data) this.getData();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.visible !== this.props.visible)
      this.setState({
        visible: this.props.visible
      });
  };
  async setData(ProductTypes) {
    let dataProductType = [];
    if (ProductTypes.length > 0) {
      for (let i in ProductTypes) {
        dataProductType.push({ ...ProductTypes[i], key: ProductTypes[i].id });
      }
    }
    this.setState({
      dataSource: dataProductType,
    });
  }
  async getData() {
    let getProductTypes = await productTypeService.getProductTypes();
    this.setState({
      ProductType: { ...this.props.data },
      br: null,
      brerror: null,
      checkedBoxProduct: false
    });
    this.setData(getProductTypes.data);
  };

  handleSubmit = (message) => {
    if ( this.ohFormRef.allValid() && this.state.ProductType.name ) {
      if (this.props.data ) {
        if (
          this.props.data.name !== this.state.ProductType.name ||
          this.props.data.notes !== this.state.ProductType.notes
        ) {
          this.actionAdd(this.state.ProductType);
        } else this.onCancel();
      } else this.actionAdd(this.state.ProductType);
    }
  };

  actionAdd = ProductType => {
    this.setState({
      status: true
    });
    this.updateProductType(ProductType);
  };

  updateProductType = async item => {
    let { t } = this.props;
    delete item.key;
    let productTypeData = _.pick(item, ['id', 'name', 'notes']);
    this.setState({isSubmit: true}, async () => {
      try {
        let saveProductType = await productTypeService.saveProductType(productTypeData);
        if (saveProductType.status) {
          this.setState(
            {
              isSubmit: false,
              productTypeId: saveProductType.data
            },
            () => this.success(t(productTypeData.id ? Constants.ACTION_MESS.update : Constants.ACTION_MESS.create) + t(" nhóm sản phẩm thành công"))
          );
        } else {
          throw saveProductType.error;
        }
      }
      catch(error) {
        this.setState({ isSubmit: false })
        if (typeof error === "string") {
          this.error(error)
          return;
        }
  
        if (error.response.data.problems[0].localeCompare('Invalid "notes"') === 1) {
          this.error(t("Mô tả quá dài"))
          return;
        }
        this.error()
      }
    })    
  };

  success = mess => {
    notifySuccess(mess);
    this.onCancel()
  };
  error = mess => {
    notifyError(mess)
  };

  onCancel = () => {
    this.setState(
      {
        visible: false,
        ProductType: {},
        isSubmit: false
      },
      () => this.props.onChangeVisible(false, this.state.productTypeId)
    );
  };

  onChange = obj => {
    let ProductType = {
      ...this.state.ProductType,
      ...obj
    };

    this.setState({ ProductType },
    );
  }

  keyPress = e => {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  render() {
    const { title, t } = this.props;
    const { ProductType, visible, isSubmit } = this.state;

    return (
      <div>
        <Modal
          className="ProductType"
          title={t(title)}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.onCancel}
          footer={[
            <OhToolbar key="product-type-toolbar"
              right={[
                {
                  type: "button",
                  label:  t("Lưu"),
                  onClick: () => this.handleSubmit(),
                  icon: <MdSave />,
                  disabled: isSubmit,
                  simple: true,
                  typeButton: "add",
                  permission: {
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
                  typeButton: "exit"
                },
              ]}
            />
          ]}
        >
          <OhForm
            title={t("")}
            totalColumns={1}
            defaultFormData={ProductType}
            onRef={ref => this.ohFormRef = ref}
            columns={[
              [
                {
                  name: "name",
                  label: t("Tên"),
                  ohtype: "input",
                  validation: "required",
                  rowClassName: 'nameType-input',
                  message: t("Vui lòng nhập tên nhóm sản phẩm"),
                  autoFocus: true,
                  onKeyDown: this.keyPress
                },
                {
                  name: "notes",
                  label: t("Mô tả"),
                  rowClassName: 'nameType-input',
                  ohtype: "textarea",
                  minRows: 1,
                  maxRows: 4,
                },
              ]
            ]}
            onChange={value => { this.onChange(value) }}
          />
        </Modal>
      </div>
    );
  }
}

ProductTypeForm.propTypes = propTypes;

export default (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProductTypeForm)
  )
);
