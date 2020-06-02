// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction.js';
import Constants from 'variables/Constants/index.js';
import moment from "moment";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function formatted_date()
{
    var result ="";
    result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
    return result;
}
function exportPDF(data, type, t, nameBranch) {
    let dataColumn = [[
        { text: '#', style: 'tableHeader' },
        { text: (type === Constants.CUSTOMER_TYPE_NAME.Customer ? t('Mã khách hàng') : t('Mã nhà cung cấp')), style: 'tableHeader' },
        { text: (type === Constants.CUSTOMER_TYPE_NAME.Customer ? t('Tên khách hàng') : t('Tên nhà cung cấp')), style: 'tableHeader' },        
        { text: t('Thời gian'), style: 'tableHeader' },
        { text: t('Địa chỉ'), style: 'tableHeader' },
        { text: t('Email'), style: 'tableHeader' },
        { text: t('Số điện thoại'), style: 'tableHeader' },
        { text: t("Công nợ"), style: 'tableHeader' },
        { text: t('Tiền ký gửi'), style: 'tableHeader' },
    ]];        
    let count = 0;
    for (let item of data) 
    {
        count += 1; 
        dataColumn.push(
            [
                {text: count},
                {text: item.code},
                {text: item.name},                
                {text: moment(item.createdAt).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING)},
                {text: item.address},
                {text: item.email},
                {text: item.tel},
                {text: item.totalOutstanding ? ExtendFunction.FormatNumber(item.totalOutstanding): 0, style: 'number'},
                {text: item.totalDeposit ? ExtendFunction.FormatNumber(item.totalDeposit) : 0, style: 'number'},
            ]);
    }
    
    var documentDefinition = 
    {
        content:
            [
                {
                    text: (type === Constants.CUSTOMER_TYPE_NAME.Customer ? t('DANH SÁCH KHÁCH HÀNG'):t('DANH SÁCH NHÀ CUNG CẤP')), style: 'header'
                },
                {
                    // to treat a paragraph as a bulleted list, set an array of items under the ul key
                    ul: [
                        t('Chi Nhánh')+':   '+nameBranch,
                        t('Thời Gian Xuất')+':   ' + formatted_date()
                    ]
                  },

                {
                    table: {
                        headerRows: 1,
                        body: dataColumn,
                        widths: [ 18, 120, 60, 80, 120, 80, 70, 70,120]
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
            textRow:
      {
        alignment: "right"
      },
      number: {
        alignment: "right"
      }
        },
        pageSize: 'A4',
        pageOrientation: 'landscape',
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 10, 30, 0, 30 ],
    };
    pdfMake.createPdf(documentDefinition).download(type === Constants.CUSTOMER_TYPE_NAME.Customer ?t('DanhSachKhachHang')+'.pdf':t('DanhSachNhaCungCap')+'.pdf');
}

export default {
    exportPDF,
};
