import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import ExtendFunction from "lib/ExtendFunction";
import "../css/css.css";
import ProductPDF from "./components/PDF/ProductPDF.js";
import productService from 'services/ProductService';
import OhToolbar from "components/Oh/OhToolbar";
import { MdAddCircle, MdVerticalAlignBottom } from "react-icons/md";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import Constants from "variables/Constants/";
import OhTable from "components/Oh/OhTable";
import OhSearchFilter from "components/Oh/OhSearchFilter";
import OhNumberInput from "components/Oh/OhNumberInput.jsx"
import { notifyError } from 'components/Oh/OhUtils';
import { trans } from "lib/ExtendFunction";
import _ from 'lodash';
class ManufacturingStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      importValues: {}
    };
    this.filters = {};
    this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
  }

  setData = (products, count) => {
    var dataSource = products || [{}];
    let arrId = [];
    if (dataSource.length > 0) {
      dataSource = dataSource.map(data => {
        data.key = data.id
        data.ManufacturerName = data.customerId ? data.customerId.name : null;
        data.customerId = data.customerId ? data.customerId.id : null;
        data.fileStorage = []
        arrId.push(data.id)

        return data;
      });

      this.setState({
        dataSource: dataSource,
        dataPrintFull: dataSource,
        totalProducts: count
      });
    }
    else
      this.setState({
        dataSource: []
      })
  }

  async getData() {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    filter = {
      ...filter,
      ["productstock.manufacturingQuantity"]: { ">": 0 },
    }
    const query = {
      filter: filter || {},
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let getProductList = await productService.getProductList(query)
    if (getProductList.status)
      this.setData(getProductList.data, getProductList.count);
    else throw getProductList.error
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }

  getDataExcel = (data, t) => {
    //header file Excel
    let dataExcel = [["#", t("Mã"), t("Tên"), t("ĐVT"), t("Tồn kho")]];


    for (let item in data) {

      //push data into file Excel
      dataExcel.push(
        [
          parseInt(item) + 1,
          data[item].code,
          data[item].name,
          data[item].unitId.name,
          data[item].manufacturingQuantity,
        ]);
    }
    return dataExcel;
  }

  export = () => {
    const { dataSource, selectedRowKeys } = this.state;
    let dataExport = dataSource.filter(function (item) {
      return selectedRowKeys.includes(item.id);
    })
    return dataExport;
  }

  exportPDF = async () => {
    let { t } = this.props;   
    let { selectedRowKeys } = this.state;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }
    filter = {
      ...filter,
      ["productstock.manufacturingQuantity"]: { ">": 0 },
    }
    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };

    let dataProductPDF = await productService.getProductList(query)
    if(dataProductPDF.status) {
      dataProductPDF.data.map(item => {
        item.name = trans(item.name, true)
      })
    }

    if ( dataProductPDF.status ) ProductPDF.productPDF(dataProductPDF.data, t)
    else notifyError(dataProductPDF.error)

  }

  exportExcel = async () => {
    let { t } = this.props;   
    let { selectedRowKeys } = this.state;
    let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;

    if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
      filter = { ...filter, id: { in: selectedRowKeys } };      
    }
    filter = {
      ...filter,
      ["productstock.manufacturingQuantity"]: { ">": 0 },
    }
    let query = {
      filter: filter || {},
      sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
      manualFilter: manualFilter || {},
      manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
    };
    
    let dataProduct = await productService.getProductList(query)
    
    if ( dataProduct.status )
    {
      dataProduct.data.map(item => {
        item.name = trans(item.name, true)
      })
      ExtendFunction.exportToCSV(this.getDataExcel(dataProduct.data, t), t("DanhSachSanPham"))
    } else notifyError(dataProduct.error)
  }

  render() {
    let { dataSource, importValues } = this.state;
    const { t } = this.props;
    let columns = [
      {
        title: t("Mã"),
        dataIndex: "code",
        align: "left",
        width: "13%",

      },
      {
        title: t("Tên sản phẩm"),
        dataIndex: "name",
        align: "left",
        width: t("lang") === 'vn' ? "35%" : "32%",
        render: value => trans(value)
      },
      {
        title: t("Loại"),
        dataIndex: "category",
        align: "left",
        width: "13%",
        render: value => {
          return value === Constants.MANUFACTURING_STOCK_STATUS.FINISHED_PRODUCT ? Constants.MANUFACTURING_STOCK_NAME.FINISHED_PRODUCT : Constants.MANUFACTURING_STOCK_NAME.MATERIAL ;
        },

      },
      {
        title: t("ĐVT"),
        dataIndex: "unitId.name",
        isManualSort: true,
        align: "left",
        width: t("lang") === 'vn' ? "13%" : "10%",
      },
      {
        title: t("Số lượng tồn"),
        dataIndex: "productstock.manufacturingQuantity",
        align: "right",
        width: "13%",
        render: value => {
          return <div className="ellipsis-not-span">{value ? ExtendFunction.FormatNumber(Math.round(value*100000)/100000) : "0"}</div>;
        },
      },
      {
        title: t("Số lượng nhập/xuất"),
        dataIndex: "inputQuantity",
        align: "right",
        width: t("lang") === 'vn' ? "13%" : "19%",
        sorter: false,
        render: (value, record) => {
          return <OhNumberInput 
            defaultValue={(importValues[record.id] || {}).value}
            onChange={val => this.setState({importValues: {
              ...importValues,
              [record.id]: {value: val, record}
            }})}
            isDecimal= {true}
            valueDecimal={100000}
            isNegative={false}
            permission= {{
              name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
              type: Constants.PERMISSION_TYPE.TYPE_ALL
            }}
          />;
        },
      },
    ];

    return (
      <Fragment>
        <Card>
          <CardBody>
            <OhToolbar
              left={[
                {
                  type: "list",
                  label: "Xuất file",
                  icon: <MdVerticalAlignBottom />,
                  typeButton: "export",
                  permission: {
                    name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                    type: Constants.PERMISSION_TYPE.TYPE_VIEW_ONLY
                  },
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
                },
              ]}
              right={[
                {
                  type: "link",
                  linkTo: Constants.ADMIN_LINK + Constants.CREATE_EXPORT_STOCK,
                  params: {products: importValues, reason: Constants.MOVE_STOCK_REASON.id.EXPORT_RETURN},
                  label: t("Xuất kho"),
                  icon: <MdAddCircle />,
                  typeButton: "add",
                  simple: true,
                  permission: {
                    name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
                {
                  type: "link",
                  linkTo: Constants.ADMIN_LINK + Constants.CREATE_IMPORT_STOCK,
                  params: importValues,
                  label: t("Nhập kho"),
                  icon: <MdAddCircle />,
                  typeButton: "add",
                  simple: true,
                  permission: {
                    name: Constants.PERMISSION_NAME.MANUFACTURE_WARE_HOUSE,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
              ]}
            />
            <OhSearchFilter
            id={"manufacturing-product-table"}
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
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Mã sản phẩm").toLowerCase()})
                },
                {
                  type: "input-text",
                  title: t("Tên sản phẩm"),
                  field: "name",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Tên sản phẩm").toLowerCase()})
                },
                {
                  type: "input-text",
                  title: t("Đơn vị tính"),
                  field: "unitId.name",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Đơn vị tính").toLowerCase()})
                },
                {
                  type: "input-range",
                  title: t("Số lượng tồn"),
                  field: "productstock.manufacturingQuantity",
                  placeholder: t("Nhập {{type}}", {type: t("Giá trị").toLowerCase()})
                },
                {
                  type: "select",
                  title: t("Loại"),
                  field: "category",
                  options: Constants.OPTIONS_MANUFACTURING_STOCK,
                  placeholder: t("Nhập {{type}}", {type: t("Loại phiếu").toLowerCase()})
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
              total={this.state.totalProducts}
              hasCheckbox={true}
              id={"manufacturing-product-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              emptyDescription={Constants.NO_PRODUCT}
            />
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

export default connect(
  function (state) {
    return {
      User: state.reducer_user.User,
      User_Function: state.reducer_user.User_Function,
    };
  }
)(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(ManufacturingStock)
  )
);