import React, { Component } from 'react';
import OhTable from 'components/Oh/OhTable';
import OhToolbar from 'components/Oh/OhToolbar';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody";
import { MdAddCircle } from "react-icons/md";
import Constants from 'variables/Constants/';
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from "react-i18next";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import StockService from 'services/StockService';
import { notifyError } from 'components/Oh/OhUtils';
import { Redirect } from 'react-router-dom';
import _ from "lodash";
class Branches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      dataSource: [],
      countDataSource: 0
    }
    this.filters = {};
  }
  
  async getData() {
    let { filter, sortField, sortOrder, manualFilter, isManualSort, pageSize, pageNumber } = this.filters;
    let fullStockList = {};

    pageSize = pageSize || Constants.DEFAULT_TABLE_STATUS.pageSize;
    pageNumber = pageNumber || Constants.DEFAULT_TABLE_STATUS.pageNumber;

    const query = {
      filter: {...filter, deletedAt: 0},
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };
    
    let getStockList = await StockService.getStockList(query)    
    if(getStockList.status){
      getStockList.data.map(item => {
        fullStockList[item.branchId.id] = fullStockList[item.branchId.id] || {};
        fullStockList[item.branchId.id][item.stockColumnIndex] = item
      });
      this.setState({ fullStockList: fullStockList, dataSource: getStockList.data, countDataSource: getStockList.count})

    }
    else notifyError(getStockList.message)
  }

  getDataStock = (data) => {
    let { fullStockList } = this.state;
    let subDataSource = [];
    let branchName = [];

      data.map(item => {
        let arrFullStockList = Object.values(fullStockList[item.branchId.id]); 
        let checkBranch = _.includes(branchName, item.branchId.name);
        let data = {
          stockName: item.name,
          address: item.address ? item.address : "",
          notes: item.notes ? item.notes : "",
          id: item.id,
          branchName: item.branchId.name 
          }
          if (!checkBranch){
            data = _.extend(data, {
              rowSpan: arrFullStockList.length
            })
            branchName.push(item.branchId.name);
          }

          subDataSource.push(data);

      });
        
    return subDataSource;
  }

  getColums = () => {
    const { t } = this.props;

    let columns = [
      {
        title: t("Chi nhánh"),
        dataIndex: "branchName",
        align: "left",
        render: (value, record, index) => {
          let obj = {
            children: <span style={{fontWeight: 700}}>{value}</span>,
            props: {}
          }
          obj.props.rowSpan = record.rowSpan || 0
          return obj;
        },
        width: "30%",
      },
      {
        title: t("Kho"),
        dataIndex: "stockName",
        width: "20%",
        align: "left",
        sorter: false
      },
      {
        title: t("Địa chỉ"),
        dataIndex: "address",
        width: "25%",
        align: "left",
        sorter: false
      },
      {
        title: t("Ghi chú"),
        dataIndex: "notes",
        width: "25%",
        align: "left",
        sorter: false
      },
    ];
    return columns
  }
  
  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }
  
    this.getData();
  }
  
  render() {
    const { t } = this.props;
    const { dataSource, countDataSource } = this.state;
    let dataStock = this.getDataStock(dataSource)
    
    
    return (
      <Card>
          {this.state.redirect}
        <CardBody>
        <OhToolbar
            right={[
              {
                type: "link",
                linkTo: "/admin/add-stock",
                label: t("Tạo kho mới"),
                icon: <MdAddCircle />,
                simple: true,
                typeButton: "add",
                permission:{
                  name: Constants.PERMISSION_NAME.SETUP_STOCK,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                },
              }
            ]}
          />
          <OhTable
           onRef={ref => (this.tableRef = ref)}
            columns={this.getColums()}
            dataSource={dataStock}
            id={"stock-list-table"}
            total={countDataSource}
            bordered={true}
            onChange={(tableState, isManualSort) => {
              this.onChange({
                ...tableState,
                isManualSort
              });
            }}
            onRowClick={(e, record, index) => {
              this.setState({
                redirect: (
                  <Redirect
                    to= {`/admin/edit-stock/${record.id}`}
                  />
                )
              });
            }}
          />
        </CardBody>
      </Card>
    );
  }
}

export default  
(withTranslation("translations")(
  withStyles(theme => ({
    ...regularFormsStyle
  }))(Branches)
));
