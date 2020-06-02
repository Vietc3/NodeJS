// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction, {trans} from 'lib/ExtendFunction';
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
function formatted_date()
{
    let result="";
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
function productPDF(data, subData, t, nameBranch) {
    let dataColumn = [[
        { text: '#', style: 'tableHeader' },
        { text: t('Mã sản phẩm'), style: 'tableHeader' },
        { text: t('Tên sản phẩm'), style: 'tableHeader' },
        { text: t('Giá vốn'), style: 'tableHeader' },
        { text: t('Giá vốn nhập cuối'), style: 'tableHeader' },
        { text: t('Giá chung'), style: 'tableHeader' }
    ]];        
    let count = 0;
    for (let item of subData) 
    {
        count += 1; 
        dataColumn.push(
            [
                {text: count},
                {text: item.code},
                {text: item.name, style: getFont(trans(item.name, true))},
                {text: item.costUnitPrice ? ExtendFunction.FormatNumber(item.costUnitPrice) : 0, style: 'textRow'},
                {text: item.lastImportPrice ? ExtendFunction.FormatNumber(item.lastImportPrice) : 0, style: 'textRow'},
                {text: item.saleUnitPrice ? ExtendFunction.FormatNumber(item.saleUnitPrice) : 0, style: 'textRow' },
            ]);
    }
    
    let documentDefinition = 
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
                    t('Thời Gian Xuất')+ ':   ' + formatted_date()
                  ]
                },
                   {text:t("Danh sách giá sản phẩm"), bold: true} ,
                {
                    table: {
                        headerRows: 1,
                        body: dataColumn,
                        widths: [ 18, 110, 110, 70, 70, 70]
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
            textRow:
            {
                alignment: "right"
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
        pageOrientation: "portrait",
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 35, 30, 25, 30 ],
    };
    pdfMake.createPdf(documentDefinition).download(t('DanhSachGiaSanPham.pdf'));
}

export default {
    productPDF,
};