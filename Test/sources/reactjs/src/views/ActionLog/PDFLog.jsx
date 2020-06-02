// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Constants from 'variables/Constants/index.js';
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function formatted_date() {
    let result = "";
    result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
    return result;
}
function productPDF(data, subData, t) {
  
    let dataColumn = [[
        { text: '#', style: 'tableHeader' },
        { text: t('Nhân viên'), style: 'tableHeader' },
        { text: t('Chức năng'), style: 'tableHeader' },
        { text: t('Thời gian'), style: 'tableHeader' },
        { text: t('Thao tác'), style: 'tableHeader' },
        { text: t('Nội dung'), style: 'tableHeader' },
        { text: t('Chi nhánh'), style: 'tableHeader' }
    ]];
    let count = 0;
    for (let item of subData) {
    
        count += 1;
        dataColumn.push(
            [
                { text: count },
                { text: item.userName },
                { text: t(Constants.ACTION_LOG_TYPE_NAME[item.function])},
                { text: moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT) },
                { text: t(Constants.ACTION_NAME[item.action])},
                { text: t(Constants.ACTION_NAME[item.action]) + " " + t(Constants.ACTION_LOG_TYPE_NAME[item.function]).toLowerCase()},
                { text: item.branchName }
            ]);
       
    }

    let documentDefinition =
    {
        content:
            [
                {
                    text: data.userName, style: 'header'
                },
                {
                    ul: [
                        t('Thời Gian Xuất') + ':   ' + formatted_date()
                    ]
                },
                { text: t("Lịch sử thao tác"), bold: true },
                {
                    table: {
                        headerRows: 1,
                        body: dataColumn,
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']
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
            number: {
                alignment: "right"
            }
        },
        pageSize: 'A4',
        pageOrientation: "portrait",
        pageMargins: [35, 30, 25, 30],
    };
  
    pdfMake.createPdf(documentDefinition).download(t('LichSuThaoTac.pdf'));
}

export default {
    productPDF,
};