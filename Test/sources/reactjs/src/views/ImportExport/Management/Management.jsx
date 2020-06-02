import React, { Fragment } from "react";
import PropTypes from "prop-types"; 
import { withTranslation, } from 'react-i18next';
// @material-ui/icons
import withStyles from "@material-ui/core/styles/withStyles"
// CODE BY THIEN BAO

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import CardList from 'views/ImportExport/Components/CardList/CardList';


class Issue extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				
		};
	}

	render() {
    const {match} = this.props;
		return (
			<Fragment>
				{alert}
				<Card>
					<CardBody>
						<CardList 
							isExport = {match.params.isExport === '1'}
							cardCode = {match.params.cardCode}
						/>
					</CardBody>
				</Card>
			</Fragment>
		);
	}
}

Issue.propTypes = {
  classes: PropTypes.object
};

export default (withTranslation("translations")(withStyles((theme)=>({
	...extendedTablesStyle,
	...buttonsStyle
}))(Issue)));;
