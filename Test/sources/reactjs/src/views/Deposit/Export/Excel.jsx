import Constants from 'variables/Constants/index.js';
import moment from "moment";
import ExtendFunction from 'lib/ExtendFunction.js';

function getTableExcel(data, t) {
  let dataExcel = [[t("Mã"), t("Loại"), t("Đối tượng"), t("Tên"), t("Thời gian"), t("Giá trị"), t("Trạng thái")]];
  for (let item of data) {
    dataExcel.push(
      [
        item.code,
        t(Constants.DEPOSIT_TYPE_NAME[item.type]),
        item.customerId.type && item.customerId.type ? t(Constants.CUSTOMER_TYPE_NAME[item.customerId.type]): "",
        item.customerId.name && item.customerId.name ? item.customerId.name : "" ,
        moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) ,
        item.amount ? ExtendFunction.FormatNumber(item.amount) : 0,
        t(Constants.DEPOSIT_STATUS_NAME[item.status]),
      ]);
  }
  return dataExcel;
}

export default { getTableExcel };