import React from "react";
import { withTranslation } from "react-i18next";
import moment from "moment";
import PropTypes from "prop-types";
import FormatNumber from "MyFunction/FormatNumber.js";
import { Modal, Icon, Input } from "antd";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import Constants from 'variables/Constants/index.js';

const {TextArea} =Input;
const propTypes = {
    visible: PropTypes.bool,
    data: PropTypes.object,
    classes: PropTypes.object.isRequired,
    title: PropTypes.string,
    onCancel: PropTypes.func
};

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
        lg: 4,
        
    },
}

class MoreDetail extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = {
        };
    }
    render() 
    {
        const { classes, title, t, data, onCancel } = this.props;
        return (
            <div>
                <Modal
                    width={1000}
                    title = {title}
                    visible = {this.props.visible}
                    onOk = {this.handleOk}
                    onCancel = {onCancel}
                    footer = {[
                        
                        <ButtonTheme
                            style={{ margin: ".3125rem 1px" }}
                            key="cancel"
                            onClick={onCancel}
                            size="sm"
                            color="danger"
                        >
                            {t("Back")}
                        </ButtonTheme>
                    ]}
                >
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            
                            <Card className="modal-card">
                                <CardBody style = {{paddingTop: 0}}>
                                    <GridContainer className = {'Custom-MuiGrid-item'}>
                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Customer Name")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {data.name}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Customer Code")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {data.code}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Address")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {data.address}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Tel")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {data.tel}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Fax")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {data.fax}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Tax Code")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {data.taxCode}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Fix")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {/* {data.Fix} */}
                                                <Icon
                                                    type="check-circle"
                                                    theme={data.fix ? "twoTone" : undefined}
                                                />
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Type")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {data.type}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Max Debt Amount")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {FormatNumber(parseInt(data.maxDeptAmount))}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Max Debt Day")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {data.maxDeptDays ? moment(data.maxDeptDays).format(Constants.DISPLAY_DATE_FORMAT_STRING) : null}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Quantity In")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {FormatNumber(parseInt(data.totalIn))}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Quantity Out")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {FormatNumber(parseInt(data.totalOut))}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Quantity Deposit")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {FormatNumber(parseInt(data.totalDeposit))}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Quantity Init")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {FormatNumber(parseInt(data.initialDeptAmount))}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Quantity Outstanding")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal} style= {{float: "left"}}>
                                                {FormatNumber(parseInt(data.QtyOutstanding))}
                                            </FormLabel>
                                        </GridItem>
                                        <GridContainer style={{margin:0}}>
                                        <GridItem sx={12} sm={2} md={2} lg={2}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Notes")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem sx={12} sm={10} md={10} lg={10} style={{marginTop:'4px'}}>
                                            <TextArea
                                                    id="notes"
                                                    name= "notes"
                                                    readOnly
                                                    value={data.notes}
                                                    placeholder={t("Trống")}
                                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                                />
                                        </GridItem>
                                        </GridContainer>
                                    </GridContainer>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </Modal>
            </div>
        );
    }
}

MoreDetail.propTypes = propTypes;
export default (withTranslation("translations")(
    withStyles(theme => ({
        ...regularFormsStyle
    }))
    (MoreDetail)
));
