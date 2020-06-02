import Constants from 'variables/Constants/';
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";

function getTableExcel(data, type, t) {
  let dataExcel = [[t("Mã đặt hàng"), t("Thời gian"), type === Constants.ORDER_CARD_TYPE.EXPORT ? t("Khách hàng") : t("Nhà cung cấp"), t("Tổng tiền"), t("Trạng thái")]];
  for (let item of data) {
    dataExcel.push(
      [
        item.code,
        moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT),
        item.customerId && item.customerId.name ? item.customerId.name : "",
        item.finalAmount ? ExtendFunction.FormatNumber(item.finalAmount) : 0,
        t(Constants.ORDER_CARD_STATUS_NAME[item.status]),
      ]);
  }
  return dataExcel;
}

export default { getTableExcel };