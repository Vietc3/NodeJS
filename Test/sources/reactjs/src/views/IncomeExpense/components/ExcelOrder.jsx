import Constants from 'variables/Constants/';
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";

function getTableExcel(data, t) {
  let dataExcel = [[t("Mã phiếu"), t("Thời gian"), t("Khách hàng"), t("Số tiền"), t("Loại phiếu")]];
  for (let item of data) {
    dataExcel.push(
      [
        item.code,
        moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
        item.customerName,
        item.amount ? Number(item.amount) : 0,
        t(item.incomeExpenseCardTypeId_name)
      ]);
  }
  return dataExcel;
}

export default { getTableExcel };