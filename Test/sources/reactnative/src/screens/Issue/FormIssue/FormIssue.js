import React, { Component } from "react";
import Axios from 'axios';
import { serverURL } from 'server/config/config';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text,
	Textarea,
	Picker,
	IconNB,
	ListItem,
	CheckBox
} from "native-base";
import {TextInput} from 'react-native';
import UploadButton from "components/UploadButton";
import MultiSelect from "components/MultiSelect";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import styles from "./styles";

const completePercent = [];
for(let i = 0; i <= 100; i+=5) {
	completePercent.push(i);
}
class FormIssue extends Component {
	constructor(props) {
		super(props);
		this.defaultValues = {
			TypeId: 6,
			StatusId: 1,
			PriorityId: '-LocORx70KOgjb6aQgMH'
		};
		this.state = {
			formData: this.defaultValues || this.props.formData,
			Types: [],
			Statuses: [],
			Priorities: [],
			Assignees: [],
			Users: [],
			startDateVisible: false,
			endDateVisible: false
		};
		this.ProjectId = "-Lo4eStNFxQFeRhUnu1s"
	}
	componentDidMount = ()=>{
		Axios.post(serverURL + '/getData',{ref:"IssueType"})
		.then(res => {
				this.setState({Types: res.data});
		})
		.catch(err => console.log(err));
		Axios.post(serverURL + '/getData',{ref:"IssueStatus"})
		.then(res => {
				this.setState({Statuses: res.data});
		})
		.catch(err => console.log(err));
		Axios.post(serverURL + '/getData',{ref:"Priority"})
		.then(res => {
				this.setState({Priorities: res.data});
		})
		.catch(err => console.log(err));
		Axios.post(serverURL + '/getData',{ref:"User"})
		.then(res => {
				let user = res.data;
				Axios.post(serverURL + '/getData',{ref:"ProjectRole", child: "ProjectId", childValue: this.ProjectId})
				.then(res => {
						this.setState({Users: user, Assignees: res.data});
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
		
	}
	handleChange = (key, value)=>{
		this.setState((prev)=>({formData: {...prev.formData, [key]: value}}));
	}
	hideDateTimePicker = ()=>{
		console.log(this.startDateRef);
		this.startDateRef.blur();
		this.endDateRef.blur();
		this.setState({startDateVisible: false, endDateVisible: false});
	}
  render() {
		const {formData, Types, Statuses, Priorities, Users, Assignees, startDateVisible, endDateVisible} = this.state;
    return (
			<Form>
				<Item inlineLabel success>
					<Label>Issue name</Label>
					<Input onPress={()=>console.log("abc")}/>
					<IconNB name="ios-checkmark-circle" />
				</Item>
				<Content padder>
					<Textarea rowSpan={5} bordered placeholder="Description" />
				</Content>
				<Item inlineLabel success>
					<Label>Type</Label>
					<Picker
						mode="dropdown"
						iosIcon={<Icon name="ios-arrow-down" />}
						style={{ width: undefined}}
						selectedValue={this.state.formData['TypeId']}
						onValueChange={(value)=>this.handleChange('TypeId', value)}
					>
						{Types.map((item)=>{
							return <Item label={item.Name} value={item.Key} key={item.Key} />
						})}
					</Picker>
					<IconNB name="ios-checkmark-circle" />
				</Item>
				<Item inlineLabel success>
					<Label>Status</Label>
					<Picker
						mode="dropdown"
						iosIcon={<Icon name="ios-arrow-down" />}
						style={{ width: undefined}}
						selectedValue={this.state.formData['StatusId']}
						onValueChange={(value)=>this.handleChange('StatusId', value)}
					>
						{Statuses.map((item)=>{
							return <Item label={item.Name} value={item.Key} key={item.Key} />
						})}
					</Picker>
					<IconNB name="ios-checkmark-circle" />
				</Item>
				<Item inlineLabel success>
					<Label>Assignee</Label>
					<Picker
						mode="dropdown"
						iosIcon={<Icon name="ios-arrow-down" />}
						style={{ width: undefined}}
						selectedValue={this.state.formData['AssigneeId']}
						onValueChange={(value)=>this.handleChange('AssigneeId', value)}
					>
						{Assignees.map((item)=>{
							
							return <Item label={Users.find((i)=>item.UserId == i.Key).FullName} value={item.UserId} key={item.UserId} />
						})}
					</Picker>
					<IconNB name="ios-checkmark-circle" />
				</Item>
				<Item inlineLabel success>
					<Label>Priority</Label>
					<Picker
						mode="dropdown"
						iosIcon={<Icon name="ios-arrow-down" />}
						style={{ width: undefined}}
						selectedValue={this.state.formData['PriorityId']}
						onValueChange={(value)=>this.handleChange('PriorityId', value)}
					>
						{Priorities.map((item)=>{
							return <Item label={item.Value} value={item.Key} key={item.Key} />
						})}
					</Picker>
					<IconNB name="ios-checkmark-circle" />
				</Item>
				
				<Item inlineLabel success>
					<Label>Start date</Label>
					<TextInput 
						ref={(ref)=> this.startDateRef = ref} 
						style={{width: 200}} 
						onFocus={()=>this.setState({startDateVisible: true})}
						value={moment.unix(formData.StartDate).isValid()?moment.unix(formData.StartDate).format('HH:mm:ss DD/MM/YYYY'):''}
					/>
					<IconNB name="ios-checkmark-circle" style={{position: 'absolute', right: 0}}/>
					<DateTimePicker
						mode= {'datetime'}
						isVisible={startDateVisible}
						onConfirm={(value)=>{this.handleChange('StartDate', moment(value).unix()); this.hideDateTimePicker();}}
						onCancel={this.hideDateTimePicker}
					/>
				</Item>
				<Item inlineLabel success>
					<Label>End date</Label>
					<TextInput 
						ref={(ref)=> this.endDateRef = ref} 
						value={moment.unix(formData.EndDate).isValid()?moment.unix(formData.EndDate).format('HH:mm:ss DD/MM/YYYY'):''} 
						style={{width: 200}} 
						onFocus={()=>this.setState({endDateVisible: true})}
					/>
					<IconNB name="ios-checkmark-circle" style={{position: 'absolute', right: 0}}/>
					<DateTimePicker
						mode = {'datetime'}
						isVisible={endDateVisible}
						onConfirm={(value)=>{this.handleChange('EndDate', moment(value).unix());this.hideDateTimePicker();}}
						onCancel={this.hideDateTimePicker}
					/>
				</Item>
				<Item inlineLabel success>
					<Label>Complete</Label>
					<Picker
						mode="dropdown"
						iosIcon={<Icon name="ios-arrow-down" />}
						style={{ width: undefined}}
						selectedValue={formData.CompletePercent}
						onValueChange={(value)=>this.handleChange('CompletePercent', value)}
					>
						{completePercent.map((item)=>{
							return <Item label={item.toString()} value={item} key={'complete_'+item} />
						})}
					</Picker>
					<IconNB name="ios-checkmark-circle" />
				</Item>
				<Item inlineLabel>
					<Label>Upload file</Label>
					<UploadButton />
				</Item>
				<Item inlineLabel>
					<MultiSelect
						data={
							Assignees.map((item)=>{
								return {id: item.UserId, name: Users.find((i)=>item.UserId == i.Key).FullName}
							})
						}
					/>
				</Item>
				<Item inlineLabel>
					<Label>Notification</Label>
					<CheckBox
						checked={formData.Notification == '1'}
						onPress={() => this.handleChange('Notification', formData.Notification=='1'?'0':'1')}
					/>
				</Item>
			</Form>
    );
  }
}

export default FormIssue;
