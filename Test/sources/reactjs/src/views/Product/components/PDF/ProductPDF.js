// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction';
import Constants from 'variables/Constants/';
import moment from "moment";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
	"Roboto":{
		"bold":"Roboto-Medium.ttf",
		"normal":"Roboto-Regular.ttf"},
	"NanumGothic":{
		"bold": 'NanumGothic-Regular.ttf',
		"normal": 'NanumGothic-Regular.ttf'},
};
//code by Long
function formatted_date()
{
  var result="";
  result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
  return result;
}
function getFont(string) {
	if (checkKorean(string)) {
		return "korean_font";
	} else {
		return "default_font";
	}
}
function checkKorean(x) {
  return /[가-힣]+/.test(x); // will return true if an Korean letter is present
}
function productPDF(data, t, nameBranch, viewColumn) {
  let dataColumn = [];
  let headerPDF = [{ text: '#', style: 'tableHeader' }];
  if(viewColumn.length > 0){
    viewColumn.map(item => {
      if(item.visible)
        headerPDF.push({ text: t(item.title), style: 'tableHeader' })
      return item;
    })
    dataColumn.push(headerPDF);
  }
  else{
    dataColumn.push([
      { text: '#', style: 'tableHeader' },
      { text: t('Mã sản phẩm'), style: 'tableHeader' },
      { text: t('Tên sản phẩm'), style: 'tableHeader' },
      { text: t('Nhóm sản phẩm'), style: 'tableHeader' },
      { text: t('ĐVT'), style: 'tableHeader' },
      { text: t('Giá bán'), style: 'tableHeader' },
      { text: t('Giá vốn'), style: 'tableHeader' },
      { text: t('Tồn kho chính'), style: 'tableHeader' },
      { text: t('Tồn kho sx'), style: 'tableHeader' },
    ]);  
  }
  let count = 0;
  let dataQtySp = 0;
  for (let item of data) 
  {
    count += 1; 
    if(viewColumn.length > 0){
      let bodyPDF = [{text: count}];
      viewColumn.map(column => {
        if(column.visible){
          if(isNaN(item[column.dataIndex]))
            bodyPDF.push({ text: item[column.dataIndex]});
          else
            bodyPDF.push({ text: ExtendFunction.FormatNumber(item[column.dataIndex] || 0), style: 'number'});
        }
        return column;
      })
      dataColumn.push(bodyPDF);
    }
    else{
      dataColumn.push(
      [
        {text: count},
        {text: item.code},
        {text: item.name, style: getFont(item.name)},
        {text: item.productTypeId_name},
        {text: item.unitId_name},
        {text: ExtendFunction.FormatNumber(item.saleUnitPrice || 0), style: 'number'},
        {text: ExtendFunction.FormatNumber(item.costUnitPrice || 0), style: 'number'},
        {text: ExtendFunction.FormatNumber(item.sumQuantity || 0), style: 'number'},
        {text: ExtendFunction.FormatNumber(item.productstock_manufacturingQuantity || 0), style: 'number'},
      ]);
    }
    dataQtySp += parseInt(item.sumQuantity);
  }
  
  var documentDefinition = 
  {
    content:
      [
        {
          text: data.Code, style: 'header'
        },
        {
          // to treat a paragraph as a bulleted list, set an array of items under the ul key
          ul: [
          t('Chi Nhánh')+':   '+nameBranch,
          t('Thời Gian Xuất')+':   ' + formatted_date(),
          { text: t('Tổng Tồn Kho')+': ' + dataQtySp, bold: true },
          ]
        },
           {text:t("Danh sách sản phẩm"), bold: true} ,
        {
          table: {
            headerRows: 1,
            body: dataColumn,
            widths: [ 40, 88, 105, 85, 60, 80, 80, 80, 80]
          },
          style:'body'
        },
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
      },
      korean_font: {
        font: "NanumGothic",
        margin: [10,0,0,2]
      },
      default_font: {
        font: "Roboto",
        margin: [10,0,0,2]
      }
    },
    pageSize: 'A4',
    pageOrientation: 'landscape',
    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    pageMargins: [ 35, 30, 25, 30 ],
  };
  pdfMake.createPdf(documentDefinition).download(t('DanhSachSanPham.pdf'));
}

export default {
  productPDF,
};