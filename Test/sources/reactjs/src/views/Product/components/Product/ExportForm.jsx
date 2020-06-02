
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {  Icon } from "antd";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import { ExportReactCSV } from 'ExportExcel/ExportReactCSV';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import ProductPDF from "../PDF/ProductPDF";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

class ExportForm extends React.Component 
{

    getDataExcel = (data) => {
        //header file Excel
        let dataExcel = [[ "#", "Mã", "Tên", "Nhóm", "Giá bán",
            "Giá vốn", "Tồn kho"]];

        
        for (let item in data) 
        {

            //push data into file Excel
            dataExcel.push(
                [
                    parseInt (item) + 1,
                    data[item].code,
                    data[item].name,
                    data[item].ProductTypeName,
                    data[item].saleUnitPrice,
                    data[item].costUnitPrice,
                    data[item].stockQuantity,
                ]);
        }
        return dataExcel;
    }

    render() 
    {
        const { t, data } = this.props;
        return (
            
            <CustomDropdown
                hoverColor="info"
               						
                buttonText={<><Icon type="export" style={{ marginTop: -8 }} /><b style={{ fontWeight: "bold" }}>{t("Export")}</b></>}
                buttonProps={{
                    fullWidth: true,
                    style: { marginBottom: "0",height:41,width:130},
                    color:"success"
                }}
                dropdownList={[
                   
                    //Excel
                    <ExportReactCSV csvData = {this.getDataExcel(data)} fileName="DanhSachSanPham.xls"  />,

                    // //PDF
                    <div onClick= { () => ProductPDF.productPDF(data) }
                        style={{ textAlign: "left", color: "red" }}
                    >
                        {/* <img alt="..." src={pdf} style={{ width: 40, height: 40 }} ></img> */}
                        {/* Pdf */}
                        <Icon type="file-pdf" theme="filled"/>
                    </div>,
                ]}
                
            />
        );
    }
}

ExportForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default connect()
(
    withTranslation("translations")(
        withStyles(theme => ({
            ...regularFormsStyle
        }))
        (ExportForm)
    )
);
