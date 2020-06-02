// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction';
import Constants from 'variables/Constants/';
import moment from "moment";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
//code by Long
function formatted_date()
{
    var result="";
    result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
    return result;
}
function productPDF(data, t) {
    let dataColumn = [[
        { text: '#', style: 'tableHeader' },
        { text: t('Mã Sản Phẩm'), style: 'tableHeader' },
        { text: t('Tên Sản Phẩm'), style: 'tableHeader' },
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
                  // to treat a paragraph as a bulleted list, set an array of items under the ul key
                  ul: [
                    'Thời Gian Xuất:   ' + formatted_date(),
                    { text: 'Tổng Tồn Kho: ' + dataQtySp, bold: true },
                  ]
                },
                   {text:"Danh sách sản phẩm", bold: true} ,
                {
                    table: {
                        headerRows: 1,
                        body: dataColumn,
                        widths: [ 18, 140, 120, 120,90, 90, 120]
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
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 35, 30, 25, 30 ],
    };
    pdfMake.createPdf(documentDefinition).download(t('DanhSachSanPham') + '.pdf');
}

export default {
    productPDF,
};