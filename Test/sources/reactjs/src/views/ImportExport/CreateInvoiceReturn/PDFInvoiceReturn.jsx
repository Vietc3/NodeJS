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

function invoiReturnPDF(dataInvoice) {
  let dataColumn = [[
    { text: '#', style: 'tableHeader' },
    { text: 'Mã', style: 'tableHeader' },
    { text: 'Tên', style: 'tableHeader' },
    { text: 'Số lượng', style: 'tableHeader' },
    { text: 'Giá bán', style: 'tableHeader' },
    { text: 'Giá nhập lại', style: 'tableHeader' },
    { text: 'Thành tiền', style: 'tableHeader' },
  ]];

  let count = 0;
  let { products } = dataInvoice

  for (let item of products) {
    count += 1;
    dataColumn.push(
      [
        { text: count },
        { text: item.productCode },
        { text: item.productName },
        { text: item.quantity ? ExtendFunction.FormatNumber(item.quantity) : 0, style: 'number' },
        { text: item.unitPrice ? ExtendFunction.FormatNumber(item.unitPrice) : 0, style: 'number' },
        { text: item.finalAmount ? ExtendFunction.FormatNumber(item.finalAmount) : 0, style: 'number' },
        { text: item.finalAmount? ExtendFunction.FormatNumber(item.finalAmount * item.quantity): ExtendFunction.FormatNumber(item.unitPrice * item.quantity), style: 'number' },
      ]);
  }

  var documentDefinition =
  {
    content:
      [
        {
          text: dataInvoice.code, style: 'header'
        },
        {
          ul: [
            { text: 'Ngày tạo đơn:  ' + moment(dataInvoice.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING), style: 'body' },
            { text: 'Ngày xuất đơn:  ' + formatted_date(), style: 'body' }, 
            { text: 'Đơn hàng:  ' + dataInvoice.invoice ? dataInvoice.invoice.code : "", style: 'body' },
            { text: 'Khách hàng:  ' + dataInvoice.invoice ? dataInvoice.invoice.customerId.name : "", style: 'body' },
          ]
        },
        { text: "Người lập: " +dataInvoice.createdBy.email, style: 'body' },
        { text: "Danh sách sản phẩm trả hàng", bold: true },
        {
          table: {
            headerRows: 1,
            body: dataColumn,
            widths: [18, 80, 90, 50 ,70, 70, 100]
          },
          style: 'body'
        },
        {
          columns: [
            {
              width: '80%',
              text: "Tổng số lượng:", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataInvoice.totalQuantity), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Tổng số mặt hàng:", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataInvoice.products.length), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Tổng tiền:", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataInvoice.totalAmount), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Giảm giá:", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataInvoice.discountAmount), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Tổng cộng:", style: 'money',bold: true
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataInvoice.returnAmount), style: 'money'
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
      },

    },
    pageSize: 'A4',
    //pageOrientation: "landscape",
    pageMargins: [35, 30, 25, 30],
  };
  pdfMake.createPdf(documentDefinition).download(dataInvoice.code + '.pdf');
}

export default {
  invoiReturnPDF,
};