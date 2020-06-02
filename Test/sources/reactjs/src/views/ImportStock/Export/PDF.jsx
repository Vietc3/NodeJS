// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Constants from 'variables/Constants/';
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function formatted_date() {
  let result = "";
  result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
  return result;
}
function exportStockPDF(data, t, nameBranch) {
  let dataColumn = [[
    { text: '#', style: 'tableHeader' },
    { text: t('Mã phiếu'), style: 'tableHeader' },
    { text: t('Lý do'), style: 'tableHeader' },
    { text: t('Ngày tạo'), style: 'tableHeader' },
    { text: t('Người tạo'), style: 'tableHeader' },
    { text: t('Trạng thái'), style: 'tableHeader' }
  ]];
  let count = 0;
  for (let item of data) {
    count += 1;
    dataColumn.push(
      [
        { text: count },
        { text: item.code },
        { text: t(Constants.MOVE_STOCK_REASON.name[item.reason]) },
        { text: moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) },
        { text: item.createdBy.fullName || "" },
        { text: t(Constants.MOVE_STOCK_CARD_STATUS.name[item.status]) }
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
            t('Thời Gian Xuất')+':   ' + formatted_date(), 
          ]
        },
        { text: t("Danh sách nhập kho"), bold: true },
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
    },
    pageSize: 'A4',
    pageOrientation: "portrait",
    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    pageMargins: [35, 30, 25, 30],
  };
  pdfMake.createPdf(documentDefinition).download(t('Danhsachnhapkho.pdf'));
}

export default {
    exportStockPDF,
};