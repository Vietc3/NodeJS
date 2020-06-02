import React, { Fragment } from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";

import { withTranslation } from "react-i18next";
// css
import Constants from 'variables/Constants/';
import OhToolbar from "components/Oh/OhToolbar";
import ProductPDF from "./components/ProductPDF.js";
import { MdAddCircle, MdVerticalAlignBottom} from "react-icons/md";
import productService from 'services/ProductService.js';
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import OhTable from "components/Oh/OhTable.jsx";
import OhSearchFilter from "components/Oh/OhSearchFilter.jsx";
import { notifyError } from 'components/Oh/OhUtils.js';
import OhNumberInput from "components/Oh/OhNumberInput.jsx";
import ExtendFunction, { trans } from "lib/ExtendFunction.js";
import _ from 'lodash';

class FinishedProduct extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    selectedRowKeys: [],
    dataSource: [],
    importValues: {}
  }  
  this.filters = {};
  this.getData = _.debounce(this.getData, Constants.UPDATE_TIME_OUT);
}

onChange = (obj) => {
  this.filters = {
    ...this.filters,
    ...obj
  }

  this.getData();
}



getDataExcel = (data, t) => {
  let dataExcel = [["#", t("Mã thành phẩm"), t("Tên thành phẩm"), t("ĐVT"), t("Tồn kho")]];
  for (let item in data) {
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
  let { selectedRowKeys } = this.state;
  let { t, nameBranch } = this.props;
  let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;
  filter = { ...filter, category: 1 }

  if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
    filter = { ...filter, id: { in: selectedRowKeys } };      
  }

  let query = {
    filter: filter || {},
    sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
    manualFilter: manualFilter || {},
    manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
  };

  let dataProductPDF = await productService.getProductList(query);
 
  if (dataProductPDF.status){
    dataProductPDF.data.map( item => {
      item.name = trans(item.name, true)
    })
    ProductPDF.productPDF(dataProductPDF.data, t, nameBranch)
  } else notifyError(dataProductPDF.error)

}

exportExcel = async () => {
  let { selectedRowKeys } = this.state;
  let { t } = this.props;
  let { filter, sortField, sortOrder, manualFilter, isManualSort } = this.filters;
  filter = { ...filter, category: 1 }

  if ( selectedRowKeys && selectedRowKeys.length > 0 && !this.tableRef.state.isSelectedAll ) {
    filter = { ...filter, id: { in: selectedRowKeys } };      
  }

  let query = {
    filter: filter || {},
    sort: (!isManualSort && sortOrder) ? sortField + " " + sortOrder : undefined,
    manualFilter: manualFilter || {},
    manualSort: (isManualSort && sortOrder) ? { sortField, sortOrder } : {},
  };

  let dataProductPDF = await productService.getProductList(query);

  if (dataProductPDF.status) {
    dataProductPDF.data.map( item => {
      item.name = trans(item.name, true)
    })
  ExtendFunction.exportToCSV(this.getDataExcel(dataProductPDF.data, t), t("DanhSachThanhPham"))
  } else notifyError(dataProductPDF.error)

}

  async getData() {
    let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;
    filter = {
      ...filter,
      category: 1,
      stoppedAt: 0,
      type: Constants.PRODUCT_TYPES.id.merchandise,
    }
    pageNumber = pageNumber || 1;
    pageSize = pageSize || 10;

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

  async setData(products, count) {
    var dataSource = products || [{}]    
    let arrId = [];
    if (dataSource.length > 0) {
      dataSource.map(data => {
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
      
    } else
    this.setState({
      dataSource: []
    })
  }

 
  render() {
        const { t } = this.props;
        const { dataSource, importValues} = this.state;
        let columns = [
          {
            title: t("Mã"),
            dataIndex: "code",
            key: "code",
            align: "left",
            width: "14%",
    
          },
          {
            title: t("Tên thành phẩm"),
            dataIndex: "name",
            key: "name",
            align: "left",
            width: "42%",
            render: value => trans(value)
    
          },
          {
            title: t("ĐVT"),
            dataIndex: "unitId.name",
            align: "left",
            width: "13%",
          },
          {
            title: t("Số lượng tồn"),
            dataIndex: "productstock.manufacturingQuantity",
            align: "right",
            width: "14%",
            render: (value) => {
              return ExtendFunction.FormatNumber(value)
            }
          },
          {
            title: t("Số lượng sản xuất"),
            dataIndex: "inputQuantity",
            align: "right",
            width: "17%",
            sorter: false,
            render: (value, record) => {
              let {importValues} = this.state;
              return <OhNumberInput
                defaultValue={(importValues[record.id] || {}).value}
                onChange={val => this.setState({importValues: {
                  ...importValues,
                  [record.id]: {value: val, record}
                }})}
                isNegative={false}
                permission= {{
                  name: Constants.PERMISSION_NAME.MANUFACTURE_PRODUCT,
                  type: Constants.PERMISSION_TYPE.TYPE_ALL
                }}
              />;
            },
          },
        ];

  return(
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
                    name: Constants.PERMISSION_NAME.MANUFACTURE_PRODUCT,
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
                }
              ]}
              right={[
                {
                  type: "link",
                  label: t("Sản xuất"),
                  linkTo: 'create-manufacturing-card',
                  params: importValues,
                  icon: <MdAddCircle />,
                  simple: true,
                  typeButton: "add",
                  permission: {
                    name: Constants.PERMISSION_NAME.MANUFACTURE_PRODUCT,
                    type: Constants.PERMISSION_TYPE.TYPE_ALL
                  },
                },
              ]}
            />
            <OhSearchFilter
            id={"finished-product-table"}
              onFilter={(filter, manualFilter) => {
                this.onChange({
                  filter,
                  manualFilter
                });
              }}
              filterFields={[
                {
                  type: "input-text",
                  title: t("Mã thành phẩm"),
                  field: "code",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Mã thành phẩm").toLowerCase()})
                },
                {
                  type: "input-text",
                  title: t("Tên thành phẩm"),
                  field: "name",
                  isManualFilter: true,
                  placeholder: t("Nhập {{type}}", {type: t("Tên thành phẩm").toLowerCase()})
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
              ]}
              defaultShowAll={false}
              searchInput={{
                fields: ["code", "name"],
                placeholder: t("Tìm theo mã thành phẩm hoặc tên thành phẩm")
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
              dataSource = {dataSource}
              total={this.state.totalProducts}
              hasCheckbox={true}
              id={"finished-product-table"}
              onSelectChange={selectedRowKeys => this.setState({ selectedRowKeys })}
              emptyDescription={Constants.NO_PRODUCT}
            />
        </CardBody>
    </Card>
      </Fragment>
  )
      }
}

export default connect(
  function (state) {
    return {
      User: state.reducer_user.User,
      User_Function: state.reducer_user.User_Function,
      nameBranch: state.branchReducer.nameBranch,
    };
  }
)(
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(FinishedProduct)
  )
);