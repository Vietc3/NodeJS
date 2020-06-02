import React, { Component } from 'react';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from "react-i18next";
import "date-fns";
import Constants from "variables/Constants/";
import moment from "moment";
import _ from "lodash";
import OhForm from 'components/Oh/OhForm';
import { connect } from "react-redux";

class InfoImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      today: false,
      dataInfoImport: {
        importedAt: moment().format(Constants.DATABASE_DATE_TIME_FORMAT_STRING),
        status: 1 // 1 là lưu tạm 2 là hoàn thành
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if ( this.props.dataEdit !== prevProps.dataEdit && this.props.dataEdit ) {
      let dataInfoImport = this.props.dataInfoImport;

      this.setState({
        dataInfoImport
      })
    }
  }

  onChange = (value) => {
    if (value["code"]){      
      value["code"] = value["code"].trim();
    }
    
    this.setState({dataInfoImport: {...this.state.dataInfoImport, ...value}}, () => this.props.onChangeInfoImport(this.state.dataInfoImport));
  }

  render() {
    const { t, isEdit, currentUser, isCanceledCard, isReturn } = this.props;
    const { dataInfoImport } = this.state;
    let createdBy = isEdit ? (dataInfoImport.createdBy || {}).fullName : currentUser.user.fullName;

    return (
      <GridItem xs={12} sm={6} md={6} lg={6}>
        <Card >
          <CardBody xs={12} style={{ padding: 0 }}>
            <OhForm
              title={t("Thông tin phiếu nhập hàng")}
              defaultFormData={ _.extend(dataInfoImport, {createdBy}) }
              onRef={ref => this.ohFormRef = ref}
              tag={isCanceledCard ? Constants.IMPORT_CARD_STATUS_NAME[dataInfoImport.status] : null}
              columns={[
                [
                  {
                    name: "code",
                    label: t("Mã phiếu"),
                    ohtype: "input",
                    placeholder: t(Constants.PLACEHOLDER_AUTO_GENERATE_CODE),
                    disabled: true,
                  },
                  {
                    name: "createdBy",
                    label: t("Người tạo"),
                    ohtype: "label",
                  },
                  {
                    name: "importedAt",
                    label: t("Ngày nhập"),
                    ohtype: "date-picker",
                    formatDateTime: Constants.DATABASE_DATE_TIME_FORMAT_STRING,
                  },
                  {
                    name: "notes",
                    label: t("Ghi chú"),
                    ohtype: isCanceledCard || isReturn ? "label" : "textarea",
                    minRows: 1,
                    maxRows: 1
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
    }))(InfoImport)
  )
);