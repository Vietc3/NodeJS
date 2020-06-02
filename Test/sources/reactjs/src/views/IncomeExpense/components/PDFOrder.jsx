// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Constants from 'variables/Constants/';
import moment from "moment";
import ExtendFunction from 'lib/ExtendFunction';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function formatted_date() {
  let result = "";
  result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
  return result;
}
function productPDF(data, t, nameBranch) {
  let dataColumn = [[
    { text: '#', style: 'tableHeader' },
    { text: t('Mã phiếu'), style: 'tableHeader' },
    { text: t('Thời gian'), style: 'tableHeader' },
    { text: t('Người nộp/nhận'), style: 'tableHeader' },
    { text: t('Loại phiếu'), style: 'tableHeader' },
    { text: t("Số tiền"), style: 'tableHeader' },
  ]];
  let count = 0;
  for (let item of data) {
    count += 1;
    dataColumn.push(
      [
        { text: count },
        { text: item.code },
        { text: moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) },
        { text: item.customerName },
        { text: item.incomeExpenseCardTypeId_name },
        { text: item.amount ? ExtendFunction.FormatNumber(item.amount) : 0, style: 'textRow' },
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
          ul: [
            t('Chi Nhánh')+':   '+nameBranch,
            t('Thời Gian Xuất')+':   ' + formatted_date() 

          ]
        },
        { text: t("Danh sách phiếu thu chi"), bold: true },
        {
          table: {
            headerRows: 1,
            body: dataColumn,
            widths: [18, 100, 130, 150, 120, 130]
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
    pageMargins: [35, 30, 25, 30],
  };
  pdfMake.createPdf(documentDefinition).download(t('Danhsachphieuthuchi.pdf'));
}

export default {
  productPDF,
};