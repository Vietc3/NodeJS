import React from "react";
import PropTypes from "prop-types";
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation, Translation } from 'react-i18next';
import { connect } from 'react-redux';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div></div>
        );
    }

}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default connect((state) => {
    return ({
        User: state.User,
        state: state,
        language: state.language
    })
})(withTranslation("translations")(withStyles(dashboardStyle)(Dashboard)));
