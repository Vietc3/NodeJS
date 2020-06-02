/*!

=========================================================
* Material Dashboard PRO React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import PropTypes from "prop-types";
// react component for creating dynamic tables
import ReactTable from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";
import Add from "@material-ui/icons/Add";
import Delete from "@material-ui/icons/Delete";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import Done from "@material-ui/icons/Done";
import Build from "@material-ui/icons/Build";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";

import { dataTable } from "variables/general.jsx";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";

import Database from "MyFunction/Database/Database";

import {connect} from "react-redux";
import Action from "MyFunction/Redux/Action";

import moment from "moment"; 

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from "@material-ui/core/Switch";
import MenuItem from "@material-ui/core/MenuItem";

import {Link} from 'react-router-dom'

import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";

import Highlighter from 'react-highlight-words';
import FormIssue from 'views/Issue/FormIssue/FormIssue';

import Api from 'MyFunction/Api/Api';
import MailTemplate from 'variables/MailTemplate';

import 'antd/dist/antd.css';
import { Select, Icon, Divider, Input, Table, Modal } from 'antd';
// multilingual
import { withTranslation, Translation } from 'react-i18next';

const { Option } = Select;

class Issue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			alert: null,
			visible_edit: false,
			visible_update: false,
			notification: 'no',
			modal_title: '',
			ProjectId: '',
			formData: undefined,
			issueId: '',
			issueCode: '',
			UploadFiles: []
    };
		this.formData_copy = {};
  }
	
	componentDidMount() {
		this.props.send(this.editIssue, this.updateIssue);
	}
	editIssue = (record, CurrentIssue)=>{
		let {t} = this.props;
		let find = null;
		if(CurrentIssue){
			find = CurrentIssue;
		} else{
			let {Issues} = this.props;
			let {key} = record;
			find = Issues.find((item)=> item.id == key);
		}
		let defaultFormData = undefined;
		if(find){
			defaultFormData = {
				TypeId: find.TypeId,
				StatusId: find.StatusId,
				Priority: find.Priority,
				ParentIssueId: find.ParentIssueId || '',
				ProjectId: find.ProjectId,
				CompletePercent: find.CompletePercent,
				Watchers: find.Watchers||[],
				Description: find.Description,
				Name: find.Name,
				StartDate: find.StartDate,
				EndDate: find.EndDate,
				AssigneeId: find.AssigneeId,
				AttachFile: find.AttachFile || []
			};
		}
		this.setState({
			visible_edit: true,
			visible_update: false,
			modal_title: t('Edit') + ' "'+find.Name+'"',
			ProjectId: find.ProjectId,
			formData: defaultFormData,
			issueId: find.id,
			issueCode: find.Code
		});
		this.formData_copy = defaultFormData;
	}
	updateIssue = (record, CurrentIssue)=>{
		let find = null;
		const { t } = this.props;
		if(CurrentIssue){
			find = CurrentIssue;
		}else{
			let {Issues} = this.props;
			let {key} = record;
			find = Issues.find((item)=> item.id == key);
		}
		let defaultFormData = undefined;
		if(find){
			defaultFormData = {
				StatusId: find.StatusId,
				CompletePercent: find.CompletePercent,
				Watchers: find.Watchers || [],
				Description: '',
				Name: find.Name,
				AssigneeId: find.AssigneeId,
				AttachFile: find.AttachFile || []
			};
		}
		this.setState({
			visible_update: true,
			visible_edit: false,
			modal_title: t('Update') + ' "'+ find.Name+'"',
			ProjectId: find.ProjectId,
			TypeId: find.TypeId,
			formData: defaultFormData,
			issueId: find.id,
			issueCode: find.Code
		});
		this.formData_copy = defaultFormData;
	}
	handleCancel = () => {
    this.setState({ alert: null, visible_edit: false, visible_update: false});
  };
	submitForm = ()=>{
		let {formData, issueId, issueCode, ProjectId, UploadFiles, notification} = this.state;
		let {User, t} = this.props;
		if(formData.Name=='' || formData.Type=='' || formData.StatusId=='' || formData.AssigneeId=='' || formData.Priority=='' || formData.StartDate=='' || formData.EndDate=='' || formData.CompletePercent==''){
			this.setState({ errorAdd: true});
		}else
		{
			formData.ModifiedDateTime = moment().unix();
			formData.ModifiedByUser = User.id;
			Database.updateIssue(issueId, formData, UploadFiles, notification, "Edit", (res, error)=>{
				console.log(res);
				console.log(error);
				if(res){
					// if(notification == 'yes'){
						// console.log(MailTemplate.updateIssue({...this.formData_copy, Code: issueCode,  ProjectId: ProjectId}, formData, {Users: User, Statuses: Status, Projects: Project}));
						// formData.Watchers.map((item)=>{
							// let filter = User.filter((c)=>c.uid == item);
							// if(filter.length) Api.sendMail(true, filter[0].Email, MailTemplate.updateIssue({...this.formData_copy, Code: issueCode,  ProjectId: ProjectId}, formData, {Users: User, Statuses: Status, Projects: Project}), [], (res)=>{
								// console.log(res);
							// })
						// });
					// }
					this.setState({
						alert: (
							<SweetAlert
								success
								style={{ display: "block", marginTop: "-100px" }}
								title={t("Updated Success!")}
								showConfirm={false}
								confirmBtnCssClass={
									this.props.classes.button + " " + this.props.classes.success
								}
							>
							</SweetAlert>
						)
					});
					setTimeout(this.handleCancel,700);
				}else{
					this.setState({
						alert: (
							<SweetAlert
								warning
								style={{ display: "block", marginTop: "-100px" }}
								title={t("Error!")}
								showConfirm={false}
								confirmBtnCssClass={
									this.props.classes.button + " " + this.props.classes.success
								}
							>
							</SweetAlert>
						)
					});
					setTimeout(this.handleCancel,700);
				}
			});
			this.setState({ errorAdd: false, errorMessage: null});
		}
	}
	submitUpdate = ()=>{
		let {formData, notification, ProjectId, issueId, issueCode, UploadFiles, TypeId} = this.state;
		let {User, Users, Statuses, Types, Projects, t } = this.props;
		let objData = JSON.parse(JSON.stringify(formData));
		let count =1;
		for(let i in formData){
			if(JSON.stringify(formData[i]) == JSON.stringify(this.formData_copy[i])) delete objData[i]
		}
		if(Object.values(objData).length == 0){
			this.setState({ errorAdd: true, errorMessage: t('Nothing to update')});
		}
		else if(formData.Name=='' || formData.Type=='' || formData.StatusId=='' || formData.AssigneeId=='' || formData.Priority=='' || formData.StartDate=='' || formData.EndDate=='' || formData.CompletePercent==''){
			this.setState({ errorAdd: true});
		}else
		{
			formData.ModifiedDateTime = moment().unix();
			formData.ModifiedByUser = User.id;
			delete formData.Description; 
			delete formData.WorkingTime; 
			objData.CreatedDateTime = moment().unix();
			objData.Creator = User.id;
			objData.IssueId = issueId;
			Database.updateIssue(issueId, formData, [], notification, "Update", (res1, error1)=>{
				let {t, i18n} = this.props;
				if(res1 && count===1) Database.addIssueHistory(objData, UploadFiles, (res, error, arrayUrl)=>{
					console.log(res);
					console.log(error);
					if(res){
						if(notification == 'yes'){
							Database.getRefFromUrl(arrayUrl, (arrRef)=>{
								formData.Watchers.map((item)=>{
									let filter = Users.filter((c)=>c.uid == item);
									if(filter.length) {
										Api.sendMail(true, filter[0].Email, MailTemplate.updateIssue({...this.formData_copy, Code: issueCode,  ProjectId: ProjectId, TypeId: TypeId}, arrRef.length?{...objData, AttachFile: arrRef}:objData, {Users: Users, Statuses: Statuses, Projects: Projects, Types: Types}), [], (res)=>{
											console.log(res);
										})
									}
								});
							})
						}
						this.setState({
							alert: (
								<SweetAlert
									success
									style={{ display: "block", marginTop: "-100px" }}
									title={t("Updated Success!")}
									showConfirm={false}
									confirmBtnCssClass={
										this.props.classes.button + " " + this.props.classes.success
									}
								>
								</SweetAlert>
							)
						});
						setTimeout(this.handleCancel,700);
					}else{
						this.setState({
							alert: (
								<SweetAlert
									warning
									style={{ display: "block", marginTop: "-100px" }}
									title={t("Error!")}
									showConfirm={false}
									confirmBtnCssClass={
										this.props.classes.button + " " + this.props.classes.success
									}
								>
								</SweetAlert>
							)
						});
						setTimeout(this.handleCancel,700);
					}
				});
				count=2;
			});
			
			this.setState({ errorAdd: false, errorMessage: null});
		}
	}
  render() {
    const { classes, Projects, Types, Statuses, Issues, Users, Priorities, t, i18n } = this.props;
		const {alert, ProjectId, issueId, notification, formData, modal_title, visible_edit, visible_update, errorAdd} = this.state;
    return (
      <GridContainer>
				{alert}
				<Modal className={"CustomModal1"}
					title={modal_title}
					visible={visible_edit || visible_update}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						errorAdd?<span style={{color: "red", paddingRight: "10px"}}> {this.state.errorMessage || t("You must fill all the required (*) information")}</span>:null,
						<Button key="submit" onClick={visible_edit?this.submitForm:this.submitUpdate} color='success' size="sm">{visible_edit ? t("Save") : t("Update")}</Button>,
						<Button style={{margin: ".3125rem 1px"}} key="cancel" onClick={this.handleCancel} size='sm'>{t("Cancel")}</Button>
					]}
					width={window.screen.width>1000?'calc(100vw - 200px)':1000}
				>
					{visible_edit || visible_update? (
						<Card style={{boxShadow: 'unset', marginTop: '0px', marginBottom: '0px'}}>
							<CardBody style={{padding: "0 20px"}}>
								<FormIssue 
									Issues={Issues}
									Users={Users}
									Projects={Projects}
									Types={Types}
									Statuses={Statuses}
									Priorities={Priorities}
									
									formData={formData}
									notification={notification}
									ProjectId={ProjectId} 
									onChange={(data)=>this.setState(data)}
									editEnable={visible_edit}
									IssueId={issueId}
								/>
							</CardBody>
						</Card>
					) : null}
				</Modal>
      </GridContainer>
    );
  }
}

Issue.propTypes = {
  classes: PropTypes.object
};

export default connect(function(state){
		return {
			User: state.User, 
			User_Function: state.User_Function
		}
})(withTranslation("translations")(withStyles((theme)=>({
	...extendedTablesStyle
}))(Issue)));;
