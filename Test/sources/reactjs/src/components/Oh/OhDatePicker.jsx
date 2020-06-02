import React,{ Component } from "react";
import { connect } from "react-redux";
import {  DatePicker } from "antd";
import moment from 'moment';
import VN from 'antd/es/date-picker/locale/vi_VN';
import KR from 'antd/es/date-picker/locale/ko_KR';
import EN from 'antd/es/date-picker/locale/en_US';
import _ from 'lodash';
import 'moment/locale/vi';
import 'moment/locale/ko';

class OhDatePicker extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      formatDate: defaultValue || "",
      locale: VN
    }
  }

  componentDidMount(){
    this.changeLanguage()
  }

  changeLanguage(){
    switch(this.props.languageCurrent){
      case 'vn':
        moment.locale('vi')
        this.setState({locale: VN})
        break;
      case 'kr':
        moment.locale('ko')
        this.setState({locale: KR})
        break;
      default:
        moment.locale('en')
        this.setState({locale: EN})
        break;
    }
  }

  sendChange = () => {
    if(this.props.onChange) {
      this.props.onChange(this.state.formatDate)
    }
  }

  handleChangeTime = e => {
    let time = e ? moment(e) : 0
    
    this.setState({ formatDate: time },
      () => this.sendChange()
    );
  };

  componentDidUpdate = (prevProps) => {
    if(prevProps.languageCurrent !== this.props.languageCurrent){
      this.changeLanguage()
    }
    
    if( this.props.defaultValue && !_.isEqual(this.applyDefaultValue(prevProps.defaultValue), this.applyDefaultValue(this.props.defaultValue)) ) {
      this.setState({
        ...this.applyDefaultValue(this.props.defaultValue)
      }, this.sendChange);
    }
  }

  applyDefaultValue = (defaultValue) => {
    return (
      Array.isArray(defaultValue) ? {
        formatDate: defaultValue[0] === 0 ? "" : defaultValue[0]
      } : {
        formatDate: defaultValue === 0 ? "" : defaultValue || moment()
            .startOf("day")
        }
    )
  }

render(){
  const { placeholder, disabled, showTime } = this.props;
  const { formatDate, locale } = this.state;
  
  return (
    <DatePicker
      showTime={showTime}
      style={{ width: '100%' }} 
      locale={locale} 
      disabled = {disabled}
      placeholder={placeholder}
      getCalendarContainer={trigger => trigger.parentNode}
      onOk={this.handleChangeTime} 
      onChange={this.handleChangeTime} 
      value={formatDate && Number(formatDate._i) === 0 ? "" : formatDate} 
      format={showTime ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY"} />
    );
  }
};

export default connect(
  function (state) {
    return {
      languageCurrent: state.languageReducer.language
    };
  }
)(OhDatePicker);
