import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation, } from 'react-i18next';
// @material-ui/icons
import withStyles from "@material-ui/core/styles/withStyles"
import moment from "moment";

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import Report from 'views/SaleReport/components/Report.jsx';
import saleReportService from "services/SaleReportService";
import { notifyError } from 'components/Oh/OhUtils';

class Management extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brerror: null,
      br: null,
      saleReport: [],
      options: 2,
      dateTime: {
        start: new Date(moment().startOf('month')).getTime(),
        end: new Date(moment().endOf('month')).getTime()
      },
      isChange: false
    };
  }

  componentDidMount = () => {
    let start = moment().startOf('month')
    let end = moment().endOf('month')
    this.getData(this.state.options, start, end)
  }

  getData = async (options, start, end) => {
    let getSaleReport = await saleReportService.getSaleReportData({

      filter: {
        createdAt: { "<=": new Date(end).getTime(), ">=": new Date(start).getTime() }
      },
      startDate: new Date(start).getTime(),
      endDate: new Date(end).getTime(),
      options: options
    });
    
    
    
    if (getSaleReport.status) {
      this.setData(getSaleReport.data, options);
    }
    else notifyError(getSaleReport.error)

  };

  setData = async (saleReport, options) => {    
    this.setState({
      saleReport: saleReport,
      options: options,
      isChange: true
    });
  };
  render() {
    let { saleReport, options, dateTime } = this.state;
    return (
      <Fragment>
        {alert}
        <Card>
          <CardBody >
            <Report
              data={saleReport}
              options_get_data={options}
              onChangeTime={(dateTime) =>
                this.setState({ dateTime: dateTime })
              }
              getData={(option) => this.getData(option, dateTime.start, dateTime.end)}
              isChange={this.state.isChange}
              onChangeData={isChange => this.setState({isChange})}
            />
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

Management.propTypes = {
  classes: PropTypes.object
};

export default (
  connect(function(state) {
    return {
      currentUser: state.userReducer.currentUser
    };
  })
)(withTranslation("translations")

(withStyles((theme) => ({
  ...extendedTablesStyle,
  ...buttonsStyle
}))(Management)));;
