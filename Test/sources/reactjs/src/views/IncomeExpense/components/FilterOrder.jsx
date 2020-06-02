import React, { Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import Collapse from "@material-ui/core/Collapse";
import { connect } from "react-redux";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import Filter from "assets/img/icons/filter.png";
import FilterActive from "assets/img/icons/filter-active.png";
import EventIcon from '@material-ui/icons/Event';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import moment from "moment";
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import "react-datepicker/dist/react-datepicker.css";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
	DatePicker
} from "@material-ui/pickers";
import "date-fns";
import Constants from "variables/Constants/";

const styles = {
    label: {
        xs: 4,
        sm: 3,
        md: 2,
		lg: 2,
		style: {fontSize: 13}
    },
    labeTo: {
        xs: 4,
        sm: 1,
		md: 1,
        lg: 2
    },
    input: {
        xs: 8,
        sm: 9,
        md: 3,
        lg: 2
    },
    amountInput: {
        xs: 8,
        sm: 4,
        md: 4,
        lg: 2
    },
    dateTime: {
        xs: 8,
        sm: 4,
        md: 4,
        lg: 2
    },
    break: {
        xs: false,
        sm: false,
        md: false,
        lg: 4
    },
    note: {
        xs: 8,
        sm: 9,
        md: 9,
        lg: 10
    }
};

class CardFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			isExpanded: false,
			fromdate:"",
			calendar:null,
			history:false,
			today:false
        };

        this.props.onChange(this.props.defaultValue);
    }

    onChange = (field, value) => {
        let formData = {
            ...this.props.value,
            [field]: value
        };
		
		this.props.onChange(formData)
	};
	

    render() {
        const { classes, t, isExport, isShowFilter } = this.props;
        const { isExpanded } = this.state;
		const formData = this.props.value || {};
		let calendar = new Date(formData.fromDate)
		calendar = calendar.getDate() + "/"+ parseInt(calendar.getMonth()+1) +"/"+calendar.getFullYear();
		const handleChange = (event) => {
			if(event.target.value!==" "){
				let date = new Date(formData.toDate)
				let month = date.getMonth()-event.target.value
				this.setState({fromdate:event.target.value})
				date.setMonth(month)
				this.onChange("fromDate", moment(date).startOf('day'))
			}
			else{
				return this.setState({history:true})
			}
		  };
        return (
			<Fragment>
				<Card>
					<CardBody style={{ paddingTop: 0, position: 'relative' }} className = {'Custom-MuiGrid-item'}>
						<img src={isExpanded ? FilterActive : Filter} 
							style={{
								width: 25, 
								height: 25, 
								position: 'absolute', 
								top: 20,
								cursor: 'pointer'
							}}
							onClick={() =>
								this.setState({ isExpanded: !isExpanded })
							}
						/>
						<GridContainer style={{ margin: 0 }}>
							<GridItem {...styles.label}>
								<FormLabel
									className={classes.labelHorizontal}
								>
									{t("Card Code") + ": "}
								</FormLabel>
							</GridItem>
							<GridItem {...styles.input}>
								<CustomInput
									formControlProps={{
										fullWidth: true
									}}
									inputProps={{
										type: "text",
										value: formData.cardCode,
										onChange: e =>
											this.onChange(
												"cardCode",
												e.target.value
											)
									}}
								/>
							</GridItem>
						</GridContainer>
						<Collapse in={isExpanded} unmountOnExit>
							<GridContainer style={{ margin: 0 }}>
								<GridItem {...styles.label}>
									<FormLabel
										className={classes.labelHorizontal}
									>
										{t("From") + ": "}
									</FormLabel>
								</GridItem>
								<GridItem style={{marginTop:'-15px'}}
									{...styles.dateTime}
								>
									<GridContainer>
										<GridItem sx={9} sm={9} md={9} lg={9} >
											<Select 
											value={" "}
											onChange={handleChange}
											>
												<MenuItem style={{backgroundColor:'#3f51b5',color:'#FFF'}} value={" "}>{calendar}</MenuItem>
												<MenuItem value={1}>1 tháng trước</MenuItem>
												<MenuItem value={3}>3 tháng trước</MenuItem>
												<MenuItem value={6}>6 tháng trước</MenuItem>
												<MenuItem value={12}>1 năm trước</MenuItem>
											</Select>
											<MuiPickersUtilsProvider utils={DateFnsUtils} locale={Constants.LOCALE}>
												<DatePicker
												style={{visibility:'hidden',position:'absolute',marginLeft:'-180px'}}
												open={this.state.history}
												onOpen={()=>this.setState({history:true})}
												onClose={()=>this.setState({history:false})}
												autoOk
												format="dd/MM/yyyy"
												variant="inline"
												DialogProps
												value={formData.fromDate}
												onChange={date => this.onChange("fromDate", moment(date).startOf('day'))}
										/></MuiPickersUtilsProvider>
										</GridItem>
										<GridItem xs={1} sm={1} md={1} lg={1}>
											<EventIcon style={{cursor: 'pointer'}} onClick={()=>this.setState({history:true})}/>
										</GridItem>
									</GridContainer>
								</GridItem>
								<GridItem {...styles.labeTo}>
									<FormLabel
										className={classes.labelHorizontal}
									>
										{t("To") + ": "}
									</FormLabel>
								</GridItem>
								<GridItem style={{marginTop:'-10px'}} {...styles.dateTime}>
									<GridContainer>
									<GridItem sx={9} sm={9} md={9} lg={9} >
									<MuiPickersUtilsProvider utils={DateFnsUtils} locale={Constants.LOCALE}>
										<DatePicker
											autoOk
											onOpen={()=>this.setState({today:true})}
											open={this.state.today}
											onClose={()=>this.setState({today:false})}
											format="dd/MM/yyyy"
											value={formData.toDate}
											onChange={date => this.onChange("toDate", date)}
											variant = "inline"
										/>
										</MuiPickersUtilsProvider>
										</GridItem>
										<GridItem xs={1} sm={1} md={1} lg={1}>
											<EventIcon style={{cursor: 'pointer'}} onClick={()=>this.setState({today:true})}/>
										</GridItem>
										</GridContainer>
									
									
							</GridItem>
							</GridContainer>
							<GridContainer style={{ margin: 0 }}>
								<GridItem {...styles.label}>
									<FormLabel
										className={classes.labelHorizontal}
									>
										{t("Amount From") + ": "}
									</FormLabel>
								</GridItem>
								<GridItem {...styles.amountInput}>
									<CustomInput
										formControlProps={{
											fullWidth: true
										}}
										inputProps={{
											type: "text",
											value: ExtendFunction.FormatNumber(
												formData.fromAmount
											),
											onChange: e =>
												this.onChange(
													"fromAmount",
													e.target.value.replace(
														/[^0-9]/g,
														""
													)
												),
											inputProps: {
												onClick: e => {
													let value = e.target.value;
													e.target.value = value === "0" ? "" : value;
												},
												style: {textAlign: 'right'}
											}
										}}
									/>
								</GridItem>
								<GridItem {...styles.labeTo}>
									<FormLabel
										className={classes.labelHorizontal}
									>
										{t("To") + ": "}
									</FormLabel>
								</GridItem>
								<GridItem {...styles.amountInput}>
									<CustomInput
										formControlProps={{
											fullWidth: true
										}}
										inputProps={{
											type: "text",
											value: ExtendFunction.FormatNumber(
												formData.toAmount
											),
											onChange: e =>
												this.onChange(
													"toAmount",
													e.target.value.replace(
														/[^0-9]/g,
														""
													)
												),
											inputProps: {
												onClick: e => {
													let value = e.target.value;
													e.target.value = value === "0" ? "" : value;
												},
												style: {textAlign: 'right'}
											}
										}}
									/>
								</GridItem>
							</GridContainer>
						</Collapse>
						<GridContainer style={{ height: 0, paddingBottom: '10px' }}>
							<GridItem
								xs={12}
								style={{ marginTop: "30px", textAlign: "center" }}
							>
								<Button
									onClick={() =>
										this.setState({ isExpanded: !isExpanded })
									}
									style={{
										position: "absolute",
										bottom: "-13px",
										color: "#3C4858",
										backgroundColor: "#ffff",
										width: '50px'
									}}
									justIcon
									round
									size="sm"
								>
									{isExpanded ? (
										<KeyboardArrowUp
											className={classes.icons}
										/>
									) : (
										<KeyboardArrowDown
											className={classes.icons}
										/>
									)}
								</Button>
							</GridItem>
						</GridContainer>
					</CardBody>
				</Card>
			</Fragment>
        );
    }
}

export default connect(function(state) {
    return {
        User: state.reducer_user.User,
        reducer_import_card: state.reducer_import_card
    };
})(
    withTranslation("translations")(
        withStyles(theme => ({
            ...extendedFormsStyle,
            ...extendedTablesStyle
        }))(CardFilter)
    )
);
