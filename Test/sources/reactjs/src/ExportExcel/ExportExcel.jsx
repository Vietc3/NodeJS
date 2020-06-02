import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportCSV = (csvData, fileName, cols) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (csvData, fileName, cols) => {
    let wb = { Sheets: {}, SheetNames: [] };

    if (Number(Object.keys(csvData[0])[0]) !== 0) {
      csvData.forEach((item, index) => {

        let ws = XLSX.utils.json_to_sheet(item.data);
        convertNumber(ws);
        let SheetNames = [`data${index !== 0 ? index : ""}`];
        wb = { ...wb, Sheets: { ...wb.Sheets, [`data${index !== 0 ? index : ""}`]: ws }, SheetNames: wb.SheetNames.concat(SheetNames) };
      })
    } else {
      const ws = XLSX.utils.json_to_sheet(csvData);
      convertNumber(ws);
      wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const convertNumber = (ws) => {
    let range = XLSX.utils.decode_range(ws['!ref']);
    let fmt = '#,##0';
    let fmtDot = '#,##0.#####';
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let cell_address = { c: C, r: R };
        /* if an A1-style address is needed, encode the address */
        let cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;
        if (ws[cell_ref].t !== 'n') continue;
        if (!isNaN(ws[cell_ref].v)) {
          let splitDot = ws[cell_ref] && ws[cell_ref].v.toString().split(".");

          if (splitDot.length >=2) {
            ws[cell_ref].z = fmtDot;
          }
          else ws[cell_ref].z = fmt;
        }
      }
    }
  }

  const formatColsNumber = (ws, cols) => {
    for (let item of cols) {

      var C = XLSX.utils.decode_col(item); // 1
      var fmt = '#,##0'; // or '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)' or any Excel number format

      /* get worksheet range */
      var range = XLSX.utils.decode_range(ws['!ref']);
      for (var i = range.s.r + 1; i <= range.e.r; ++i) {
        /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
        var ref = XLSX.utils.encode_cell({ r: i, c: C });
        /* if the particular row did not contain data for the column, the cell will not be generated */
        if (!ws[ref]) continue;
        /* `.t == "n"` for number cells */
        if (ws[ref].t !== 'n') continue;
        /* assign the `.z` number format */
        ws[ref].z = fmt;
      }

    }
  }

  return exportToCSV(csvData, fileName, cols)
}