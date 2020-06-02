import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import AlertQuestion from "components/Alert/AlertQuestion";
import CardBody from "components/Card/CardBody.jsx";
import ProductTypeForm from "views/ProductType/components/ProductType/Form";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import NotificationSuccess from "components/Notification/NotificationSuccess.jsx";
import NotificationError from "components/Notification/NotificationError.jsx";
import { MdAddCircle, MdDelete } from "react-icons/md";
import productTypeService from "services/ProductTypeService";
import OhToolbar from "components/Oh/OhToolbar";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import OhTable from "components/Oh/OhTable";
import Constants from "variables/Constants/";
import _ from 'lodash';
import Actions from "store/actions/";
import Store from "store/Store";
import ManualSortFilter from "MyFunction/ManualSortFilter";

class ProductType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editedProductType: {},
      visible: false,
      type: null,
      alert: null,
      notification: null,
      pageOfItems: [],
      refresh: false,
      m_searchText: "",
      selectedRowKeys: [],
      br: null,
      brerror: null,
      checkedBoxProduct: false,
      searchText: {},
      searchWords: {},
      dataSource: this.props.productTypes && this.props.productTypes.length ? this.props.productTypes : [],
      totalProductTypes: this.props.productTypes && this.props.productTypes.length ? this.props.productTypes.length : 0,
    };
    this.onCancel = this.onCancel.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.dataSource_copy = [];
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  onChangePage(pageOfItems) {
    this.setState({ pageOfItems: pageOfItems });
  }

  onRefresh(refresh) {
    this.setState({ refresh: refresh });
  }
  
  onClickRemoveProductType = async () => {
    let { selectedRowKeys } = this.state;
    let lengthSelectedRowkeys = selectedRowKeys.length;
    let { t } =  this.props;
   
    this.setState({
      alert: (
        <AlertQuestion
          messege={t("Bạn có chắc chắn muốn xóa {{lengthSelectedRowkeys}} nhóm sản phẩm này?",{lengthSelectedRowkeys:lengthSelectedRowkeys})}
          hideAlert={this.hideAlert}
          action={async () => {
            let deleteProductTypes = await productTypeService.deleteProductTypes(selectedRowKeys)

            if (!deleteProductTypes.status) {
              this.error(deleteProductTypes.error)
              this.hideAlert()
            }
            else {
              this.success(t('Xóa nhóm sản phẩm thành công'))
              this.tableRef.resetSelectRowKeys()
              this.getData()
            }

          }}
          buttonOk={t("Đồng ý")}
        />
      )
    })
  };

  hideAlert = () => {
    this.setState({
      alert: null,
    });
  };

  onCancel = () => {
    this.setState({
      alert: null,
      visible: false,
      type: "",
      title: "",
      selectedRowKeys: []
    });
  };

  onClickEdit = e => {
    const t = this.props.t;

    var _self = this;
    _self.setState({
      editedProductType: e,
      visible: true,
      type: "edit",
      title: t("Cập nhật nhóm sản phẩm")
    });
  };

  showModalAdd = () => {
    return (
      <ProductTypeForm
        type={this.state.type}
        visible={this.state.visible}
        title={this.state.title}
        onCancel={this.onCancel}
        data={this.state.editedProductType}
        onChangeVisible={visible => {
          this.setState({ visible: visible });
          if(this.props.productTypes && this.props.productTypes.length) {
            this.getDataStore();
          }
          else this.getData();
        }}
        ProductTypes={this.state.ProductTypes}
      ></ProductTypeForm>
    );
  };

  success = mess => {
    this.setState(
      { br: <NotificationSuccess closeNoti={() => this.setState({ brsuccess: null })} message={mess} /> },
      () => this.onCancel()
    );
  };
  error = mess => {
    this.setState({
      brerror: <NotificationError closeNoti={() => this.setState({ brerror: null })} message={mess} />
    });
  };

  onClickAdd = () => {
    const t = this.props.t;
    this.setState({
      editedProductType: {},
      visible: true,
      type: "add",
      title: t("Thêm nhóm sản phẩm")
    });
  };

  async setData(ProductTypes, count) {
    let dataProductType = [];
    if (ProductTypes.length > 0) {
      for (let i in ProductTypes) {
        dataProductType.push({ ...ProductTypes[i], key: ProductTypes[i].id });
      }
    }
    this.setState({
      dataSource: dataProductType,
      dataPrintFull: dataProductType,
      totalProductTypes: count,
      ProductTypes
    });
    this.dataSource_copy = dataProductType;
  }

  async getDataStore() {
    let products = await productTypeService.getProductTypes({});

    if (products.status) {

      let dataProductTypes = ManualSortFilter.sortArrayObject(products.data, "name", "asc")

      Store.dispatch(Actions.changeProductTypeList(dataProductTypes))

      this.onChange(this.filters)
    }
  }

  async componentWillMount() {
    if (this.props.productTypes && this.props.productTypes.length) {
      let products = await productTypeService.getProductTypes({});

      if (products.status) {

        let dataProductTypes = ManualSortFilter.sortArrayObject(products.data, "name", "asc")

        Store.dispatch(Actions.changeProductTypeList(dataProductTypes))
      }
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
    try {
      let getProductTypes = await productTypeService.getProductTypes(query);

      if (getProductTypes.status) {
        this.setData(getProductTypes.data, getProductTypes.count)
      }
      else throw getProductTypes.error
    }
    catch (err) {
      this.error(err)
    }
  }
  
  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }
    
    if (this.props.productTypes && this.props.productTypes.length) {
      let filter = { ...this.filters.filter, ...this.filters.manualFilter };

      let dataFilter = ManualSortFilter.ManualSortFilter(this.props.productTypes, filter, { sortField: this.filters.sortField, sortOrder: this.filters.sortOrder })

      this.setState({
        dataSource: dataFilter,
        totalProducts: dataFilter.length,
        dataPrintFull: dataFilter
      })
    }
    else this.getData();
  }

  render() {
    let { selectedRowKeys, dataSource } = this.state;

    const { t } = this.props;

    let columns = [
      {
        title: t("Tên nhóm"),
        dataIndex: "name",
        key: "Name",
        width: "40%",
        sorter: (a, b) => a.name.toString().localeCompare(b.name),
        sortDirections: ["descend", "ascend"],
      },
      {
        title: t("Ghi chú"),
        dataIndex: "notes",
        key: "Description",
        width: "60%",
        render: (value, record) => {
          return <div title={value} >{value}</div>;

        }
      }
    ];

    return (
      <Fragment>
        {this.state.notification}
        {this.state.alert}
        {this.state.visible ? this.showModalAdd() : null}
        <Card>
          <CardBody >
            {this.state.br}
            {this.state.brerror}
            <OhToolbar
              right={[
                {
                  type: selectedRowKeys.length ? "button" : null,
                  label: t("Xóa"),
                  onClick: () => this.onClickRemoveProductType(),
                  icon: <MdDelete />,
                  typeButton:"delete",
                  simple: true,
                  permission : {
                    name: Constants.PERMISSION_NAME.PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
                {
                  type: "button",
                  onClick: () => this.onClickAdd(),
                  label: t("Tạo nhóm sản phẩm"),
                  typeButton:"add",
                  icon: <MdAddCircle />,
                  simple: true,
                  permission : {
                    name: Constants.PERMISSION_NAME.PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                }
              ]}
            />
            <OhSearchFilter
            id={"product-type-table"}
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              defaultShowAll={false}
              searchInput={{
                fields: ["name", "notes"],
                placeholder: t("Tìm theo tên nhóm hoặc ghi chú")
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
              dataSource={dataSource}
              total={this.state.totalProductTypes}
              hasCheckbox={true}
              id={"product-type-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              onRowClick={(e, record, index) => this.onClickEdit(record)}
            />
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

ProductType.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  function (state) {
    return {
      productTypes: state.productTypeReducer.productTypes
    };
  }
)(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ProductType)
  )
);
