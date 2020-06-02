import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import { withTranslation } from "react-i18next";

const propTypes = {
    type: PropTypes.string,
    visible: PropTypes.bool,
    data: PropTypes.object,
    classes: PropTypes.object.isRequired,
    title: PropTypes.string,
    onCancel: PropTypes.func
};

class AddCustomerType extends React.Component 
{
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            title: this.props.title,
            CustomerType: {},
            textAddError: "",
        };
    }

    componentDidMount = () => {
        if(this.props.data)
            this.getData();
    }

    getData = () => {
        this.setState({
            CustomerType: {...this.props.data}
        });
    }

    handleSubmit = () => 
    {
        if (this.props.type === "add") 
        {
            let CustomerType = this.state.CustomerType;
            if(CustomerType.Name && CustomerType.Type )
            {
                this.setState({
                    CustomerType: {
                        ...CustomerType,
                        Fix : CustomerType.Fix ? 1 : 0,
                    }
                }, ()=>{
                    this.props.handleAdd(this.state.CustomerType);
                })
            }
                
            else
                this.setState({
                    textAddError: "Please enter all required * information"
                })
        } 
        else 
        {
            let CustomerType = this.state.CustomerType;
            if(CustomerType.Name && CustomerType.Type)
            {
                delete CustomerType.Action;
                this.props.handleAdd(CustomerType);
            }
                
            else
                this.setState({
                    textAddError: "Please enter all required * information"
                })
        }
    };
  

    handleInputChange = (event) => {
        
        var CustomerType = this.state.CustomerType;
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked ? 1 : 0 : target.value;
        const name = target.name;
        this.setState({
            CustomerType: {
                ...CustomerType,
                [name]: value
            }
        });
    }

    render() {
        const { classes, title, visible, t, data, type,onCancel } = this.props;
        const { CustomerType } = this.state;
        // console.log("bbbbbbb");
        
        return (
            <div>
                <Modal
                    title={title}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={onCancel}
                    footer={[
                        <ButtonTheme
                            key="submit"
                            onClick={this.handleSubmit}
                            className = {"button-success"}
                            size="sm"
                            style={{ margin: ".3125rem 1px",width:"85px" }}
                        >
                            {t("Save")}
                        </ButtonTheme>,

                        <ButtonTheme
                            style={{ margin: ".3125rem 1px" }}
                            key="cancel"
                            onClick={this.props.onCancel}
                            size="sm"
                            className = {"button-danger"}
                        >
                            {t("Cancel")}
                        </ButtonTheme>
                    ]}
                >
                    <GridContainer style={{ height: window.innerHeight < 900 ? 'calc(100vh - 130px)' : null }}>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card className="modal-card">
                                <CardBody>
                                    <form onKeyDown={(e) => {if (e.keyCode===13) {this.handleSubmit(e)}}}>
                                        <GridContainer className="custom-modal-input custom-modal-input-first">
                                            <GridItem xs={4} sm={2}>
                                                <FormLabel className={classes.labelHorizontal}>
                                                    {t("Name")}
                                                    <span style={{ color: 'red' }}>&nbsp;*</span>
                                                </FormLabel>
                                            </GridItem>

                                            <GridItem xs={8} sm={3}>
                                                <CustomInput
                                                    id="Name"
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: "Name",
                                                        type: "text",
                                                        value: CustomerType.Name,
                                                        onChange: (e) => e.target.value.length < 30 ? this.handleInputChange(e) : null,
                                                    }}
                                                    helpText={t("Name")}
                                                />
                                            </GridItem>

                                            <GridItem xs={4} sm={2}>
                                                <FormLabel className={classes.labelHorizontal}>
                                                    {t("Type")} 
                                                    <span style={{ color: 'red' }}>&nbsp;*</span>
                                                </FormLabel>
                                            </GridItem>

                                            <GridItem xs={8} sm={3}>
                                                <CustomInput
                                                    id="Type"
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        name: "Type",
                                                        type: "text",
                                                        value: CustomerType.Type,
                                                        onChange: (e) => e.target.value.length < 30 ? this.handleInputChange(e) : null,
                                                    }}
                                                    helpText={t("Type")}
                                                />
                                            </GridItem>

                                            <GridItem xs={4} sm={1}>
                                                <FormLabel className={classes.labelHorizontal}>
                                                    {t("Fix")}
                                                </FormLabel>
                                            </GridItem>

                                            <GridItem xs={8} sm={1} style={{padding: "0px", marginTop:"25px"}}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name = "Fix"
                                                            checked={CustomerType.Fix}
                                                            onChange={this.handleInputChange}
                                                            color="primary"
                                                        />
                                                    }
                                                />
                                            </GridItem>
                                        </GridContainer>

                                        <GridContainer justify="center">
                                            <FormLabel className={classes.labelLeftHorizontal}> <code> {this.state.textAddError}</code> </FormLabel>
                                        </GridContainer>
                                    </form>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </Modal>
            </div>
        );
    }
}

AddCustomerType.propTypes = propTypes;

export default (withTranslation("translations")(
    withStyles(theme => ({
        ...regularFormsStyle
    }))(AddCustomerType)
));
