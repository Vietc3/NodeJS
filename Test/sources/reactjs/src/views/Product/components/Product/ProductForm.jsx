import React from "react";
import { connect } from "react-redux";
import FormLabel from "@material-ui/core/FormLabel";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
// multilingual
import { withTranslation } from "react-i18next";
import "date-fns";
import OhTable from "components/Oh/OhTable";
import { trans } from "lib/ExtendFunction";

class ProductForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ProductsForm: [],
        }
    }
    render() {
      const { t } = this.props
      const { ProductsForm } = this.state
      let columns = [
        {
          title: t("Mã sản phẩm"),
          width: "25%",
          // dataIndex: "productCode",
          align: "left",
        },
        {
          title: t("Tên sản phẩm"),
          width: "25%",
          // dataIndex: "productName",
          align: "left",
          render: value => trans(value)
        },
        {
          title: t("Giá bán"),
          align: "left",
          width: "25%",
        },
        {
          title: t("SL tem in"),
          align: "left",
          width: "25%"
        },
      ];
      return(
        <>
        <GridContainer style={{ width: "100%" }}>
          <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className='HeaderForm'>{t("Thông tin sản phẩm")}</b>
            </FormLabel>
            </GridContainer>
            <GridContainer>
          <GridItem xs = {12}>
            <OhTable
            onRef={ref => (this.tableRef = ref)}
            columns={columns}
            dataSource={ProductsForm}
            isNonePagination={true}
            id={"barcode-form-table"}
            />
            </GridItem>
        </GridContainer>
        </>
      )
    }
}
export default connect()(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProductForm)
  )
);