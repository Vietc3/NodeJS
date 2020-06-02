import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from 'react-i18next';
import ExtendFunction from "lib/ExtendFunction";
import Card from "components/Card/Card.jsx";
import { Select, Typography } from "antd";
import GridContainer from "components/Grid/GridContainer.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import OhTable from 'components/Oh/OhTable';
import quotaReport from 'services/QuotaReportService';
import productTypeService from 'services/ProductTypeService';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Constants from "variables/Constants/";
import { MdVerticalAlignBottom } from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar";
import { notifyError } from 'components/Oh/OhUtils';
import { Redirect, Link } from 'react-router-dom';
import OhSearchFilter from "components/Oh/OhSearchFilter";
import { trans } from "lib/ExtendFunction";
import OhMultiChoice from "components/Oh/OhMultiChoice";

class QuotaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourcePType: [],
      dataQuotaReport: [],
      productType: {},
      selectTypes: [],
      selectNameType: [],
      stock_lists: ExtendFunction.getSelectStockList(this.props.stockList, false)

    }
    this.filters = {};
  }

  componentDidMount() {
    this.getData();
    this.changeProductTypeProps()
  }

  async getData() {    
    let { t } = this.props;
    let { filter } = this.filters;
    let { stock_lists } = this.state;
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
      stockId: stocks
    };

    let dataQuotaReport = await quotaReport.getQuotaReportData(query)
    if (dataQuotaReport.status) {
      this.setState({
        dataQuotaReport: dataQuotaReport.data
      })
    } else notifyError(t("Lỗi xử lý dữ liệu"))
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
    const { dataQuotaReport } = this.state;
    let dataExcel = [[
      '#',
      t('Mã'),
      t('Sản phẩm'),
      t('Tồn kho'),
      t('Tồn kho tối thiểu'),
      t('Cần nhập')
    ]];
    for (let item in dataQuotaReport) {
      console.log( dataQuotaReport[item])
      
      dataExcel.push(
        [
          parseInt(item) + 1,
          dataQuotaReport[item].code,
          trans(dataQuotaReport[item].name, true),
          ExtendFunction.FormatNumber(Number(dataQuotaReport[item].stockQuantity).toFixed(0)),
          ExtendFunction.FormatNumber(Number(dataQuotaReport[item].stockMin).toFixed(0)),
          ExtendFunction.FormatNumber(Number(dataQuotaReport[item].quantityNeed).toFixed(0)),
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

  render() {
    const { t } = this.props;
    const { dataQuotaReport } = this.state;
  
    let columns = [
      {
        title: t('Mã'),
        align: 'left',
        width: '20%',
        dataIndex: 'code',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.code.localeCompare(b.code),
        key: "code",
        render: (value, record) => {
          return <Link to={Constants.ADMIN_LINK + Constants.EDIT_PRODUCT + "/" + record.id} target="_blank">{value}</Link>
        },
      },
      {
        title: t("Tên"),
        align: 'left',
        width: '40%',
        dataIndex: 'name',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) =>  trans(a.name, true).localeCompare(trans(b.name, true)),
        render: (value, record) =>
        {
          return <Link to={Constants.ADMIN_LINK + Constants.EDIT_PRODUCT + "/" + record.id} target="_blank">{trans(value)}</Link>
        },
      },
      {
        title: t("SL tồn kho"),
        align: 'right',
        width: 100,
        dataIndex: 'stockQuantity',
        key: "stockQuantity",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.stockQuantity - b.stockQuantity),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: t("Tồn kho tối thiểu"),
        align: 'right',
        width: 170,
        dataIndex: 'stockMin',
        key: "stockMin",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.stockMin - b.stockMin),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: t("Cần nhập"),
        align: 'right',
        width: 100,
        dataIndex: 'quantityNeed',
        key: "quantityNeed",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.quantityNeed - b.quantityNeed),
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
                      fileName: t("BaoCaoTonDuoiMucToiThieu") +".xls",
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
              </GridContainer>
              <GridContainer>
                <CardBody>
                  {dataQuotaReport.length > 500 ?
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
                    id="quota-report"
                    columns={columns}
                    dataSource={dataQuotaReport.length > 500 ? dataQuotaReport.slice(0,500) : dataQuotaReport}
                    isNonePagination={true}
                    onRowClick={(e, record, index) => window.open(Constants.ADMIN_LINK + Constants.EDIT_PRODUCT + "/" + record.id, "_blank")}                   
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

QuotaReport.propTypes = {
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
    }))(QuotaReport)
  )
);
