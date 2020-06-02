import React, { Component } from 'react';
import OhTable from 'components/Oh/OhTable.jsx';
import OhToolbar from 'components/Oh/OhToolbar.jsx';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { MdAddCircle } from "react-icons/md";
import { withTranslation } from 'react-i18next';
import Constants from 'variables/Constants/index.js';
import BranchService from 'services/BranchService.js';
import { notifyError } from 'components/Oh/OhUtils.js';
import { Redirect } from 'react-router-dom';

class Branches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      dataSource: [],
      totaldataSource: 0,
    }
    this.filters = {};
  }
  componentDidMount = () => {
    this.getData()
  }

  async getData() {
    let { filter, sortField, sortOrder, manualFilter, isManualSort, pageSize, pageNumber } = this.filters;
  
    pageSize = pageSize || Constants.DEFAULT_TABLE_STATUS.pageSize;
    pageNumber = pageNumber || Constants.DEFAULT_TABLE_STATUS.pageNumber;

    filter = {...filter}

    const query = {
      filter: filter,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };
    try {
      let getBranches = await BranchService.getBranches(query)

      if (getBranches.status) {
        this.setState({ dataSource: getBranches.data, totaldataSource: getBranches.count})
      }
      else throw getBranches.message
    }
    catch(error) {
      if (typeof error === "string") notifyError(error)

      notifyError(error)
    }
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }
  
    this.getData();
  }

  getColums = () => {
    const { t } = this.props;

    let columns = [
      {
        title: t("Tên"),
        align: "left",
        dataIndex: "name"
      },
      {
        title: t("Địa chỉ"),
        align: "rigth",
        dataIndex: "address"
      },
      {
        title: t("Số điện thoại"),
        align: "left",
        dataIndex: "phoneNumber"
      },
      {
        title: t("Email"),
        align: "left",
        dataIndex: "email"
      },
      {
        title: t("Trạng thái"),
        align: "left",
        dataIndex: "status",
        render: value => {
          return (
            <span style={{color: value === Constants.BRANCH_CARD_STATUS.INACTIVE ? "red": null}}>{t(Constants.BRANCH_STATUS_NAME[value])}</span>
          )
        }
      }
    ];
    return columns
  }
  render() {
    const { t } = this.props;
    const { dataSource, totaldataSource } = this.state;

    return (
      <Card>
          {this.state.redirect}
        <CardBody>
        <OhToolbar
            right={[
              {
                type: "link",
                linkTo: "/admin/add-branch",
                label: t("Tạo chi nhánh"),
                icon: <MdAddCircle />,
                simple: true,
                typeButton: "add",
                permission:{
                  name: Constants.PERMISSION_NAME.SETUP_BRANCH,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                },
              }
            ]}
          />
          <OhTable
            onRef={ref => (this.tableRef = ref)}
            onChange={(tableState, isManualSort) => {
              this.onChange({
                ...tableState,
                isManualSort
              });
            }}
            columns={this.getColums()}
            dataSource={dataSource}
            total={totaldataSource}
            id={"list-branch-table"}
            onRowClick={(e, record, index) => {
              this.setState({
                redirect: (
                  <Redirect
                    to= {`/admin/edit-branch/${record.id}`}
                    
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

export default  withTranslation("translations")(Branches);