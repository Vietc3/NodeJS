import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import withStyles from "@material-ui/core/styles/withStyles";
import moment from 'moment';
import statisticStyle from "assets/jss/material-dashboard-pro-react/views/statisticStyle.jsx";
import ReactEcharts from 'echarts-for-react';

const option_line = {
  title: {
    left: 'center',
  },
  color: ['#3398DB'],
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    },
    right: 40,
    top: 20
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '9%',
    right: '12%',
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
  yAxis: {
    splitLine: {
      show: false
    },
    type: "value"
  },
  series: {
    type: 'bar',
    barWidth: '50%',
    data: []
  },
};

const defaultTotal = {
  "Thu": 0,
  "Chi": 0
};

class ChartDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: moment().startOf('day'),
      end: moment().endOf('day'),
      dataSource: [],
      InvoiceReturn: []
    };
    this.total = JSON.parse(JSON.stringify(defaultTotal));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataSource.length !== this.props.dataSource.length
      || prevProps.language !== this.props.language
      || prevProps.InvoiceReturn.length !== this.props.InvoiceReturn.length
      || JSON.stringify(prevProps.dataSource) !== JSON.stringify(this.props.dataSource)
      || JSON.stringify(prevProps.InvoiceReturn) !== JSON.stringify(this.props.InvoiceReturn)  
      || (this.props.dateTime !== {} && (this.props.dateTime.start !== prevProps.dateTime.start
        || this.props.dateTime.end !== prevProps.dateTime.end))) {

      this.setState({
        dataSource: this.props.dataSource,
        from: this.props.dateTime.start,
        end: this.props.dateTime.end,
        InvoiceReturn: this.props.InvoiceReturn
      }, () => this.prepare_line_option(option_line))

    }
  }

  componentDidMount() {
    this.prepare_line_option(option_line)
  }

  getFormatTime(value) {
    let valueDate = (this.state.end - this.state.from) / (3600 * 24 * 1000);

    if (valueDate <= 1) {
      return moment(value).format("HH:mm")
    }
  }

  prepare_line_option = (option) => {
    const { t } = this.props;
    let { dataSource, from, end, InvoiceReturn } = this.state;
    let tempData = {};
    tempData["Thu"] = {};

    let valueDate = (end - from) / (3600 * 24 * 1000);

    option.yAxis = {
      ...option.yAxis,
      type: 'value',
      name: t('Doanh thu') + ' (VND)',
    }

    option.toolbox.feature.dataZoom.title = {
      zoom: t('Vui lòng chọn khu vực để phóng to'),
      back: t('Quay lại')
    }

    option.toolbox.feature.restore.title = t('Khôi phục')
    option.toolbox.feature.saveAsImage.title = t('Lưu dưới dạng hình ảnh')
    option.title.text = t('Doanh thu bán hàng');

    this.total = JSON.parse(JSON.stringify(defaultTotal));

    for (let item of dataSource) {

      if (valueDate <= 3) {
        this.total["Thu"] = tempData["Thu"][moment(item.createdAt).format("HH DD/MM")]
          ? tempData["Thu"][moment(item.createdAt).format("HH DD/MM")] + item.finalAmount : item.finalAmount;

        tempData["Thu"][moment(item.createdAt).format("HH DD/MM")]
          = tempData["Thu"][moment(item.createdAt).format("HH DD/MM")] || 0;
        tempData["Thu"][moment(item.createdAt).format("HH DD/MM")] = this.total["Thu"];

      } else if (valueDate <= 31) {
        this.total["Thu"] = tempData["Thu"][moment(item.createdAt).format("DD/MM")]
          ? tempData["Thu"][moment(item.createdAt).format("DD/MM")] + item.finalAmount : item.finalAmount;

        tempData["Thu"][moment(item.createdAt).format("DD/MM")]
          = tempData["Thu"][moment(item.createdAt).format("DD/MM")] || 0;
        tempData["Thu"][moment(item.createdAt).format("DD/MM")] = this.total["Thu"];

      } else if (valueDate <= 1068) {
        this.total["Thu"] = tempData["Thu"][moment(item.createdAt).format("MM/YYYY")]
          ? tempData["Thu"][moment(item.createdAt).format("MM/YYYY")] + item.finalAmount : item.finalAmount;

        tempData["Thu"][moment(item.createdAt).format("MM/YYYY")]
          = tempData["Thu"][moment(item.createdAt).format("MM/YYYY")] || 0;
        tempData["Thu"][moment(item.createdAt).format("MM/YYYY")] = this.total["Thu"];

      } else {
        this.total["Thu"] = tempData["Thu"][moment(item.createdAt).format("YYYY")]
          ? tempData["Thu"][moment(item.createdAt).format("YYYY")] + item.finalAmount : item.finalAmount;

        tempData["Thu"][moment(item.createdAt).format("YYYY")]
          = tempData["Thu"][moment(item.createdAt).format("YYYY")] || 0;
        tempData["Thu"][moment(item.createdAt).format("YYYY")] = this.total["Thu"];
      }

    }

    for (let item of InvoiceReturn) {

      if (valueDate <= 3) {
        this.total["Thu"] = tempData["Thu"][moment(item.createdAt).format("HH DD/MM")]
          ? tempData["Thu"][moment(item.createdAt).format("HH DD/MM")] - item.finalAmount : -item.finalAmount;

        tempData["Thu"][moment(item.createdAt).format("HH DD/MM")]
          = tempData["Thu"][moment(item.createdAt).format("HH DD/MM")] || 0;
        tempData["Thu"][moment(item.createdAt).format("HH DD/MM")] = this.total["Thu"];

      } else if (valueDate <= 31) {
        this.total["Thu"] = tempData["Thu"][moment(item.createdAt).format("DD/MM")]
          ? tempData["Thu"][moment(item.createdAt).format("DD/MM")] - item.finalAmount : -item.finalAmount;;

        tempData["Thu"][moment(item.createdAt).format("DD/MM")]
          = tempData["Thu"][moment(item.createdAt).format("DD/MM")] || 0;
        tempData["Thu"][moment(item.createdAt).format("DD/MM")] = this.total["Thu"];

      } else if (valueDate <= 1068) {
        this.total["Thu"] = tempData["Thu"][moment(item.createdAt).format("MM/YYYY")]
          ? tempData["Thu"][moment(item.createdAt).format("MM/YYYY")] - item.finalAmount : -item.finalAmount;;

        tempData["Thu"][moment(item.createdAt).format("MM/YYYY")]
          = tempData["Thu"][moment(item.createdAt).format("MM/YYYY")] || 0;
        tempData["Thu"][moment(item.createdAt).format("MM/YYYY")] = this.total["Thu"];

      } else {
        this.total["Thu"] = tempData["Thu"][moment(item.createdAt).format("YYYY")]
          ? tempData["Thu"][moment(item.createdAt).format("YYYY")] - item.finalAmount : -item.finalAmount;;

        tempData["Thu"][moment(item.createdAt).format("YYYY")]
          = tempData["Thu"][moment(item.createdAt).format("YYYY")] || 0;
        tempData["Thu"][moment(item.createdAt).format("YYYY")] = this.total["Thu"];
      }

    }

    let dataXAxis = Object.keys(tempData["Thu"])

    if (valueDate < 3) {
      let arr = []
      for (let i in dataXAxis) {
        let split = dataXAxis[i].split(" ")
        arr.push(`${split[0]}:00 ${split[1]}`)
      }

      dataXAxis = arr;
    }

    option.xAxis = {
      ...option.xAxis,
      name: t('Thời gian'),
      data: dataXAxis,
      axisLabel: {
        ...option.xAxis.axisLabel,
        formatter: (function (value) {
          return dataXAxis.length > 6 ? ""
            : value
        })
      }
    }

    option.series.data = Object.values(tempData["Thu"])

    if (this.line_chart)
      this.line_chart.getEchartsInstance().setOption(option, true)
  }

  render() {
    return (
      <div style={{ marginTop: "10px" }}>
        <ReactEcharts
          option={option_line}
          ref={ref => this.line_chart = ref}
          style={{ 
            height:  "calc(85vh - 290px)",
          }}
        />
      </div>
    );
  }
}

export default (withTranslation("translations")(withStyles(statisticStyle)(ChartDashboard)));