import { Icon, Input } from "antd";
import "bootstrap-daterangepicker/daterangepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import "date-fns";
import _ from 'lodash';
import moment from "moment";
import React, { Component } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Constants from "variables/Constants/";
import { withTranslation } from "react-i18next";

class OhDateTimePicker extends Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;

    this.state = {
      ...this.applyDefaultValue(defaultValue)
    }
    this.DISPLAY_DATE_FORMAT_STRING = this.props.format || Constants.DISPLAY_DATE_FORMAT_STRING;
  }

  applyDefaultValue = (defaultValue) => {
    return (
      Array.isArray(defaultValue) ? {
        startTime: defaultValue[0],
        endTime: defaultValue[1],
      } : {
          startTime: defaultValue || moment()
            .startOf("day"),
          endTime: defaultValue || moment()
            .endOf("day")
        }
    )
  }

  componentDidUpdate = (prevProps) => {
    if( this.props.defaultValue && !_.isEqual(this.applyDefaultValue(prevProps.defaultValue), this.applyDefaultValue(this.props.defaultValue)) ) {
      this.setState({
        ...this.applyDefaultValue(this.props.defaultValue)
      });
    }
  }
  
  sendChange = () => {
    if(this.props.onChange) {
      this.props.onChange(
        this.state.startTime,
        this.state.endTime,
        this.getInputString()
      )
    }
  }

  handleChangeTime = a => {
    const { startTime, endTime } = this.state;
    const start = moment(a.startDate._d);
    const end = moment(a.endDate._d);

    if (!(startTime.isSame(start) && endTime.isSame(end))) {
      this.setState(
        {
          startTime: start,
          endTime: end,
        },
        () => this.sendChange()
      );
    }
  };

  getInputString = () => {
    const { startTime, endTime } = this.state;
    const { singleDatePicker } = this.props;
    let displayStartTime = moment(startTime).format(this.DISPLAY_DATE_FORMAT_STRING);
    let displayEndTime = moment(endTime).format(this.DISPLAY_DATE_FORMAT_STRING);
    return (singleDatePicker || displayStartTime === displayEndTime) ? `${displayStartTime}` : `${displayStartTime} - ${displayEndTime}`;
  };

  render() {
    const { t, singleDatePicker, timePicker, disabled} = this.props;
    const ranges = {
      [t('Hôm nay')]: [moment().startOf('day'), moment().endOf('day')],
      [t('Hôm qua')]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      [t('7 ngày trước')]: [moment().subtract(6, 'days'), moment()],
      [t('30 ngày trước')]: [moment().subtract(29, 'days'), moment()],
      [t('Tháng này')]: [moment().startOf('month'), moment().endOf('month')],
      [t('Tháng trước')]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    };
    const locale = {
      format: "DD/MM/YYYY",
      separator: " - ",
      applyLabel: t("Xác nhận"),
      cancelLabel: t("Hủy"),
      fromLabel: t("Từ"),
      toLabel: t("Đến"),
      customRangeLabel: t("Tùy chọn"),
      daysOfWeek: [t("CN"), t("T2"), t("T3"), t("T4"), t("T5"), t("T6"), t("T7")],
      monthNames: [
        t("Tháng 1") + " -",
        t("Tháng 2") + " -",
        t("Tháng 3") + " -",
        t("Tháng 4") + " -",
        t("Tháng 5") + " -",
        t("Tháng 6") + " -",
        t("Tháng 7") + " -",
        t("Tháng 8") + " -",
        t("Tháng 9") + " -",
        t("Tháng 10") + " -",
        t("Tháng 11") + " -",
        t("Tháng 12") + " -"
      ]
    };

    let input = (
      <Input
        addonAfter={<Icon type="calendar" />}
        value={this.getInputString()}
        disabled={disabled}
      />
    );

    if(disabled) return input;
    else
      return (
        <DateRangePicker
          key={t("Hôm nay")}
          ranges={ranges}
          locale={locale}
          onApply={(e, a) => this.handleChangeTime(a)}
          alwaysShowCalendars
          autoApply
          autoUpdateInput
          singleDatePicker={singleDatePicker}
          timePicker={timePicker}
        >{input}</DateRangePicker>
      );
  }
}
export default withTranslation("translations")(
  OhDateTimePicker
);
