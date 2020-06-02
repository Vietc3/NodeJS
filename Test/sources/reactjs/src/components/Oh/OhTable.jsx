import withStyles from "@material-ui/core/styles/withStyles";
import { Empty, Table, Typography, Modal } from "antd";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import paginationAction from "store/actions/paginationAction";
import Store from "store/Store";
import Constants from "variables/Constants/";
import OhButton from 'components/Oh/OhButton';
import OhDragList from 'components/Oh/OhDragList';
import { MdCancel, MdSave} from "react-icons/md";

const { Paragraph } = Typography;
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

class OhTable extends Component {
  constructor(props) {
    super(props);
    let { paginationReducer, id } = this.props;
    let pageStatus = paginationReducer[id] || {
      pageSize: 10,
      pageNumber: 1
    };

    if (paginationReducer[id] === undefined) {
      Store.dispatch(paginationAction.changePagination(id, Constants.DEFAULT_TABLE_STATUS));
    }
    if(this.props.onChangeViewColumn) {
      this.props.onChangeViewColumn(paginationReducer[id] && paginationReducer[id].viewColumns || []);
    }

    this.state = {
      selectedRowKeys: [],
      expandedRowKeys: [],
      isSelectedAll: false,
      visible: false
    };
    this.returnedSorter = {};
    this.manualSortFields = {};
    this.sendChange = _.debounce(this.sendChange, Constants.UPDATE_TIME_OUT);
    this.onChange(pageStatus);
    if ( this.props.onRef ) this.props.onRef(this)
  }

