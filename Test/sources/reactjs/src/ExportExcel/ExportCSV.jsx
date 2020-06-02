import React from 'react'
import OhButton from "components/Oh/OhButton.jsx"
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PropTypes from "prop-types";

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
class ExportCSV extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.onRef) this.props.onRef(this)
  }

  exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  render() {
    let { onClick, title, onRef, ...rest } = this.props;

    return (
      <OhButton
        color="success"
        onClick={onClick}
        {...rest}
      >
        {title}
      </OhButton>
    )
  }
}

ExportCSV.propTypes = {
  onRef: PropTypes.func
};

export default ExportCSV;