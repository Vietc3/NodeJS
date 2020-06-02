import React, { Fragment } from "react";
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
function invoicePDF(dataInvoice) {
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
  let dataQtySp = 0;
  let { products } = dataInvoice
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
          text: dataInvoice.code, style: 'header'
        },
        {
          ul: [
            { text: 'Ngày tạo đơn:  ' + moment(dataInvoice.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING), style: 'body' },
            { text: 'Ngày xuất đơn:  ' + formatted_date(), style: 'body' },
            { text: 'Khách hàng:  ' + dataInvoice.customerId.name, style: 'body' },
            { text: 'Địa chỉ giao hàng:  ' + dataInvoice.deliveryAddress, style: 'body' },
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
              text: ExtendFunction.FormatNumber(dataInvoice.totalAmount), style: 'money'
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
              text: ExtendFunction.FormatNumber(dataInvoice.discountAmount), style: 'money'
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
              text: ExtendFunction.FormatNumber(dataInvoice.taxAmount), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Phí giao hàng", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataInvoice.deliveryAmount), style: 'money'
            },
          ],
          columnGap: 10
        },
        {
          columns: [
            {
              width: '80%',
              text: "Khách phải trả", style: 'money'
            },
            {
              width: '20%',
              text: ExtendFunction.FormatNumber(dataInvoice.finalAmount), style: 'money'
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
  pdfMake.createPdf(documentDefinition).download(dataInvoice.code + '.pdf');
}

export default {
  invoicePDF,
};