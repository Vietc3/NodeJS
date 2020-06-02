import React, { Component } from 'react';
import OhForm from 'components/Oh/OhForm';
import ProductTypeService from "services/ProductTypeService";
import { notifyError } from 'components/Oh/OhUtils';
import { Modal } from 'antd';
import { MdCancel ,MdAddCircle} from "react-icons/md";
import OhToolbar from 'components/Oh/OhToolbar';
import { withTranslation } from "react-i18next";

class ModalClickGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProductType: [],
      data: {}
    }
  }
  async componentDidMount() {
    try {
      let getProductTypes = await ProductTypeService.getProductTypes();

      if (getProductTypes.status)
        this.setState({
          ProductType: getProductTypes.data
        })
      else throw getProductTypes.error
    }
    catch (err) {
      if (typeof err === "string") notifyError(err)
      notifyError()
    }
  }

  onChange = (obj) => {
    this.setState({
      data: {...obj}
    })
  }

  render() {
    let { ProductType, data } = this.state;
    let { visible, t } = this.props;

    return (
      <Modal
        title={t("Thêm từ nhóm sản phẩm")}
        visible={visible}
        onCancel={() => this.props.handleCloseModal(false)}
        style={{overflow: "visible"}}       
        footer={[
          <OhToolbar
            key="product-form-toolbar"
            right={[
              {
                type: "button",
                label: t("Thêm vào"),
                onClick: () => {
                  if (this.ohFormRef.allValid()){
                    this.props.transferData(false, data)
                  }
                },
                icon: <MdAddCircle />,
                simple: true,
                typeButton: "add"
              },
              {
                type: "button",
                label: t("Thoát"),
                icon: <MdCancel />,
                onClick: () => this.props.handleCloseModal(false),
                simple: true,
                typeButton: "exit"
              },
            ]}
          />
        ]}
      >
        <OhForm
          defaultFormData={data}
          onRef={ref => this.ohFormRef = ref}
          columns={[
            [
              {
                name: "productTypeId",
                label: t("Nhóm"),
                ohtype: "select",
                validation: "required",
                message: t("Thông tin nhập vào bị lỗi"),
                options: ProductType.map(item => ({ title: item.name, value: item.id, data: item, code : item.code }))
              },
            ]
          ]}
          onChange={obj => this.onChange(obj)}
        />
      </Modal>
    );
  }
}

export default withTranslation("translations")(ModalClickGroup);