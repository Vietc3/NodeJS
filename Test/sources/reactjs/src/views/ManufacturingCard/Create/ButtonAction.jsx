import React, { Component } from 'react';
import { connect } from "react-redux"
import GridContainer from "components/Grid/GridContainer.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import { withTranslation } from "react-i18next";
import Constants from "variables/Constants";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import { MdSave, MdCancel } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import moment from "moment";
import { trans } from "lib/ExtendFunction";
import ManufacturingCardService from 'services/ManufacturingCardService';
import StoreConfig from 'services/StoreConfig';
import OhButton from 'components/Oh/OhButton';
import { Redirect } from 'react-router-dom';
import { printHtml } from "react-print-tool";
import AlertQuestion from "components/Alert/AlertQuestion";
import ExtendFunction from "lib/ExtendFunction";

class ButtonAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        reason: 1,
        userName: this.props.currentUser.fullName,
        exportedAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        status: 2,
      },
      dataUsers: [],
      dataProducts: [],
      Products: [],
      brsuccess: null,
      brerror: null,
      alert: null,
      isSubmit: false
    };
    this.ohFormRef = null;
  }

  getDataPrintTemplate = async () => {
    let { manufacturingCard } = this.props;
    let dataPrint = {
      created_on: moment(Number(manufacturingCard.createdAt)).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
      order_code: manufacturingCard.code || "",
      recipient_name: "" || "",
      finishedProducts: [],
      materials: [],
      total_quantity: 0,
      total_quantity_material: 0
    };
   
    let { finishedProducts, materials } = manufacturingCard
    
    if ( finishedProducts ) {
      let count = 0;
      for ( let item of finishedProducts ) {
        let name = trans(item.name, true)
        dataPrint = {
          ...dataPrint,
          finishedProducts: dataPrint.finishedProducts.concat({
            line_stt: count+=1,
            line_variant_code: item.code,
            line_variant_name: name ,
            line_quantity: item.quantity
          }),
          total_quantity: dataPrint.total_quantity += item.quantity
        }
      }

    }

    if ( materials) {
      let count = 0;

      for ( let item of materials ) {
        let name = trans(item.name, true)
        dataPrint = {
          ...dataPrint,
           materials: dataPrint.materials.concat({
            line_stt_material: count+=1,
            line_variant_code_material: item.code,
            line_variant_name_material: name,
            line_quantity_material: item.quantity
          }),
          total_quantity_material: dataPrint.total_quantity_material += item.quantity
        }
      }

    }

    try {
      let printTemplate = await StoreConfig.printTemplate({ data: dataPrint, type: "manufacturing_stock" });
      if ( printTemplate.status ) 
      this.setState({ printTemplate: printTemplate.data },
        async () => await printHtml(printTemplate.data)) 
      else throw printTemplate.error
    }
    catch(error) {
      if ( typeof error === "string" ) notifyError(error)
    }
   
  }

  handleSubmit = async () => {
    let { t, manufacturingCard, errorMaterial, cardId, materials, finishedProducts } = this.props;
    if(materials)
      manufacturingCard.materials = materials;
    if(finishedProducts)
      manufacturingCard.finishedProducts = finishedProducts;

    if (!manufacturingCard.finishedProducts || !manufacturingCard.finishedProducts.length) {
      notifyError(t('Chọn thành phẩm cần sản xuất'));
    }

    else if (!manufacturingCard.materials || !manufacturingCard.materials.length) {
      notifyError(t('Chọn nguyên vật liệu để sản xuất'));
    }

    else if (errorMaterial && !cardId) {
      notifyError(t(errorMaterial));
    }

    else {
      let updateManufacturingCard = await ManufacturingCardService.updateManufacturingCard(manufacturingCard);

      if (updateManufacturingCard.status) {

        if(cardId)
          notifySuccess(t("Cập nhật phiếu sản xuất thành công"));
        else
          notifySuccess(t("Tạo phiếu sản xuất thành công"));
        this.setState({
          isSubmit: false,
          redirect: <Redirect to={{ pathname: Constants.ADMIN_LINK + Constants.MANUFACTURING_CARD_LIST}} />
        })
      }
      else {
        this.setState({ isSubmit: false });
        notifyError(updateManufacturingCard.message);
      }
    }
  }

  handleCancel = async (cardId) => {
    const { t } = this.props;
    this.setState({
      alert: (
        <AlertQuestion
          hideAlert={this.hideAlert}
          messege={t("Bạn muốn hủy phiếu sản xuất này?")}
          action={async () => {
            this.hideAlert();
            let cancelManufacturingCard = await ManufacturingCardService.cancelManufacturingCard(cardId);
            
            if (cancelManufacturingCard.status) {
              notifySuccess(t("Hủy phiếu sản xuất thành công"));
              this.setState({
               redirect: <Redirect to={Constants.ADMIN_LINK + Constants.MANUFACTURING_CARD_LIST} />
              })
            }
            else notifyError(cancelManufacturingCard.message)
          }}
          buttonOk={t("Đồng ý")}
        />
      )
    });
  }

  hideAlert = () => {
    
    this.setState(
      {
        alert: null
      },
    );
  };

  render() {
    const { t, cardId, readOnly } = this.props;
    const { isSubmit } = this.state;

    return (
      <CardFooter>

        {this.state.brsuccess}
        {this.state.brerror}
        {this.state.redirect}
        {this.state.alert}
        <GridContainer justify="flex-end" style={{ padding: 10 }}>
          {readOnly ? null :
            <OhButton
              type="add"
              icon={<MdSave />}
              disabled={isSubmit || this.props.loading}
              onClick={() => this.handleSubmit()}
              permission={{
                name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }}
            >
              {t("Lưu")}
            </OhButton>
          }
          {cardId && !readOnly ?
          <>
            <OhButton
              type="add"
              icon={<AiFillPrinter />}
              onClick={() => this.getDataPrintTemplate()}
            >
              {t("In phiếu")}
            </OhButton>
            <OhButton
              type={"delete"}
              icon={<MdCancel />}
              onClick={() => this.handleCancel(cardId)}
              permission={{
                name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }}
            >
              {t("Hủy")}
            </OhButton>
            </>:null
            }
          <OhButton
            type={"exit"}
            icon={<MdCancel />}
            linkTo={Constants.ADMIN_LINK + Constants.MANUFACTURING_CARD_LIST}
          >
            {t("Thoát")}
          </OhButton>
        </GridContainer>
      </CardFooter>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user,
    languageCurrent: state.languageReducer.language
  };
})(withTranslation("translations")(ButtonAction));