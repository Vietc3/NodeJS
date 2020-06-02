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
import Constants from "variables/Constants/";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem";
import { ButtonGroup } from "@material-ui/core";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import OhCheckBox from "components/Oh/OhCheckbox";
import { notifyError } from 'components/Oh/OhUtils';
import OhNumberInput from "components/Oh/OhNumberInput";

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    let { defaultFormData } = this.props;

    this.state = {
      formData: {
        discountType: defaultFormData.discountType !== Constants.DISCOUNT_TYPES.id.percent ? Constants.DISCOUNT_TYPES.id.VND : defaultFormData.discountType,
        importPrice: defaultFormData.unitPrice === undefined ? 0 : defaultFormData.unitPrice,
        discount: defaultFormData.discount === undefined ? 0 : defaultFormData.discount,
      },
    };
    this.prevDiscountType = this.state.formData.discountType;
  }

  sendChange = () => {
    if (this.props.onChange) this.props.onChange(this.state.formData)
  }
  
  onChange = (value, name) => {
    let {formData} = this.state;
    
    if(name === 'isPromoted'){
      if(value){
        formData.saveDiscount = formData.discount;
        formData.saveDiscountType = formData.discountType;
      }
        formData.discount = value ? 100 : formData.saveDiscount;
        formData.discountType = value ? Constants.DISCOUNT_TYPES.id.percent : formData.saveDiscountType;
    }
    this.setState({
      formData: {
        ...formData,
        [name]: value,
      }
    }, () => this.sendChange())
  }

  onChangeType = (value) => {
    let {formData} = this.state;
    let discount = 0, discountAmount = 0;
    if(value !== formData.discountType){
      if(value === Constants.DISCOUNT_TYPES.id.percent){
        discount = formData.discount / formData.importPrice * 100;
      }
      else{
        discount = formData.discount * formData.importPrice / 100;
      }
    }
    this.setState({
      formData: {
        ...formData,
        discount,
        discountType: value,
        discountAmount
      }
    }, () => this.sendChange())
  }

  render() {
    const { t } = this.props;
    const { formData } = this.state;
    let perCent =  formData.discountType === Constants.DISCOUNT_TYPES.id.percent;
    return (
      <Card className='CardPopover'>
        <CardBody xs={12} className='CardBodyPopover'>
          <GridContainer justify='center'>
            <FormLabel>
              <b className='HeaderForm'>{t("Giá nhập")}</b>
            </FormLabel>
          </GridContainer>

          <GridContainer xs={12} className='GridContentPopover'>
            <GridItem xs={4}>
              <FormLabel className="LabelPopover">
                <b className='ContentForm'>{t("Giá nhập")}</b>
              </FormLabel>
            </GridItem>
            <GridItem xs={8}>
              <OhNumberInput
                autoFocus
                style={{marginTop: 5, height: 29, textAlign: 'right' }}
                defaultValue={ Math.round(formData.importPrice) || 0}
                isDecimal={ false}
                isNegative={false}
                disabled = {formData.isPromoted}
                onChange={(value) => {
                  this.onChange(value, 'importPrice')
                }}
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
                  onChange={(value) => {
                    this.onChange(value, 'discount')
                  }}
                  onFocus= {(event) => event.target.select()}
                  max={perCent ? Constants.NUMBER_LENGTH.PERCENT_VALUE : Constants.NUMBER_LENGTH.VALUE}
                  defaultValue={ perCent ? formData.discount : Math.round(formData.discount) || 0}
                  isDecimal={true}
                  isNegative={false}
                  disabled= {formData.isPromoted}
                />
                <ButtonTheme size="sm" className={formData.discountType === Constants.DISCOUNT_TYPES.id.VND ? 'buttonGreen' : 'buttonGray'} id="vnd" onClick={() => this.onChangeType(Constants.DISCOUNT_TYPES.id.VND)}>
                  VND
              </ButtonTheme>
                <ButtonTheme size="sm" className={perCent ? 'buttonGreen' : 'buttonGray'} id="%" onClick={() => this.onChangeType(Constants.DISCOUNT_TYPES.id.percent)}>
                  %
              </ButtonTheme>
              </ButtonGroup>
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
                onChange={value => this.onChange(value[0], 'isPromoted')}
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
