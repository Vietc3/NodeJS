import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Icon } from "antd";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import { ExportReactCSV } from "ExportExcel/ExportReactCSV";
import pdfMake from "pdfmake/build/pdfmake";
import pdf from "assets/img/pdf.png";
import pdfFonts from "pdfmake/build/vfs_fonts";

import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import ExportPDF from "./ProductPDF";
import Constants from "variables/Constants/";
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const propTypes = {
  data: PropTypes.array
};

class ExportForm extends React.Component {
  constructor(props) {
    super(props);
  }

  getDataExcel = data => {
    //header file Excel
    let dataExcel = [["#", "Mã", "Thời gian", "Số lượng", "Giá trị", "Trạng thái", "Ghi chú"]];

    for (let item in data) {
      //push data into file Excel
      dataExcel.push([
        parseInt(item) + 1,
        data[item].Code,
        data[item].CreatedDateTime
          ? moment(data[item].CreatedDateTime).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)
          : null,
        data[item].Qty ? ExtendFunction.FormatNumber(data[item].Qty) : 0,
        data[item].Amount ? ExtendFunction.FormatNumber(data[item].Amount) : 0,
        data[item].StatusName,
        data[item].Notes
      ]);
    }
    return dataExcel;
  };

  render() {
    const { classes, t, data } = this.props;
    
    return (
      <CustomDropdown
        hoverColor="info"
        buttonText={
          <>
            <Icon type="export" style={{ marginTop: -8 }} />
            <b style={{ fontWeight: "bold" }}>{t("Export")}</b>
          </>
        }
        buttonProps={{
          fullWidth: true,
          style: { marginBottom: "0", height: 41, width: 130 },
          color: "success"
        }}
        dropdownList={[
          //Excel
          <ExportReactCSV csvData={this.getDataExcel(data)} fileName="DanhSachKiemKho.xls" />,

          // //PDF
          <div onClick={() => ExportPDF.exportPDF(data)} style={{ textAlign: "left", color: "red" }}>
            <img alt="..." src={pdf} style={{ width: 40, height: 40 }}></img>
            Pdf
          </div>
        ]}
      />
    );
  }
}

ExportForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(function(state) {
  return {
    User: state.reducer_user.User,
    User_Function: state.reducer_user.User_Function
  };
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ExportForm)
  )
);
