
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction.js';
import Constants from 'variables/Constants/index.js';
import moment from "moment";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
function formatted_date()
{
    var result="";
    result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
    return result;
}
function productPDF(data, t , nameBranch) {
    let dataColumn = [[
  { text: '#', style: 'tableHeader' },
  { text: t('Mã thành phẩm'), style: 'tableHeader' },
  { text: t('Tên thành phẩm'), style: 'tableHeader' },
  { text: t('ĐVT'), style: 'tableHeader' },
  { text: t('Tồn kho'), style: 'tableHeader' },
    ]];  
    let count = 0;
    let dataQtySp = 0;
    for (let item of data) 
    {
  count += 1; 
  dataColumn.push(
      [
    {text: count},
    {text: item.code},
    {text: item.name},
    {text: item.unitId.name},
    {text: item.manufacturingQuantity ? ExtendFunction.FormatNumber(item.manufacturingQuantity) : 0, style: 'number'},
      ]);
      dataQtySp += parseInt(item.manufacturingQuantity);
    }
    
    var documentDefinition = 
    {
  content:
      [
    {
        text: data.Code, style: 'header'
    },
    {
      ul: [
        t('Chi Nhánh')+':   '+nameBranch,
        t('Thời Gian Xuất')+':   ' + formatted_date(), 
        { text: t('Tổng Tồn Kho')+': ' + dataQtySp, bold: true },
      ]
    },
       {text:t("Danh sách thành phẩm"), bold: true} ,
    {
        table: {
      headerRows: 1,
      body: dataColumn,
      widths: [ 18, 160, 160, 140, 140]
        },
        style:'body'
    }
    
      ],
  styles:
  {
      body:{
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
      number :
      {
    alignment: 'right'
      }
  },
  pageSize: 'A4',
  pageOrientation: 'landscape',
  pageMargins: [ 35, 30, 25, 30 ],
    };
    pdfMake.createPdf(documentDefinition).download(t('DanhsachThanhPham.pdf'));
}

export default {
    productPDF,
};