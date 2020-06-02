// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Constants from 'variables/Constants/index.js';
import moment from "moment";
import ExtendFunction from 'lib/ExtendFunction.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function formatted_date() {
  let result = "";
  result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
  return result;
}
function productPDF(data, t, nameBranch) {
  let dataColumn = [[
    { text: '#', style: 'tableHeader' },
    { text: t('Mã'), style: 'tableHeader' },
    { text: t('Loại'), style: 'tableHeader' },
    { text: t('Đối tượng'), style: 'tableHeader' },
    { text: t('Tên'), style: 'tableHeader' },
    { text: t('Thời gian'), style: 'tableHeader' },
    { text: t('Giá trị'), style: 'tableHeader' },
  ]];
  let count = 0;
  for (let item of data) {
    count += 1;
    dataColumn.push(
      [
        { text: count },
        { text: item.code },
        { text: t(Constants.DEPOSIT_TYPE_NAME[item.type])},
        { text: item.customerId.type && item.customerId.type ? t(Constants.CUSTOMER_TYPE_NAME[item.customerId.type]) : ""},
        { text: item.customerId.name && item.customerId.name ? item.customerId.name : "" },
        { text: moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) },
        { text: item.amount ? ExtendFunction.FormatNumber(item.amount) : 0 ,style: 'textRow'},
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
        { text: t("Danh sách tiền ký gửi"), bold: true },
        {
          table: {
            headerRows: 1,
            body: dataColumn,
            widths: [18, 70,60, 70, 90, 90,80]
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
  pdfMake.createPdf(documentDefinition).download(t('Danhsachtienkygui') + ".pdf");
}

export default {
  productPDF,
};