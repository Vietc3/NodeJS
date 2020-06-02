import React, { Component } from 'react';
import { connect } from "react-redux"
import Card from "components/Card/Card.jsx";
import { withTranslation } from "react-i18next";
import OhForm from "components/Oh/OhForm";
import Constants from "variables/Constants";
import CardBody from "components/Card/CardBody.jsx";

class CardInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({
      data: this.props.cardInfo
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.cardInfo !== prevProps.cardInfo)
      this.setState({
        data: this.props.cardInfo
      })
  }

  onChange = value => {
    this.setState({
      data: {
        ...this.state.data,
        ...value
      }
    }, () => this.props.onChangeCardInfo(this.state.data))
  }


  render() {
    const { data } = this.state;
    const { t, readOnly } = this.props;
    const column1 = [
      {
        name: "code",
        label: t("Mã phiếu"),
        ohtype: "input",
        disabled: readOnly,
        placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
      },
      {
        name: "userName",
        label: t("Người tạo"),
        ohtype: "input",
        disabled: true
      },
      {
        name: "createdAt",
        label: t("Ngày sản xuất"),
        ohtype: "date-picker",
        disabled: readOnly,
        placeholder: t("Chọn ngày sản xuất"),
        formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
      },
    ];

    const column2 = [
      {
        name: "notes",
        label: t("Ghi chú"),
        ohtype: "textarea",
        disabled: readOnly,
        minRows: 6,
        maxRows: 10
      },
    ];

    return (
      <Card>
        <CardBody>
          <OhForm
            title={t("Thông tin chung")}
            tag={ readOnly ? Constants.MANUFACTURING_CARD_STATUS.name[data.status] : null}
            defaultFormData={data}
            columns={[column1, column2]}
            onChange={value => { this.onChange(value) }}
            validator={this.validator}
          />
        </CardBody>
      </Card>
    );
  }
}

export default connect(state => {
  return {
    currentUser: state.userReducer.currentUser.user
  };
})(withTranslation("translations")(CardInfo));