import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import { withTranslation } from 'react-i18next';
import ExtendFunction from "lib/ExtendFunction.js";
import Card from "components/Card/Card.jsx";
import { Typography } from "antd";
import GridContainer from "components/Grid/GridContainer.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import moment from "moment";
import FormLabel from "@material-ui/core/FormLabel";
import OhTable from 'components/Oh/OhTable.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Constants from "variables/Constants/index.js";
import { MdViewList, MdVerticalAlignBottom } from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar.jsx";
import { notifyError } from 'components/Oh/OhUtils.js';
import GeneralDebtService from 'services/GeneralDebtService.js';
import OhSelect from 'components/Oh/OhSelect.jsx';
import OhCheckBox from 'components/Oh/OhCheckbox.jsx';
import OhDateTimePicker from 'components/Oh/OhDateTimePicker.jsx';
const { Paragraph } = Typography;

class GerenalDebtReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTime: {
        start: new Date(moment().startOf('month')).getTime(),
        end: new Date(moment().endOf('month')).getTime()
      },
      InputValue: [moment().startOf('month'),moment().endOf('month')],
      selectType: 0,
      dataReport: [],
      isCheckDebt: false,
      loading: false
    }
  }

  componentDidMount() {
    let start = moment().startOf('month')
    let end = moment().endOf('month')
    this.getData(start, end);
  }

  async getData(start, end) {

    this.setState({
      loading: true
    });

    let dataReport = await GeneralDebtService.getGeneralDebtReportData({
      startDate: new Date(start).getTime(),
      endDate: new Date(end).getTime(),
      type: this.state.selectType,
      isCheckDebt: this.state.isCheckDebt
    })
    if (dataReport.status)
      this.setState({
        dataReport: dataReport.data,
        loading: false
      })
    else {
      notifyError(dataReport.message);
      this.setState({
        loading: false
      });
    }
  }

  export = () => {
    const { dataReport } = this.state;
    const { t } = this.props;
    let dataExcel = [[
      '#',
      t('Mã'),
      t('Tên'),
      t('Nợ đầu kỳ'),
      t('Tổng nhập xuất trong kỳ'),
      t('Tổng thu chi trong kỳ'),
      t('Nợ trong kỳ'),
      t('Nợ cuối kỳ')
    ]];
    for (let item in dataReport) {
      dataExcel.push(
        [
          parseInt(item) + 1,
          dataReport[item].code,
          dataReport[item].name,
          dataReport[item].beginDebt !== undefined ? ExtendFunction.FormatNumber(Number(dataReport[item].beginDebt).toFixed(2)) : 0,
          dataReport[item].debtAmout !== undefined ? ExtendFunction.FormatNumber(Number(dataReport[item].debtAmout).toFixed(2)) : 0,
          dataReport[item].amountIncExp !== undefined ? ExtendFunction.FormatNumber(Number(dataReport[item].amountIncExp).toFixed(2)) : 0,
          dataReport[item].midDebt !== undefined ? ExtendFunction.FormatNumber(Number(dataReport[item].midDebt).toFixed(2)) : 0,
          dataReport[item].lastDebt !== undefined ? ExtendFunction.FormatNumber(Number(dataReport[item].lastDebt).toFixed(2)) : 0,
        ]
      )
    }

    return dataExcel
  }

  render() {
    const { t } = this.props;
    const { InputValue, dateTime, dataReport, loading } = this.state;
    let columns = [
      {
        title: t('Mã'),
        align: 'left',
        dataIndex: 'code',
        width: "10%",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : -1),
        key: "code",
        render: value => {
          return <div title={value}>{value}</div>;
        },
      },
      {
        title: t("Tên"),
        align: 'left',
        dataIndex: 'name',
        width: "20%",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : -1),
        render: value => {
          return (
            <Paragraph title={value} style={{ wordWrap: "break-word", wordBreak: "break-word" }} ellipsis={{ rows: 4 }}>
              {value}
            </Paragraph>
          );
        },
      },
      {
        title: t("Nợ đầu kỳ"),
        align: 'right',
        width: "14%",
        dataIndex: 'beginDebt',
        key: "beginDebt",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.beginDebt - b.beginDebt),
        render: value => {
          return value ? ExtendFunction.FormatNumber(Math.round(value)) : 0
        }
      },
      {
        title: t("Trong kỳ"),
        children: [
          {
            title: t("Tổng nhập xuất"),
            align: 'right',
            dataIndex: 'debtAmout',
            width: "14%",
            key: "debtAmout",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.debtAmout - b.debtAmout),
            render: value => {
              return value ? ExtendFunction.FormatNumber(Math.round(value)) : 0
            }
          },
          {
            title: t("Tổng thu chi"),
            align: 'right',
            dataIndex: 'amountIncExp',
            width: "14%",
            key: "amountIncExp",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.amountIncExp - b.amountIncExp),
            render: value => {
              return value ? ExtendFunction.FormatNumber(Math.round(value)) : 0
            }
          },
          {
            title: t("Nợ trong kỳ"),
            align: 'right',
            dataIndex: 'midDebt',
            width: "14%",
            key: "midDebt",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.midDebt - b.midDebt),
            render: value => {
              return value ? ExtendFunction.FormatNumber(Math.round(value)) : 0
            }
          }
        ]
      },
      {
        title: t("Nợ cuối kỳ"),
        align: 'right',
        dataIndex: 'lastDebt',
        width: "14%",
        key: "lastDebt",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.lastDebt - b.lastDebt),
        render: value => {
          return value ? ExtendFunction.FormatNumber(Math.round(value)) : 0
        }
      },
    ];

    return (
      <div>
        <Fragment>
          <Card>
            <CardBody >
              <GridContainer style={{ padding: '0px 15px' }} alignItems="center">
                <OhToolbar
                  left={[
                    {
                      type: "csvlink",
                      label: t("Xuất báo cáo"),
                      typeButton: "export",
                      csvData: this.export(),
                      fileName: t("BaoCaoCongNoTongQuat") + ".xls",
                      onClick: () => { },
                      icon: <MdVerticalAlignBottom />,
                    },
                  ]}
                />

                <GridItem >
                  <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                      let dateTime = {start: start, end: end};
                      this.setState({dateTime})
                    }}
                  />
                </GridItem>


                <GridItem>
                  <span className="TitleInfoForm">{t("Theo")}</span>
                </GridItem>
                <GridItem style={{ width: "200px", marginTop: 0 }} className="InventoryItemGrid" >
                  <OhSelect
                    defaultValue={this.state.selectType}
                    options={Constants.SELECT_CUSTOMER_TYPES.map(item => ({...item, title: t(item.title)}))}
                    onChange={value => this.setState({ selectType: value })}
                  />
                </GridItem>
                <GridItem>
                  <OhCheckBox
                    options={[{ label: t('Chỉ hiện có dư nợ'), value: 1 }]}
                    onChange={(value, record) =>
                      this.setState({
                        isCheckDebt: value[0] === 1 ? true : false
                      })
                    }
                  />
                </GridItem>

                <GridItem >
                  <OhToolbar
                    right={[
                      {
                        type: "button",
                        label: t("Xem báo cáo"),
                        onClick: () => this.getData(dateTime.start, dateTime.end),
                        icon: <MdViewList />,
                        simple: true,
                        typeButton: "add",
                      },

                    ]}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <CardBody>
                  {dataReport.length > 500 ?
                    <GridItem >
                      <GridContainer >
                        <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                          <b className='HeaderForm'>{t("Hiển thị 1–500 của 500+ kết quả. Để thu hẹp kết quả, bạn hãy chỉnh sửa phạm vi thời gian hoặc chọn Xuất báo cáo để xem đầy đủ")}</b>
                        </FormLabel>
                      </GridContainer>
                    </GridItem>
                    :
                    null
                  }
                  <OhTable
                    id="general-debt-report"
                    columns={columns}
                    dataSource={dataReport.length > 500 ? dataReport.slice(0, 500) : dataReport}
                    isNonePagination={true}
                    loading={loading}
                  />
                </CardBody>
              </GridContainer>
            </CardBody>
          </Card>
        </Fragment>
      </div>
    );
  }
}

GerenalDebtReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(GerenalDebtReport)
  )
);
