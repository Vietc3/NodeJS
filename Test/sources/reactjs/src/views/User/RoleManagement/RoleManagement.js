import React, { Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import { withTranslation } from 'react-i18next'
import '../User.css';
import { Input, Icon } from "antd";
import AlertQuestion from "components/Alert/AlertQuestion";
import RoleService from "services/RoleService";
import Constants from "variables/Constants";

import OhTable from "components/Oh/OhTable";
import OhToolbar from "components/Oh/OhToolbar";
import OhSearchFilter from "components/Oh/OhSearchFilter";

import { Redirect } from "react-router-dom";
import { MdAddCircle, MdDelete } from "react-icons/md";
import moment from "moment";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import _ from 'lodash';
import Actions from "store/actions/";
import Store from "store/Store";
import ManualSortFilter from "MyFunction/ManualSortFilter";
import { connect } from "react-redux";

class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      Roles: [],
      Users: [],
      Functions: [],
      dataSource: this.props.roles && this.props.roles.length ? this.props.roles : [],
      totalRole: this.props.roles && this.props.roles.length ? this.props.roles.length : 0,
      selectedRowKeys: [],
      searchText: {},
      searchWords: {},
      visible: false,
      loading: false,
      title: '',
      roleDetail: {},
      ableEdit: false,
      checked: [24, 22],
      treeLength: 0,
      treeData: [],
      errorAdd: false,
      m_searchText: "",
      m_Pagination: { page: 1, pageSize: 10 },
      valueSort: 0,
      br: null,
      brerror: null,
    };
    this.dataSource_copy = [];
    this.filters = {};
    this.currentPage = {
      pageSize: 10,
      page: 1
    }
  }
  getColumns = () => {
    const { t } = this.props;

    let columns = [
      {
        title: t("Bộ phận"),
        dataIndex: 'name',
        align: "left",
        width: '25%',
      },
      {
        title: t("Ghi chú"),
        dataIndex: 'notes',
        width: '60%',
        sortDirections: ["descend", "ascend"],
        render: (value) => {
          return (
            <div className="ellipsis-not-content">
              {value ? value : "---"}
            </div>
          )
        }
      },
      {
        title: t("Ngày cập nhật"),
        dataIndex: 'updatedAt',
        align: "left",
        width: '15%',
        render: value => moment(value).format(Constants.DISPLAY_DATE_FORMAT_STRING)

      },
    ];
    return columns;
  }

  async componentWillMount() {
    if (this.props.roles && this.props.roles.length) {
      this.getDataStore()
    }
  }

  async setData(roles, count) {
    this.setState({
      dataSource: roles,
      totalRole: count
    });
  }

  async getData() {

    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    const query = {
      filter: filter || {},
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    try {
      let getRoles = await RoleService.getRoles(query);

      if (!getRoles.status) throw getRoles.message
      else {
        this.setData(getRoles.data, getRoles.count);
        this.dataSource_copy = JSON.parse(JSON.stringify(getRoles.data));
      }
    }
    catch (err) {
      this.error(err)
    }
  }

  async getDataStore() {
    let getRoles = await RoleService.getRoles({});

    if (getRoles.status) {

      let dataRoles = ManualSortFilter.sortArrayObject(getRoles.data, "name", "asc")

      Store.dispatch(Actions.changeRoleList(dataRoles))

      this.onChange(this.filters)
    }
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    if (this.props.roles && this.props.roles.length) {
      let filter = { ...this.filters.filter, ...this.filters.manualFilter };

      let dataFilter = ManualSortFilter.ManualSortFilter(this.props.roles, filter, { sortField: this.filters.sortField, sortOrder: this.filters.sortOrder })

      this.setData(dataFilter, dataFilter.length);
    }
    else this.getData();
  }

  handleSearch = (e, id) => {
    let { searchWords, searchText } = this.state;
    searchWords[id] = searchWords[id] || '';
    searchText[id] = searchText[id] || '';
    searchWords[id] = e.target.value.toString().split(/\s/).filter(word => word);
    searchText[id] = e.target.value
    let arr = this.dataSource_copy.filter((item) => {
      let exist = true;
      for (let i in searchText) {

        let text = searchText[i];
        exist = exist && (text === '' ? true : item[i].toLowerCase().includes(text.toLowerCase()));
      }
      return exist;
    });

    this.setState({ searchWords: searchWords, searchText: searchText, dataSource: arr });
  };
  searchValue = (id) => {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            value={this.state.searchText[id]}
            onChange={e => { this.handleSearch(e, id) }}
            onPressEnter={e => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.focus());
        }
      },
    }
  }
  clearFilters = () => {
    this.setState({ searchText: {}, searchWords: {}, dataSource: this.dataSource_copy });
  }
  handleRemove = () => {
    const { t } = this.props;
    let { selectedRowKeys } = this.state;

    this.setState({
      alert: (
        <AlertQuestion
          action={() => {
            let findAdmin = selectedRowKeys.find(item => item === 1);
            if (findAdmin) {
              this.error(t("Bạn không được xóa bộ phận admin"))
              this.hideAlert()
            }
            else this.actionDeleteBatch();
          }}
          hideAlert={() => this.hideAlert()}
          messege={t("Bạn có chắc chắn muốn xóa ") + t("{{count}} bộ phận này?", { count: selectedRowKeys.length })}
          buttonOk={t("Xóa")}
        />
      )
    });
  };

  actionDeleteBatch = async () => {
    const { t } = this.props;
    let deleteRole = await RoleService.deleteRoles({ ids: this.state.selectedRowKeys });

    if (deleteRole.status) {
      this.success(t("Xóa thành công"));
      this.tableRef.resetSelectRowKeys();
      if (this.props.users && this.props.users.length) {
        this.getDataStore()
      }
      else this.getData();
    } else {
      this.hideAlert()
      this.error(deleteRole.error);
    }    
  };


  success = (mess) => {
    this.hideAlert();
    notifySuccess(mess)
  }

  error = (mess) => {
    notifyError(mess)
  }
  hideAlert = () => {
    this.setState({
      alert: null
    });
  }
  hideAlertError = () => {
    this.props.resetUpdateRole();
    this.setState({
      alert: null
    });
  }


  handleShowSizeChange = (current, size) => {
    let cur_page = this.state.m_Pagination.page;
    let cur_pageSize = this.state.m_Pagination.pageSize;
    let cur_item = cur_pageSize * (cur_page - 1) + 1;
    let page = parseInt(cur_item / size) + 1;

    this.setState({ m_Pagination: { page: page, pageSize: size } })
  }


  handleSort = () => {
    this.setState({
      valueSort: this.state.valueSort <= 1 ? this.state.valueSort + 1 : 0
    },
      () => this.sort()
    );
  }

  sort = () => {
    let dataSort = [...this.state.dataSource];
    switch (this.state.valueSort) {
      case 0:
        dataSort = this.dataSource_copy;
        break;
      case 1:
        dataSort.sort((a, b) => {
          return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1;
        });
        break;
      case 2:
        dataSort.sort((a, b) => {
          return a.Name.toLowerCase() > b.Name.toLowerCase() ? -1 : 1;
        });
        break;
      default:
        break;
    }
    this.setState({
      dataSource: dataSort,
      refresh: true
    })
  }

  render() {
    const { dataSource, selectedRowKeys } = this.state;
    let { t } = this.props;

    let columns = this.getColumns();
    return (
      <Fragment>
        {this.state.alert}
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        <Fragment>
          <Card>
            <CardBody>
              <OhToolbar
                right={[
                  {
                    type: selectedRowKeys.length ? "button" : null,
                    label: t("Xóa"),
                    onClick: () => this.handleRemove(),
                    icon: <MdDelete />,
                    typeButton: "delete",
                    simple: true,
                    permission: {
                      name: Constants.PERMISSION_NAME.SETUP_USER,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }
                  },
                  {
                    type: "link",
                    linkTo: Constants.ADD_ROLE_PATH,
                    label: t("Tạo bộ phận"),
                    icon: <MdAddCircle />,
                    typeButton: "add",
                    simple: true,
                    permission: {
                      name: Constants.PERMISSION_NAME.SETUP_USER,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }
                  }
                ]}
              />
              <OhSearchFilter
              id={"role-management-table"}
                onFilter={(filter, manualFilter) => {
                  this.onChange({
                    filter,
                    manualFilter
                  });
                }}
                filterFields={[
                  { type: "date", title: t("Ngày cập nhật"), field: "updatedAt" },
                  {
                    type: "input-text",
                    title: t("Bộ phận"),
                    field: "name",
                    isManualFilter: true,
                    placeholder: t("Nhập {{type}}", {type: t("Bộ phận").toLowerCase()})
                  },
                ]}
                defaultShowAll={false}
                searchInput={{
                  fields: ["name"],
                  placeholder: t("Tìm theo bộ phận")
                }}
              />
              <OhTable
                onRef={ref => (this.tableRef = ref)}
                onChange={(tableState, isManualSort) => {
                  this.onChange({
                    ...tableState,
                    isManualSort
                  });
                }}
                rowClassName={() => {
                  return 'rowOhTable'
                }}
                columns={columns}
                total={this.state.totalRole}
                dataSource={dataSource}
                hasCheckbox={true}
                id={"role-management-table"}
                onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
                onRowClick={(e, record, index) => {
                  this.setState({
                    redirect: (
                      <Redirect
                        from="/auth/login-page"
                        to={{
                          pathname: Constants.EDIT_ROLE_PATH + record.id
                        }}
                      />
                    )
                  });
                }}
              />
            </CardBody>
          </Card>
        </Fragment>
      </Fragment>
    );
  }
}

UserManagement.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  function (state) {
    return {
      roles: state.roleReducer.roles
    };
  }
)(withTranslation("translations")(withStyles((theme) => ({
  ...buttonsStyle,
  ...regularFormsStyle,
  ...extendedTablesStyle,
  ...sweetAlertStyle,
  inlineChecks: {
    marginTop: '20px'
  }
}))(UserManagement)));
