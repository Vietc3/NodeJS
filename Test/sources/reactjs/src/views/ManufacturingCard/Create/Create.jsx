import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from "react-i18next";
import Constants from 'variables/Constants/';
import "date-fns";
import CardInfo from "./CardInfo";
import FinishedProduct from "./FinishedProduct";
import ButtonAction from "./ButtonAction";
import moment from "moment";
import ManufacturingCardService from 'services/ManufacturingCardService';
import { notifyError } from "components/Oh/OhUtils";
import ProductUnitService from 'services/ProductUnitService';

class CreateManufacturingCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manufacturingCard: {
        notes: '',
        status: 1,
        createdAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        userName: this.props.currentUser.fullName,
      },
      brsuccess: null,
      brerror: null,
      errorMaterial: '',
      isGetMaterialFormular: false,  //biến kiểm tra để lấy nguyên vật liệu theo công thức
      isEdit: this.props.match.params.id !== undefined,
      isCancel: false,
      loading: false
    };
    this.ohFormRef = null;
  }

  componentDidMount = () => {
    this.getDataEdit();
  }

  getDataEdit = async () => {
    if (this.props.match && this.props.match.params && this.props.match.params.id) {
      try {
        let getManufacturingCard = await ManufacturingCardService.getManufacturingCard(this.props.match.params.id);
        if (getManufacturingCard.status) {
          let { data } = getManufacturingCard;
          this.getCardInfo(data);
        }
        else throw getManufacturingCard.error;
      }
      catch (error) {
        if (typeof error === "string") notifyError(error)
      }
    }

    if (this.props.location && this.props.location.state) {
      this.setFinishedProduct(this.props.location.state);
    }
  }


  getCardInfo = async (data) => {
    let { finishedProducts, materials } = data;

    let getProductUnits = await ProductUnitService.getProductUnits();

    for (let i in materials) {
      for (let j in getProductUnits.data) {
        if (materials[i].productId.unitId === getProductUnits.data[j].id) {
          materials[i].unit = getProductUnits.data[j].name;
          break;
        }
      }

      finishedProducts.map(item => {
        item.id = item.productId.id
        for (let j in getProductUnits.data) {
          if (item.productId.unitId === getProductUnits.data[j].id) {
            item.unitId = {name: getProductUnits.data[j].name}
            break;
          }
        }
      })

      materials[i].id = materials[i].productId.id;
      materials[i].manufacturingQuantity = materials[i].productId.manufacturingQuantity;
      materials[i].oldQuantity = 0;
      delete materials[i].createdAt;
      delete materials[i].updatedAt;
      delete materials[i].productId;
      delete materials[i].manufacturingCardId;
    }

    this.setState({
      manufacturingCard: {
        ...data.manufacturingCard,
        createdAt: moment(data.manufacturingCard.createdAt).format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        userName: data.manufacturingCard.createdBy.fullName,
        code: data.manufacturingCard.code,
        finishedProducts: finishedProducts,
        editProducts: finishedProducts,
        materials: materials,
        editMaterials: materials
      },
      isCancel: data.manufacturingCard.status === Constants.MANUFACTURING_STATUS.CANCELLED
    })
  }

  setFinishedProduct = (products) => {
    let productArray = Object.values(products);
    let finishedProducts = [];

    productArray.forEach((item) => {
      let finishedProduct = {
        ...item.record,
        quantity: item.value
      };
      finishedProducts.push(finishedProduct);
    })

    this.setState({
      manufacturingCard: {
        ...this.state.manufacturingCard,
        finishedProducts: finishedProducts
      },
      isGetMaterialFormular: true
    })
  }

  render() {
    const { manufacturingCard, errorMaterial, isGetMaterialFormular, isCancel, isEdit, loading } = this.state;
    const cardId = this.props.match && this.props.match.params && this.props.match.params.id ? this.props.match.params.id : null;
    const readOnly = manufacturingCard.status === Constants.MANUFACTURE_CARD_STATUS.CANCELLED ? true : false;

    return (
      <>
        <CardInfo
          cardInfo={{
            createdAt: manufacturingCard.createdAt,
            notes: manufacturingCard.notes,
            status: manufacturingCard.status,
            userName: manufacturingCard.userName,
            code: manufacturingCard.code
          }}
          readOnly={readOnly}
          onChangeCardInfo={(cardInfo) => {
            this.setState({
              manufacturingCard: {
                ...manufacturingCard,
                code: cardInfo.code,
                notes: cardInfo.notes,
                status: cardInfo.status,
                createdAt: cardInfo.createdAt
              }
            })
          }}
        />
        <Card>
          <CardBody>
            <FinishedProduct
              cardId = {cardId}
              manufacturingCard = {manufacturingCard}
              finishedProducts = {cardId ? manufacturingCard.editProducts : manufacturingCard.finishedProducts}
              materials = {manufacturingCard.editMaterials}
              isGetMaterialFormular = {isGetMaterialFormular}
              readOnly = {readOnly}
              isEdit = {isEdit}
              isCancel = {isCancel}
              onChangeQuantityProducts={(finishedProducts) => {
                this.setState({
                  finishedProducts: finishedProducts
                })
              }}
              onChangeLoading={isloading => this.setState({ loading: isloading })}
              onChangeMaterial={(materials) => {
                this.setState({
                  materials: materials
                })
              }}

              showError={(error) => {
                this.setState({
                  errorMaterial: error
                })
              }}
            />

            <ButtonAction
              manufacturingCard={manufacturingCard}
              materials={this.state.materials}
              finishedProducts={this.state.finishedProducts}
              errorMaterial={errorMaterial}
              cardId={cardId}
              readOnly={readOnly}
              getData={this.getDataEdit}
              loading={loading}
            />
          </CardBody>
        </Card>
      </>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user
  };
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(CreateManufacturingCard)
  )
);
