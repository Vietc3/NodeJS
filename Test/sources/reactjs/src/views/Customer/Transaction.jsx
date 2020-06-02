import React, { Component } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from "react-i18next";
import CardBody from "components/Card/CardBody.jsx";
import ExtendFunction from "lib/ExtendFunction.js";
import moment from "moment";
import Constants from 'variables/Constants/index.js';
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import OhTable from 'components/Oh/OhTable.jsx';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: [],
      br: null,
      brerror: null,
      sorter: {},
      filters: {},
    }
    this.currentPage = 1;
    this.pageSize = 10;
  }

  componentDidMount = () => {
    this.setData(this.props.cards)
  }

  success = (mess) => {
    this.setState({ br: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={mess} /> }, () => this.onCancel())
  }

  error = (mess) => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    })
  }

  onCancel = () => {
    this.setState({
      br: null,
      brerror: null,
    })
  }

  setData = async (transaction) => {
    this.setState({
      transaction: transaction
    })
  }

  showInfor = (record) => {
    let URL = window.location.origin;

    switch (record.type) {

      case 1:
        return (
          URL + Constants.MANAGE_INVOICE + record.id
        );
      case 2:
        return (
          URL + Constants.EDIT_IMPORT_CARD_PATH + record.id
        );
      case 3:
        return (
          URL + Constants.UPDATE_INVOICE_RETURN + record.id
        );
      case 4:
        return (
          URL + Constants.EDIT_EXPORT_CARD_PATH + record.id
        );
      default:
      break;
    }
  }

  render() {
    const { t } = this.props;
    const { transaction } = this.state
    let columns = [
      {
        title: t("Ngày"),
        align: "left",
        dataIndex: "createdAt",
        type: 'number',
        key: "createdAt",
        sorter: (a, b) => a.createdAt - b.createdAt,
        render: value => moment(value).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)
      },
      {
        title: t("Thao tác"),
        align: "left",
        dataIndex: "code",
        key: "code",
        sorter: (a, b) => a.code.localeCompare(b.code),
        render: (value, record) => {
          return (
            <span> { t(Constants.TRANSACTION_TYPE[record.type]) }&nbsp; 
              <a style={{cursor:"pointer"}} href={this.showInfor(record)} target="_blank" rel="noopener noreferrer">{value}</a>
            </span>
          )
        }
      },
      {
        title: t("Giá trị"),
        align: "left",
        dataIndex: "finalAmount",
        type: 'number',
        key: "finalAmount",
        sorter: (a, b) => a.finalAmount - b.finalAmount,
        render: (value, record) => {
          return ExtendFunction.FormatNumber(value)
        }
      },
      {
        title: t("Trạng thái"),
        align: "left",
        dataIndex: "status",
        type: 'number',
        key: "status",
        sorter: (a, b) => a.status - b.status,
        render: (value) => t(Constants.INVOICE_RETURN_CARD_STATUS_NAME[value])
      },
    ]

    return (
      <CardBody>
        <OhTable
          onRef={ref => (this.tableRef = ref)}
          columns={columns}
          dataSource={transaction}
          id={"transaction-table"}
        />
      </CardBody>
    );
  }
}

export default (
  withTranslation("translations")(
    withStyles(theme => ({
    }))(Transaction)
  )
);
