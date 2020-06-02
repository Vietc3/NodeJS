import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import AlertQuestion from "components/Alert/AlertQuestion";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import AddProductUnit from "./AddProductUnit.jsx";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import moment from "moment";
import Constants from "variables/Constants/";
import productUnitService from 'services/ProductUnitService';
import _ from "lodash";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import OhTable from "components/Oh/OhTable";
import OhToolbar from "components/Oh/OhToolbar";
import { MdAddCircle, MdDelete } from "react-icons/md";
import ManualSortFilter from "MyFunction/ManualSortFilter";
import Actions from "store/actions/";
import Store from "store/Store";

class ProductUnit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unitCheckCard: [],
      unitCheckCardCount: 0,
      alert: null,
      br: null,
      brerror: null,
      dataSource: this.props.productUnits && this.props.productUnits.length ? this.props.productUnits : [],
      dataIssueStatusFilter: [],
      editProductUnit: {},
      visible: false,
      type: null,
      searchText: {},
      searchWords: {},
      isEdit: false,
      recordEdit: {},
      selectedRowKeys: [],
      checkedBoxProduct: false,
      rejectedFilters: {},

    };
    this.onCancel = this.onCancel.bind(this);
    this.dataSource_copy = [];
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  hideAlert = () => {
    this.setState(
      {
        alert: null
      },
      () => { }
    );
  };

  onClickRemoveProductUnit = () => {
    let { selectedRowKeys } = this.state;
    const {t} = this.props
    this.setState({
      alert: (
        <AlertQuestion
          action={() => {
            this.actionDeleteBatch();
          }}
          hideAlert={() => this.hideAlert()}
          messege={t("Bạn có chắc chắn muốn xóa đơn vị tính này ?", {count: selectedRowKeys.length})}
          buttonOk={t("Xóa")}
        />
      )
    });
  };
  actionDeleteBatch = async () => {
    const {t} = this.props;
    let deleteProductUnits = await productUnitService.deleteProductUnits(this.state.selectedRowKeys);
    if (deleteProductUnits.status) {
      this.success(t(`Đơn vị tính được xóa thành công`));
      if (this.props.productUnits && this.props.productUnits.length) {
        this.getDataStore()
      }
      else this.getData();
      this.tableRef.resetSelectRowKeys();
    } else {
      this.error(deleteProductUnits.error);
    }
    this.hideAlert();
  };

  async getDataStore() {
    let productUnits = await productUnitService.getProductUnits({});

    if (productUnits.status) {

      let dataProductUnits = ManualSortFilter.sortArrayObject(productUnits.data, "name", "asc")

      Store.dispatch(Actions.changeProductUnitList(dataProductUnits))

      this.onChange(this.filters)
    }
  }

  async setData(ProductUnits) {
    let dataProductUnit = [];
    if (ProductUnits.length > 0) {
      ProductUnits.reverse();
      for (let i in ProductUnits) {
        dataProductUnit.push({ ...ProductUnits[i], key: ProductUnits[i].id })
      }
      this.setState({
        dataSource: dataProductUnit,
        dataPrintFull: dataProductUnit,
        ProductUnits
      });
      this.dataSource_copy = dataProductUnit
    }
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
    let getProductUnits = await productUnitService.getProductUnits(query);

    if (getProductUnits.status) {
      this.setState({
        unitCheckCard: getProductUnits.data,
        dataSource: this.getDataSource(getProductUnits.data),
        unitCheckCardCount: getProductUnits.count
      });
    }
  }

  async componentWillMount() {
    if (this.props.productTypes && this.props.productTypes.length) {
      let productUnits = await productUnitService.getProductUnits({});

      if (productUnits.status) {

        let dataProductUnits = ManualSortFilter.sortArrayObject(productUnits.data, "name", "asc")

        Store.dispatch(Actions.changeProductUnitList(dataProductUnits))
      }
    }
  }
  
  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    if (this.props.productUnits && this.props.productUnits.length) {
      let filter = { ...this.filters.filter, ...this.filters.manualFilter };

      let dataFilter = ManualSortFilter.ManualSortFilter(this.props.productUnits, filter, { sortField: this.filters.sortField, sortOrder: this.filters.sortOrder })

      this.setState({
        dataSource: dataFilter,
        totalProducts: dataFilter.length,
        dataPrintFull: dataFilter
      })
    }
    else this.getData();
  }
  
  getDataSource = unitCheckCard => {
    return unitCheckCard.map(item => {
      return {
        ...item,
        checkedAt: moment(item.checkedAt, Constants.DATABASE_DATE_TIME_FORMAT_STRING).format(
          Constants.DISPLAY_DATE_TIME_FORMAT_STRING
        )
      };
    });
  };

  onCancel = () => {
    this.setState({
      alert: null,
      visible: false,
      type: "",
      title: "",
      selectedRowKeys: [],
    });
  };

  onClickAdd = () => {
    const t = this.props.t;
    this.setState({
      editProductUnit: {},
      visible: true,
      type: "add",
      title: t("Tạo đơn vị tính")
    });
  };

  onClickEditModal = productUnit => {
    const t = this.props.t;
    this.setState({
      editProductUnit: productUnit,
      visible: true,
      type: "edit",
      title: t("Cập nhật đơn vị tính")
    });
  };

  success = (mess) => {
    const { t } = this.props;
    this.setState({ br: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={t(mess)} /> }, () => this.onCancel())
  }

  error = (mess) => {
    const { t } = this.props;
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={t(mess)} />
    })
  }

  showModalAdd = () => {
    return (
      <AddProductUnit
        type={this.state.type}
        visible={this.state.visible}
        title={this.state.title}
        onCancel={this.onCancel}
        data={this.state.editProductUnit}
        getData={this.props.productUnits && this.props.productUnits.length ? this.getDataStore : this.getData}
        showAlertSuccess={this.showAlertSuccess}
        showAlertError={this.showAlertError}
        onChangeVisible={visible => {
          this.setState({ visible: visible });
          if (this.props.productUnits && this.props.productUnits.length) {
            this.getDataStore()
          }
          else this.getData();
        }}
        dataSource={this.state.dataSource}
      ></AddProductUnit>
    );
  };

  handleInputChange = event => {
    this.setState({
      editProductUnit: {
        ...this.state.editProductUnit,
        [event.target.name]: event.target.value
      }
    });
  };

  updateProductUnit = async item => {
    let productUnitData = _.pick(item, ['id', 'name'])
    let saveProductUnit = await productUnitService.saveProductUnit(productUnitData);

    if (saveProductUnit.status) {
      this.success("Xóa đơn vị tính thành công")
      if (this.props.productUnits && this.props.productUnits.length) {
        this.getDataStore()
      }
      else this.getData()
    }
    else this.error(saveProductUnit.error)
  }

  getColumns = () => {
    const { t } = this.props;
    let columns = [
      {
        title: t("Tên"),
        dataIndex: "name",
        width: "100%",
        align: "left",
        sorter: (a, b) => a.name.localeCompare(b.name),
        onSort: (a, b) => a.name.localeCompare(b.name),
      }
    ];
    return columns;
  }
  render() {
    let { selectedRowKeys, dataSource, unitCheckCardCount } = this.state;
    const {t} = this.props;
    return (
      <Fragment>

        {this.state.notification}
        {this.state.alert}
        {this.state.visible ? this.showModalAdd() : null}
        {this.state.brerror}
        {this.state.br}
        <Card>
          <CardBody>
            <OhToolbar
              right={[
                {
                  type: selectedRowKeys.length ? "button" : null,
                  label: t("Xóa"),
                  onClick: () => this.onClickRemoveProductUnit(),
                  icon: <MdDelete />,
                  typeButton:"delete",
                  simple: true,
                  permission : {
                    name: Constants.PERMISSION_NAME.PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },

                },
                {
                  type: "link",
                  label: t("Tạo đơn vị tính"),
                  onClick: () => this.onClickAdd(),
                  icon: <MdAddCircle />,
                  simple: true,
                  typeButton:"add",
                  permission : {
                    name: Constants.PERMISSION_NAME.PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                }
              ]}
            />
            <OhSearchFilter
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              defaultShowAll={false}
              searchInput={{
                fields: ["name"],
                placeholder: t("Tìm tên")
              }}
            />
            <OhTable
              onRef={ref => this.tableRef = ref}
              onChange={(tableState, isManualSort) => {
                this.onChange({
                  ...tableState,
                  isManualSort
                });
              }}
              columns={this.getColumns()}
              dataSource={dataSource}
              total={unitCheckCardCount}
              hasCheckbox={true}
              id={"unit-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => this.onClickEditModal(record)}
            />
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

ProductUnit.propTypes = {
  classes: PropTypes.object.isRequired
};


export default connect(function (state) {
  return {
    productUnits: state.productUnitReducer.productUnits
  };
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProductUnit)
  )
);
