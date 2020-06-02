import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
// multilingual
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import "date-fns";
import { ButtonGroup } from "@material-ui/core";
import OhNumberInput from "components/Oh/OhNumberInput";
import Constants from 'variables/Constants/';

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPercent: true,
      discount: 0,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    let value;
    if(prevState.isPercent !== this.state.isPercent){
      if(this.props.discountAmount && this.props.totalAmount){
        if(this.state.isPercent){
          value = Number(this.props.discountAmount/this.props.totalAmount*100).toFixed(2);
        }
        if(!this.state.isPercent){
          value = Number(this.props.discountAmount).toFixed(0);
        }
      }
      this.setState({
        discount: value,
      }, () => this.props.onChangeDiscount(this.state.isPercent, value))
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
        discount: parseInt(this.props.discountAmount),
        isPercent: false
      }, () => this.props.onChangeDiscount(this.state.isPercent, this.props.discountAmount))
    }
  }

  render() {
    const { t, title } = this.props;
    const { isPercent, discount } = this.state;
    return (
      <Card className='CardDiscountPopover'>
        <CardBody >
          <GridContainer justify='center'>
            <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className = 'HeaderForm'>{t(title)}</b>
            </FormLabel>
          </GridContainer>

          <GridContainer>
            <ButtonGroup>
              <ButtonTheme size="sm" className = {!isPercent ? 'buttonGreen' : 'buttonGray'} id="vnd" onClick={() => this.onChangeType(false, discount)}>
                VND
              </ButtonTheme>
              <ButtonTheme size="sm" className = {isPercent ? 'buttonGreen' : 'buttonGray'} id="%" onClick={() => this.onChangeType(true, discount)}>
                %
              </ButtonTheme>
              <OhNumberInput
                autoFocus
                onFocus= {(event) => event.target.select()}
                className='InputPopover'
                onChange={(e) => {
                  let value = 0;
                  if (e && isNaN(ExtendFunction.UndoFormatNumber(e)) === false) {
                    value = parseFloat(ExtendFunction.UndoFormatNumber(e));
                    this.onChangeType(isPercent, value)
                  }
                }}
                onClick={ (e) => {
                  if(parseFloat(e.target.value) === 0)
                    e.target.value = ''
                }}
                onKeyDown={ (e) => {
                  if(e.keyCode === 13) 
                    this.props.onChangeVisible(false)
                }}
                isDecimal={isPercent}
                isNegative={false}
                onBlur={ (e) => {
                  if(e.target.value === '')
                    this.onChangeType(isPercent, 0)
                }}
                defaultValue={discount}
                max={isPercent ? Constants.NUMBER_LENGTH.PERCENT_VALUE : Constants.NUMBER_LENGTH.VALUE}
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
