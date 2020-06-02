import FormLabel from "@material-ui/core/FormLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import { Tooltip, Tag } from "antd";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import moment from 'moment';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Col, Container, Row, setConfiguration } from "react-grid-system";
import { withTranslation } from "react-i18next";
import { AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import SimpleReactValidator from "simple-react-validator";
import Constants from 'variables/Constants/';
import "./index.scss";
import OhCheckbox from "./OhCheckbox";
import OhDateTimePicker from "./OhDateTimePicker";
import OhInput from "./OhInput";
import OhLabel from "./OhLabel";
import OhLink from "./OhLink";
import OhNumberInput from "./OhNumberInput";
import OhRadio from "./OhRadio";
import OhSelect from "./OhSelect";
import OhTextArea from "./OhTextArea";
import OhDatePicker from "./OhDatePicker";
import {notifyError } from 'components/Oh/OhUtils';
import _ from 'lodash';
import OhMultiChoice from "./OhMultiChoice";

import { ButtonGroup } from "@material-ui/core";
import ButtonTheme from "components/CustomButtons/Button.jsx";

setConfiguration({ gridColumns: 100 });

class OhForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.defaultFormData || {},
    }
    
    this.validator = new SimpleReactValidator({
      messages: Constants.VALIDATION_MESSAGE
    });
    if(this.props.onRef) this.props.onRef(this);
    this.errorMessages = {};
  }
  
  allValid = () => {
    let {t} = this.props;
    if (!this.validator.allValid()) {
      this.validator.showMessages();
      this.forceUpdate();
      let myNewArray = [].concat.apply([], this.props.columns)
      
      _.forEach(myNewArray,item=>{
        if ( this.validator.errorMessages[item.name]){
          // notifyError(item.message ||  this.validator.errorMessages[item.name]);
          notifyError(item.message ||  t("Không thể lưu vì thiếu hoặc sai một số thông tin bắt buộc"));
          return false;
        }
      })
    }
    this.errorMessages = this.validator.errorMessages;
    return this.validator.allValid();
  }
  
  onChange = (obj, record = {}) => {
    Object.keys(obj).map(item => {
      if(record.onChange) record.onChange(obj[item], obj);
      this.validator.showMessageFor(item);
      return null;
    });
    if(this.props.onChange) this.props.onChange({...this.props.defaultFormData, ...obj});
  }
  
  sendChange = () => {
    if(this.props.onChange) this.props.onChange({...this.state.formData})
  }

  renderCustom = (input) => {
    const { defaultFormData } = this.props;
    const { render } = input;

    return render ? render(defaultFormData) : null;
  }

  renderInput = (input) => {
    const { defaultFormData } = this.props;
    const { placeholder, name, disabled, type, onClick, onFocus, readOnly, autoFocus, onKeyDown, onKeyUp, className } = input;

    return (
      <OhInput 
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultFormData[name]}
        onChange={value => this.onChange({[name]: value}, input)}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        className={className}
      />
    );
  }

  renderInputNumber = (input) => {
    const { defaultFormData } = this.props;
    const { placeholder, name, disabled, onClick, onFocus, readOnly, onKeyDown, onKeyUp, className, autoFocus, isNegative, isDecimal, size, max, integer} = input;

    return (
      <OhNumberInput 
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        defaultValue={defaultFormData[name]}
        onChange={value => this.onChange({[name]: value}, input)}
        onClick={onClick}
        onFocus={onFocus}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        className={className}
        isNegative={isNegative}
        isDecimal={isDecimal}
        size={size}
        max={max}
        integer={integer}
      />
    );
  }

  renderTextarea(input) {
    const {minRows, maxRows, placeholder, name, disabled, onClick, onFocus, readOnly} = input;
    const {defaultFormData} = this.props;

    return (
      <OhTextArea 
        minRows={minRows}
        maxRows={maxRows}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={value => this.onChange({[name]: value}, input)}
        defaultValue={defaultFormData[name]}
        onClick={onClick}
        onFocus={onFocus}
      />
    );
  }

  renderSwitchInput(input) {
    const {name, options, disabled, optionName} = input;
    const {defaultFormData} = this.props;

    return (
      <ButtonGroup style={{width: '100%'}}>
        <OhNumberInput
          defaultValue={defaultFormData[name]}
          style={{marginTop: 5, height: 29, textAlign: 'right' }}
          onChange={value => {
            this.onChange({[name]: value}, input);
          }}
          onFocus={(e) => {
            e.target.select()
          }}
          isDecimal={false}
          onClick={(e) => {
            e.target.select()
          }}
          disabled={disabled}
        />
        {
          options.map((item, index) => {
            return (
              <ButtonTheme disabled={disabled} key={'switch_' + index} color={'success'} size="sm" className = {defaultFormData[optionName] === item.value ? 'buttonGreen' : 'buttonGray'} onClick={() => this.onChange({[optionName]: item.value}, input)}>
                {item.title}
              </ButtonTheme>
            );
          })
          
        }
      </ButtonGroup>
    );
  }

  renderLabel(input) {
    const {name, format, align} = input;
    const {defaultFormData} = this.props;

    return (
      <OhLabel
        align={align}
        defaultValue={format ? format(defaultFormData[name], input) : defaultFormData[name]}
      />
    );
  }

  renderLink (input) {
    const {name, format, linkTo, onClick} = input;
    const {defaultFormData} = this.props;
    
    return (
      <OhLink
        defaultValue={format ? format(defaultFormData[name], input) : defaultFormData[name]}
        linkTo={linkTo}
        onClick={onClick}
      />
    );
  }

  renderSelect(input, multi = false) {
    const {placeholder, options, name, disabled, className, onChange, open, onRef} = input;
    const {defaultFormData} = this.props;

    return (
      <OhSelect
        placeholder={placeholder}
        onChange={(value, record) => {
            this.select = {
              ...(this.select || {}),
              name: {value, record}
            }
            if(onChange) onChange(value, record);
            this.onChange({ [name]: value });
          }
        }
        defaultValue={defaultFormData[name]}
        options={options}
        disabled={disabled}
        className={className}
        open={open}
        onRef={onRef}
      />
    );
  }

  renderSelectMutilChoice(input) {
    const {placeholder, options, name, disabled, className, onChange} = input;
    const {defaultFormData} = this.props;

    return (
      <OhMultiChoice
        placeholder={placeholder}
        onChange={(value, record) => {
            this.select = {
              ...(this.select || {}),
              name: {value, record}
            }
            if(onChange) onChange(value, record);
            this.onChange({ [name]: value });
          }
        }
        defaultValue={defaultFormData[name]}
        dataSourcePType={options}
        disabled={disabled}
        className={className}
      />
    );
  }

  renderCheckbox(input) {
    const { options, isHorizontal, name, disabled, hasCheckAll } = input;
    const {defaultFormData} = this.props;

    return (
      <OhCheckbox 
        isHorizontal={isHorizontal}
        options={options}
        disabled={disabled}
        hasCheckAll={hasCheckAll}
        defaultValue={defaultFormData[name]}
        onChange={(value, record) =>
          this.onChange({ [name]: value }, input)
        }
        key={'OhCheckbox_' + name}
      />
    );
  }

  renderRadio(input) {
    const { options, name, isHorizontal, ...res } = input;
    const {defaultFormData} = this.props;

    return (
      <OhRadio
        options={options}
        isHorizontal = {isHorizontal}
        defaultValue={defaultFormData[name]}
        onChange={(value, record) => this.onChange({ [name]: value }, input)}
        {...res}
      />
    );
  }

  renderDatePicker(input) {
    const {name, formatDateTime, disabled, placeholder, showTime} = input;
    const {defaultFormData} = this.props;
    
    return (
      <OhDatePicker 
        showTime={showTime}
        defaultValue={formatDateTime ? moment(defaultFormData[name], formatDateTime) : defaultFormData[name]}
        placeholder={placeholder}
        format={Constants.DISPLAY_DATE_TIME_FORMAT_STRING}
        onChange={value => this.onChange({[name]: formatDateTime ? moment(value).format(formatDateTime) : value}, input)}
        disabled = {disabled}
      />
    );
  }

  renderDateRangePicker(input) {
    const {name, formatDateTime, disabled} = input;
    const {defaultFormData} = this.props;
    
    return (
      <OhDateTimePicker 
        disabled={disabled}
        defaultValue={formatDateTime ? moment(defaultFormData[name], formatDateTime) : defaultFormData[name]}
        format={Constants.DISPLAY_DATE_TIME_FORMAT_STRING}
        onChange={value => this.onChange({[name]: formatDateTime ? moment(value).format(formatDateTime) : value}, input)}
      />
    );
  }

  renderDateTimePicker(input) {
    const {name, formatDateTime, disabled} = input;
    const {defaultFormData} = this.props;

    return (
      <OhDateTimePicker 
        singleDatePicker
        timePicker
        disabled={disabled}
        defaultValue={formatDateTime ? moment(defaultFormData[name], formatDateTime) : defaultFormData[name]}
        format={Constants.DISPLAY_DATE_TIME_FORMAT_STRING}
        onChange={value => this.onChange({[name]: formatDateTime ? moment(value).format(formatDateTime) : value}, input)}
      />
    );
  }
  
  renderType = (input) => {
    switch (input.ohtype) {
      case "custom":
        return this.renderCustom(input);
      case "input":
        return this.renderInput(input);
      case "input-number":
        return this.renderInputNumber(input);
      case "textarea":
        return this.renderTextarea(input);
      case "switch-input":
        return this.renderSwitchInput(input);
      case "label":
        return this.renderLabel(input);
      case "link":
        return this.renderLink(input);
      case "select":
        return this.renderSelect(input);
      case "multiselect":
        return this.renderSelect(input, true);
      case "checkbox":
        return this.renderCheckbox(input);
      case "radio":
        return this.renderRadio(input);
      case "date-picker":
        return this.renderDatePicker(input);
      case "date-time-picker":
        return this.renderDateTimePicker(input);
      case "select-multi-choice":
        return this.renderSelectMutilChoice(input);
      default:
        return null;
    }
  }

  renderColumn = (column) => {
    const { t, classes, defaultFormData, labelRow, hasHelpText } = this.props;

    return column.map((item, index) => {
      if(item && item.customType) return item.customType.render;
      else if(item) {
        let {name, validation, label, helpText, ohtype, button, rowClassName ,labelClassName, isNoneLabel, style, tooltipClassName } = item;
        label = typeof label === 'string' ? t(label) : label;
        let validationMessage = validation ?  (this.validator.message(name, defaultFormData[name], validation) || undefined) : undefined;        
        validationMessage = validationMessage ? validationMessage.props.children : undefined;
        let widthLabel = item.labelRow ? item.labelRow : labelRow ? labelRow : 25;
        return ohtype ? (
          <Row className={"oh-row"} key={`row_${index}`} style={style}>
            {isNoneLabel ? null :
            widthLabel && <Col className={"oh-col"} xs={100} sm={widthLabel}>
              {label && 
                <FormLabel className={[classes.labelHorizontal, labelClassName ].join(' ')} style={{position: 'relative'}}>
                  {t(label)}: {(validation && validation.includes('required')) && <span className={'oh-required-icon'}>&nbsp;*</span>}
                </FormLabel>
              }
            </Col>
            }
            <Col className={["oh-col", rowClassName].join(' ')}>
              {this.renderType(item)}
            </Col>
            {button ?
              <Col className={"oh-button-col"}>
                {button}
              </Col> : null}
              {(hasHelpText === undefined || hasHelpText) && <Col className={"oh-col oh-tooltip-col"}>
              {helpText || validationMessage ? (
                <Tooltip placement="right" title={t(validationMessage) || t(helpText)} arrowPointAtCenter>
                  {validationMessage ? <AiOutlineWarning style={{color: 'red'}} className={["oh-tooltip", tooltipClassName ].join(' ')}/> : <AiOutlineInfoCircle className={["oh-tooltip", tooltipClassName ].join(' ')}/>}
                </Tooltip>
              ) : null}
            </Col>
            }
          </Row>
        ) : null;
      }
      else return null;
    });
  }

  render() {
    const { title, columns, tag, t, style } = this.props;

    return (
      <Container className={"react-grid-system-container"} style={style}>
        {title && (
          <Row className={"oh-row"}>
            <FormLabel className="ProductFormAddEdit">
              <b className="HeaderForm">{typeof title === 'string' ? t(title) : title}</b>{tag ? <Tag color="#f50" className="tag-oh-form" >{typeof tag === 'string' ? t(tag) : tag}</Tag> : null}
            </FormLabel>
          </Row>
        )}
        <Row className={"oh-row"}>
          {columns.map((item, index) => (
            item ? <Col xs={100} sm={100/columns.length} key={`col_${index}`} >{this.renderColumn(item)}</Col> : null
          ))}
        </Row>
      </Container>
    );
  }
}

OhForm.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.array.isRequired,
  errors: PropTypes.object
};

export default connect(state => {
  return {
    language: state.languageReducer.language
  };
})(withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle,
    ...extendedTablesStyle,
    ...buttonsStyle
  }))(OhForm)
));


