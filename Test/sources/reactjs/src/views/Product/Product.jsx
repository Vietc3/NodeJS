import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Tabs} from "antd";
import { withTranslation } from "react-i18next";
// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import TinyView from "components/TinyEditor/TinyView";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import image from "assets/img/no-image-product.png";
import ExtendFunction from "lib/ExtendFunction";
import { trans } from "lib/ExtendFunction";
import "../css/css.css";
import productService from 'services/ProductService';
import Constants from "variables/Constants/";
import OhTable from "components/Oh/OhTable";
import {notifyError } from 'components/Oh/OhUtils';
import Store from "store/Store";
import _ from 'lodash';
import ExpendProduct from "./ExpendProduct";
import paginationAction from "store/actions/paginationAction";
import ManualSortFilter from "MyFunction/ManualSortFilter";
import Actions from "store/actions/";

const { TabPane } = Tabs;

class Product extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.onRef) this.props.onRef(this);
    let products = this.props.productList && this.props.productList.length ? this.props.productList : [];

    if (this.props.productTypeId) {
      products = products.filter(item => item.productTypeId_id === this.props.productTypeId)
    }

    this.state = {
      visible: false,
      type: null,
      file: null,
      notification: null,
      dataSource: products,
      totalProducts: products.length,
      fullStockList: {},
      isViewImage: false,
      photoIndex: 0,
      arrImage: [],
      dataPrint: [],
      selectedRowKeys: [],
      expandedRowKeys: [],
      imageProduct: image,
      imageNew: null,
      titleShowList: null,
      br: null,
      brerror: null,
      valueIsStop: 0,
      loading: false,
      loading_product_view: false,
      productTypeId: null
    };
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
    this.getDataStoreProduct = _.debounce(this.getDataStoreProduct, Constants.UPDATE_TIME_OUT);
  }

  componentWillMount = async () => {
    this.props.onValueIsStop(this.state.valueIsStop);
    if (this.props.productList && this.props.productList.length) {
      this.setData(this.state.dataSource, this.state.totalProducts);
    } 
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.valueIsStop !== this.state.valueIsStop) {     
      this.getData();
    } 

    if (this.props.isResetSelectedRowKeys !== prevProps.isResetSelectedRowKeys && this.props.isResetSelectedRowKeys){
      this.tableRef.resetSelectRowKeys();
      this.props.onResetRowKey(false);
    }
  }

  async setData(products, count) {
    var dataSource = products && _.cloneDeep(products) || [{}];
    let arrId = [];

    if (dataSource.length > 0) {      
      dataSource.map(data => {
        data.key = data.id;
        data.ManufacturerName = data.customerId ? data.customerId.name : null;
        data.customerId = data.customerId ? data.customerId.id : null;
        data.fileStorage = [];
        data.branchProduct = [];
        arrId.push(data.id)

        return data;
        
      });
      this.setState({
        dataSource: dataSource,
        dataPrintFull: dataSource,
        totalProducts: count,
        productTypeId: this.props.productTypeId,

      });
    }
    else
      this.setState({
        dataSource: [],
        totalProducts: count,
        productTypeId: this.props.productTypeId,

      })
  }

  async getDataStore(ids, isDelete){
    if (isDelete) {
      let data = _.cloneDeep(this.props.productList)
      _.map(ids, item => {
        let foundIndex = data.findIndex(elem => item === elem.id)

        if (foundIndex > -1) {
          data.splice(foundIndex, 1)
        }
      })

      Store.dispatch(Actions.changeProductList(data));

      this.onChange(this.filters);
    }
    else {
      let dataProducts = await productService.getProductList({filter: {id: { in: ids }}});

      if (dataProducts.status) {
        let data = dataProducts.data.concat(this.props.productList);

        data = _.uniqBy(data, "id");

        data = ManualSortFilter.sortArrayObject(data, "name", "asc");
        
        Store.dispatch(Actions.changeProductList(data));

        this.onChange(this.filters);
      }
    }
  }

  async getData(id) {    
    let arrId = [];
    
    if (id) {
      arrId.push(id);
      this.setState({loading_product_view: true});
    }
    let selectArrayId = arrId.length ? [{"productTypeId.id": arrId }] : [];

    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;
    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    filter = {
      ...filter
    }
    const query = {
      filter: filter || {},
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
      selectArrayId: selectArrayId
    };

    let getProductList = await productService.getProductList(query)

    if (getProductList.status){

      this.setData(getProductList.data, getProductList.count);

      this.setState({
        loading_product_view: false,
      });
    }
    else  {
      notifyError(getProductList.message)
      this.setState({
        loading_product_view: false,
      });
    }
  }

  getDataStoreProduct(){
    let manualFilter = {};      
    
    if (this.filters.manualFilter) {
      manualFilter = {...this.filters.manualFilter}  
      //kiểm tra trạng thái kinh doanh
      if(manualFilter.status && manualFilter.status === Constants.PRODUCT_STOPPED_STATUS.STOPPED){
        this.filters.manualFilter={...this.filters.manualFilter, stoppedAt: {'>': 0}}
      } else if(manualFilter.status && manualFilter.status === Constants.PRODUCT_STOPPED_STATUS.NONE){
        this.filters.manualFilter={...this.filters.manualFilter, stoppedAt: 0}
      }
      delete this.filters.manualFilter.status;
      delete this.filters.manualFilter.quota;
    }

    let filter = { ...this.filters.filter, ...this.filters.manualFilter };

    if (this.props.productTypeId) {
      _.extend(filter, { productTypeId_id: this.props.productTypeId })
    }
    
    let dataFilter = ManualSortFilter.ManualSortFilter(this.props.productList, filter, { sortField: this.filters.sortField, sortOrder: this.filters.sortOrder });

    if (manualFilter.status)
      this.filters.manualFilter.status = manualFilter.status

    if(manualFilter.quota) {
      this.filters.manualFilter.quota = manualFilter.quota
      let data = [];
      let stockQuantityList = [];
      
      for (let stock in this.props.stockList) {
        if(this.props.stockList[stock].deletedAt === 0)
          stockQuantityList.push("productstock_" + Constants.STOCK_QUANTITY_LIST[this.props.stockList[stock].stockColumnIndex]);
      }

      for( let item of dataFilter ) {
        let totalStock = 0;

        for(let stock of stockQuantityList) {
          totalStock = totalStock + item[stock]
        }

        //Kiểm tra tồn kho tối thiểu
        if(manualFilter.quota && manualFilter.quota === Constants.LOW_STOCK_STATUS.LOW && (item.productstock_stockMin > totalStock)){
          data.push(item);
        } else if(manualFilter.quota && manualFilter.quota === Constants.LOW_STOCK_STATUS.ENOUGH && (item.productstock_stockMin <= totalStock)){
          data.push(item);
        }
      }

      dataFilter = data;
    }

    this.setData(dataFilter, dataFilter.length)
  }
  
  onChange = (obj) => {    
    this.filters = {
      ...this.filters,
      ...obj
    }

    if (this.props.productList && this.props.productList.length) {
      this.getDataStoreProduct()
    }
    else this.getData(this.props.productTypeId);
  }

  handleChange = (pagination, filters, sorter, extra) => {
    document.getElementById("scroll").scrollIntoView(0);
    this.setState({
      dataPrint: extra.currentDataSource,
    })
  }

  getDataProduct = (dataSource, key) => {
    const { t } = this.props;
    const styleProduct = {
      Title: {
        textAlign: "left",
        color: "#357CD9",
        marginTop: "15px",
        marginLeft: "30px",
      },
      Span: {
        fontSize: 12,
        color: "#000000",
        maxWidth: "99%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "inline-block",

      },
      Hr: {
        margin: "10px 0px"
      },
      Hr_1: {
        marginTop: "0px",
        marginBottom: "10px"
      },
      Image: {
        maxWidth: "100%",
        display: "block",
        margin: "auto",
        maxHeight: "180px",
        overflowY: "visible",
      },
      Image_2: {
        maxWidth: "100%",
        maxHeight: "100%",
        display: "block",
        margin: "auto",
        height: "50px",
        width: "60px"

      },
    }
    let data = [];
    if (dataSource) {
      dataSource.map(item => {
        if (item.code === key) {
          data.push(
            <div key = {"div_"+ item.code}>
              <h4 style={styleProduct.Title}><b style={{ fontWeight: "bold" }}>{trans(item.name)}</b></h4>
              <GridContainer xs={12} sm={12} style={{ marginTop: '-25px' }}>
                <GridItem xs={12} sm={5}>
                  <GridContainer style={{ maxWidth: "600px" }}>
                    <GridItem xs={12} style={{ marginLeft: 20 }}>
                      {item.fileStorage.length > 0 ?
                        <span onClick={() => this.viewImage(item.fileStorage)} style={{cursor:"pointer"}}>
                          <img alt="Product"
                            style={styleProduct.Image}
                            src={(item.fileStorage.includes(this.state.imageNew) ? this.state.imageNew : item.fileStorage[0])}
                          /></span> :
                        <img alt="Product"
                          style={styleProduct.Image}
                          src={this.state.imageProduct}
                        />}
                    </GridItem>

                  </GridContainer>
                  <GridContainer style={{ marginLeft: 10 ,cursor:"pointer"}}>
                    {item.fileStorage.length > 0 ?
                      this.showImage(item.fileStorage)
                      : <img alt="Product"
                        style={styleProduct.Image_2}
                        src={this.state.imageProduct}
                        
                      />}
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  <GridContainer>
                    <GridItem xs={12}>
                      {<span style={styleProduct.Span}>{t("Mã sản phẩm")}:
                        <b title = {item.code} style={{ fontWeight: "bold", marginLeft: 25, fontSize: 13 }}>{item.code ? item.code : ""}</b>
                      </span>}<hr style={styleProduct.Hr} />
                      {<span style={styleProduct.Span}>{t("Nhóm sản phẩm")}:
                        <b title = {item.productTypeId ? item.productTypeId.name : ""} style={{ marginLeft: 8, fontSize: 13 }}>{item.productTypeId ? item.productTypeId.name : ""}</b>
                      </span>}<hr style={styleProduct.Hr} />
                      {<span style={styleProduct.Span}>{t("Nhà cung cấp")}:
                        <b title = {item.ManufacturerName ? item.ManufacturerName : ""} style={{ marginLeft: 28, fontSize: 13 }}>{item.ManufacturerName ? item.ManufacturerName : ""}</b>
                      </span>}<hr style={styleProduct.Hr} />
                      {<span style={styleProduct.Span}>{t("Giá bán")}:
                        <b style={{ marginLeft: 60, fontSize: 13 }}>{item.saleUnitPrice ? ExtendFunction.FormatNumber(item.saleUnitPrice) : 0}</b>
                      </span>}<hr style={styleProduct.Hr} />
                      {<span style={styleProduct.Span}>{t("Giá vốn")}:
                        <b style={{ marginLeft: 60, fontSize: 13 }}>{item.costUnitPrice ? ExtendFunction.FormatNumber(item.costUnitPrice) : 0}</b>
                      </span>}

                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <GridContainer xs={12} sm={12}>
                    <GridItem xs={12} sm={12} >
                      <span style={styleProduct.Span}>{t("Mô tả")}{" "}</span>
                      <hr style={styleProduct.Hr} />
                      {item.description ?
                        <div style={{ marginTop: "10px" }}>
                          <TinyView
                            content={item.description}
                            height={150}
                            width="100%"
                            id={"task_editor_" + item.ID}
                          /></div> : null}

                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>

            </div>
          )
        }

        return null;
        }
      )
    } return data;
  }


  render() {
    let { t, permissionsUser, tableId } = this.props;
    let { dataSource } = this.state;
    let type_permission = Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY;
    let titleTable = this.props.productTypeId ? ("-"+ this.props.productTypeId ): "";

    let columns = [
      {
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: "12%",
        align: "left",
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        width: "27%",
        align: "left",
        sortDirections: ["descend", "ascend"],
        render: value => trans(value),
      },
      (this.props.productTypeId) ? {} :
      {
        title: "Nhóm sản phẩm",
        dataIndex: "productTypeId_name",
        key: "ProductTypeName",
        width: "18%",
        align: "left",
        // isManualSort: true,
      },
      {
        title: "ĐVT",
        dataIndex: "unitId_name",
        key: "UnitName",
        width: "10%",
        align: "left",
      },
      {
        title: "Giá bán",
        dataIndex: "productprice_saleUnitPrice",
        key: "saleUnitPrice",
        width: "13%",
        align: "right",
        sortDirections: ["descend", "ascend"],
        render: value => {
          return <div className="ellipsis-not-span">{value ? ExtendFunction.FormatNumber(value) : "0"}</div>;
        },
      },
      {
        title: "Giá vốn",
        dataIndex: "productprice_costUnitPrice",
        key: "costUnitPrice",
        width: "13%",
        align: "right",
        sortDirections: ["descend", "ascend"],
        render: (value, record) => {
          if(record.type === Constants.PRODUCT_TYPES.id.merchandise) 
            return <div className="ellipsis-not-span">{value ? ExtendFunction.FormatNumber(Number(value).toFixed(0)) : "0"}</div>;
        },
      },
      {
        title: (parseInt(this.props.Manufacture) === Constants.MANUFACTURE_OPTIONS.ON && (permissionsUser.manufacture_product >= type_permission ||  permissionsUser.manufacture_ware_house >= type_permission || permissionsUser.manufacture_card >= type_permission) ) ? "Tồn kho chính" : "Tồn kho",
        dataIndex: "sumQuantity",
        key: "stockQuantity",
        align: "right",
        width: "12%",
        sortDirections: ["descend", "ascend"],
        render: (value, record) => {        
          if(record.type === Constants.PRODUCT_TYPES.id.merchandise)  
            return <div key={record.id} className="ellipsis-not-span" style={{color: record.stockMin > value ? 'red' : 'none'}} >{value ? ExtendFunction.FormatNumber(value) : "0"}</div>;
        },
      },
     ( parseInt(this.props.Manufacture) === Constants.MANUFACTURE_OPTIONS.ON && (permissionsUser.manufacture_product >= type_permission ||  permissionsUser.manufacture_ware_house >= type_permission || permissionsUser.manufacture_card >= type_permission) ) ?
        {
          title: "Tồn kho sx",
          dataIndex: "productstock_manufacturingQuantity",
          key: "manufacturingQuantity",
          align: "right",
          width: "12%",
          sortDirections: ["descend", "ascend"],
          render: (value, record) => {
            if(record.type === Constants.PRODUCT_TYPES.id.merchandise)  
              return <div className="ellipsis-not-span" >{value ? ExtendFunction.FormatNumber(value) : "0"}</div>;
          },
        }
        : {}
    ];

    return (
      <Fragment>
        {this.state.notification}
        {this.state.br}
        {this.state.brerror}
        {this.state.redirect}
        
        <OhTable
              key = {tableId+ titleTable}
              onRef={ref => (this.tableRef = ref)}
              rowClassName={(record, index) => {
                if(record.stoppedAt > 0){
                  return 'blurRowOhTable';
                } return 'rowOhTable'
              }}
              className = {"product-table-view"}
              onChange={(tableState, isManualSort) => {
                this.props.onChangePageSize(tableState.pageSize);
                Store.dispatch(
                  paginationAction.changePagination("barcode-form-table", {
                    pageSize: tableState.pageSize || 10,
                    pageNumber: tableState.pageNumber || 1
                  })
                );
                this.onChange({
                  ...tableState,
                  isManualSort
                });
              }}
              columns={columns}
              dataSource={dataSource}
              total={this.state.totalProducts}
              hasCheckbox={true}
              id={tableId+ titleTable}
              onSelectChange={selectedRowKeys => this.props.onSelectChange(selectedRowKeys)}
              isExpandable={true}
              loading={this.state.loading_product_view}
              expandedRowRender={(record) => {
                return <ExpendProduct 
                  data={record}
                  id={record.id}
                  onChangeStatus={(data, value, mess) => this.props.onChangeStatus(data, value, mess)}
                  openChangeStockModal={data => this.props.openChangeStockModal(data)}
                  onValueIsStop={onValueIsStop => this.props.onValueIsStop(onValueIsStop)}
                />
              }}
              onChangeViewColumn={(column) => {if(this.props.onChangeViewColumn) this.props.onChangeViewColumn(column)}}
            />
      </Fragment>
    );
  }
}

export default connect(
  function (state) {
    return {
      User: state.reducer_user.User,
      User_Function: state.reducer_user.User_Function,
      permissionsUser: state.userReducer.currentUser.permissions,
      Manufacture: state.reducer_user.Manufacture,
      languageCurrent: state.languageReducer.language,
      nameBranch: state.branchReducer.nameBranch,
      stockList: state.stockListReducer.stockList,
      productList: state.productListReducer.products
    };
  }
)(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(Product)
  )
);