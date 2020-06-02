// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction';
import Constants from 'variables/Constants/';
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function exportPDF(data, t, nameBranch) {
    let dataQtySp=[];
    let dataAmount=[];
    let dataColumn = [[
        { text: '#', style: 'tableHeader' },
        { text: t('Mã phiếu'), style: 'tableHeader' },
        { text: t('Thời gian'), style: 'tableHeader' },
        { text: t('Số lượng'), style: 'tableHeader' },
        { text: t('Giá trị'), style: 'tableHeader' },
        { text: t('Ghi chú'), style: 'tableHeader' },
    ]];        
    let count = 0;
    let totalAmount = 0;
    let totalQuantity = 0;
    for (let item of data) 
    {
        count += 1; 
        dataColumn.push(
            [
                {text: count},
                {text: item.code},
                {text: moment(item.checkedAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)},
                {text: item.realQuantity, style: 'number'},
                {text: ExtendFunction.FormatNumber(item.realAmount), style: 'number'},
                {text: item.notes },
            ]);
            dataQtySp.push(item.realQuantity);
            dataAmount.push(item.realAmount);
            totalAmount += item.realAmount;
            totalQuantity += item.realQuantity;
    }
    
    var documentDefinition = 
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
                    t('Thời gian xuất') +':   ' + moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING),
                    { text: t('Tổng giá trị')+': ' + ExtendFunction.FormatNumber(totalAmount), bold: true },
                    { text: t('Tổng số lượng')+': ' + ExtendFunction.FormatNumber(totalQuantity), bold: true },
                  ]
                },
                   {text:t("Danh sách kiểm kho"), bold: true} ,
                {
                    table: {
                        headerRows: 1,
                        body: dataColumn,
                        widths: [ 18, 100, 100, 100, 120, 250]
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
    pdfMake.createPdf(documentDefinition).download(t('Danhsachkiemkho.pdf'));
}

export default {
    exportPDF,
};