import React, { Component } from "react";
import { CSVLink } from "react-csv";

class OhCSVLink extends Component {

  render() {
    const { children, csvData, fileName, onClick } = this.props;

    return (
      <CSVLink data={csvData} uFEFF filename={fileName} asyncOnClick onClick={(event, done) => onClick(event, done)}>
        {children}
      </CSVLink>
    );
  }
}

export default OhCSVLink;
