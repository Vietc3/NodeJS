import React from "react";
import { withTranslation } from "react-i18next";

import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from "@material-ui/core/styles/withStyles";
import { Modal } from "antd";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";

class IssueStatusForm extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = {
            objColumn: {}
        };
    }

    onChange = (event) =>{
        let objColumn = this.state.objColumn;
        if(!event.target.checked && objColumn[event.target.name])
        {
            delete objColumn[event.target.name];
            this.setState({
                objColumn: {
                    ...objColumn
                }
            })
        }
            
        else
        {
            if(Object.keys(objColumn).length < 7)
                this.setState({
                    objColumn: {
                        ...objColumn,
                        [event.target.name]: event.target.checked
                    }
                })
        }
    }

    handleSubmit = () => {
        this.props.selectColumn(this.state.objColumn);
    }

    render() 
    {
        const { classes, visibleSelectPDF, t, onCancel } = this.props;
        const {objColumn} = this.state;
        
        return (
            <div>
                
                <Modal
                    className = "CustomModal"
                    title = {t("Select columns to export (max is 7)")}
                    visible = {visibleSelectPDF}
                    onOk = {this.handleSubmit}
                    onCancel = {onCancel}
                    footer = {[
                        <ButtonTheme
                            key = "submit"
                            onClick = {this.handleSubmit}
                            className = {"button-success"}
                            size = "sm"
                        >
                            {t("Export")}
                        </ButtonTheme>,

                        <ButtonTheme
                            style={{ margin: ".3125rem 1px" }}
                            key="cancel"
                            onClick={onCancel}
                            size="sm"
                            className = {"button-default"}
                        >
                            {t("Cancel")}
                        </ButtonTheme>
                    ]}
                    // width={500}
                >
                    <GridContainer>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Code")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "Code"
                                checked={objColumn.Code ? objColumn.Code : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Name")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "Name"
                                checked={objColumn.Name ? objColumn.Name : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Address")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "Address"
                                checked={objColumn.Address ? objColumn.Address : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>

                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Type")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "TypeName"
                                checked={objColumn.TypeName ? objColumn.TypeName : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Rep Name")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "RepName"
                                checked={objColumn.RepName ? objColumn.RepName : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Tel")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "Tel"
                                checked={objColumn.Tel ? objColumn.Tel : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>

                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Mobile")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "Mobile"
                                checked={objColumn.Mobile ? objColumn.Mobile : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Fax")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "Fax"
                                checked={objColumn.Fax ? objColumn.Fax : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Tax Code")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "TaxCode"
                                checked={objColumn.TaxCode ? objColumn.TaxCode : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>

                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Fix")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "Fix"
                                checked={objColumn.Fix ? objColumn.Fix : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Max Debt Amount")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "MaxDebtAmount"
                                checked={objColumn.MaxDebtAmount ? objColumn.MaxDebtAmount : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Max Debt Day")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "MaxDebtDay"
                                checked={objColumn.MaxDebtDay ? objColumn.MaxDebtDay : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>

                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Quantity In")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "QtyIn"
                                checked={objColumn.QtyIn ? objColumn.QtyIn : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Quantity Out")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "QtyOut"
                                checked={objColumn.QtyOut ? objColumn.QtyOut : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Quantity Deposit")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "QtyDeposit"
                                checked={objColumn.QtyDeposit ? objColumn.QtyDeposit : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>

                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Quantity Init")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "QtyInit"
                                checked={objColumn.QtyInit ? objColumn.QtyInit : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Quantity Outstanding")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "QtyOutstanding"
                                checked={objColumn.QtyOutstanding ? objColumn.QtyOutstanding : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                        <GridItem xs={4} sm={2}>
                            <FormLabel className={classes.labelHorizontal}>
                                {t("Notes")}
                            </FormLabel>
                        </GridItem>

                        <GridItem xs={2} sm={2} style={{padding: "0px", marginTop:"40px"}} justify = "flex-end">
                            <Checkbox
                                name = "Notes"
                                checked={objColumn.Notes ? objColumn.Notes : 0}
                                onChange={(event) => this.onChange(event)}
                                color="primary"
                                style = {{height: 24, padding: "0px 0px"}}
                            />
                        </GridItem>
                    </GridContainer>
                </Modal>
            </div>
        );
    }
}


export default (withTranslation("translations")
(
    withStyles(theme => ({
        ...regularFormsStyle
    }))(IssueStatusForm)
));
