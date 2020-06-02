import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction';
import moment from "moment";
import Constants from 'variables/Constants/';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
function formatted_date() {
  var result = "";
  var d = new Date();
  result += d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() +
    " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  return result;
}
function importPDF(dataImport) {
  let dataColumn = [[
    { text: '#', style: 'tableHeader' },
    { text: 'Mã', style: 'tableHeader' },
    { text: 'Tên', style: 'tableHeader' },
    { text: 'Đơn vị', style: 'tableHeader' },
    { text: 'Số lượng', style: 'tableHeader' },
    { text: 'Đơn giá', style: 'tableHeader' },
    { text: 'Thành tiền', style: 'tableHeader' },
  ]];
  let count = 0;
  let { products } = dataImport
  for (let item of products) {
    count += 1;
    dataColumn.push(
      [
        { text: count },
        { text: item.productCode },
        { text: item.productName },
        { text: item.unit },
        { text: item.quantity ? ExtendFunction.FormatNumber(item.quantity) : 0, style: 'number' },
        { text: item.unitPrice ? ExtendFunction.FormatNumber(item.unitPrice) : 0, style: 'number' },
        { text: item.finalAmount ? ExtendFunction.FormatNumber(item.finalAmount) : 0, style: 'number' },
      ]);
    dataQtySp += parseInt(item.stockQuantity);
  }

  var documentDefinition =
  {
    content:
      [
        {
          text: dataImport.code, style: 'header'
        },
        {
          ul: [
            { text: 'Ngày tạo đơn:  ' + moment(dataImport.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING), style: 'body' },
            { text: 'Ngày xuất đơn:  ' + formatted_date(), style: 'body' },
            { text: 'NCC:  ' + dataImport.name, style: 'body' },
          ]
        },
        { text: "Danh sách sản phẩm", bold: true },
        {
          table: {
            headerRows: 1,
            body: dataColumn,
            widths: [18, 50, 100, 50, 50, 90, 120]
          },
          style: 'body'
        },
        {
          columns: [
            {
              width: '80%',
              text: "Tổng tiền", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataImport.totalAmount), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Giảm giá", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataImport.discountAmount), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Thuế", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataImport.taxAmount), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Tiền phải trả", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataImport.finalAmount), style: 'money'
            },
          ],
          columnGap: 10
        },
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
      number:
      {
        alignment: 'right'
      },
      money:
      {
        fontSize: 10,
        alignment: 'right'
      }
    },
    pageSize: 'A4',
    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    pageMargins: [35, 30, 25, 30],
  };
  pdfMake.createPdf(documentDefinition).download(dataImport.code + '.pdf');
}

export default {
  importPDF,
};