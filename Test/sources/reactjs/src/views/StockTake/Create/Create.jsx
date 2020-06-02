import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import {connect} from "react-redux";
import CreateCardForm from 'views/StockTake/Components/CreateCardForm/CreateCardForm';
import { withTranslation } from 'react-i18next';

class CreateIssue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    
    return (
      <Fragment>
        <Card>
          <CardBody>
            <CreateCardForm {...this.props}/>
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

CreateIssue.propTypes = {
  classes: PropTypes.object
};

export default connect(function(state){
  return ({})
})(withTranslation("translations")(withStyles(extendedFormsStyle)(withRouter(CreateIssue))));