  componentDidUpdate = (prevProps, prevState) => {
    let { total, paginationReducer, id } = this.props;
    const { pageSize, pageNumber } = paginationReducer[id] || Constants.DEFAULT_TABLE_STATUS;
    if (prevProps.total !== total && total < pageSize * (pageNumber - 1)) {
      this.onChange({ pageNumber: Math.floor(total / pageSize) + 1 });
    }
    if (prevProps.total !== total && prevProps.total < pageSize * (pageNumber - 1)) {
      console.log("vao", prevState.pageNumber)
      this.onChange({ pageNumber:  pageNumber });
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    if(this.state.isSelectedAll)
      this.setState({isSelectedAll: false})
    
    this.setState({ selectedRowKeys }, () => this.props.onSelectChange(selectedRowKeys));
  }

  resetSelectRowKeys = () => {
    this.setState({ selectedRowKeys: [], isSelectedAll: false }, () => this.props.onSelectChange(this.state.selectedRowKeys));
  }

  onChange = (filter) => {
    this.returnedSorter = {
      ...this.returnedSorter,
      ...filter
    }
    
    this.sendChange();
  }

  sendChange = () => {
    let isManualSort = this.manualSortFields[this.returnedSorter.sortField] || false;
    
    if(this.props.onChange) this.props.onChange({
      ...this.returnedSorter,
      sortOrder: this.returnedSorter.sortOrder ? (this.returnedSorter.sortOrder === "ascend" ? "ASC" : "DESC") : undefined
    }, isManualSort);
  }
  
  formatColumnOption  = (columns) => {
    const {
      id,
      paginationReducer,
      t
    } = this.props;
    const { sortField, sortOrder } = paginationReducer[id] || Constants.DEFAULT_TABLE_STATUS;
    return columns.filter(item => (typeof item === 'object') && Object.keys(item).length).map(item => {
      if(item.children) {
        return ({
          title: item.title,
          children: this.formatColumnOption(item.children)
        })
      } else{
        if(item.isManualSort) this.manualSortFields[item.dataIndex] = true
        return _.extend(
          { 
            ...item, 
            sorter: item.sorter !== undefined ? item.sorter : (() => {}), 
            sortDirections: ["descend", "ascend"],
            sortOrder: sortField === item.dataIndex && sortOrder ? sortOrder : false,
            render: (value, record, index) => {
              let arrDataIndex = (item.dataIndex || '').split('.');
              let newValue = record;
              for(let key of arrDataIndex) {
                if(!newValue)
                  break;
                newValue = newValue[key];
              }
               
              if(item.render) {
                return item.render(newValue, record, index)
              }  
              return newValue;
            }
          },
          item.type === 'notes' ? {render: value => {
            return (
              <Paragraph title={value} style={{ wordWrap: "break-word", wordBreak: "break-word", maxWidth: "100%" }} ellipsis={{ rows: 2 }}>
                {value}
              </Paragraph>
            );
          }} : {}
        )
      }
    });
  }
  
  openSetting = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ visible: false});
    Store.dispatch(
      paginationAction.changePagination(this.props.id, {viewColumns: this.viewColumns})
    );
    
    if(this.props.onChangeViewColumn)
      this.props.onChangeViewColumn(this.viewColumns);
  };

  handleCancel = () => {
    this.viewColumns = null;
    this.setState({ visible: false });
  };

  render() {
    const {
      columns,
      hasCheckbox,
      isExpandable,
      expandedRowRender,
      classes,
      t,
      dataSource,
      id,
      x,
      y,
      paginationReducer,
      onRef,
      className,
      onChange,
      onRowClick,
      total,
      isNonePagination,
      emptyDescription,
      hasRowNumberColumn,
      hasRemoveColumn,
      onClickRemove,
      isNoneScroll,
      expandIcon,
      bordered,
      rowClassName,
      scrollToFirstRowOnChange,
      onExpandedRowsChange,
      ...rest
    } = this.props;
    const { selectedRowKeys, expandedRowKeys, isSelectedAll, visible } = this.state;
    const { pageSize, pageNumber, sortField, sortOrder, viewColumns } = paginationReducer[id] || Constants.DEFAULT_TABLE_STATUS;
    let viewColumnsTable;
    if (viewColumns) {
      viewColumnsTable = viewColumns.map(item => ({...item, title: item.title && typeof item.title === "string" ? t(item.title) : item.title}))
    }
    const totalLength = total || dataSource.length;
    const dataTable = dataSource.map((item, index) => ({ ...item, key: item.id ? item.id : "row_" + index }));
    let formattedColumns = this.formatColumnOption((hasRemoveColumn ? [{
      title: t(" "),
      dataIndex: "",
      width: 30,
      key: "x",
      render: (value, record) => {        
        return (
          (typeof hasRemoveColumn === "boolean" ? hasRemoveColumn : hasRemoveColumn(value, record))?
          <OhButton
            onClick={onClickRemove ? (() => onClickRemove(value, record)) : null}
            simpleDelele
          />: null
        );
      }
    }] : [])
    .concat( hasRowNumberColumn ? [{
      title: t("STT"),
      key: "STT",
      sorter: false,
      width: 50,
      render: (value, record, index) => (pageSize || 10) * ((pageNumber || 1) - 1) + index + 1
    }] : [])
    .concat(columns)
    .slice());
    return (
      <>
        <div id={id} />
        <Table
          bordered={bordered}
          expandIcon = {expandIcon}
          {..._.extend(
            hasCheckbox
              ? {
                rowSelection: {
                  selectedRowKeys: isSelectedAll ? dataTable.map(item => item.key) : selectedRowKeys,
                  onChange: this.onSelectChange,
                  onSelectAll: (selected, selectedRows, changeRows) => {
                    this.setState({
                      isSelectedAll: selected
                    })
                  }
                }
              }
              : {},
            isExpandable
              ? {
                expandedRowKeys: expandedRowKeys,
                onExpand: (expanded, record) => {
                  this.setState({ expandedRowKeys: expanded ? [record.key] : [] });
                },
                expandRowByClick: true,
                expandedRowRender: expandedRowRender || (() => "expanded content")
              }
              : {}
          )}
          size={window.innerWidth <= 1300 ? " small" : "default "}
          scroll={isNoneScroll ? {} : {x: x || 768, y: y }}
          columns={(viewColumnsTable || formattedColumns.map(item => ({...item, title: (item.title && typeof item.title === "string" ? t(item.title) : item.title) || undefined}))).filter(item => item.visible !== false)}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t(emptyDescription ? emptyDescription : t("Không có dữ liệu"))} /> }}
          className={className}
          onExpandedRowsChange={onExpandedRowsChange}
          dataSource={dataTable}
          rowClassName={(record, index) => {
            let className = rowClassName ? (typeof rowClassName === 'string' ? rowClassName : rowClassName(record, index)) : '';
            return className;
          }}
          pagination= { isNonePagination ? false : {
            pageSize: pageSize,
            current: pageNumber,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "50", "100"],
            total: totalLength,
            size: "normal",
            showTotal: (total, range) => `${range[0]}-${range[1]} ${t("của")} ${t("countItem", {count: total})}`,
            locale: { items_per_page: "/ " + t("trang") }
          }}
          onChange={(pagination, filters, sorter, extra) => {
            if (sortOrder !== sorter.order || sortField !== sorter.field) {

              this.onChange({
                sortField: sorter.field,
                sortOrder: sorter.order
              });

              Store.dispatch(
                paginationAction.changePagination(id, {
                  sortOrder: sorter.order,
                  sortField: sorter.field
                })
              );
            }
            if (pageSize !== pagination.pageSize || pageNumber !== pagination.current) {
              this.onChange({ pageSize: pagination.pageSize, pageNumber: pagination.current });
              if (scrollToFirstRowOnChange !== false){
                document.getElementById(id).scrollIntoView({behavior: "auto", block: "start", inline: "start"});
              }
              Store.dispatch(
                paginationAction.changePagination(id, {
                  pageSize: pagination.pageSize,
                  pageNumber: pagination.current
                })
              );
            }
          }}          
          onRow={(record, rowIndex) => {
            return this.props.onRowClick ? {
              onClick: e => {
                this.props.onRowClick(e, record, rowIndex);
              }
            } : null;
          }}
          {...rest}
        />
        
        <Modal
          visible={visible}
          title={t("Điều chỉnh cột hiển thị")}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <OhButton 
              key="submit" 
              type="primary" 
              onClick={this.handleOk}
              icon={<MdSave/>}
            >
              {t("Lưu")}
            </OhButton>,
            <OhButton
              type="exit"
              key="exit" 
              icon={<MdCancel/>}
              onClick={this.handleCancel}
              >
              {t("Thoát")}
            </OhButton>
          ]}
          centered={true}
          width={window.innerWidth > 700 ? 700 : "100%"}
          bodyStyle={{maxHeight:(window.innerHeight) *80/100 + "px", overflowY: "hidden"}}
          destroyOnClose={true}
        >
          <OhDragList
            tableRef={this}
            datasource={formattedColumns}
            viewColumns={viewColumns}
            onChange={(viewColumns) => {
              this.viewColumns = viewColumns;
            }}
          />
        </Modal> 
      </>
    );
  }
}

OhTable.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  hasCheckbox: PropTypes.bool,
  isExpandable: PropTypes.bool,
  pagination: PropTypes.object,
  expandedRowRender: PropTypes.func,
  onSelectChange: PropTypes.func,
  onChange: PropTypes.func,
  onRef: PropTypes.func,
  onRowClick: PropTypes.func,
  id: PropTypes.string
};

export default connect(function (state) {
  return {
    paginationReducer: state.paginationReducer
  };
})(withTranslation("translations")(withStyles(styles)(OhTable)));
