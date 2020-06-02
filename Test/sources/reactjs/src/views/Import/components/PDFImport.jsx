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
function productPDF(data, subData ,t , nameBranch) {
  let dataColumn = [[
    { text: '#', style: 'tableHeader' },
    { text: t('Mã nhập hàng'), style: 'tableHeader' },
    { text: t('Thời gian'), style: 'tableHeader' },
    { text: t('Nhà cung cấp'), style: 'tableHeader' },
    { text: t('Tổng tiền'), style: 'tableHeader' },
    { text: t('Trạng thái'), style: 'tableHeader' }
  ]];
  let count = 0;
  for (let item of subData) {
    count += 1;
    dataColumn.push(
      [
        { text: count },
        { text: item.code },
        { text: moment(item.importedAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) },
        { text: item.recipientId && item.recipientId.name ? item.recipientId.name : "" },
        { text: item.totalAmount ? ExtendFunction.FormatNumber(item.totalAmount) : 0, style: 'number' },
        { text: t(Constants.IMPORT_CARD_STATUS_NAME[item.status]) },
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
        { text: t("Danh sách nhập hàng"), bold: true },
        {
          table: {
            headerRows: 1,
            body: dataColumn,
            widths: [18, 110, 110, 100, 70, 70]
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
      number: {
        alignment: "right"
      }
    },
    pageSize: 'A4',
    pageOrientation: "portrait",
    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    pageMargins: [35, 30, 25, 30],
  };
  pdfMake.createPdf(documentDefinition).download(t('Danhsachnhaphang.pdf'));
}

export default {
  productPDF,
};