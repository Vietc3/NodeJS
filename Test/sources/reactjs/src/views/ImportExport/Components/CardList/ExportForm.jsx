
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import Constants from 'variables/Constants/';
import { Icon } from "antd";
import moment from "moment";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import ExportPDF from "../PDF/ExportPDF.js";

import { ExportReactCSV } from 'ExportExcel/ExportReactCSV';
import pdfMake from "pdfmake/build/pdfmake";
import pdf from "assets/img/pdf.png";
import pdfFonts from "pdfmake/build/vfs_fonts";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const propTypes = {
    data: PropTypes.array,
};

class ExportForm extends React.Component {
    constructor(props) {
        super(props);
    }

    getDataExcel = (data) => {
        let dataExcel = [[

            "Mã đơn trả hàng",
            "Đơn hàng", "Khách hàng", "Thời gian",
            "Tổng tiền", "Trạng thái"]];

        for (let item in data) {

            dataExcel.push(
                [
                    data[item].code,
                    data[item].reference,
                    data[item].recipientId && data[item].recipientId.name ? data[item].recipientId.name : "",
                    moment(data[item].createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
                    data[item].finalAmount ? data[item].finalAmount : 0,
                    data[item].status ? (Constants.STOCKCHECK_STATUS[data[item].status]) : ""
                ]);
        }
        return dataExcel;
    }

    render() {
        const { classes, t, data } = this.props;
        return (

            <CustomDropdown
                hoverColor="info"

                buttonText={<><Icon type="export" style={{ marginTop: -8 }} /><b style={{ fontWeight: "bold" }}>{t("Export")}</b></>}
                buttonProps={{
                    fullWidth: true,
                    style: { marginBottom: "0", height: 41, width: 130 },
                    color: "success"
                }}
                dropdownList={[

                    //Excel
                    <ExportReactCSV csvData={this.getDataExcel(data)} fileName="DanhSachTraHang.xls" />,

                    // //PDF
                    <div onClick={() => ExportPDF.productPDF(data)}
                        style={{ textAlign: "left", color: "red" }}
                    >
                        <Icon type="file-pdf" theme="filled" />
                    </div>,
                ]}

            />
        );
    }
}

ExportForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default (
        withTranslation("translations")(
            withStyles(theme => ({
                ...regularFormsStyle
            }))
                (ExportForm)
        )
    );
