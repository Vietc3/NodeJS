import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import { Icon } from 'antd';

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import { ExportReactCSV } from 'ExportExcel/ExportReactCSV.jsx';
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";

class ExportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getTableExcel = (data) => {
        let dataExcel = [["#", "Name", "Customer Code", "Address", "Type",
            "Tel", "Mobile", "Fax", "Tax Code", "Fix",
            "Max Debt Amount", "Max Debt Day", "Qty In", "Qty Out",
            "Qty Deposit", "Qty Init", "Qty Outstanding", "Notes","Email","Gender","Birth"
        ]];
        let count = 0;
        for (let customer of data) {
            dataExcel.push(
                [
                    ++count,
                    customer.name,
                    customer.code,
                    customer.address,
                    customer.type,
                    customer.tel,
                    customer.mobile,
                    customer.fax,
                    customer.taxCode,
                    customer.fix,
                    customer.maxDeptAmount,
                    customer.maxDeptDays,
                    customer.totalIn,
                    customer.totalOut,
                    customer.totalDeposit,
                    customer.initialDeptAmount,
                    customer.totalOutstanding,
                    customer.notes,
                    customer.email,
                    customer.gender,
                    customer.birthday
                ]);
        }
        return dataExcel;
    }

    render() {
        const { t, data } = this.props;

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
                    <ExportReactCSV
                        csvData={this.getTableExcel(data)}
                        fileName="CustomerList.xls"
                    />,

                    //PDF
                    <div onClick={() => this.props.onChangeVisible(true, data)}
                        style={{ color: "red" }}
                    >
                        {/* <img alt="..." src={pdf} style={{ width: 40, height: 40 }} ></img>
                        Pdf */}
                        <Icon type="file-pdf" theme="filled" />
                    </div>
                ]}

            />
        );
    }
}

ExportForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default connect(
    function (state) {
        return {
            User: state.reducer_user.User,
            User_Function: state.reducer_user.User_Function,
        };
    }
)
    (
        withTranslation("translations")(
            withStyles(theme => ({
                ...regularFormsStyle
            }))
                (ExportForm)
        )
    );
