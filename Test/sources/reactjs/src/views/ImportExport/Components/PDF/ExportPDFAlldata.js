import React, { Fragment } from "react";
// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction';

//code by Lê Na

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function exportPDF(data, getSubDataSource, isExport) {
    
    let dataPDF = [[
        { text: '#', style: 'tableHeader' },
        { text: 'Mã xuất hàng', style: 'tableHeader' },
        { text: 'Mã đơn hàng', style: 'tableHeader' },
        { text: 'Khách hàng', style: 'tableHeader' },
        { text: 'Thời gian', style: 'tableHeader' },
        { text: 'Tổng tiền', style: 'tableHeader' },
        { text: 'Trạng thái', style: 'tableHeader' },
    ]];    
    let count = 0;
    
    for (let item of data) 
    {
        count += 1; 
        let rowPDF = 
            [
                {text: count, style: 'tableRow' },
                {text: item.code, style: 'tableRow' },
                {text: item.code, style: 'tableRow' },
                {text: item.customerName, style: 'tableRow' },
                {text: item.time, style: 'tableRow'} ,
                {text: ExtendFunction.FormatNumber(parseInt(item.totalAmount)), style: 'tableRow' },
                {text: item.status===1?"Đã nhận":"Đang nhận", style: 'tableRow' },
              
            ];
        dataPDF.push(rowPDF);

        let productList = getSubDataSource(item);

        if(productList.length > 0)
        {
            let countSubTable = 0;
            let dataSub = [
                { text: ''},
                { text: '#', style: 'subTableHeader' },
                { text: 'Product Code', style: 'subTableHeader' },
                { text: 'Product Name', style: 'subTableHeader' },
                { text: 'Is Promoted', style: 'subTableHeader' },
                { text: 'Product Unit', style: 'subTableHeader' },
                { text: 'Quantity', style: 'subTableHeader' },
                { text: 'Unit Price', style: 'subTableHeader' },
                { text: 'Discount', style: 'subTableHeader' },
                { text: 'BuyPrice', style: 'subTableHeader' },
                { text: 'Amount', style: 'subTableHeader' },
            ];   
            dataPDF.push(dataSub); 
            for (let product of productList) 
            {
                countSubTable += 1; 
                let rowPDF = [
                    {text: ''},
                    {text: countSubTable, style: 'subTableRow' },
                    {text: product.Code, style: 'subTableRow' },
                    {text: product.Name, style: 'subTableRow' },
                    {text: product.IsPromoted === 'true' ? "Yes" : "No", style: 'subTableRow' },
                    {text: product.Unit, style: 'subTableRow' },
                    {text: product.Qty, style: 'subTableRow' },
                    {text: ExtendFunction.FormatNumber(parseInt(product.UnitPrice)), style: 'subTableRow' },
                    {text: product.Discount, style: 'subTableRow' },
                    {text: ExtendFunction.FormatNumber(parseInt(product.BuyPrice)), style: 'subTableRow' },
                    {text: ExtendFunction.FormatNumber(parseInt(product.Amount)), style: 'subTableRow' },
                ];
                dataPDF.push(rowPDF);
            }
        }

    }
    var documentDefinition = 
    {
        content:
                [
                    {
                        text: " Danh sách trả hàng", style: 'header'
                    },
                    {
                        table: {
                            headerRows: 1,
                            body: dataPDF,
                            widths: [ 18, 120, 120, 120, 120, 110, 110]
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
            subTableHeader:
            {
                fillColor: '#ddd',
                color: '#2a068e',
                fontSize: 10
            },
            tableRow:
            {
                fillColor: '#d5f1f5',
                fontSize: 10
            },
            subTableRow:
            {
                color: '#2a068e',
                fontSize: 10
            },
        },
        pageSize: 'A4',
        pageOrientation: 'landscape',
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 35, 30, 25, 30 ],
    };
    pdfMake.createPdf(documentDefinition).download(isExport ? 'ExportCardList' : 'ImportCardList');
}

export default {
    exportPDF,
};