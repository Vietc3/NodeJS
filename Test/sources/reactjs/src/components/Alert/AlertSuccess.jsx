import React, { Component } from "react";
// import Button from '@material-ui/core/Button';
import SweetAlert from "react-bootstrap-sweetalert";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from "react-i18next";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";

class AlertSuccess extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	render(){
		const {classes, t} = this.props;
		return (
			<SweetAlert
				success
				style={{ display: "block",marginLeft:0,marginTop:0,top:`${(window.innerHeight/2-85)*100/window.innerHeight}%`,left:`${(window.innerWidth/2-150)*100/window.innerWidth}%`}}
				title = {t("Success!")}
				onConfirm={() => {}}
				showConfirm={false}
				confirmBtnCssClass={
					classes.button + " " + classes.info
				}
			></SweetAlert>
		);
	}
}

export default withTranslation("translations")(
    withStyles(() => ({
		...buttonsStyle
    }))(AlertSuccess)
 );