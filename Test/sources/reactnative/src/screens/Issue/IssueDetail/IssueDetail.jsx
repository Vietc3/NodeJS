
import React from "react";
import PropTypes from "prop-types";
// react component for creating dynamic tables
import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Build from "@material-ui/icons/Build";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import Database from "MyFunction/Database/Database";

import {connect} from "react-redux";

import moment from "moment"; 

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import {Link} from 'react-router-dom'

import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";

import 'antd/dist/antd.css';
import { Select, Icon, Divider, Input, Table, Modal } from 'antd';

import UpdateIssue from 'views/Issue/UpdateIssue/UpdateIssue';
import { getAssignedUsersInProject } from "MyFunction/Database/Project";
const { Option } = Select;

const formatDate = 'DD/MM/YYYY';
const formatDateTime = 'DD/MM/YYYY HH:mm:ss';

class Issue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			IssueHistory: [], 
			CurrentIssue: null, 
			Types: [], 
			Statuses: [], 
			Users: [], 
			Projects: [],
			arrRef: [],
			arrRefHistory: null,
			notification: 'no',
			alert: null
		}
		this.Database = {};
		this.editIssue = null;
		this.updateIssue = null;
  }
	
	componentDidMount() {
		Database.getIssue([this.props.match.params.ProjectId], (Issue, User, Type, Status, Priority)=>{
			this.Database.CurrentIssue = Issue.find((item)=>item.id == this.props.match.params.IssueId)||{};
			this.Database.Issues = Issue;
			// this.Database.Users = User;
			this.Database.Types = Type;
			this.Database.Statuses = Status;
			this.Database.Priorities = Priority;
			Database.getIssueHistory(this.props.match.params.IssueId, (IssueHistory)=>{
				this.Database.IssueHistory = IssueHistory;
				
				Database.getProject((Project)=>{
					this.Database.Projects = Project;
					Database.getRefFromUrl(this.Database.CurrentIssue.AttachFile || [], (arrRef)=>{
						this.Database.arrRef = arrRef;
						this.Database.arrRefHistory = null;
						this.setState(this.Database, ()=>{
							// this.createTableData();
						});
					})
				});
			});
		});
		getAssignedUsersInProject(this.props.match.params.ProjectId, Users => {
			this.Database.Users = Users;
		})
	}
	componentWillUnmount(){
		Database.offListener();
	}
	listHistory = ()=>{
		let {IssueHistory, CurrentIssue, Statuses, Users, arrRefHistory} = this.state;
		let {classes, Project_Function, User} = this.props;
		let _firstHistory = JSON.parse(JSON.stringify(IssueHistory[0]));
		let html = [];
		for(let i = 0; i < IssueHistory.length-1; i++){
			let li = [];
			let firstHistory = JSON.parse(JSON.stringify(_firstHistory))
			if(IssueHistory[i+1].StatusId) {
				let oldValue = Statuses.find((item)=> item.id == firstHistory.StatusId).Name;
				let newValue = Statuses.find((item)=> item.id == IssueHistory[i+1].StatusId).Name;
				li.push(
					<li key={'status_'+IssueHistory[i+1].CreatedDateTime}><span style={{fontWeight: 700}}>Status </span>changed from <em>{oldValue}</em> to <em>{newValue}</em></li>
				);
				firstHistory.StatusId = IssueHistory[i+1].StatusId;
			}
			if(IssueHistory[i+1].AssigneeId) {
				let oldValue = Users.find((item)=> item.UserId == firstHistory.AssigneeId).UserName;
				let newValue = Users.find((item)=> item.UserId == IssueHistory[i+1].AssigneeId).UserName;
				li.push(
					<li key={'assignee_'+IssueHistory[i+1].CreatedDateTime}><span style={{fontWeight: 700}}>Assignee </span>changed from <em>{oldValue}</em> to <em>{newValue}</em></li>
				);
				firstHistory.AssigneeId = IssueHistory[i+1].AssigneeId;
			}
			if(IssueHistory[i+1].CompletePercent) {
				li.push(
					<li key={'complete_'+IssueHistory[i+1].CreatedDateTime}><span style={{fontWeight: 700}}>Complete percent </span>changed from <em>{firstHistory.CompletePercent}</em> to <em>{IssueHistory[i+1].CompletePercent}</em></li>
				);
				firstHistory.CompletePercent = IssueHistory[i+1].CompletePercent;
			}
			if(IssueHistory[i+1].WorkingTime) {
				li.push(
					<li key={'workingtime_'+IssueHistory[i+1].CreatedDateTime}><span style={{fontWeight: 700}}>Time log </span><em>{IssueHistory[i+1].WorkingTime} hours</em></li>
				);
			}
			if(IssueHistory[i+1].Description) {
				li.push(
					<li key={'description_'+IssueHistory[i+1].CreatedDateTime}><span style={{fontWeight: 700}}>Comment</span>
						<div style={{paddingLeft: "40px"}} dangerouslySetInnerHTML={{__html: IssueHistory[i+1].Description}}></div>
					</li>
				);
			}
			if(IssueHistory[i+1].AttachFile) {
				li.push(
					<li key={'attachfile_'+IssueHistory[i+1].CreatedDateTime}><span style={{fontWeight: 700}}>Attachment</span>
						<div style={{paddingLeft: "40px"}}>
							<ol style={{paddingLeft: 0}}>
								{
									IssueHistory[i+1].arrUrl.map((item, index)=>{
										return (
											<li key={'file_'+index}><a href={item.url} target={'_blank'} style={{paddingRight: '20px'}}>{item.ref.name}</a>
											</li>
										)
									})
								}
							</ol>
						</div>
					</li>
				);
			}
			html.push(
				<div style={{paddingRight: "10px", marginBottom: "20px"}}  key={'history_'+IssueHistory[i+1].CreatedDateTime}>
					<p style={{display: 'inline-block', paddingRight: '10px'}}>Updated by <Link>{Users.find((item)=> item.UserId == IssueHistory[i+1].Creator).UserName}</Link> at {moment.unix(IssueHistory[i+1].CreatedDateTime).format(formatDateTime)}</p>
					{Project_Function[CurrentIssue.ProjectId].DELETE_ISSUEHISTORY?
					<Button style={{padding: '2px'}} color="danger" title={"Update"} className={classes.actionButton} size='sm' onClick={()=>this.removeHistory(IssueHistory[i+1].id)}>
						 <Delete className={classes.icon} />
					</Button>:null}
					{CurrentIssue.AssigneeId=User.id?
					<Button style={{padding: '2px'}} color="danger" title={"Update"} className={classes.actionButton} size='sm' onClick={()=>this.removeHistory(IssueHistory[i+1].id)}>
					<Delete className={classes.icon} />
			   </Button>:null
					}
					<hr style={{margin: '0px', marginBottom: '10px'}}/>
					<ul>
						{li}
					</ul>
				</div>
			);
			_firstHistory = firstHistory;
		}
		return html.reverse();
	}
	removeHistory = (id)=>{
		let {classes} = this.props;
		this.setState({
			alert: (
				<SweetAlert
					warning
					showConfirm={false}
					showCancel={false}
					style={{ display: "block", marginBottom: "100px" }}
					title={"Are you sure?"}
					onCancel={()=>this.handleCancel()}
					onConfirm={()=>{}}
				>
					<div style={{fontSize: '20px'}}>
						{"You will not be able to recover this data"}!
					</div>
					<div style={{textAlign: "center", paddingTop: "20px"}}>
						<Button color="success" className={classes.marginRight} onClick={() => {
							Database.removeIssueHistory(id);
							this.handleCancel();
						}}>
							{"Delete"}
						</Button>
						<Button color="danger" className={classes.marginRight} onClick={() => this.handleCancel()}>
							{"Cancel"}
						</Button>
					</div>
				</SweetAlert>
			)
		});
	}
	handleCancel = () => {
    this.setState({ alert: null});
  };
  render() {
    const { classes, User, Project_Function } = this.props;
		const {CurrentIssue, IssueHistory, Users, Projects, Priorities, Statuses, Types, Issues, arrRef, notification, alert} = this.state;
		let CreatedUser = Users.find((item)=>item.UserId == CurrentIssue.Creator);
		let LastUpdatedUser = Users.find((item)=>item.UserId == IssueHistory[IssueHistory.length-1].Creator);

		return (
      <GridContainer style={{fontSize: 15}}>
				{alert}
        <GridItem xs={12}>
					{CurrentIssue?
          <Card>
						<CardBody>
							<GridContainer>
								<GridItem xs={12} sm={6} md={6} lg={6}>
									<Button style={{padding: '3px 7px 3px 3px'}} color="twitter" title={"Edit"}  className={classes.marginRight} size='sm' onClick={()=>this.props.history.goBack()}>
									 <KeyboardBackspace className={classes.icon} /> Back
									</Button>
									<h4 className={classes.cardIconTitle} style={{fontWeight: 500, display:'inline-block', marginTop: '10px'}}>{Types.find((item)=>item.id == CurrentIssue.TypeId).Name+' #'+CurrentIssue.Code+': '}<span style={{color: '#40a9ff'}}>{CurrentIssue.Name}</span></h4>
								</GridItem>
								<GridItem xs={12} sm={6} md={6} lg={6} style={{textAlign: 'right'}}>
									
									<Button style={{padding: '3px 7px 3px 3px'}} color="success" title={"Edit"}  className={classes.marginRight} size='sm' onClick={()=>this.editIssue(null, CurrentIssue)} disabled={!Project_Function[CurrentIssue.ProjectId].EDIT_ISSUE}>
									 <Edit className={classes.icon} /> Edit issue
									</Button>
									<Button style={{padding: '3px 7px 3px 3px'}} color="info" title={"Edit"}  className={classes.marginRight} size='sm' onClick={()=>this.updateIssue(null, CurrentIssue)} disabled={!Project_Function[CurrentIssue.ProjectId].UPDATE_ISSUE}>
									 <Build className={classes.icon} /> Update issue
									</Button>
								</GridItem>
							</GridContainer>
							<GridContainer style={{paddingTop: '20px'}}>
								{Users.length?<GridItem xs={12}>{'Added by '}
								<Link>{Users.find((item)=>item.UserId == CurrentIssue.Creator).UserName}</Link>
								{' at '+moment.unix(CurrentIssue.CreatedDateTime).format(formatDateTime)}</GridItem>:null}
							</GridContainer>
							<GridContainer>
								{IssueHistory.length>0?<GridItem xs={12}>{'Last updated by '}
									<Link>{LastUpdatedUser.UserName}</Link>
								{' at '+moment.unix(IssueHistory[IssueHistory.length-1].CreatedDateTime).format(formatDateTime)}</GridItem>:null}
							</GridContainer>
							{Projects.length?(
								<div style={{paddingTop: '20px'}}>
									<GridContainer className={'Detail_Issue_Table'}>
										<GridItem xs={6} sm={3} md={3} lg={2} style={{fontWeight: 700}}>Project</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2} ><Link>{Projects.find((item)=>item.id == CurrentIssue.ProjectId).Name}</Link></GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2} style={{fontWeight: 700}}>Priority</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2} >{Priorities.find((item)=>item.id == CurrentIssue.Priority).Name}</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2} style={{fontWeight: 700}}>Assignee</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2}><Link>{Users.find((item)=>item.UserId == CurrentIssue.AssigneeId).UserName}</Link></GridItem>
										
										<GridItem xs={6} sm={3} md={3} lg={2} style={{fontWeight: 700}}>Completed</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2}>{CurrentIssue.CompletePercent+' %'}</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2} style={{fontWeight: 700}}>Start date</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2}>{moment.unix(CurrentIssue.StartDate).format(formatDateTime)}</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2} style={{fontWeight: 700}}>End date</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2}>{moment.unix(CurrentIssue.EndDate).format(formatDateTime)}</GridItem>

										<GridItem xs={6} sm={3} md={3} lg={2} style={{fontWeight: 700}}>Status</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2}>{Statuses.find((item)=>item.id == CurrentIssue.StatusId).Name}</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2} style={{fontWeight: 700}}>Spent time</GridItem>
										<GridItem xs={6} sm={3} md={3} lg={2}></GridItem>
										
									</GridContainer>
								</div>
							):null}
							<GridContainer style={{paddingTop: '20px'}}>
								<GridItem xs={12}><h4 style={{fontWeight: 500}}>Attachment</h4></GridItem>
								<GridItem xs={12}>
									<ol>
										{
											arrRef.map((item, index)=>{
												return (
													<li key={'historyfile_'+index}><a href={item.url} target={'_blank'} style={{paddingRight: '20px'}}>{item.ref.name}</a>
													</li>
												)
											})
										}
									</ol>
								</GridItem>
							</GridContainer>
							<GridContainer style={{paddingTop: '10px'}}>
								<GridItem xs={12}><h4 style={{fontWeight: 500}}>Description</h4></GridItem>
								<GridItem xs={12}><div dangerouslySetInnerHTML={{__html: CurrentIssue.Description}}></div></GridItem>
							</GridContainer>
							<GridContainer style={{paddingTop: '20px'}}>
								<GridItem xs={12}><h3 style={{fontWeight: 700}}>History</h3></GridItem>
								<GridItem xs={12}>
									{this.listHistory()}
								</GridItem>
							</GridContainer>
						</CardBody>
						
						<UpdateIssue 
							Users={Users}
							Projects={Projects}
							Types={Types}
							Statuses={Statuses}
							Issues={Issues}
							Priorities={Priorities}
							
							notification={notification}
							send={(editIssue, updateIssue)=>{
								this.editIssue = editIssue;
								this.updateIssue = updateIssue;
							}}
						/>
					</Card>:null}
        </GridItem>
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
			User_Function: state.User_Function,
			Project_Function: state.Project_Function
		}
})(withStyles((theme)=>({
	...extendedTablesStyle
}))(Issue));;
