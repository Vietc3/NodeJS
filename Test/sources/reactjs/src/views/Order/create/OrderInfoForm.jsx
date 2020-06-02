import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

// multilingual
import { withTranslation } from "react-i18next";
import Constants from 'variables/Constants/';
import "date-fns";
import moment from "moment";
import _ from "lodash";
import OhForm from 'components/Oh/OhForm';

class OrderInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: {
        orderAt: moment(),
        expectedAt: moment(),
        status: 1
      },
    };

  }

  componentDidUpdate = (prevProps, prevState) => {
    const { dataEdit } = this.props;
    if (prevProps.dataEdit !== dataEdit && dataEdit)
      this.setState({
        orderInfo: {
          code: dataEdit.code,
          notes: dataEdit.notes,
          orderAt: moment(dataEdit.orderAt),
          expectedAt: moment(dataEdit.expectedAt),
          status: dataEdit.status
        }
      })
  }

  onChange = (value) => {
    this.setState({
      orderInfo: value
    }, () => this.props.sendOrderInfo(this.state.orderInfo))
  }

  render() {
    const { t, dataEdit, isEdit, currentUser, isCanceledCard } = this.props;
    const { orderInfo } = this.state
    let sale = isEdit ? (dataEdit.createdBy || {}).fullName : currentUser.user.fullName;

    return (
      <GridItem float='right' xs={12} sm={12} md={6} lg={6}>
        <Card className = 'invoice-info-card' style={{height: "100%"}}>
          <CardBody xs={12} style={{ padding: 0 }}>
            <OhForm
              title={t("Thông tin đơn hàng")}
              defaultFormData={ _.extend(orderInfo, { sale }) }
              onRef={ref => this.ohFormRef = ref}
              tag={isCanceledCard ? Constants.ORDER_CARD_STATUS_NAME[dataEdit.status] : null}
              columns={[
                [
                  {
                    name: "code",
                    label: t("Mã đặt hàng"),
                    ohtype: "input",
                    disabled: true,
                    placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
                  },
                  {
                    name: "sale",
                    label: t("Người tạo"),
                    ohtype: "label",
                  },
                  {
                    name: "orderAt",
                    label: t("Ngày đặt"),
                    ohtype: "date-picker",
                    disabled: isCanceledCard,
                  },
                  {
                    name: "expectedAt",
                    label: t("Ngày giao"),
                    ohtype: "date-picker",
                    disabled: isCanceledCard,
                  },
                  dataEdit.status === Constants.ORDER_CARD_STATUS.CANCELLED ? {} :
                  {
                    name: "status",
                    label: t("Trạng thái"),
                    ohtype: "select",
                    options: Constants.OPTIONS_ORDER_CARD_STATUS.map(item => ({...item, title: t(item.title) }))
                  },
                  {
                    name: "notes",
                    label: t("Ghi chú"),
                    ohtype: isCanceledCard ? "label" : "textarea",
                    minRows: 1,
                    maxRows: 2
                  },
                ],
              ]}
              onChange={value => {
                this.onChange(value);
              }}
            />
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default connect(function(state) {
  return ({
    currentUser: state.userReducer.currentUser
  });
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(OrderInfoForm)
  )
);
