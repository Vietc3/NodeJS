import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Table, Empty } from "antd";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  },
  header: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold"
  }
});

class OhTableReport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rowId: ''
    }
  }

  setRowClassName = (record) => {
    const {defaultIdRow} = this.props;
      return defaultIdRow && defaultIdRow === record.id ? 'clickRowStyle' : '';
  }

  render() {
    let {
      columns,
      t,
      dataSource,
      emptyDescription,
      loading,
      className
    } = this.props;
    columns.map(item =>{
      if (item.type === "number"){
        item.sorter = (a,b) => a[item.dataIndex] - b[item.dataIndex];
        if (!item.align) item.align = 'right';
      }
      else
        item.sorter = (a,b) => a[item.dataIndex].localeCompare(b[item.dataIndex]);
      item.sortDirections = ["descend", "ascend"] ;
      return item;
    })

    if (this.props.isBlur) {
      columns.map(item => {
        if (item.type !== "number") {
          item.render = (value, record, index) => {
            return (<p style={{ color: record.quantity === 0 ? "lightgrey" : "black" }}>
              {value}
            </p>
            )
          }
        }
        return item;
      })
    }

    let firstColumn = this.props.index ? [{
      title: t("STT"),
      dataIndex: "index",
      width: "10%",
      render: (id, record, index) => {
        return index + 1;
      }
    }] : [];
    
    columns = firstColumn.concat(columns);

    return (
        <Table
          className = {className}
          size={window.innerWidth <= 1300 ? " small" : "default "}
          pagination={false}
          columns={columns}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t(emptyDescription ? emptyDescription :"Không có dữ liệu")} /> }}
          dataSource={dataSource}
          rowKey={(record, index) => "row_" + index}
          onRow={(record, rowIndex) => {
              return this.props.onRowClick ? {
                onClick: e => {
                  this.props.onRowClick(e, record, rowIndex);
                }
              } : null;
            }
          }
          rowClassName={(record, index) => this.setRowClassName(record)}
          loading={loading}
        />
    );
  }
}

OhTableReport.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
};

export default connect(function(state) {
  return {
  };
})(withTranslation("translations")(withStyles(styles)(OhTableReport)));
