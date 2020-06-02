import Constants from 'variables/Constants/index.js';
import moment from "moment";

function getTableExcel(data, t) {
    let dataExcel = [[t("Nhân viên"), t("Chức năng"), t("Thời gian"), t("Thao tác"), t("Nội dung"), t("Chi nhánh")]];
    for (let item of data) {
        dataExcel.push(
            [
                item.userName,
                t(Constants.ACTION_LOG_TYPE_NAME[item.function]),
                moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT),
               t( Constants.ACTION_NAME[item.action]),
                t(Constants.ACTION_NAME[item.action]) + " " + t(Constants.ACTION_LOG_TYPE_NAME[item.function]).toLowerCase(),
                item.branchName
            ]);
    }
    return dataExcel;
}

export default { getTableExcel };