import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
// multilingual
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import "date-fns";
import Constants from 'variables/Constants/';
import OhNumberInput from "components/Oh/OhNumberInput";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem";
import { ButtonGroup } from "@material-ui/core";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import { notifyError } from 'components/Oh/OhUtils';
import OhCheckBox from "components/Oh/OhCheckbox";

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    let { defaultFormData } = this.props;

    this.state = {
      formData: {
        discountType: defaultFormData.discountType !== Constants.DISCOUNT_TYPES.id.percent ? Constants.DISCOUNT_TYPES.id.VND : defaultFormData.discountType,
        unitPrice: defaultFormData.unitPrice === undefined ? 0 : defaultFormData.unitPrice,
        discount: defaultFormData.discount === undefined ? 0 : defaultFormData.discount,
        sellPrice: defaultFormData.finalAmount === undefined ? 0 : defaultFormData.finalAmount,
      },
    };
  }

  checkMaxDiscount = (discount, discountType, maxDiscount, unitPrice) => {
    const {t} = this.props;
    if(discountType === Constants.DISCOUNT_TYPES.id.percent){
      if(discount > maxDiscount){
        notifyError(t("Chiết khấu tối đa của sản phẩm này là " + maxDiscount + "%"));
        return false;
      }
    }
    else {
      if(discount > maxDiscount * unitPrice / 100){
        notifyError(t("Chiết khấu tối đa của sản phẩm này là " + maxDiscount + "%"));
        return false;
      }
    }
    return true;
  }

  componentDidUpdate = (prevProps, prevState) => {
    let discount;
    const { formData } = this.state;
    const { discountType } = formData;
    const { defaultFormData } = this.props;
    if (prevState.formData.discountType !== discountType && prevState.formData.sellPrice === formData.sellPrice && !formData.isPromoted) {
      if (defaultFormData.unitPrice && defaultFormData.discount) {
        if (discountType === Constants.DISCOUNT_TYPES.id.percent) {
          discount = Number(defaultFormData.discount / defaultFormData.unitPrice * 100);
        }
        if (discountType === Constants.DISCOUNT_TYPES.id.VND) {
          discount = Number(defaultFormData.discount);
        }
        let sellPrice = ExtendFunction.getSellPrice(defaultFormData.unitPrice, discount, discountType, formData.isPromoted)
        this.setState({
          formData: {
            ...this.state.formData, 
            discount: Number(discount),
            sellPrice: sellPrice
          }
        }, () => this.sendChange());
      }
    }
  }

  sendChange = () => {
    if (this.props.onChange) this.props.onChange(this.state.formData)
  }

  onChangeType = (discountType) => {
    this.setState({ formData: {
      ...this.state.formData,
      discountType: discountType,
    }});
  }

  onChangeDiscount = (discount) => {
    let sellPrice = ExtendFunction.getSellPrice(this.state.formData.unitPrice, discount, this.state.formData.discountType, this.state.formData.isPromoted);
    this.setState({ formData: {
      ...this.state.formData,
      discount: discount,
      sellPrice: sellPrice > 0 ? sellPrice : 0
    }}, () => this.sendChange());
  }

  onChangeSellPrice = (sellPrice) => {
    sellPrice = Number(sellPrice); 
    this.setState({ formData: {
      ...this.state.formData,
      discount: this.state.formData.unitPrice - sellPrice,
      discountType: Constants.DISCOUNT_TYPES.id.VND,
      sellPrice: sellPrice
    }}, () => this.sendChange());
  }

  onChangePromoted = (isPromoted) => {
    this.setState({
      formData: {
        ...this.state.formData,
        discount: isPromoted ? 100 : 0,
        sellPrice: isPromoted ? 0 : this.state.formData.unitPrice,
        isPromoted: isPromoted,
    }}, () => this.sendChange())
  }

  render() {
    const { t, isInvoice, defaultFormData } = this.props;
    const { formData } = this.state;
    const { maxDiscount } = defaultFormData;
    let perCent =  formData.discountType === Constants.DISCOUNT_TYPES.id.percent;
    return (
      <Card className='CardPopover'>
        <CardBody xs={12} className='CardBodyPopover'>
          <GridContainer justify='center'>
            <FormLabel>
              <b className='HeaderForm'>{t("Chiết khấu")}</b>
            </FormLabel>
          </GridContainer>

          <GridContainer xs={12} className='GridContentPopover'>
            <GridItem xs={4}>
              <FormLabel className="LabelPopover">
                <b className='ContentForm'>{t("Đơn giá")}</b>
              </FormLabel>
            </GridItem>
            <GridItem xs={8}>
              <OhNumberInput
                style={{marginTop: 5, height: 29, textAlign: 'right' }}
                defaultValue={Math.round(formData.unitPrice) || 0}
                disabled= {true}
                isDecimal={false}
                isNegative={false}
              />
            </GridItem>
          </GridContainer>


          <GridContainer xs={12} className='GridContentPopover'>
            <GridItem xs={4}>
              <FormLabel className="LabelPopover">
                <b className='ContentForm'>{t("Chiết khấu")}</b>
              </FormLabel>
            </GridItem>
            <GridItem xs={8}>
              <ButtonGroup>
              <OhNumberInput
                  style={{marginTop: 5, height: 29, textAlign: 'right' }}
                  onBlur={(e) => {
                    let value = 0;
                    if (isNaN(ExtendFunction.UndoFormatNumber(e.target.value)) === false) {
                      value = parseFloat(ExtendFunction.UndoFormatNumber(e.target.value));
                    }
                    if (e.target.value === "")
                      value = 0;
                      if(this.checkMaxDiscount(value, formData.discountType, maxDiscount, formData.unitPrice))
                    this.onChangeDiscount(value)
                  }}
                  onFocus= {(event) => event.target.select()}
                  max={perCent ? Constants.NUMBER_LENGTH.PERCENT_VALUE : Constants.NUMBER_LENGTH.VALUE}
                  defaultValue={ perCent ? formData.discount : Math.round(formData.discount) || 0}
                  isDecimal={perCent}
                  isNegative={false}
                  disabled= {formData.isPromoted}
                />
                <ButtonTheme size="sm" className={formData.discountType === Constants.DISCOUNT_TYPES.id.VND ? 'buttonGreen' : 'buttonGray'} id="vnd" onClick={() => this.onChangeType(Constants.DISCOUNT_TYPES.id.VND)}>
                  VND
              </ButtonTheme>
                <ButtonTheme size="sm" className={formData.discountType === Constants.DISCOUNT_TYPES.id.percent ? 'buttonGreen' : 'buttonGray'} id="%" onClick={() => this.onChangeType(Constants.DISCOUNT_TYPES.id.percent)}>
                  %
              </ButtonTheme>
              </ButtonGroup>
            </GridItem>
          </GridContainer>

          <GridContainer xs={12} className='GridContentPopover'>
            <GridItem xs={4}>
              <FormLabel className="LabelPopover">
                <b className='ContentForm'>{isInvoice ? t("Giá bán") : t("Giá nhập")}</b>
              </FormLabel>
            </GridItem>
            <GridItem xs={8}>
            <OhNumberInput
                style={{marginTop: 5, height: 29, textAlign: 'right' }}
                onBlur={(e) => {
                  let value = 0;
                  if (isNaN(ExtendFunction.UndoFormatNumber(e.target.value)) === false) {
                    value = parseFloat(ExtendFunction.UndoFormatNumber(e.target.value));
                  }
                  if (e.target.value === "")
                    value = 0;
                    if( this.checkMaxDiscount(formData.unitPrice - value, Constants.DISCOUNT_TYPES.id.VND, maxDiscount, formData.unitPrice))
                  this.onChangeSellPrice(value)
                }}
                autoFocus
                defaultValue={ Math.round(formData.sellPrice) || 0}
                isDecimal={ false}
                isNegative={false}
                disabled = {formData.isPromoted}
              />
            </GridItem>
          </GridContainer>

          <GridContainer xs={12} className='GridContentPopover'>
            <GridItem xs={4}>
              <FormLabel className="LabelPopover">
                <b className='ContentForm'>{t("Khuyến mãi")}</b>
              </FormLabel>
            </GridItem>
            <GridItem xs={8} style={{marginTop: 5}}>
              <OhCheckBox
                options={ [{label: '', value: 1}]}
                onChange={value => this.onChangePromoted(value[0])}
                disabled={maxDiscount < 100}
              />
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    );
  }
}

export default connect()(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProductForm)
  )
);
