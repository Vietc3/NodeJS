import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ButtonTheme from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import { Modal, Upload, Icon, Select } from "antd";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import SweetAlert from "react-bootstrap-sweetalert";
import _ from "lodash";
// multilingual
import { withTranslation, Translation } from "react-i18next";
const { Option } = Select;
const propTypes = {
    type: PropTypes.string,
    visible: PropTypes.bool,
    data: PropTypes.object,
    classes: PropTypes.object.isRequired,
    title: PropTypes.string,
    onCancel: PropTypes.func,
    updateProduct: PropTypes.object
};

const styles = {
    label: {
        xs: 4,
        sm: 4,
        md: 2,
        lg: 2
    },
    input: {
        xs: 8,
        sm: 8,
        md: 4,
        lg: 4
    },
    image: {
        xs: 8,
        sm: 10,
        md: 10,
        lg: 10
    },
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class ProductForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    changeProductProps(itemView) {
        const { t } = this.props;
        var images = [];
        
        var uid = 0;
        itemView.Image.map(item => {
            var temp = {};
            uid--;
            temp.uid = uid;
            temp.name = item
                .split("/")[4]
                .split("?")[0]
                .split("%2FImages%2F")[1];
            temp.status = "done";
            temp.url = item;
            images.push(temp);
        });
        return images;
    }

    render() {
        const { classes, title, isViewDetail, t, itemView, onCancelModalView } = this.props;
        // console.log(itemView);
        let fileList = itemView ? this.changeProductProps(itemView) : [];

        const listImages = {
            beforeUpload: file => {
                fileList = [...fileList, file]
                return false;
            },
            fileList
        };

        // console.log(listImages);
        
        

        return (
            <div>
                <Modal                    
                    title={t("View detail") + " " + itemView.Name}
                    visible={isViewDetail}
                    width={800} 
                    onCancel={() => onCancelModalView()}
                    footer={[
                        <ButtonTheme
                            style={{ margin: ".3125rem 1px" }}
                            key="cancel"
                            size="sm"
                            onClick = {() => onCancelModalView()}
                        >
                            {t("Back")}
                        </ButtonTheme>
                    ]}
                >
                    <GridContainer style={{ height: window.innerHeight < 900 ? 'calc(100vh - 150px)' : null }}>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card className="modal-card">
                                <CardBody style = {{paddingTop: 0}}>
                                    <GridContainer className = {'Custom-MuiGrid-item'} >
                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Product Code")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={"ellipsis-not-span-mobile"} style = {{ fontSize: "small", color: "black" }}>
                                                {itemView.Code}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Product Name")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={"ellipsis-not-span-mobile"} style = {{ fontSize: "small", color: "black"  }} >
                                                {itemView.Name}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Product Type")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {itemView.ProductTypeName}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Product Unit")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {itemView.ProductUnitName}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Unit Price")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {itemView.UnitPrice}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Discount Price")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {itemView.DiscountPrice}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Manufacturer")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={"ellipsis-not-span-mobile"} style = {{ fontSize: "small", color: "black"  }} >
                                                {itemView.ManufacturerName}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Provider Name")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {itemView.ProviderName}
                                            </FormLabel>
                                        </GridItem>

                                        <GridItem {...styles.label}>
                                            <FormLabel className={"ellipsis-not-span-mobile"} style = {{ fontSize: "small", color: "black"  }} >
                                                {t("Notes")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.input}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {itemView.Notes}
                                            </FormLabel>
                                        </GridItem>
                                        
                                    </GridContainer>
                                    <GridContainer >
                                        <GridItem {...styles.label}>
                                            <FormLabel className={classes.labelHorizontal}>
                                                {t("Image")  + ": "}
                                            </FormLabel>
                                        </GridItem>
                                        <GridItem {...styles.image}>
                                            <Upload
                                                {...listImages}
                                                listType="picture-card"
                                                multiple={true}
                                            >
                                            </Upload>
                                        </GridItem>
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

ProductForm.propTypes = propTypes;

export default connect()(
    withTranslation("translations")(
        withStyles(theme => ({
            ...regularFormsStyle
        }))(ProductForm)
    )
);
