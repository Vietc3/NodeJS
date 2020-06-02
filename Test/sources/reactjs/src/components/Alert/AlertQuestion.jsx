import React, { Component } from "react";
// import Button from '@material-ui/core/Button';
import SweetAlert from "react-bootstrap-sweetalert";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from "react-i18next";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import { MdDelete,MdCancel} from "react-icons/md";
import OhButton from "components/Oh/OhButton.jsx"
import ReactHtmlParser from 'react-html-parser';

class AlertSuccess extends Component {
	constructor(props) {
    super(props);
    this.state = {
		};
  }

	render(){
    const {t, action, hideAlert, messege, buttonOk, name, style} = this.props;
        
		return (
			<SweetAlert
        showConfirm={false}
        showCancel={false}
        style={{...style, width:window.innerWidth<900?300:450, display: "block", marginLeft: 0, marginTop: 0, top: `${(window.innerHeight / 2 - 85) * 100 / window.innerHeight}%`, left: `${(window.innerWidth / 2 - (window.innerWidth<900?150:225)) * 100 / window.innerWidth}%` }}
        title={
        <div style={{ fontSize: "12px", lineHeight: "1.5em" }}>
          {
            typeof messege === 'string' ?
            <span style={{ color: "black", marginLeft: "2px" }}>
              {ReactHtmlParser(t("{{mess}}&nbsp;{{name}}&nbsp;<br>", {mess: t(messege), name: name}))}
            </span> :
            messege
          }
        </div>
        }
        onCancel={() => hideAlert()}
        onConfirm={() => hideAlert()}
      >
        <div style={{ textAlign: "center" }}>
        {buttonOk ?
        <OhButton
            type="add"
            onClick={async () => action()}
            icon={<MdDelete/>}
            >
           {t(buttonOk)}
        </OhButton>
        : null }
        <OhButton
            type="exit"
            icon={<MdCancel/>}
            onClick={() => hideAlert()}
            >
            {t("Đóng")}
        </OhButton>
        </div>
			</SweetAlert>
		);
	}
}

export default withTranslation("translations")(
    withStyles(() => ({
		...buttonsStyle
    }))(AlertSuccess)
 );