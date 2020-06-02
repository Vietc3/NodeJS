import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import Constants from "variables/Constants/";

// multilingual
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import "date-fns";
import { ButtonGroup } from "@material-ui/core";
import OhNumberInput from "components/Oh/OhNumberInput";

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.onRef) this.props.onRef(this);    
    this.state = {
      isPercent: true,
      discount: 0,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    let value = 0;

    if(prevState.isPercent !== this.state.isPercent){

      if(this.props.discountAmount && this.props.totalAmount || this.props.totalAmount !== prevProps.totalAmount){
        value= this.getDiscountValue(this.state.isPercent);

      }
      this.setState({
        discount: value,
      }, () => this.props.onChangeDiscount(this.state.isPercent, value))
    }

    if (this.props.discountAmount !== prevProps.discountAmount) {
        let value = this.getDiscountValue();
        this.setState({
          discount: value,
      })    
    }

  }

  onChangeType = (isPercent, value) => {
    this.setState({
      isPercent: isPercent,
      discount: value,
    }, () => this.props.onChangeDiscount(isPercent, value))
  }

  componentDidMount = () => {
    if(this.props.discountAmount){      
      this.setState({
        discount: Math.round(this.props.discountAmount / this.props.totalAmount * 10000) / 100,
        isPercent: true
      })
    }
  }
  
  getDiscountValue = (isPercent) => {
    let value = 0;

    if (this.props.discountAmount && this.props.totalAmount) {
      if (isPercent !== undefined ? isPercent : this.state.isPercent) {
        value = Math.round(this.props.discountAmount / this.props.totalAmount * 10000) / 100;
      } else {
        value =  Math.round(Number(this.props.discountAmount));
      }
    }
    return value;
  }

  render() {
    const { t, title } = this.props;
    const { isPercent, discount } = this.state;

    return (
      <Card className='CardDiscountPopover'>
        <CardBody >
          <GridContainer justify='center'>
            <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className='HeaderForm'>{t(title)}</b>
            </FormLabel>
          </GridContainer>

          <GridContainer>
            <ButtonGroup>
              <ButtonTheme size="sm" className={!isPercent ? 'buttonGreen' : 'buttonGray'} id="vnd" onClick={() => this.onChangeType(false, discount)}>
                VND
              </ButtonTheme>
              <ButtonTheme size="sm" className={isPercent ? 'buttonGreen' : 'buttonGray'} id="%" onClick={() => this.onChangeType(true, discount)}>
                %
              </ButtonTheme>
              <OhNumberInput
                autoFocus ={true}
                onFocus={(event) => {
                  this.onFocus = true;
                  event.target.select();
                }}
                onBlur={(event) => {
                  this.onFocus = false;
                  event.target.select();
                }}
                className='InputPopover'
                onChange={(e) => {
                  this.onChangeType(isPercent, e)
                }}
                onKeyDown={(e) => { 
                  if(e.keyCode === 13) 
                  this.props.onChangeVisible(false);
                  }
                }
                onClick={(e) => {
                  if (parseFloat(e.target.value) === 0){
                    e.target.value = ''
                  }
                }}
                isDecimal={isPercent}
                isNegative={false}
                defaultValue={discount}
                max={isPercent ? Constants.NUMBER_LENGTH.PERCENT : Constants.NUMBER_LENGTH.VALUE}
                onRef ={ ref => this.ohnumberinputRef = ref}
              />
            </ButtonGroup>
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
