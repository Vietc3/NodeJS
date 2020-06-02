import React from 'react'
import { CSVLink } from 'react-csv'
import {Icon} from "antd";

export const ExportReactCSV = ({csvData, fileName, title}) => {
  return (
    <CSVLink data={csvData} uFEFF={true}  filename={fileName} style={{ textAlign: "center" , color:"green"}}>
      <a style={{ textAlign: "center" , color:"white"}}>{title}<Icon type="file-excel"theme="filled" /></a>
      </CSVLink>
  )
}