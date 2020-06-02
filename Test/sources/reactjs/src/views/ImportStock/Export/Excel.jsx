import Constants from 'variables/Constants/';
import moment from "moment";

function getTableExcel(data, t) {
  let dataExcel = [[t("Mã phiếu"), t("Ngày tạo"), t("Người tạo"), t("Trạng thái")]];
  for (let item of data) {
    console.log(item);
    
    dataExcel.push(
      [
        item.code,
        moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
        item.createdBy.fullName || "",
        t(Constants.MOVE_STOCK_CARD_STATUS.name[item.status])
      ]);
  }
  return dataExcel;
}

export default { getTableExcel };