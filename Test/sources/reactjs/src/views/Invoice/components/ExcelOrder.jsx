import Constants from 'variables/Constants/';
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";

function getTableExcel(data, t) {
  let dataExcel = [[t("Mã đơn hàng"), t("Thời gian"), t("Khách hàng"), t("Tổng tiền"), t("Trạng thái")]];
  for (let item of data) {
    dataExcel.push(
      [
        item.code,
        moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT),
        item.customerId ? item.customerId.name : "",
        item.finalAmount ? item.finalAmount : 0,
        t(Constants.INVOICE_STATUS.name[item.status]),
      ]);
  }
  return dataExcel;
}

export default { getTableExcel };