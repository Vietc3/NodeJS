import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from 'react-i18next';
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Select } from "antd";
import TableReport from "./TableReport.jsx";
import Chart from "./Chart.jsx"
import Constants from "variables/Constants/";
import Export from "../Export/SaleReportExcel.js";
import { MdViewList, MdVerticalAlignBottom} from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar";
import OhDateTimePicker from 'components/Oh/OhDateTimePicker';

const { Option } = Select;
const SELECT_VALUE_RETURN = 2;
const SELECT_NAME = "selects";
const SELECT_OPTIONS = "options";

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSaleReport: [],
      options: 2,
      selects: 1,
      InputValue: [moment().startOf('month'),moment().endOf('month')],
      options_get_data: 2,
      isChangeChart: false
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.length !== this.props.data.length 
      || JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
      || (prevProps.isChange !== this.props.isChange && this.props.isChange)
    ) {
      this.getData()
    }

    if (prevProps.options_get_data !== this.props.options_get_data) {
      this.setOption(this.props.options_get_data)
    }
  }

  setOption(options_get_data) {
    this.setState({ options_get_data })
  }

  getData = async () => {
    let dataSource = this.props.data || [{}];
    let dataSaleReport = [];
    for (let i in dataSource) {
      dataSaleReport.push({
        ...dataSource[i],
        finalAmount: (dataSource[i].totalAmount + dataSource[i].taxAmount + dataSource[i].deliveryAmount - (dataSource[i].discountAmount + dataSource[i].returnAmount))
      })
    }
    this.setState({
      dataSaleReport: dataSaleReport,
      isChangeChart: true
    }, () => this.props.onChangeData(false));
  }

  onChange = async (value, name) => {
    this.setState({
      [name]: value
    }, () => name === SELECT_NAME && value === SELECT_VALUE_RETURN
      && (this.state.options === Constants.OPTIONS_SALE_REPORT.USER || this.state.options === Constants.OPTIONS_SALE_REPORT.CUSTOMER) ?
      this.setState({ options: Constants.OPTIONS_SALE_REPORT.HOUR }) : null);
  }

  getToltal() {
    let { dataSaleReport } = this.state;
    return dataSaleReport.reduce((total, item) => {
      return total += item.finalAmount
    }, 0)
  }

  getToltalProfit() {
    let { dataSaleReport } = this.state;
    return dataSaleReport.reduce((total, item) => {
      return total += item.profitAmount
    }, 0)
  }

  render() {
    const { t } = this.props
    const { dataSaleReport, options, selects, options_get_data, InputValue } = this.state;
    let total = this.getToltal();
    let totalProfit = this.getToltalProfit();

    const selectFollowReport = [
      <Option value={1} >{t("Doanh thu")}</Option>,
      <Option value={2} >{t("Lợi nhuận")}</Option>,
    ]

    const selectFollow = [
      <Option value={1} >{t("Giờ")}</Option>,
      <Option value={2} >{t("Loại ngày")}</Option>,
      <Option value={3} >{t("Tháng")}</Option>,
      <Option value={4} >{t("Năm")}</Option>,
      <Option value={5} >{t("Sản phẩm")}</Option>,
      <Option value={6} >{t("Những nhân viên")}</Option>,
      <Option value={7} >{t("Khách hàng")}</Option>
    ];

    return (
      <div>
        <GridContainer style={{ padding: '0px 10px 0px 20px' }}alignItems="center">
              <OhToolbar
                left={[
                  {
                    label: t("Xuất báo cáo"),
                    type: "csvlink",
                    typeButton:"export",
                    csvData: Export.SaleReportExcel(dataSaleReport, options_get_data, total, this.props.languageCurrent, t, totalProfit),
                    fileName: t("BaoCaoBanHang") + ".xls",
                    onClick: () => { },
                    icon: <MdVerticalAlignBottom />,
                  }
                ]}
              />
              <>
              <GridItem>
                  <span className="TitleInfoForm">{t("Báo cáo")}</span>
                </GridItem>
                <GridItem style={{ width: "150px" }} id="autocompleteItems">
                  <Select
                    getPopupContainer={() => document.getElementById('autocompleteItems')}
                    disabled={false}
                    style={{ width: 200, height: "35px"}}
                    size={"large"}
                    placeholder={t("Theo")}
                    optionFilterProp="children"
                    onChange={(e) => this.onChange(e, SELECT_NAME)}
                    name="Options"
                    value={selects}
                    filterOption={(input, option) => {
                      return option.props.children
                        ? ExtendFunction.removeSign(option.props.children
                          .toLowerCase())
                          .indexOf(ExtendFunction.removeSign(input.toLowerCase())) >= 0
                        : false;
                    }}
                  >
                    {selectFollowReport}
                  </Select>
                </GridItem>
                <GridItem >
                  <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                    let dateTime = {start: start, end: end};
                    this.props.onChangeTime(dateTime)
                    }}
                  />
                </GridItem>
              </>
              <>
                <GridItem>
                  <span className="TitleInfoForm">{t("Theo")}</span>
                </GridItem>
                <GridItem style={{ width: "185px" }} id="autocompleteItem">
                  <Select
                    getPopupContainer={() => document.getElementById('autocompleteItem')}
                    disabled={false}
                    style={{ width: 200, height: "35px"}}
                    size={"large"}
                    placeholder={t("Theo")}
                    optionFilterProp="children"
                    onChange={(e) => this.onChange(e, SELECT_OPTIONS)}
                    name="Options"
                    value={options}
                    filterOption={(input, option) => {
                      return option.props.children
                        ? ExtendFunction.removeSign(option.props.children
                          .toLowerCase())
                          .indexOf(ExtendFunction.removeSign(input.toLowerCase())) >= 0
                        : false;
                    }}
                  >
                    {selectFollow}
                  </Select>
                </GridItem>
                <GridItem >
                  <OhToolbar
                    left={[
                      {
                        type: "button",
                        label: t("Xem báo cáo"),
                        onClick: () => this.props.getData(this.state.options),
                        icon: <MdViewList />,
                        simple: true,
                        typeButton:"add",
                      },
                    ]}
                  />
                </GridItem>
              </>
        </GridContainer>
        <GridContainer >
          <GridItem xs={12} >
            <Chart
              data={dataSaleReport}
              options={options}
              selects={selects}
              language={this.props.languageCurrent}
              isChangeChart={this.state.isChangeChart}
              onChangeChart={isChangeChart => this.setState({isChangeChart})}
            />
          </GridItem>
          <GridItem xs={12} >
            <TableReport
              data={dataSaleReport}
              options={options_get_data}
              total={total}
              totalProfit={totalProfit}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Report.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  function (state) {
    return {
      languageCurrent: state.languageReducer.language
    };
  }
)(withTranslation("translations")(withStyles(dashboardStyle)(Report)));
