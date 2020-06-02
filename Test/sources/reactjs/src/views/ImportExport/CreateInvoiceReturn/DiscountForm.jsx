import React, { Component } from 'react';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
// multilingual
import { withTranslation } from "react-i18next";
import { ButtonGroup } from "@material-ui/core";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import OhNumberInput from 'components/Oh/OhNumberInput';
import Constants from "variables/Constants/";

class DiscountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPercent: true,
      discount: 0,
    };
  }

  onChangeDiscount = value => {
    this.setState({
      discount: value,
    }, () => this.props.onChangeDiscount(this.state.isPercent, value))
  }

  componentDidMount() {
    if ( this.props.isPercent )
      this.setState({ isPercent: this.props.isPercent })
    if ( this.props.discount )
      this.setState({discount: this.props.discount})
  }

  onChangeType = isPercent => {
    let { discountAmount, totalAmount } = this.props;
    let value = 0;

    if(discountAmount && totalAmount){
      if(isPercent){
        value = Number(this.props.discountAmount/this.props.totalAmount*100).toFixed(2);
      }
      if(!isPercent){
        value = Number(this.props.discountAmount).toFixed(0);
      }
    }

    this.setState({
      isPercent,
      discount: value,
    }, () => this.props.onChangeDiscount(isPercent, value))
  }

  render() {
    const { t, title } = this.props;
    const { isPercent, discount } = this.state;
    return (
      <>
        <Card className='CardDiscountPopover'>
          <CardBody>
            <GridContainer justify='center'>
              <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
                <b className = 'HeaderForm'>{t(title)}</b>
              </FormLabel>
            </GridContainer>

            <GridContainer>
              <ButtonGroup>
                <ButtonTheme size="sm" className = {!isPercent ? 'buttonGreen' : 'buttonGray'} id="vnd" onClick={() => this.onChangeType(false)}>
                  VND
                </ButtonTheme>
                <ButtonTheme size="sm" className = {isPercent ? 'buttonGreen' : 'buttonGray'} id="%" onClick={() => this.onChangeType(true)}>
                  %
                </ButtonTheme>
                <OhNumberInput
                  className='InputPopover'
                  onChange={value => {
                    if (value === "") {
                      value = 0;
                    }

                    this.onChangeDiscount(value)                   
                  }}
                  onKeyDown={ (e) => {
                    if(e.keyCode === 13) 
                      this.props.onChangeVisible(false)
                  }}
                  autoFocus
                  onFocus= {(event) => event.target.select()}
                  defaultValue={discount}
                  isDecimal={isPercent}
                  isNegative={false}
                  max={isPercent ? Constants.NUMBER_LENGTH.PERCENT_VALUE : Constants.NUMBER_LENGTH.VALUE}
                />
              </ButtonGroup>
            </GridContainer>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default (withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle
  }))(DiscountForm)));