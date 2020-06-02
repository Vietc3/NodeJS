// @material-ui
import { Icon, Input } from "antd";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import OhTable from "components/Oh/OhTable";
import OhToolbar from "components/Oh/OhToolbar";
import OhButton from "components/Oh/OhButton";
import ExtendFunction from "lib/ExtendFunction";
import _ from "lodash";
import React, { Fragment } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { withTranslation } from "react-i18next";
import { MdAddCircle, MdDelete } from "react-icons/md";
import incomeExpenseTypeService from "services/IncomeExpenseTypeService";
import Constants from "variables/Constants/index";
import EditForm from "views/IncomeExpenseTypes/components/EditForm";
import { notifySuccess, notifyError } from "components/Oh/OhUtils";
import { connect } from "react-redux";
import Actions from "store/actions/";
import Store from "store/Store";
import ManualSortFilter from "MyFunction/ManualSortFilter";

class IncomeExpenseTypes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editedIcomeExpenseType: {},
      visible: false,
      isEditForm: false,
      notification: null,
      selectedRowKeys: [],
      br: null,
      brerror: null,
      searchText: {},
      searchWords: {},
      dataSource: [],
      incomeExpenseTypes: this.props.incomeExpenseTypes && this.props.incomeExpenseTypes.length ? this.props.incomeExpenseTypes : [],
      totalIncomeExpenseTypes: this.props.incomeExpenseTypes && this.props.incomeExpenseTypes.length ? this.props.incomeExpenseTypes.length : 0,
    };
    this.filters = {};
    this._datasource = [];
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  searchValue = field => {
    return {
      filterDropdown: ({ confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            value={this.state.searchText[field]}
            onChange={e => {
              this.handleSearch(e.target.value, field);
            }}
            onPressEnter={e => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      filterIcon: filtered => <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.focus());
        }
      }
    };
  };

  handleSearch = (value, field) => {
    let { searchWords, searchText } = this.state;
    searchWords[field] = searchWords[field] || "";
    searchText[field] = searchText[field] || "";
    searchWords[field] = value
      .toString()
      .split(/\s/)
      .filter(word => word);
    searchText[field] = value;
    let arr = this._datasource.filter(item => {
      let exist = true;
      for (let i in searchText) {
        let text = searchText[i];
        exist =
          exist &&
          (text === ""
            ? true
            : !item[i]
              ? false
              : ExtendFunction.removeSign(item[i].toLowerCase()).includes(ExtendFunction.removeSign(text.toLowerCase())));
      }
      return exist;
    });

    this.setState({ searchWords: searchWords, searchText: searchText, dataSource: arr });
  };

  onClickRemoveIncomeExpenseType = async () => {
    const t = this.props.t;
    let { selectedRowKeys } = this.state;

    this.setState({
      notification: (
        <SweetAlert
          showConfirm={false}
          showCancel={false}
          style={{
            width: window.innerWidth < 900 ? 300 : 500,
            display: "block",
            marginLeft: 0,
            marginTop: 0,
            top: `${((window.innerHeight / 2 - 85) * 100) / window.innerHeight}%`,
            left: `${((window.innerWidth / 2 - (window.innerWidth < 900 ? 150 : 250)) * 100) / window.innerWidth}%`
          }}
          title={
            <div style={{ fontSize: "12px", lineHeight: "1.5em" }}>
              {/* <Icon type="exclamation-circle" style={{ color: "#f44336", marginLeft: "-5px" }} />&nbsp; */}
              <span style={{ color: "black", marginLeft: "2px" }}>
                {t("Bạn có chắc chắn muốn xóa ")}
                <span style={{ fontWeight: "bold" }}>{selectedRowKeys.length + " "}</span>
                {t("{{count}} loại thu chi này?", {count: selectedRowKeys.length })}
              </span>
            </div>
          }
          onCancel={() => this.hideAlert()}
          onConfirm={() => this.hideAlert()}
        >
          <div style={{ textAlign: "center" }}>
            <OhButton
              type="delete"
              onClick={async () => {
                let deleteIncomeExpenseTypes = await incomeExpenseTypeService.deleteIncomeExpenseTypes(selectedRowKeys);

                if (!deleteIncomeExpenseTypes.status) this.error();
                else {
                  this.success(t("Xóa loại thu chi thành công"));

                  if (this.props.incomeExpenseTypes && this.props.incomeExpenseTypes.length) {
                    this.getDataStore();
                  }
                  else this.getData();
                }
              }}
              permission={{
                name: Constants.PERMISSION_NAME.CASHFLOW,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }}>
              {t("Xoá")}
            </OhButton>
            <OhButton
              type="exit"
              onClick={() => this.hideAlert()}
              permission={{
                name: Constants.PERMISSION_NAME.CASHFLOW,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }}>
              {t("Thoát")}
            </OhButton>


          </div>
        </SweetAlert>
      )
    });
  };

  hideAlert = () => {
    this.setState({
      notification: null
    });
  };

  onCancel = () => {
    this.setState({
      visible: false
    });
  };

  success = mess => {
    notifySuccess(mess)
    this.hideAlert()
    this.tableRef.resetSelectRowKeys()
  };
  error = mess => {
    notifyError(mess)
  };

  onClickAdd = () => {
    let { t } = this.props;
    this.setState({
      editedIcomeExpenseType: {},
      visible: true,
      isEditForm: false,
      title: t("Tạo loại thu chi")
    });
  };

  onClickEdit = record => {
    let { t } = this.props;
    this.setState({
      editedIcomeExpenseType: record,
      visible: true,
      isEditForm: true,
      title: t("Sửa loại thu chi")
    });
  };

  async getData() {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    pageNumber = pageNumber || 1;
    pageSize = pageSize || 10;

    filter = _.extend(filter || {}, {auto: 0}, {deletedAt: 0});
    const query = {
      filter: filter,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? {sortField, sortOrder} : {},
    };

    let getIncomeExpenseTypes = await incomeExpenseTypeService.getIncomeExpenseTypes(query);    

    this._datasource = getIncomeExpenseTypes.data.map(item => _.extend(item, { key: item.id }));

    this.setState({
      dataSource: this._datasource,
      incomeExpenseTypes: getIncomeExpenseTypes.data,
      totalIncomeExpenseTypes: getIncomeExpenseTypes.count
    });
  }

  async getDataStore() {
    let getIncomeExpenseTypes = await incomeExpenseTypeService.getIncomeExpenseTypes({});

    if (getIncomeExpenseTypes.status) {

      let dataIncExpTypes = ManualSortFilter.sortArrayObject(getIncomeExpenseTypes.data, "name", "asc")

      Store.dispatch(Actions.changeIncomeExpenseType(dataIncExpTypes))

      this.onChange(this.filters)
    }
  }

  async componentWillMount() {
    if (this.props.incomeExpenseTypes && this.props.incomeExpenseTypes.length) {
      let getDataIncExpTypes = await incomeExpenseTypeService.getIncomeExpenseTypes({});

      if (getDataIncExpTypes.status) {

        let dataIncExpTypes = ManualSortFilter.sortArrayObject(getDataIncExpTypes.data, "name", "asc")

        Store.dispatch(Actions.changeIncomeExpenseType(dataIncExpTypes))
      }
    }
  }
  
  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }
    
    if (this.props.incomeExpenseTypes && this.props.incomeExpenseTypes.length) {
      let filter = { ...this.filters.filter, ...this.filters.manualFilter };

      let dataFilter = ManualSortFilter.ManualSortFilter(this.props.incomeExpenseTypes, filter, { sortField: this.filters.sortField, sortOrder: this.filters.sortOrder })
      let data = _.cloneDeep(dataFilter)
      this._datasource = data.map(item => _.extend(item, { key: item.id }));

      this.setState({
        dataSource: this._datasource,
        incomeExpenseTypes: dataFilter,
        totalIncomeExpenseTypes: dataFilter.length
      })
    }
    else this.getData();
  }

  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  };

  render() {
    const { selectedRowKeys, dataSource } = this.state;
    const { t } = this.props;
    let columns = [
      {
        title: t("Tên"),
        dataIndex: "name",
        align: "left",
        width: "45%"
      },
      {
        title: t("Loại"),
        dataIndex: "type",
        align: "left",
        width: "20%",
        render: value => t(Constants.COST_TYPE_NAME[value])
      },
      {
        title: t("Ghi chú"),
        dataIndex: "notes",
        type: "notes",
        align: "left",
        width: "35%",
      }
    ];

    return (
      <Fragment>
        {this.state.notification}        
        {this.state.br}
          {this.state.brerror}
        <Card>            
          <CardBody >
            <OhToolbar
              right={[
                {
                  type: selectedRowKeys.length ? "button" : null,
                  label: t("Xóa"),
                  onClick: () => this.onClickRemoveIncomeExpenseType(),
                  icon: <MdDelete />,
                  typeButton:"delete",
                  simple: true,
                  permission:{
                    name: Constants.PERMISSION_NAME.INCOME_EXPENSE_TYPE,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
                {
                  type: "button",
                  label: t("Thêm mới"),
                  onClick: () => this.onClickAdd(),
                  icon: <MdAddCircle />,
                  typeButton:"add",
                  simple: true,
                  permission:{
                    name: Constants.PERMISSION_NAME.INCOME_EXPENSE_TYPE,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
              ]} 
            />
            <OhSearchFilter
            id={"income-expense-type-table"}
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
                  field: "name",
                  placeholder: t("Nhập {{type}}", {type: t("Tên").toLowerCase()})
                }
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["name", "notes"],
                placeholder: t("Tìm theo tên hoặc ghi chú")
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
              total={this.state.totalIncomeExpenseTypes}
              columns={columns}
              dataSource={dataSource}
              hasCheckbox={true}
              id={"income-expense-type-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => {
                this.onClickEdit(record)
              }}
            />                
          </CardBody>
        </Card>
        <EditForm
          onRef={ref => (this.editFormRef = ref)}
          isEditForm={this.state.isEditForm}
          visible={this.state.visible}
          onCancel={this.onCancel}
          onSuccess={() => {
            this.setState({ visible: false });
            if (this.props.incomeExpenseTypes && this.props.incomeExpenseTypes.length) {
              this.getDataStore();
            }
            else this.getData();
          }}
          defaultValue={this.state.editedIcomeExpenseType}
        />
      </Fragment>
    );
  }
}

export default connect(
  function (state) {
    return {
      incomeExpenseTypes: state.incExpTypeReducer.incomeExpenseTypes
    };
  }
)(withTranslation("translations")(
  IncomeExpenseTypes
));
