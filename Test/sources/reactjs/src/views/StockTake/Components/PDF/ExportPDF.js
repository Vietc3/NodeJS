import React, { Fragment } from "react";
// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction';
import Constants from 'variables/Constants/';
import moment from "moment";

//code by Lê Na

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function exportPDF(data) {
    
    let dataColumn = [[
        { text: '#', style: 'tableHeader' },
        { text: 'Mã phiếu', style: 'tableHeader' },
        { text: 'Thời gian', style: 'tableHeader' },
        { text: 'Số lượng', style: 'tableHeader' },
        { text: 'Giá trị', style: 'tableHeader' },
        { text: 'Trạng thái', style: 'tableHeader' },
        { text: 'Ghi chú', style: 'tableHeader' },
    ]];        
    let count = 0;
    for (let item of data) 
    {
        count += 1; 
        dataColumn.push(
            [
                {text: count},
                {text: item.Code},
                {text: item.CreatedDateTime ? moment(item.CreatedDateTime).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING) : null},
                {text: item.Qty ? ExtendFunction.FormatNumber(item.Qty) : 0, style: 'number'},
                {text: item.Amount ? ExtendFunction.FormatNumber(item.Amount): 0, style: 'number'},
                {text: item.StatusName},
                {text: item.Notes},
            ]);
    }

    var documentDefinition = 
    {
        content:
            [
                {
                    text: data.Code, style: 'header'
                },
                    "Danh sách phiếu kiểm kho",
                {
                    table: {
                        headerRows: 1,
                        body: dataColumn,
                        widths: [ 18, 100, 100, 100, 100, 100, 100]
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
    pdfMake.createPdf(documentDefinition).download('DanhSachKiemKho.pdf');
}

export default {
    exportPDF,
};