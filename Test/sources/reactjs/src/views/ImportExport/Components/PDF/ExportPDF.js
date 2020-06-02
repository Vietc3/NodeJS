// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction';
import Constants from 'variables/Constants/';
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function formatted_date() {
  let result = "";
  result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
  return result;
}
function productPDF(data, t, nameBranch) {
  let dataColumn = [[
    { text: '#', style: 'tableHeader' },
    { text: t('Mã trả đơn hàng'), style: 'tableHeader' },
    { text: t('Đơn hàng'), style: 'tableHeader' },
    { text: t('Khách hàng'), style: 'tableHeader' },
    { text: t('Thời gian'), style: 'tableHeader' },
    { text: t('Tổng tiền'), style: 'tableHeader' },
    { text: t('Trạng thái'), style: 'tableHeader' }
  ]];
  let count = 0;
  for (let item of data) {
    count += 1;
    dataColumn.push(
      [
        { text: count },
        { text: item.code },
        { text: item.reference },
        { text: item.recipientId && item.recipientId.name ? item.recipientId.name : "" },
        { text: moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) },
        { text: item.finalAmount ?  ExtendFunction.FormatNumber(item.finalAmount) : 0, style: 'number' },
        { text: item.status ? t(Constants.INVOICE_RETURN_CARD_STATUS_NAME[item.status] ) : "" },

      ]);
  }

  let documentDefinition =
  {
    content:
      [
        {
          text: data.code, style: 'header'
        },
        {
          // to treat a paragraph as a bulleted list, set an array of items under the ul key
          ul: [
            t('Chi Nhánh')+':   '+nameBranch,
            t('Thời Gian Xuất')+':   ' + formatted_date()
          ]
        },
        { text: t("Danh sách trả hàng"), bold: true },
        {
          table: {
            headerRows: 1,
            body: dataColumn,
            widths: [ 18, 120, 120, 120,120, 100, 100]
          },
          style: 'body'
        }

      ],
    styles:
    {
      body: {
        fontSize: 10
      },
      header:
      {
        fontSize: 20,
        bold: true,
        margin: [0, 10, 0, 10],
        alignment: 'center'
      },
      tableHeader:
      {
        fillColor: '#4CAF50',
        color: 'white',
        fontSize: 10
      },
      textRow:
      {
        alignment: "right"
      },
    },
    pageSize: 'A4',
    pageOrientation: "landscape",
    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    pageMargins: [35, 30, 25, 30],
  };
  pdfMake.createPdf(documentDefinition).download(t('Danhsachtrahang') + ".pdf");
}

export default {
  productPDF,
};