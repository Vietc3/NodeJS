import Constants from 'variables/Constants/';
import moment from "moment";

function getTableExcel(data, t) {
  let dataExcel = [[ t("Mã phiếu"), t("Ngày tạo"), t("Ghi chú"), t("Trạng thái")]];
  for (let item of data) {
    dataExcel.push(
      [
        item.code,
        moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
        item.notes,
        t(Constants.MANUFACTURING_STATUS[item.status]),
      ]);
  }
  return dataExcel;
}

export default { getTableExcel };