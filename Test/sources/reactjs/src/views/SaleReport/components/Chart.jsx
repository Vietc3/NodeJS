
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from "react-i18next";
import ReactEcharts from "echarts-for-react";
import Constants from "variables/Constants/";
import { trans } from "lib/ExtendFunction";

import chartsStyle from "assets/jss/material-dashboard-pro-react/views/chartsStyle.jsx";

const option_bar = {
  title: {
    left: 'center',
  },
  color: ['#3398DB'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {

    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      interval: 0,
    },
    splitLine: {
      show: false
    },
  },
  yAxis:
  {
    type: 'value',
    data: []
  },
  series:
  {
    type: 'bar',
    barWidth: '50%',
    data: []
  }
};


class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSaleReport: [],
      isCheckData: false
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.data.length !== this.props.data.length
      || JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
      || this.props.language !== prevProps.language
      || (this.props.isChangeChart !== prevProps.isChangeChart && this.props.isChangeChart)
    ) {
      this.setState({
        dataSaleReport: this.props.data,
        options: this.props.options,
        selects: this.props.selects
      }, () => {
        this.props.onChangeChart(false)
        this.prepare_bar_option(option_bar)
      })

    }

  }

  prepare_bar_option = option_bar => {
    let dataXAxis = [];
    let dataYAxis = [];
    let { t } = this.props;
    let { dataSaleReport, options, selects } = this.state;

    switch (options) {
      case Constants.OPTIONS_SALE_REPORT.HOUR: {
        for (let item of dataSaleReport) {
          let split = item.time.split(" ");

          dataXAxis.push(`${split[0]}:00\n${split[1]}`);
          dataYAxis.push(selects === Constants.REPORT.Revenue ? item.finalAmount : item.profitAmount)
        }

        break;
      }
      case Constants.OPTIONS_SALE_REPORT.DAY:
      case Constants.OPTIONS_SALE_REPORT.MONTH:
      case Constants.OPTIONS_SALE_REPORT.YEAR: {
        for (let item of dataSaleReport) {
          dataXAxis.push(item.time);
          dataYAxis.push(selects === Constants.REPORT.Revenue ? item.finalAmount : item.profitAmount)
        }

        break;
      }
      case Constants.OPTIONS_SALE_REPORT.PRODUCT: {
        for (let item of dataSaleReport) {
          dataXAxis.push(trans(item.productName, true));
          dataYAxis.push(selects === Constants.REPORT.Revenue ? item.finalAmount : item.profitAmount)
        }

        break;
      }
      case Constants.OPTIONS_SALE_REPORT.USER:
      case Constants.OPTIONS_SALE_REPORT.CUSTOMER: {
        for (let item of dataSaleReport) {
          dataXAxis.push(item.name);
          dataYAxis.push(selects === Constants.REPORT.Revenue ? item.finalAmount : item.profitAmount)
        }

        break;
      }
      default:
        break;
    }

    option_bar.yAxis.name = selects === Constants.REPORT.Revenue ? t("Doanh thu") : t("Lợi nhuận")
    option_bar.xAxis = {
      ...option_bar.xAxis,
      data: dataXAxis,
      axisLabel: {
        ...option_bar.xAxis.axisLabel,
        rotate: dataXAxis.length > 8 ? 50 : 0,
        formatter: (function (value) {
          return dataXAxis.length > 13 ? ""
            : value.length > 16 ? value.slice(0, 16) + "..." : value
        })
      }
    }

    option_bar.series.data = dataYAxis;
    if (this.ref)
      this.ref.getEchartsInstance().setOption(option_bar)
  }

  render() {    
    return (
      <>
        <ReactEcharts
          option={option_bar}
          style={{ height: 360, width: "100%" }}
          ref={(ref) => this.ref = ref}
        />
      </>
    );
  }
}

Charts.propTypes = {
  classes: PropTypes.object
};

export default withTranslation("translations")(withStyles(chartsStyle)(Charts));




