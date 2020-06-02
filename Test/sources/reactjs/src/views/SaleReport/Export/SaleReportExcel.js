import Constants from "variables/Constants/";
import ExtendFunction from "lib/ExtendFunction";

function SaleReportExcel(data, options, total, languageCurrent, t, totalProfit) {
  let dataProductExcel = [[

    t("Sản phẩm"),
    t("Sl bán ra"),
    t("Tiền hàng"),
    t("Chiết khấu"),
    t("Thuế"),
    t("Sl trả lại"),
    t("Tiền trả hàng"),
    t("Doanh thu"),
    t("Lợi nhuận")
  ]];
  let dataExcel = [[

    options === Constants.OPTIONS_SALE_REPORT.USER ?
      t("Nhân viên") : options === Constants.OPTIONS_SALE_REPORT.CUSTOMER ?
        t("Khách hàng") : t("Thời gian"),
    t("Đơn hàng"),
    t("Tiền hàng"),
    t("Chiết khấu"),
    t("Thuế"),
    t("Trả hàng"),
    t("Doanh thu"),
    t("Lợi nhuận")
  ]];

  for (let item in data) {
    
    options === Constants.OPTIONS_SALE_REPORT.PRODUCT ?
      dataProductExcel.push(
        [
          ExtendFunction.languageName(data[item].productName)[languageCurrent],
          data[item].quantity,
          ExtendFunction.FormatNumber(data[item].totalAmount),
          ExtendFunction.FormatNumber(data[item].discountAmount),
          ExtendFunction.FormatNumber(data[item].taxAmount),
          ExtendFunction.FormatNumber(data[item].returnQuantity),
          ExtendFunction.FormatNumber(data[item].returnAmount),
          ExtendFunction.FormatNumber(data[item].finalAmount),
          ExtendFunction.FormatNumber(data[item].profitAmount)
        ]) :
      dataExcel.push(
        [
          options === Constants.OPTIONS_SALE_REPORT.USER || options === Constants.OPTIONS_SALE_REPORT.CUSTOMER ?
            data[item].name : options === Constants.OPTIONS_SALE_REPORT.HOUR ? getHours(data[item].time) : data[item].time,
          data[item].count,
          ExtendFunction.FormatNumber(data[item].totalAmount),
          ExtendFunction.FormatNumber(data[item].discountAmount),
          ExtendFunction.FormatNumber(data[item].taxAmount),
          ExtendFunction.FormatNumber(data[item].returnAmount),
          ExtendFunction.FormatNumber(data[item].finalAmount),
          ExtendFunction.FormatNumber(data[item].profitAmount)
        ])
  }
  options === Constants.OPTIONS_SALE_REPORT.PRODUCT ?
    dataProductExcel.push(['', '', '', '', '', '', t('Tổng'), ExtendFunction.FormatNumber(total), ExtendFunction.FormatNumber(totalProfit)]) :
    dataExcel.push(['', '', '', '', '', t('Tổng'), ExtendFunction.FormatNumber(total), ExtendFunction.FormatNumber(totalProfit)])
  return options === Constants.OPTIONS_SALE_REPORT.PRODUCT ? dataProductExcel : dataExcel;
};

function getHours(time) {

  let split = time.split(" ");
  return split[0] + ":00 " + split[1]

}

export default {
  SaleReportExcel,
};