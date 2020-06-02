import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import ExtendFunction from "lib/ExtendFunction";
import Card from "components/Card/Card.jsx";
import { Select, Typography } from "antd";
import GridContainer from "components/Grid/GridContainer.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import moment from "moment";
import FormLabel from "@material-ui/core/FormLabel";
import OhTable from 'components/Oh/OhTable';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { MdViewList, MdVerticalAlignBottom} from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar";
import { notifyError } from 'components/Oh/OhUtils';
import ImportExportReportService from 'services/ImportExportReportService';
import { trans } from "lib/ExtendFunction";
import OhMultiChoice from "components/Oh/OhMultiChoice";
import OhDateTimePicker from 'components/Oh/OhDateTimePicker';
import ManualSortFilter from "MyFunction/ManualSortFilter";

const { Paragraph } = Typography;

const { Option } = Select;

class InventoryReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTime: {
        start: new Date(moment().startOf('month')).getTime(),
        end: new Date(moment().endOf('month')).getTime()
      },
      InputValue: [moment().startOf('month'),moment().endOf('month')],
      dataSourcePType: this.props.productTypes || [],
      dataSourceProduct: (this.props.productList || []).map(item => ({...item, name: trans(item.name, true)})),
      fileList: [],
      dataInventoryReport: [],
      alert: null,
      productType: {},
      checkedBoxProduct: false,
      selectTypes: [],
      selectProducts: [],
      selectStockId: [],
      loading: false,
      stock_lists: ExtendFunction.getSelectStockList(this.props.stockList, false)
    }
  }

  componentDidMount() {
    let start = moment().startOf('month')
    let end = moment().endOf('month') 
    this.getData(start, end);
  }

  async componentDidUpdate(prevProps, prevState) {
    if ((this.props.productList.length && !prevProps.productList.length) || (this.props.productTypes.length && !prevProps.productTypes.length)){
      this.setState({
        dataSourcePType: this.props.productTypes || [],
        dataSourceProduct: (this.props.productList || []).map(item => ({...item, name: trans(item.name, true)})),
      })
    }
  }

  async getData(start, end) {
    this.setState({
      loading: true
    })
    let { stock_lists, selectStockId } = this.state;
    let stocks = [];

    if ( stock_lists.length) {
      stock_lists.map( item => stocks.push(item.id));
    }

    const query = {
      selectProduct: this.state.selectProducts,
      startDate: new Date(start).getTime(),
      endDate: new Date(end).getTime(),
      type: this.state.selectTypes,
      stockId: selectStockId.length === 0 ? stocks : selectStockId
    };
      let dataInventoryReport = await ImportExportReportService.getStoreReportData(query)
      if (dataInventoryReport.status){                    
        this.setState({
          loading: false,
          dataInventoryReport: dataInventoryReport.data,
        })
      } else {
        notifyError(dataInventoryReport.message);        
        this.setState({
          loading: false
        })
      }
  }

  getDataFilterProductByType() {
    let { selectTypes } = this.state;

    if (!selectTypes.length) {
      this.setState({
        dataSourceProduct: (this.props.productList || []).map(item => ({...item, name: trans(item.name, true)}))
      })
    }
    else {
      let dataFilter = ManualSortFilter.ManualSortFilter(this.props.productList || [], {["productTypeId.id"]: {in:selectTypes }}, {});

      this.setState({
        dataSourceProduct: dataFilter.map(item => ({...item, name: trans(item.name, true)}))
      })
    }
  }

  async setData(productTypes) {
    if (productTypes.length > 0) {
      this.setState({
        checkedBoxProduct: false
      })
    }        
    this.setState({
      dataSourcePType: productTypes,
    })
  }

  export = () => {
    let { dataInventoryReport } = this.state;
    let { t } = this.props
    let dataExcel = [[
      '#',
      t('Mã'),
      t('Sản phẩm'),
      t('ĐVT'),
      t('Số lượng tồn đầu kỳ'),
      t('Giá trị tồn đầu kỳ'),
      t('Nhập trong kỳ'),
      t('Xuất trong kỳ'),
      t('Số lượng tồn cuối kỳ'),
      t('Giá trị tồn cuối kỳ'),
    ]];
    for (let item in dataInventoryReport) {;
      dataExcel.push(
        [
          parseInt(item) + 1,
          dataInventoryReport[item].code,
          trans(dataInventoryReport[item].name, true),
          dataInventoryReport[item].unitName,
          dataInventoryReport[item].beginQuantity !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].beginQuantity).toFixed(0)) : 0,
          dataInventoryReport[item].beginAmount !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].beginAmount).toFixed(0)) : 0,
          dataInventoryReport[item].importQuantity !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].importQuantity).toFixed(0)) :0,
          dataInventoryReport[item].exportQuantity !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].exportQuantity).toFixed(0)) : 0,
          dataInventoryReport[item].lastQuantity !== undefined ?  ExtendFunction.FormatNumber(Number(dataInventoryReport[item].lastQuantity).toFixed(0)) : 0,
          dataInventoryReport[item].lastAmount !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].lastAmount).toFixed(0)) : 0,
        ]
      )
    }

    return dataExcel
  }
  
  

  render() {
    let { t } = this.props;
    let { InputValue, dateTime, dataInventoryReport, loading, stock_lists } = this.state;

    let columns = [      
      {
        title: t('Mã'),
        align: 'left',
        dataIndex: 'code',
        width: "10%",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : -1),
        key: "code",
        render: value => {
          return <div title={value}>{value }</div>;
        },
      },
      {
        title: t("Sản phẩm"),
        align: 'left',
        dataIndex: 'name',
        width: "15%",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : -1),
        render: value => {
          return (
            <Paragraph title={trans(value, true)} style={{ wordWrap: "break-word", wordBreak: "break-word", maxWidth: 200 }} ellipsis={{ rows: 4 }}>
              {trans(value)}
            </Paragraph>
          );
        },
      },
      {

        title: t("ĐVT"),
        dataIndex: 'unitName',
        key: "unitName",
        width: "5%",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.unitName ? a.unitName.localeCompare(b.unitName) : -1),
      },
      {
        title: t("Tồn đầu kỳ"),
        children: [
          {
            title: t("SL"),
            align: 'right',
            width: "7%",
            dataIndex: 'beginQuantity',
            key: "beginQuantity",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.beginQuantity - b.beginQuantity),
            render: value => {
              return value ? ExtendFunction.FormatNumber(value) : 0
            }
          },
          {

            title: t("Giá trị"),
            align: 'right',
            dataIndex: 'beginAmount',
            key: "beginAmount",
            width: "10%",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.beginAmount - b.beginAmount),
            render: value => {
              return value ? ExtendFunction.FormatNumber(value) : 0
            }
          },
        ],
       
      },
      {
        title: t("Trong kỳ"),
        children: [
          {
            title: t("Nhập"),
            align: 'right',
            dataIndex: 'importQuantity',
            width: "7%",
            key: "importQuantity",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.importQuantity - b.importQuantity),
            render: value => {
              return value ? ExtendFunction.FormatNumber(value) : 0
            }
          },
          {
            title: t("Giá trị"),
            align: 'right',
            dataIndex: 'importAmount',
            width: "10%",
            key: "importAmount",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.importAmount - b.importAmount),
            render: value => {
              return value ? ExtendFunction.FormatNumber(value) : 0
            }
          },
          {
            title: t("Xuất"),
            align: 'right',
            dataIndex: 'exportQuantity',
            width: "7%",
            key: "exportQuantity",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.exportQuantity - b.exportQuantity),
            render: value => {
              return value ? ExtendFunction.FormatNumber(value) : 0
            }
          },
          {
            title: t("Giá trị"),
            align: 'right',
            dataIndex: 'exportAmount',
            width: "10%",
            key: "exportAmount",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.exportAmount - b.exportAmount),
            render: value => {
              return value ? ExtendFunction.FormatNumber(value) : 0
            }
          },
        ]
      },       
      {
        title: t("Tồn cuối kỳ"),
        children: [
          {
            title: t("SL"),
            align: 'right',
            dataIndex: 'lastQuantity',
            width: "7%",
            key: "lastQuantity",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.lastQuantity - b.lastQuantity),
            render: value => {
              return value ? ExtendFunction.FormatNumber(value) : 0
            }
          },
          {
            title: t("Giá trị"),
            align: 'right',
            dataIndex: 'lastAmount',
            width: "10%",
            key: "lastAmount",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => (a.lastAmount - b.lastAmount),
            render: value => {
              return value ? ExtendFunction.FormatNumber(value) : 0
            }
          }
        ]
      },      
    ];

    return (
      <div>
        <Fragment>
          <Card>
            <CardBody >
              <GridContainer style={{ padding: '0px 15px' }}alignItems="center">
                  <OhToolbar
                    left={[
                      {
                        type: "csvlink",
                        label: t("Xuất báo cáo"),
                        typeButton:"export",
                        csvData: this.export(),
                        fileName: t("BaoCaoNhapXuatTonKho")+".xls",
                        onClick: () => { },
                        icon: <MdVerticalAlignBottom />,
                      },
                    ]}
                  />
                <GridItem>
                  <span className="TitleInfoForm">{t("Ngày")}</span>
                </GridItem>
                <GridItem >
                  <OhDateTimePicker defaultValue={InputValue} onChange={(start, end) => {
                    let dateTime = { start: start, end: end };
                    this.setState({ dateTime })
                  }}
                  />
                </GridItem>
                {stock_lists.length > 1 ?
                  <GridItem  >
                    <OhMultiChoice
                      dataSourcePType={stock_lists}
                      placeholder={t("Chọn theo kho")}
                      onChange={(selectStockId) => {

                        this.setState({
                          selectStockId: selectStockId,
                        })
                      }}
                      defaultValue={this.state.selectStockId}
                      className='reportSelect'
                    />
                  </GridItem> : null}
              </GridContainer>
              <GridContainer>
                <GridItem>
                  <span className="TitleInfoForm">{t("Theo")}</span>
                </GridItem>

                <GridItem  >
                  <OhMultiChoice
                    dataSourcePType={this.state.dataSourcePType}
                    placeholder={t("Chọn theo nhóm sản phẩm")}
                    onChange={(selectTypes) => {
                      this.setState({
                        selectTypes: selectTypes,
                      }, () => this.getDataFilterProductByType())
                    }}
                    defaultValue={this.state.selectTypes}
                    className='reportSelect'
                  />
                </GridItem>
                <GridItem>
                  <span className="TitleInfoForm">{t("Sản phẩm")}</span>
                </GridItem>
                <GridItem  >
                  <OhMultiChoice
                    dataSourcePType={this.state.dataSourceProduct}
                    placeholder={t("Chọn tên sản phẩm")}
                    onChange={(selectProducts) => {
                      this.setState({
                        selectProducts: selectProducts,
                      })
                    }}
                    defaultValue={this.state.selectProducts}
                    className='reportSelect'
                  />
                </GridItem>
                <GridItem style={{marginTop: '-17px'}}>
                  <OhToolbar
                    right={[
                      {
                        type: "button",
                        label: t("Xem báo cáo"),
                        onClick: () => this.getData(dateTime.start, dateTime.end),
                        icon: <MdViewList />,
                        simple: true,
                        typeButton: "add",
                      },

                    ]}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <CardBody>

                {dataInventoryReport.length > 1000 ?
                    <GridItem >
                      <GridContainer >
                        <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                          <b className='HeaderForm'>{t("Hiển thị 1–1000 của 1000+ kết quả. Để thu hẹp kết quả, bạn hãy chỉnh sửa phạm vi thời gian hoặc chọn Xuất báo cáo để xem đầy đủ")}</b>
                        </FormLabel>
                      </GridContainer>
                    </GridItem>
                    :
                    null
                  }
                  <OhTable
                    id= "store-import-export-report"
                    columns={columns}
                    dataSource={dataInventoryReport.length > 1000 ? dataInventoryReport.slice(0,1000) : dataInventoryReport}
                    isNonePagination={true}
                    loading={loading}
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

InventoryReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (
  connect(function (state) {
    return {
      stockList: state.stockListReducer.stockList,
      productList: state.productListReducer.products,
      productTypes: state.productTypeReducer.productTypes,
    };
  })
) (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(InventoryReport)
  )
);
