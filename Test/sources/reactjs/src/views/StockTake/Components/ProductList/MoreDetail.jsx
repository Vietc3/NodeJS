import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import { connect } from "react-redux";
import moment from "moment";
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import "react-datepicker/dist/react-datepicker.css";
import 'date-fns';
import MoreDetailProduct from "../SubProductForm/MoreDetailProduct";
import Constants from 'variables/Constants/';

// coded by Le Na

const completePercent = [];
for (let i = 0; i <= 100; i += 5) {
    completePercent.push(i.toString());
}
const styles = {
    label: {
        xs: 5,
        sm: 4,
        md: 2,
        lg: 2
    },
    input: {
        xs: 7,
        sm: 8,
        md: 4,
        lg: 4
    },
    checkbox: {
        xs: 12,
        sm: 9,
        md: 1,
        lg: 1
    },
    break: {
        xs: false,
        sm: false,
        md: 6,
        lg: 6
    },
    note: {
        xs: 7,
        sm: 8,
        md: 10,
        lg: 10
    },
    title: {
        xs: 10,
        sm: 10,
        md: 10,
        lg: 10,
        style: { fontWeight: "bold", fontSize: "13px", textAlign: "left", color: "#6baa47", padding: 0}
    },
};

Object.filter = function(obj, predicate) {
    let result = {},
        key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};

const timeCodeFormat = "DDMMYYYY";

class FormIssue extends React.Component {
    constructor(props) {
        super(props);
        let defaultFormData = this.props.defaultFormData || {
            formData: {},
            productData: []
        };
    }
 
    render() {
        const { classes, t, defaultFormData, isExport, reducer_import_export_card} = this.props;
        // console.log(defaultFormData);
        // console.log(reducer_import_export_card);
        
        const {
            Customer_Provider,
            Customer_Producer,
            Customer_Only,
            Product,
            Sale,
			Store
        } = reducer_import_export_card;

        let Customer = [];

        if (isExport) {
            if (Customer_Only) Customer = Customer.concat(Customer_Only.data);
        } else {
            if (Customer_Provider)
                Customer = Customer.concat(Customer_Provider.data);
            if (Customer_Producer)
                Customer = Customer.concat(Customer_Producer.data);
        }

        let formData = defaultFormData.formData;
        let productData = defaultFormData.productData;
        // console.log(Sale);
        

        return (
            <div>
                <GridContainer className = {'Custom-MuiGrid-item'} >
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer style={{ margin: "-15px 0px 10px 0px", width: "100%" }}>

                            <GridItem {...styles.label}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t(isExport ? "Client" : "Provider") + ": "}
                                </FormLabel>
                            </GridItem>

                            <GridItem {...styles.input}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {Customer.sort((a, b) => a.Name ? a.Name.toString().localeCompare(b.Name) : "").map((item) => {
                                        if (item.ID === formData.CustomerID)
                                            return item.Name 
                                    })}
                                </FormLabel>
                            </GridItem>

                            <GridItem {...styles.label}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t("Create Date") + ": "}
                                </FormLabel>
                            </GridItem>

                            <GridItem {...styles.input}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {moment(formData.Time, Constants.DATABASE_DATE_TIME_FORMAT_STRING).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) }
                                </FormLabel>
                            </GridItem>

                            {isExport ? (
                                <>
                                    <GridItem {...styles.label}>
                                        <FormLabel className={classes.labelHorizontal}>
                                            {t("Sale") + ": "}
                                        </FormLabel>
                                    </GridItem>
                                    <GridItem {...styles.input}>
                                        <FormLabel className={classes.labelHorizontal}>
                                            {Sale ? Sale.data.sort((a, b) => a.Name ? a.Name.toString().localeCompare(b.Name) : "").map((item) => {
                                                if (item.ID === formData.SaleID)
                                                    return item.Name 
                                            }) : null}
                                            {/* {formData.SaleID} */}
                                        </FormLabel>
                                    </GridItem>
                                </>
                            ) : null}

                            <GridItem {...styles.label}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t("Card Code") + ": "}
                                </FormLabel>
                            </GridItem>

                            <GridItem 
                                {...styles.input}
                            >
                                <FormLabel className={classes.labelHorizontal}>
                                    {formData.Code}
                                </FormLabel>
                            </GridItem>

                            <GridItem {...styles.label}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t("Amount") + ": "}
                                </FormLabel>
                            </GridItem>

                            <GridItem 
                                {...styles.input}
                            >
                                <FormLabel className={classes.labelHorizontal}>
                                    {ExtendFunction.FormatNumber(formData.Amount)}
                                </FormLabel>
                            </GridItem>

                            <GridItem {...styles.label}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t("Notes") + ": "}
                                </FormLabel>
                            </GridItem>

                            <GridItem {...styles.note}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {formData.Notes}
                                </FormLabel>
                            </GridItem>
                                        
                            <MoreDetailProduct 
                                productData = {productData}
                                isExport = {isExport}
                            />

                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default connect()(withTranslation("translations")(withStyles(extendedFormsStyle)(FormIssue)));
