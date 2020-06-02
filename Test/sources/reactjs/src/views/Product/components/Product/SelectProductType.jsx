import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

//antd
import { Modal, Select } from "antd";

//component
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

//material-ui
import FormLabel from "@material-ui/core/FormLabel";
import withStyles from "@material-ui/core/styles/withStyles";

// for multilingual
import { withTranslation } from "react-i18next";
import NotificationError from "components/Notification/NotificationError.jsx";

import productTypeService from 'services/ProductTypeService';
import Constants from "variables/Constants/index";
import OhToolbar from "components/Oh/OhToolbar";
import { MdSave, MdCancel } from "react-icons/md";
import OhButton from "components/Oh/OhButton";
import { Icon } from "antd";
import ProductTypeForm from "views/ProductType/components/ProductType/Form";

const { Option } = Select;
const propTypes = {
  type: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.object,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  onCancel: PropTypes.func
};
class AddProductType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      title: this.props.title,
      ProductTypeList: [],
      alert: "",
      brerror: null,
      visibleAddProductType: false,
    };
  }

  componentDidMount = async () => {
    let getProductTypes = await productTypeService.getProductTypes();
    
    this.setState({
      ProductTypeList: getProductTypes.data
    });
  }

  handleSelectChange = (e) => {
    this.setState({
      idSelect: e
    })
  }

  onCancel = () => {
    this.setState({
      visible: false
    }, () => this.props.changeVisible(false));
  }

  handleSubmit = () => {
    let { t } = this.props;
    if (this.state.idSelect !== undefined) {
      let product = this.state.ProductTypeList.find(props =>
        this.state.idSelect === props.id)
      this.onCancel();
      this.props.changeProductType(this.state.idSelect, product.name)
    }
    else this.error(t("Vui lòng chọn nhóm hàng"))
  }
  error = (mess) => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    })
  }

  render() {
    const { classes, title, t, visible } = this.props;
    const { ProductTypeList, idSelect } = this.state;

    return (
      <div key={"producttype-form"}>
        <ProductTypeForm
          type={"add"}
          visible={this.state.visibleAddProductType}
          title={t("Thêm nhóm sản phẩm")}
          data={{}}
          onChangeVisible={(visible, productTypeId) => {
            this.setState({
              visibleAddProductType: visible
            })

            if (productTypeId) {
              this.setState({
                idSelect: productTypeId.id,
                ProductTypeList: [...this.state.ProductTypeList, productTypeId]
              })
            }
          }}
        />
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.onCancel}
          key={"select_"+title}
          footer={[
            <OhToolbar
                key = {"toolbar_select_producttype"}
                right={[
                  {
                    type: "button" ,
                    label: t("Lưu") ,
                    onClick:() => this.handleSubmit(),
                    icon: <MdSave/>,
                    typeButton:"add",
                    simple: true,
                    permission:{
                      name: Constants.PERMISSION_NAME.PRODUCT,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    },
                  },
                  {
                    type: "button",
                    label: t("Thoát"),
                    onClick: () => this.onCancel(),
                    icon: <MdCancel />,
                    typeButton:"exit",
                    simple: true,
                    permission:{
                      name: Constants.PERMISSION_NAME.PRODUCT,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    },
                  },
                ]} 
              />
          ]}
          width={500}
        >
          <GridItem xs={12} sm={12} md={12} style={{ margin: "-20px 0px" }}>
            {this.state.alert}
            {this.state.brerror}
            <form>
              <GridContainer className="custom-modal-input custom-modal-input-first">
                <GridItem xs={3} sm={3} md={2} lg={2}>
                  <FormLabel className={classes.labelHorizontal} style={{ marginTop: "30px"}}>
                    {t("Tên")}
                    <span style={{ color: 'red' }}>&nbsp;*</span>
                  </FormLabel>
                </GridItem>

                <GridItem xs={7} sm={7} md={8} lg={8}>
                  <Select
                    showSearch
                    style={{ width: 200, marginTop: "30px" }}
                    placeholder={t('Chọn một nhóm sản phẩm')}
                    optionFilterProp="children"
                    value={idSelect}
                    onChange={this.handleSelectChange}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {ProductTypeList.length > 0 ? ProductTypeList.map((ProductType) =>
                      <Option value={ProductType.id} key={ProductType.id}>{t(ProductType.name)}</Option>
                    ) : null}
                  </Select>
                </GridItem>

                <GridItem xs={2} sm={3} md={2} lg={2} style={{ marginTop: "30px" }}>
                  <OhButton 
                    type="exit" 
                    onClick={() => {
                      this.setState({ visibleAddProductType: true })
                    }} 
                    className="button-add-information" 
                    icon={<Icon type="plus" className="icon-add-information" />} 
                  />
                </GridItem>

              </GridContainer>
              {this.state.MessageError ? <p style={{ margin: '0', width: 'inherit', textAlign: 'center', color: 'red' }}>*{t(this.state.MessageError)}</p> : null}
            </form>
          </GridItem>
        </Modal>
      </div>
    );
  }
}

AddProductType.propTypes = propTypes;
export default connect(function (state) {
  return {};
})(withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle
  }))(AddProductType)
));
