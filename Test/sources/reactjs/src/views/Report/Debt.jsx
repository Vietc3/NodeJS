import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from 'react-i18next';
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import ReportDebt from 'services/ReportDebt';
import FormLabel from "@material-ui/core/FormLabel";
import NotificationError from "components/Notification/NotificationError.jsx";
import OhTable from 'components/Oh/OhTable';
import { MdViewList, MdVerticalAlignBottom} from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar";
import OhDateTimePicker from 'components/Oh/OhDateTimePicker';

class Debt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      InputValue: [moment().startOf('day'),moment().endOf('day')],
      dataDebtReport: [],
      totalDebt: 0,
      brerror: null,
    }
    this.type = this.props.location.pathname === "/admin/customer-debt-report" ? 1 : 2;
  }

  componentDidMount() {
    let start = moment().startOf('day')
    let end = moment().endOf('day')
    this.getData(start, end)
  }

  async getData(start, end) {
    let dataDebtReport = await ReportDebt.getDebtReport({
      type: this.type,
      startDate: new Date(start).getTime(),
      endDate: new Date(end).getTime()
    })
    if (dataDebtReport.status)
      this.setState({
        dataDebtReport: dataDebtReport.debtRecords,
        totalDebt: dataDebtReport.totalDebt
      })
    else
      this.error(dataDebtReport.error)
  }

  error = (mess) => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    })
  }

  export = () => {
    const { dataDebtReport, totalDebt } = this.state;
    let { t } = this.props;

    let dataExcel = [[
      t("Mã khách hàng"),
      t("Tên khách hàng"),
      this.type === 1 ? t("Công nợ phải thu") : t("Công nợ phải trả"),
    ]];
    for (let item in dataDebtReport) {
      dataExcel.push(
        [
          dataDebtReport[item].code,
          dataDebtReport[item].name,
          ExtendFunction.FormatNumber(dataDebtReport[item].sumDebt),
        ])
    }
    dataExcel.push(['', t('Tổng'), ExtendFunction.FormatNumber(totalDebt)])
    return dataExcel;
  }

  render() {
    const { t } = this.props
    const { dateTime, dataDebtReport, totalDebt, InputValue } = this.state;

    let columns = [
      {
        title: t("Mã khách hàng"),
        dataIndex: "code",
        type: "text",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : -1),
        width: "30%",
        align: "left",
      },
      {
        title: t("Tên khách hàng"),
        dataIndex: "name",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : -1),
        width: "50%",
        align: "left",
      },
      {
        title: this.type === 1 ? t("Công nợ phải thu") : t("Công nợ phải trả"),
        dataIndex: "sumDebt",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.sumDebt - b.sumDebt),
        align: "right",
        width: "20%",
        render: value => {
          return ExtendFunction.FormatNumber(value) || 0;
        },
      },
    ];


    return (
      <div>
        <Card >
        <GridContainer style={{ padding: '0px 0px 0px 40px' }}alignItems="center">
            <GridItem xs={12}>
              <GridContainer alignItems="center">
              <OhToolbar
                left={[
                  {
                    type: "csvlink",
                    typeButton:"export",
                    csvData: this.export(),
                    fileName: t("DanhSachCongNo")+".xls",
                    onClick: () => { },
                    label: t("Xuất báo cáo"),
                    icon: <MdVerticalAlignBottom />,
                  },
                ]}
                />
                <GridItem>
                  <span className="TitleInfoForm">{t("Thời gian")}</span>
                </GridItem>
                <GridItem>
                  <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                    let dateTime = {start: start, end: end};
                    this.setState({dateTime})
                    }}
                  />
                </GridItem>
                <GridItem >
                <OhToolbar
                left={[
                  
                  {
                    type: "button",
                    label: t("Xem báo cáo"),
                    onClick: () => this.getData(dateTime.start, dateTime.end),
                    icon: <MdViewList />,
                    simple: true,
                    typeButton:"add",
                  },
                ]}
              />
                </GridItem>
              </GridContainer>
            </GridItem>
            </GridContainer>
        </Card>
        <GridContainer style={{ padding: '0px 5px' }}>
          <GridItem xs={12} sm={12} md={12}>
            <Card >
              <GridItem style={{ textAlign: 'center' }}>
                <OhTable
                  id= "debt-report"
                  columns={columns}
                  dataSource={dataDebtReport.length > 500 ? dataDebtReport.slice(0,500) : dataDebtReport}
                  isNonePagination={true}
                />
              </GridItem>
              {dataDebtReport.length > 500 ?
                <GridItem >
                  <GridContainer >
                    <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                      <b className='HeaderForm'>{t("Hiển thị 1–500 của 500+ kết quả. Để thu hẹp kết quả, bạn hãy chỉnh sửa phạm vi thời gian hoặc chọn Xuất báo cáo để xem đầy đủ")}</b>
                    </FormLabel>
                  </GridContainer>
                </GridItem>
                :
                <GridItem>
                  <GridContainer justify="flex-end">
                    <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                      <b className='HeaderForm'>{t("Tổng")}: {ExtendFunction.FormatNumber(totalDebt)}</b>
                    </FormLabel>
                  </GridContainer>
                </GridItem>
              }
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Debt.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (withTranslation("translations")(withStyles(dashboardStyle)(Debt)));
