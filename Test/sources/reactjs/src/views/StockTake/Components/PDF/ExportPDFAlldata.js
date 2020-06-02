import React, { Fragment } from "react";
// core components
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExtendFunction from 'lib/ExtendFunction';

//code by Lê Na

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function exportPDF(data, getSubData) {
    
    let dataColumn = [[
        { text: '#', style: 'tableHeader' },
        { text: 'Card Code', style: 'tableHeader' },
        { text: 'Customer Code', style: 'tableHeader' },
        { text: 'Customer Name', style: 'tableHeader' },
        { text: 'Time', style: 'tableHeader' },
        { text: 'Total', style: 'tableHeader' },
        { text: 'Notes', style: 'tableHeader' },
    ]];     
    
    let dataSub = [[
        { text: '#', style: 'tableHeader' },
        { text: 'Product Code', style: 'tableHeader' },
        { text: 'Product Name', style: 'tableHeader' },
        { text: 'Is Promoted', style: 'tableHeader' },
        { text: 'Product Unit', style: 'tableHeader' },
        { text: 'Quantity', style: 'tableHeader' },
        { text: 'Unit Price', style: 'tableHeader' },
        { text: 'Discount', style: 'tableHeader' },
        { text: 'BuyPrice', style: 'tableHeader' },
        { text: 'Amount', style: 'tableHeader' },
    ]];    

    var table = [{
        headerRows: 1,
        body: dataSub,
        widths: [ 18, 50, 50, 50, 50, 50, 50]
    }]
    let content1 = [];
    let count = 0;
    for (let item of data) 
    {
        count += 1; 
        dataColumn = 
            [
                {text: count},
                {text: item.Code},
                {text: item.CustomerCode},
                {text: item.CustomerName},
                {text: item.Time},
                {text: ExtendFunction.FormatNumber(parseInt(item.Amount))},
                {text: item.Notes},
            ];

        let productList = getSubData(item);
        let dataSubColumn = dataSub;
        let countSubTable = 0;
        for (let product of productList) 
        {
            countSubTable += 1; 
            dataSubColumn.push(
                [
                    {text: countSubTable},
                    {text: product.Code},
                    {text: product.Name},
                    {text: product.IsPromoted ? "Yes" : "No"},
                    {text: product.Unit},
                    {text: product.Qty},
                    {text: ExtendFunction.FormatNumber(parseInt(product.UnitPrice))},
                    {text: product.Discount},
                    {text: ExtendFunction.FormatNumber(parseInt(product.BuyPrice))},
                    {text: ExtendFunction.FormatNumber(parseInt(product.Amount))},
                ]);
        }

    }
    
    
    var documentDefinition = 
    {
        // content: content1,
        content: [
            {
                style: 'body',
                table: {
                    body: [
                        ['Column 1', 'Column 2', 'Column 3'],
                        [
                            {
                                table: {
                                    body: [
                                        ['Col1', 'Col2', 'Col3'],
                                        ['1', '2', '3'],
                                        ['1', '2', '3']
                                    ]
                                }, 
                                style: 'tableHeader', 
                                colSpan: 3, 
                                alignment: 'center'
                            }
                        ]
                    ]
                }
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
        },
        pageSize: 'A4',
        pageOrientation: 'landscape',
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 35, 30, 25, 30 ],
    };
    pdfMake.createPdf(documentDefinition).download('CustomerList.pdf');
}

export default {
    exportPDF,
};