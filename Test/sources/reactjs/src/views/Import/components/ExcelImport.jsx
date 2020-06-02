import Constants from 'variables/Constants/';
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";

function getTableExcel(data, t) {
  let dataExcel = [[t("Mã nhập hàng"), t("Thời gian"), t("Nhà cung cấp"), t("Tổng tiền"), t("Trạng thái")]];
  for (let item of data) {
    dataExcel.push(
      [
        item.code,
        moment(item.importedAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
        item.recipientId && item.recipientId.name ? item.recipientId.name : "",
        item.finalAmount ? item.finalAmount : 0,
        t(Constants.IMPORT_CARD_STATUS_NAME[item.status]),
      ]);
  }
  return dataExcel;
}

export default { getTableExcel };