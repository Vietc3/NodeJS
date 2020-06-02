import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Popover } from "antd";
import withStyles from "@material-ui/core/styles/withStyles";
import ExtendFunction from "lib/ExtendFunction";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import AddPrice from "./AddPrice.jsx";
import PDFPrice from "./PDFPrice.jsx";
import ExcelPrice from "./ExcelPrice.jsx";
import ProductService from "services/ProductService.js";
import OhToolbar from "components/Oh/OhToolbar.jsx";
import { MdVerticalAlignBottom } from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import OhTable from "components/Oh/OhTable.jsx";
import OhSearchFilter from "components/Oh/OhSearchFilter.jsx";
import Constants from "variables/Constants/";
import { notifySuccess, notifyError } from 'components/Oh/OhUtils';
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import { ExportCSV } from 'ExportExcel/ExportExcel';
import { trans } from "lib/ExtendFunction";
import _ from 'lodash';
import Store from "store/Store";
import Actions from "store/actions/";
import ManualSortFilter from "MyFunction/ManualSortFilter";

let priceType, priceTypeName;

class Price extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      dataSource: this.props.productList && this.props.productList.length ? this.props.productList.map((item,index) => { item.count = index; return item}) : [],
      dataIssueStatusFilter: [],
      editUnit: {},
      visible: false,
      value: 0,
      type: null,
      searchText: {},
      searchWords: {},
      isEdit: false,
      recordEdit: [],
      anchorEl: null,
      filterFormData: {},
      brsuccess: null,
      brerror: null,
      visiblePopover: {},
      visibleCostPopover: {},
      sorter: {},
      isCheckInput: false
    };
    this.filters = {};
    this.dataSource_copy = this.props.productList && this.props.productList.length ? JSON.parse(JSON.stringify(this.props.productList)) : [];
    this.defaultFilterFormData = {
      Code: '',
      Name: ''
    };
    this.currentPage = 1;
    this.pageSize = 10;
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
    this.getDataStore = _.debounce(this.getDataStore, Constants.UPDATE_TIME_OUT);
  }

  hideAlert = () => {
    this.setState({
      alert: null
    });
  }

  async componentWillMount() {
    if (this.props.productList && this.props.productList.length) {
      let products = await ProductService.getProductList({});

      if (products.status) {

        let dataProducts = ManualSortFilter.sortArrayObject(products.data, "name", "asc")

        Store.dispatch(Actions.changeProductList(dataProducts))
      }
    }
  }

  getData = async () => {
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
      let Products = await ProductService.getProductList(query);

      if (Products.status === false) throw Products.error
      else {
        this.setState({
          dataSource: Products.data,
          totalProductsPrice: Products.count
        })
        this.dataSource_copy = JSON.parse(JSON.stringify( Products.data));
      }
    }
    catch (err) {
      notifyError(err)
    }
  }

  getDataStore = () => {
    let filter = { ...this.filters.filter, ...this.filters.manualFilter };

    let dataFilter = ManualSortFilter.ManualSortFilter(this.props.productList, filter, { sortField: this.filters.sortField, sortOrder: this.filters.sortOrder });

    this.setState({
      dataSource: dataFilter.map((item, index) => { item.count = index; return item;}),
      totalProductsPrice: dataFilter.length
    });

    this.dataSource_copy = JSON.parse(JSON.stringify(dataFilter));
  }
  
  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }
    
    if (this.props.productList && this.props.productList.length) {
      this.getDataStore()
    }
    else this.getData();
  }

  onCancel = () => {
    this.setState({
      visible: false,
      newPrice: 0,
      value: 0,
      type: "",
      title: "",
      anchorEl: null,
      editUnit: {}
    });
  };

  onClickAdd = () => {
    const t = this.props.t;
    this.setState({
      editUnit: {},
      visible: true,
      type: "add",
      title: t("Add ") + t(priceTypeName),
    });
  };

  onClickEditModal = (record) => {
    const t = this.props.t;
    this.setState({
      editUnit: record,
      visible: true,
      type: "edit",
      title: t("Edit ") + t(priceTypeName),
    });
  };

  onClickEdit = e => {
    this.setState({
      isEdit: true,
      recordEdit: e,
    })
  };

  showModalPrice = (e, record) => {
    this.setState({
      editUnit: record,
      visiblePopover: { ["visible_" + record.id]: true }
    })
  }

  showModalCostPrice = (e, record) => {
    this.setState({
      editUnit: record,
      visibleCostPopover: { ["visible_" + record.id]: true }
    })
  }

  handleInputChange = (event) => {
    let value = event.target.value.replace(/[^0-9]/g, "");
    value = parseFloat(value);
    this.setState({
      recordEdit: {
        ...this.state.recordEdit,
        [priceType]: value,
      },
    })
  }

  closeInputEdit = () => {
    this.setState({
      isEdit: false,
    });
  }

  handleAdd = (record) => {
    this.props.updateProduct(record);
    this.closeInputEdit();
    this.onCancel();
  }

  exportPDF = async () => {
    let { selectedRowKeys } = this.state;
    let { t, nameBranch } = this.props;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataProductPDF = await ProductService.getProductList(query);
    
    if ( dataProductPDF.status ){
      dataProductPDF.data.map( item => {
        item.name = trans(item.name, true)
      })
      PDFPrice.productPDF(dataProductPDF.data, dataProductPDF.data, t, nameBranch)
    } else notifyError(dataProductPDF.error)
    
  }

  exportExcel = async () => {
    let { selectedRowKeys } = this.state;
    let { t } = this.props;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }

    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataProduct = await ProductService.getProductList(query);
  
    if ( dataProduct.status ) ExportCSV(ExcelPrice.getTableExcel(dataProduct.data, t), t("DanhSachGiaSanPham"), ['D','E','F'])
    else notifyError(dataProduct.error)
    
  }

  updateProductPrice = async (record, isCostUnitPrice) => {
    let { t } = this.props;

    try {
      let saveProductPrice = await ProductService.updateProductPrice({ id: record.id, value: isCostUnitPrice ? record.costUnitPrice : record.saleUnitPrice, type: "one", isCostUnitPrice, selectOptionPrice: Constants.OPTIONS_PRICE.CURRENT, isCalculatePercent: false });

      if (saveProductPrice.status) {
        this.setState({ 
          editUnit: {}, 
          visiblePopover: isCostUnitPrice ? this.state.visiblePopover : {},
          visibleCostPopover: isCostUnitPrice ? {} : this.state.visibleCostPopover,
          isCheckInput: false
        },
          () => {
            if (this.props.productList && this.props.productList.length) {
              let foundIndex = this.props.productList.findIndex(item => item.id === record.id);

              if (foundIndex > -1) {
                let data = _.cloneDeep(this.props.productList)
                let product = data[foundIndex];
                let field = isCostUnitPrice ? "costUnitPrice" : "saleUnitPrice";
                let value = isCostUnitPrice ? record.costUnitPrice : record.saleUnitPrice;
                product.productprice[field] = value;
                product["product_" + field] = value;
                product[field] = value;
                data[foundIndex] = product;
                Store.dispatch(Actions.changeProductList(data));
                this.onChange();
              }
            }
            else this.getData()
            notifySuccess(isCostUnitPrice ? t("Cập nhật giá vốn thành công") : t("Cập nhật giá bán thành công"))
          })
      }
      else notifyError(isCostUnitPrice ? t("Cập nhật giá vốn thất bại") : t("Cập nhật giá bán thất bại"))
    }
    catch (err) {
      notifyError(isCostUnitPrice ? t("Cập nhật giá vốn thất bại") : t("Cập nhật giá bán thất bại"))
    }
  }

  render() {
    let { t, dataPermissions } = this.props;
    let { dataSource, isCheckInput } = this.state;

    let columns =
      [
        {
          title: t("Mã"),
          dataIndex: "code",
          key: "code",
          width: "14%",
          align:"left",
          sorter: (a, b) => a.code.localeCompare(b.code),
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: t("Tên"),
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
          width: "24%",
          align:"left",
          sortDirections: ['descend', 'ascend'],
          render: value => trans(value)
        },
        {
          title: t("Nhóm"),
          dataIndex: "productTypeId.name",
          key: "productType",
          width: "20%",
          align:"left",
          sortDirections: ['descend', 'ascend'],
          render: (value, record) => {
            return (<div title={value} >{record.productTypeId && record.productTypeId.name ? record.productTypeId.name : ""}</div>);
          },
        },        
        {
          title: t("Giá nhập cuối"),
          dataIndex: "productprice.lastImportPrice",
          key: "lastImportPrice",
          sortDirections: ['descend', 'ascend'],
          width: "14%",
          align: "right",
          render: (value, record) => {
            if(record.type === Constants.PRODUCT_TYPES.id.merchandise) 
            return (<div className="ellipsis-not-span">{value ? ExtendFunction.FormatNumber(Number(value).toFixed(2)) : 0}</div>);
          },

        },
        {
          title: t("Giá vốn"),
          dataIndex: "productprice.costUnitPrice",
          key: "costUnitPrice",
          sortDirections: ['descend', 'ascend'],
          width: "14%",
          align: "right",
          render: (value, record, index) => {
            if(record.type === Constants.PRODUCT_TYPES.id.merchandise) {
              return (
                dataPermissions.permissions[Constants.PERMISSION_NAME.MANAGEMENT_PRICE] === Constants.PERMISSION_TYPE.TYPE_ALL ? 
                <Popover
                  content={
                    <AddPrice
                      getData={this.getData}
                      onCancel={() => this.setState({ anchorEl: null, editUnit: {}, visibleCostPopover: {} })}
                      data={this.state.editUnit}
                      isCostUnitPrice={true}
                      isCheckInput={isCheckInput}
                      onChange={this.onChange}
                    />
                  }
                  title=""
                  trigger="click"
                  visible={this.state.visibleCostPopover["visible_" + record.id] || false}
                  placement="bottomRight"
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <TextField
                    id={"Input_Cost_" + record.id}
                    value={ExtendFunction.FormatNumber(record.costUnitPrice)}
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "right" }
                      },
                      onChange: (e) => {
                        let value = e.target.value;
                        let source = this.state.dataSource;
                        if (value === "")
                          source[record.count || index].costUnitPrice = '';
                        else {
                          if (isNaN(ExtendFunction.UndoFormatNumber(value)) === false && parseInt(ExtendFunction.UndoFormatNumber(value)) >= 0) {
                            source[index].costUnitPrice = parseInt(ExtendFunction.UndoFormatNumber(value));
                          }
                        }
                        this.setState({ dataSource: source, isCheckInput: true })
                      },
                      onClick: (e) => {
                        let source = this.state.dataSource;
                        if(parseInt(e.target.value) === 0) {
                          source[record.count || index].costUnitPrice = '';
                          this.setState({ dataSource: source })
                        }
                        this.showModalCostPrice(e, record)
                        this.setState({ visiblePopover: { } })
                      },
                      onKeyDown: async (e) => {                      
                        let source = this.state.dataSource;
                        if (e.keyCode === 13) {
  
                          if (source[record.count || index].costUnitPrice === "") {
                            source[record.count || index].costUnitPrice = 0;
                          }
  
                          this.setState({ 
                            dataSource: source
                          }, () => this.updateProductPrice(source[record.count || index], true))
                        }
                        if (e.keyCode === 27) {
                          if (source[record.count || index].id === this.dataSource_copy[record.count || index].id) {
                            source[record.count || index].costUnitPrice = this.dataSource_copy[record.count || index].costUnitPrice;                          
                          }
                          this.setState({
                            dataSource: source,
                            visibleCostPopover: {}
                          })
                        }
                       
                      },
                      onBlur: async (e) => {   
                        let source = this.state.dataSource;
  
                        if (e.target.value === "") {
                          source[record.count || index].costUnitPrice = 0;
                        }
  
                        this.setState({ 
                          dataSource: source
                        }, async () => {
                          if (source[record.count || index].id === this.dataSource_copy[record.count || index].id && source[record.count || index].costUnitPrice !== this.dataSource_copy[record.count || index].costUnitPrice && source[record.count || index].costUnitPrice !== "") {
                            this.updateProductPrice(source[record.count || index], true)
                          }
                        })                      
                      }
                    }}
                  />
                </Popover>: ExtendFunction.FormatNumber(record.costUnitPrice)
              );
            }
            
          },

        },
       
        {
          title: t("Giá bán"),
          dataIndex: "productprice.saleUnitPrice",
          key: "saleUnitPrice",
          width: '14%',
          sortDirections: ['descend', 'ascend'],
          align: "right",
          render: (value, record, index) => {
            return (
              dataPermissions.permissions[Constants.PERMISSION_NAME.MANAGEMENT_PRICE] === Constants.PERMISSION_TYPE.TYPE_ALL ? 
              <Popover
                content={
                  <AddPrice
                    getData={this.getData}
                    onCancel={() => this.setState({ anchorEl: null, editUnit: {}, visiblePopover: {} })}
                    data={this.state.editUnit}
                    isCostUnitPrice={false}
                    isCheckInput={isCheckInput}
                    onChange={this.onChange}
                  />
                }
                title=""
                trigger="click"
                visible={this.state.visiblePopover["visible_" + record.id] || false}
                placement="bottomRight"
                getPopupContainer={trigger => trigger.parentNode}
              >
                <TextField
                  id={"Input_Sale_" + record.id}
                  value={ExtendFunction.FormatNumber(record.saleUnitPrice)}
                  InputProps={{
                    inputProps: {
                      style: { textAlign: "right", color: parseFloat(record.saleUnitPrice) < parseFloat(record.costUnitPrice) ? "red" : null }
                    },
                    onChange: (e) => {
                      let value = e.target.value;
                      let source = this.state.dataSource;
                      if (value === "")
                        source[record.count || index].saleUnitPrice = '';
                      else {
                        if (isNaN(ExtendFunction.UndoFormatNumber(value)) === false && parseInt(ExtendFunction.UndoFormatNumber(value)) >= 0 ) {
                          source[record.count || index].saleUnitPrice = parseInt(ExtendFunction.UndoFormatNumber(value));
                        }
                      }
                      this.setState({ dataSource: source, isCheckInput: true })
                    },
                    onClick: (e) => {
                      let source = this.state.dataSource;
                      if (parseInt(e.target.value) === 0) {
                        source[record.count || index].saleUnitPrice = '';
                        this.setState({ dataSource: source })
                      }
                      this.showModalPrice(e, record);
                      this.setState({ visibleCostPopover: {} })
                    },
                    onKeyDown: async (e) => {
                      let source = this.state.dataSource;

                      if (e.keyCode === 13) {

                        if (e.target.value === "") {
                          source[record.count || index].saleUnitPrice = 0;
                        }

                        this.setState({
                          dataSource: source
                        }, () => this.updateProductPrice(source[record.count || index], false))
                      }
                      if (e.keyCode === 27) {
                        if (source[record.count || index].id === this.dataSource_copy[record.count || index].id) {
                          source[record.count || index].saleUnitPrice = this.dataSource_copy[record.count || index].saleUnitPrice;
                        }
                        this.setState({
                          dataSource: source,
                          visiblePopover: {}
                        })
                      }

                    },
                    onBlur: async (e) => {
                      let source = this.state.dataSource;
                    
                      if (e.target.value === "") {
                        source[record.count || index].saleUnitPrice = 0;
                      }

                      this.setState({
                        dataSource: source
                      }, async () => {
                        if (source[record.count || index].id === this.dataSource_copy[record.count || index].id && source[record.count || index].saleUnitPrice !== this.dataSource_copy[record.count || index].saleUnitPrice && source[record.count || index].saleUnitPrice !== "") {
                          this.updateProductPrice(source[record.count || index], false)
                        }
                      })
                    }
                  }}
                />
              </Popover>: ExtendFunction.FormatNumber(record.saleUnitPrice)
            );
          },
        }
      ];

    return (
      <Fragment>
        {this.state.alert}
        {this.state.brsuccess}
        {this.state.brerror}
        <Card>
          <CardBody>
            <OhToolbar
              left={[
                {
                  type: "list",
                  label: "Xuất file",
                  icon: <MdVerticalAlignBottom />,
                  typeButton:"export",
                  listDropdown: [
                    {
                      title: "Excel",
                      type: "button",
                      onClick: () => this.exportExcel(),
                      icon: <AiOutlineFileExcel className="icon-export" />,
                      color: Constants.COLOR_SUCCESS 
                    },
                    {
                      title: "PDF",
                      onClick: () => this.exportPDF(),
                      icon: <AiOutlineFilePdf className="icon-export" />,
                      color: Constants.COLOR_DANGER
                    }
                  ],
                  dropPlacement: "bottom-start",
                  simple: true
                }
              ]}
            />
            <OhSearchFilter
            id={"price-table"} 
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                {
                  type: "input-text",
                  title: t("Mã sản phẩm"),
                  field: "code",
                  placeholder: t("Nhập {{type}}", {type: t("Mã sản phẩm").toLowerCase()})
                },
                {
                  type: "input-text",
                  title: t("Tên sản phẩm"),
                  field: "name",
                  placeholder: t("Nhập {{type}}", {type: t("Tên sản phẩm").toLowerCase()})
                },
                {
                  type: "input-text",
                  title: t("Nhóm sản phẩm"),
                  field: "productTypeId.name",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Nhóm sản phẩm").toLowerCase()})
                },
                {
                  type: "input-range",
                  title: t("Giá vốn"),
                  field: "productprice.costUnitPrice",
                  placeholder: "Nhập giá trị"
                },
                {
                  type: "input-range",
                  title: t("Giá nhập cuối"),
                  field: "productprice.lastImportPrice",
                  placeholder: "Nhập giá trị"
                },
                {
                  type: "input-range",
                  title: t("Giá chung"),
                  field: "productprice.saleUnitPrice",
                  placeholder: "Nhập giá trị"
                }
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["code", "name"],
                placeholder: t("Tìm theo mã sản phẩm hoặc tên sản phẩm")
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
              total={this.state.totalProductsPrice}
              id={"price-table"}     
              emptyDescription={Constants.NO_PRODUCT}          
            />              
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

Price.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(state => {
  return {
    dataPermissions: state.userReducer.currentUser,
    nameBranch: state.branchReducer.nameBranch,
    productList: state.productListReducer.products
  };
})(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(Price)
  )
);
