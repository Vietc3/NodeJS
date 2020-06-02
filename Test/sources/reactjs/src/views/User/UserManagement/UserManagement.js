import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withTranslation } from 'react-i18next';
import {  Input, Icon } from 'antd';
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import AlertQuestion from "components/Alert/AlertQuestion";
import '../User.css';
import Constants from 'variables/Constants';
import UserService from 'services/UserService';
import {  Redirect } from "react-router-dom";
import OhTable from "components/Oh/OhTable";
import OhToolbar from "components/Oh/OhToolbar";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import moment from "moment";

import { MdAddCircle, MdDelete } from "react-icons/md";
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
      Users: {},
      Roles: [],
      dataSource: this.props.users && this.props.users.length ? this.props.users : [],
      totalUser: this.props.users && this.props.users.length ? this.props.users.length : 0,
      searchText: {},
      searchWords: {},
      visible: false,
      loading: false,
      selectedRowKeys: [],
      title: '',
      userDetail: {},
      br: null,
      brerror: null,
      m_searchText: "",
      m_Pagination: { page: 1, pageSize: 10 },
      valueSort: 0,
      visible_invite: false,
      onSubmit: false,
    };
    this.notificationTimeout = null;
    this.filters = {};
    this.dataSource_copy = [];
    this.currentPage = {
      pageSize: 10,
      page: 1
    }

  }

  getColunm = () => {
    const { t } = this.props;
    let columns = [
      {
        title: t("Tên"),
        dataIndex: 'fullName',
        align: "left",
        width: "26%",
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: t("Email"),
        dataIndex: 'email',
        align: "left",
        width: "25%",
        sorter: (a, b) => a.email.localeCompare(b.email),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: t("Trạng thái"),
        dataIndex: 'isActive',
        align: "left",
        width: "16%",
        sorter: (a, b) => a.isActive - b.isActive,
        sortDirections: ['descend', 'ascend'],
        render: (value, record, index) => {
          return value === true ? <span style={{ color: 'green' }}>{t("Đang hoạt động")}</span> : <span style={{ color: 'gray' }}>{t("Đang bị khóa")}</span>
        }
      },
      {
        title: t("Bộ phận"),
        dataIndex: 'roleName',
        align: "left",
        width: "17%",
        isManualSort: true,
        sorter: (a, b) => a.roleName.localeCompare(b.roleName),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: t("Ngày tạo"),
        dataIndex: 'createdAt',
        align: "left",
        width: "16%",
        sorter: (a, b) => a.createdAt - b.createdAt,
        sortDirections: ['descend', 'ascend'],
        render: value => moment(value).format(Constants.DISPLAY_DATE_FORMAT_STRING)
      },
    ];
    return columns;
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
      manualSort: (isManualSort && sortOrder) ? {sortField, sortOrder} : {},
    };

    try {
      let getUserList = await UserService.getUserList(query);

      if (getUserList.status === false) throw getUserList.error
      else {
        this.setData(getUserList.data, getUserList.count);
        this.dataSource_copy = JSON.parse(JSON.stringify(getUserList.data));
      }
    }
    catch (err) {
      this.error(err)
    }
  }

  async componentWillMount() {
    if (this.props.users && this.props.users.length) {
      let getUsers = await UserService.getUserList({});

      if (getUsers.status) {

        let dataUsers = ManualSortFilter.sortArrayObject(getUsers.data, "fullName", "asc")

        Store.dispatch(Actions.changeUserList(dataUsers));

        this.onChange(this.filters)
      }
    }
  }
  
  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }
    
    if (this.props.users && this.props.users.length) {
      let filter = { ...this.filters.filter, ...this.filters.manualFilter };

      let dataFilter = ManualSortFilter.ManualSortFilter(this.props.users, filter, { sortField: this.filters.sortField, sortOrder: this.filters.sortOrder })

      this.setData(dataFilter, dataFilter.length);
    }
    else this.getData();
  }

  async getDataStore() {
    let getUsers = await UserService.getUserList({});

    if (getUsers.status) {

      let dataUsers = ManualSortFilter.sortArrayObject(getUsers.data, "fullName", "asc")

      Store.dispatch(Actions.changeUserList(dataUsers))

      this.onChange(this.filters)
    }
  }

  async setData(user, count) {
    var dataSource = _.cloneDeep(user) || [{}];
    if (dataSource.length > 0) {
      dataSource.map(data => data.roleName = data.roleId.name);

      this.setState({
        dataSource: dataSource,
        dataPrintFull: dataSource,
        totalUser: count,
        searchWords: {},
        filtered_dataSource: dataSource
      });
    }
    else
      this.setState({
        dataSource: [],
        totalUser: 0
      })
    this.dataSource_copy = dataSource;
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
        exist = exist && (text === '' ? true : (!item[i] ? false : item[i].toLowerCase().includes(text.toLowerCase())));
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

  success = (mess) => {
    notifySuccess(mess)
    this.hideAlert()
  }

  error = (mess) => {
    notifyError(mess)
  }

  hideAlert = () => {
    this.setState({
      alert: null
    });
  }
  handleCancel = () => {
    this.setState({ visible: false, visible_role: false, visible_create: false, visible_invite: false });
  };

  handleRemove = () => {
    const { t } = this.props;
    let { selectedRowKeys } = this.state;

    this.setState({
      alert: (
        <AlertQuestion
          action={() => {
            let findAdmin = selectedRowKeys.find(item => item === 1);
            if (findAdmin) {
              this.error(t("Bạn không được xóa tài khoản Admin"));
              this.hideAlert();
            }
            else this.actionDeleteBatch();            
          }}
          hideAlert={() => this.hideAlert()}
          messege={t("Bạn có chắc chắn muốn xóa ") + t("{{count}} người dùng này?", { count: selectedRowKeys.length })}
          buttonOk={t("Xóa")}
        />
      )
    });
  };

  actionDeleteBatch = async () => {
    const { t } = this.props;
    let deleteUser = await UserService.deleteUsers({ ids: this.state.selectedRowKeys });
    if (deleteUser.status) {
      this.success(t("Xóa thành công"));
      this.tableRef.resetSelectRowKeys();
      if (this.props.users && this.props.users.length) {
        this.getDataStore()
      }
      else this.getData();
    } else {
      this.error(deleteUser.error);
      this.hideAlert();
    }    
  };


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

  handleSubmit = (childData) => {
    this.setState({ onSubmit: childData });
  }
  render() {
    const { t } = this.props;
    const { dataSource, selectedRowKeys } = this.state;
    let columns = this.getColunm();

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
                    typeButton:"delete",
                    simple: true,
                    permission: {
                      name: Constants.PERMISSION_NAME.SETUP_USER,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }
                  },
                  {
                    type: "link",
                    linkTo: Constants.ADD_USER_PATH,
                    label: t("Tạo người dùng"),
                    icon: <MdAddCircle />,
                    typeButton:"add",
                    simple: true,
                    permission: {
                      name: Constants.PERMISSION_NAME.SETUP_USER,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }
                  }
                ]}
              />
              <OhSearchFilter
              id={"user-management-table"}
                onFilter={(filter, manualFilter) => {
                  this.onChange({
                    filter,
                    manualFilter
                  });
                }}
                filterFields={[
                  {
                    type: "input-text",
                    title: t("Tên"),
                    field: "fullName",
                    isManualFilter: true,
                    placeholder: t("Nhập tên")
                  },
                  {
                    type: "input-text",
                    title: t("Email"),
                    field: "email",
                    isManualFilter: true,
                    placeholder: t("Nhập email")
                  },
                  {
                    type: "select",
                    title: t("Trạng thái"),
                    field: "isActive",
                    isManualFilter: true,
                    placeholder: t("Chọn trạng thái"),
                    options: [{ value: 0, title: Constants.USER_STATUS[0] }, { value: 1, title: Constants.USER_STATUS[1] }]
                  },
                  {
                    type: "input-text",
                    title: t("Bộ phận"),
                    field: "roleId.name",
                    isManualFilter: true,
                    placeholder: t("Nhập bộ phận")
                  },
                  { type: "date", title: t("Ngày tạo"), field: "createdAt" },                  
                ]}
                defaultShowAll={false}
                searchInput={{
                  fields: ["fullName", "email"],
                  placeholder: t("Tìm theo tên hoặc email")
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
                columns={columns}
                total={this.state.totalUser}
                dataSource={dataSource}
                hasCheckbox={true}
                id={"user-management-table"}
                onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
                onRowClick={(e, record, index) => {
                  this.setState({
                    redirect: (
                      <Redirect
                        from="/auth/login-page"
                        to={{
                          pathname: Constants.EDIT_USER_PATH + record.id
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
      users: state.userListReducer.users
    };
  }
)(withTranslation("translations")(UserManagement));