import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.jsx";
import { withTranslation } from 'react-i18next';
import ExtendFunction from "lib/ExtendFunction.js";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import OhTable from 'components/Oh/OhTable.jsx';
import FinishedEstimatesService from 'services/FinishedEstimatesService.js';
import productTypeService from 'services/ProductTypeService.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Constants from "variables/Constants/";
import { MdVerticalAlignBottom } from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar.jsx";
import { notifyError } from 'components/Oh/OhUtils.js';
import OhSearchFilter from "components/Oh/OhSearchFilter.jsx";
import { trans } from "lib/ExtendFunction.js";
import OhMultiChoice from "components/Oh/OhMultiChoice.jsx";
import InforFinishedEstimates from "./inforFinishedEstimates.jsx"

class EstimatesReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourcePType: [],
      FinishedEstimatesReport: [],
      productType: {},
      selectTypes: [],
      selectStockId: [],
      selectNameType: [],
      stock_lists: ExtendFunction.getSelectStockList(this.props.stockList, false),
      loading: false

    }
    this.filters = {};
  }

  componentDidMount() {
    this.changeProductTypeProps()
  }

  async getData() { 
    this.setState({
      loading: true
    })   
    let { t } = this.props;
    let { filter } = this.filters;
    let { stock_lists, selectStockId } = this.state;
    let stocks = [];

    if (stock_lists.length) {
      stock_lists.map( item => stocks.push(item.id));
    }

    filter = {
      ...filter
    }

    const query = {
      filter: filter,
      type: this.state.selectTypes,
      stockId: selectStockId.length === 0 ? stocks : selectStockId
    };

    let FinishedEstimatesReport = await FinishedEstimatesService.getFinishedEstimatesDate(query)
    if (FinishedEstimatesReport.status) {
      this.setState({
        loading: false,
        FinishedEstimatesReport: FinishedEstimatesReport.data
      })
    } else {
      notifyError(t("Lỗi xử lý dữ liệu"))
      this.setState({
        loading: false
      })
    }
  }

  async setData(productTypes) {
    this.setState({
      dataSourcePType: productTypes,
    })
  }

  async changeProductTypeProps() {
    let getProductType = await productTypeService.getProductTypes();
    this.setData(
      getProductType.data
    )
  }

  export = () => {
    let { t } = this.props;
    const { FinishedEstimatesReport } = this.state;
    let dataExcel = [[
      '#',
      t('Mã'),
      t('Tên thành phẩm'),
      t('ĐVT'),
      t('Tồn kho'),
      t('Tồn kho sx'),
      t('Có thể sx')
    ]];
    for (let item in FinishedEstimatesReport) {            
      dataExcel.push(
        [
          parseInt(item) + 1,
          FinishedEstimatesReport[item].code,
          trans(FinishedEstimatesReport[item].name, true),
          FinishedEstimatesReport[item].unitName,
          ExtendFunction.FormatNumber(Number(FinishedEstimatesReport[item].stockQuantity).toFixed(0)),
          ExtendFunction.FormatNumber(Number(FinishedEstimatesReport[item].manufacturingQuantity).toFixed(0)),
          ExtendFunction.FormatNumber(Number(FinishedEstimatesReport[item].productionMay).toFixed(0)),
        ]
      )
    }
    return dataExcel
  }

  onChange = (obj) => {
    this.filters = {
      ...this.filters,
      ...obj
    }

    this.getData();
  }
  showInfor = (record) => {
    let URL = window.location.origin;
    return (
      URL + Constants.ADMIN_LINK + Constants.EDIT_PRODUCT + "/" + record.id
    ); 
  }

  render() {
    const { t } = this.props;
    const { FinishedEstimatesReport, stock_lists } = this.state;
      
    let columns = [
      {
        title: t('Mã'),
        align: 'left',
        width: '16%',
        dataIndex: 'code',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.code.localeCompare(b.code),
        key: "code",
        render: (value, record) => { 
          return (
          <div className = "finished-estimates">
            <a href={this.showInfor(record)} target="_blank" rel="noopener noreferrer" >{value}</a>
            </div>
          )
        }
      },
      {
        title: t("Tên thành phẩm"),
        align: 'left',
        width: '40%',
        dataIndex: 'name',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) =>  trans(a.name, true).localeCompare(trans(b.name, true)),
        render: (value, record) => trans(value)
      },
      {
        title: t("ĐVT"),
        align: 'left',
        width: '12%',
        dataIndex: 'unitName',
        sorter: (a, b) =>  a.unitName.localeCompare(b.unitName),
        sortDirections: ["descend", "ascend"],
      },
      {
        title: t("Tồn kho"),
        align: 'right',
        width: 120,
        dataIndex: 'stockQuantity',
        key: "stockQuantity",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.stockQuantity - b.stockQuantity),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: t("Tồn kho sx"),
        align: 'right',
        width: 120,
        dataIndex: 'manufacturingQuantity',
        key: "manufacturingQuantity",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.manufacturingQuantity - b.manufacturingQuantity),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: t("Có thể sx"),
        align: 'right',
        width: 135,
        dataIndex: 'productionMay',
        key: "productionMay",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.productionMay - b.productionMay),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
    ];
    
    return (
      <div>
        <Fragment>
        {this.state.redirect}
          <Card>
            <CardBody >
              <GridContainer style={{ padding: '0px 15px' }} alignItems="center">
                <OhToolbar
                  left={[
                    {
                      type: "csvlink",
                      label: t("Xuất báo cáo"),
                      typeButton: "export",
                      csvData: this.export(),
                      fileName: t("BaoCaoUocTinhThanhPham") +".xls",
                      onClick: () => { },
                      icon: <MdVerticalAlignBottom />,
                    },
                  ]}
                />

                <GridItem>
                  <span className="TitleInfoForm">{t("Sản phẩm")}</span>
                </GridItem>
                <GridItem style={{ width: "340px", marginTop: 20 }} >
                  <OhSearchFilter
                    id={"low-stock-table"}
                    onFilter={(filter) => {
                      this.onChange({
                        filter
                      });
                    }}
                    defaultShowAll={false}
                    searchInput={{
                      fields: ["code", "name"],
                      placeholder: t("Tìm theo mã sản phẩm hoặc tên sản phẩm")
                    }}
                  />
                </GridItem>
                <GridItem>
                  <span className="TitleInfoForm">{t("Nhóm SP")}</span>
                </GridItem>
                <GridItem style={{ width: "310px" }} >
                  <OhMultiChoice
                    dataSourcePType={this.state.dataSourcePType}
                    placeholder={t("Chọn theo nhóm sản phẩm")}
                    onChange= {(selectTypes) => {
                      this.setState({
                        selectTypes: selectTypes,
                      }, () => this.getData())
                    }}
                    defaultValue={this.state.selectTypes}
                  />
                </GridItem>
                { stock_lists.length > 1 ?
                <GridItem style={{ width: "190px" }} >
                    <OhMultiChoice
                      dataSourcePType={stock_lists}
                      placeholder={t("Chọn theo kho")}
                      onChange= {(selectStockId) => {
                        
                        this.setState({
                          selectStockId: selectStockId,
                        }, () => this.getData())
                      }}
                      defaultValue={this.state.selectStockId}
                    />
                </GridItem>: null}
              </GridContainer>
              <GridContainer>
                <CardBody>
                  {FinishedEstimatesReport.length > 500 ?
                    <GridItem >
                      <GridContainer >
                        <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                          <b className='HeaderForm'>{t("Hiển thị 1–500 của 500+ kết quả. Để thu hẹp kết quả, bạn hãy chọn loại nhóm hoặc chọn Xuất báo cáo để xem đầy đủ")}</b>
                        </FormLabel>
                      </GridContainer>
                    </GridItem>
                    : null
                  }
                  <OhTable
                    id="finished-estimates-report"
                    columns={columns}
                    dataSource={FinishedEstimatesReport.length > 500 ? FinishedEstimatesReport.slice(0,500) : FinishedEstimatesReport}
                    isNonePagination={true} 
                    isExpandable={true}
                    hasCheckbox={false} 
                    loading={this.state.loading}
                    rowClassName={() => { return 'rowOhTable'}} 
                    scrollToFirstRowOnChange={false}
                    expandedRowRender={(record) => {
                                         
                      return (
                        <Card style ={{margin:"0px 0px"}} key = {"card-table-finish-estimates-"+ record.id}>
                          <CardBody style ={{marginTop:"4px"}}>
                            <InforFinishedEstimates
                             stock_lists = {stock_lists}
                             selectStockId = {this.state.selectStockId}
                             id = {record.id}
                            />
                          </CardBody>
                        </Card>
                      )
                    }}                 
                  />
                </CardBody>
              </GridContainer>
            </CardBody>
          </Card>
        </Fragment>
      </div>
    );
  }
}

EstimatesReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (
  connect(function (state) {
    return {
      stockList: state.stockListReducer.stockList
    };
  })
) (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(EstimatesReport)
  )
);
