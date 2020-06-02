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
import moment from "moment";
import FormLabel from "@material-ui/core/FormLabel";
import OhTable from 'components/Oh/OhTable';
import inventoryReport from 'services/InventoryReportService';
import productTypeService from 'services/ProductTypeService';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Constants from "variables/Constants/";
import { MdViewList, MdVerticalAlignBottom} from "react-icons/md";
import { AiOutlineSetting} from "react-icons/ai";
import OhToolbar from "components/Oh/OhToolbar";
import { trans } from "lib/ExtendFunction";
import OhMultiChoice from "components/Oh/OhMultiChoice";
import OhDateTimePicker from 'components/Oh/OhDateTimePicker';
import { ExportCSV } from 'ExportExcel/ExportExcel';
const { Paragraph } = Typography;

const { Option } = Select;
class InventoryReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().startOf('month').format("DD/MM/YYYY"),
      endTime: moment().endOf('month').format("DD/MM/YYYY"),
      dateTime: {
        start: new Date(moment().startOf('month')).getTime(),
        end: new Date(moment().endOf('month')).getTime()
      },
      InputValue: [moment().startOf('month'),moment().endOf('month')],
      dataSourcePType: [],
      fileList: [],
      MessageError: "",
      dataInventoryReport: [],
      totalInventory: 0,
      alert: null,
      br: null,
      brerror: null,
      productType: {},
      checkedBoxProduct: false,
      selectTypes: [],
      selectStockId: [],
      loading: false,
      stock_lists: ExtendFunction.getSelectStockList(this.props.stockList, false)


    }
    this.viewColumn = [];
  }

  componentDidMount() {
    let start = moment().startOf('month')
    let end = moment().endOf('month')
    this.getData(start, end);
    this.changeProductTypeProps()
  }

  async getData(start, end) {
    this.setState({
      loading: true
    })

    let { stock_lists, selectStockId, selectTypes } = this.state;
    let stocks = [];

    if (stock_lists.length) {
      stock_lists.map( item => stocks.push(item.id));
    }
    
    const query = {
      startDate: new Date(start).getTime(),
      endDate: new Date(end).getTime(),
      type: selectTypes,
      stockId: selectStockId.length === 0 ? stocks : selectStockId
    };

    let dataInventoryReport = await inventoryReport.getInventoryReportData(query)

    if (dataInventoryReport.status)
      this.setState({
        dataInventoryReport: dataInventoryReport.data,
        totalInventory: dataInventoryReport.totalAmount,
        loading: false
      })
    else {
      this.error(dataInventoryReport.error)
      this.setState({
        loading: false
      })
    }
  }

  async setData(productTypes) {
    if (productTypes.length > 0) {
      this.setState({
        br: false,
        brerror: false,
        checkedBoxProduct: false
      })
    }
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

  formatted_date(){
    var result="";
    result += moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING);
    return result;
  }

  export = () => {
    const {t, nameBranch} = this.props;
    let { dateTime } = this.state;
    const { dataInventoryReport, totalInventory } = this.state;    
    let checkInventory = (this.viewColumn.length  && (this.viewColumn[this.viewColumn.length - 1].visible === true || this.viewColumn[this.viewColumn.length - 1].visible === undefined)) || this.viewColumn.length === 0 ;

    let dataExcel = [[t("Chi nhánh"), nameBranch ], [t("Thời gian xuất"), this.formatted_date() ],
    [t("Thời gian khảo sát"), moment(dateTime.start).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT) + "-" + moment(dateTime.end).format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT) ], checkInventory ? [t('Tổng tồn kho'), ExtendFunction.FormatNumber(totalInventory) ]: ""];
    let headerExcel = ["#"];
    
    if(this.viewColumn.length > 0){
      this.viewColumn.map(item => {
        if(item.visible === true || item.visible === undefined)
          headerExcel.push(t(item.title))
        return item;
      })
      dataExcel.push(headerExcel)
    }
    else{
      dataExcel.push([
        '#',
        t('Sản phẩm'),
        t('Mã'),
        t('SL nhập'),
        t('SL kiểm kê tăng'),
        t('SL hàng trả lại'),
        t('SL bán ra'),
        t('SL trả NCC'),
        t('SL kiểm kê giảm'),
        t('Giá vốn'),
        t('Tồn kho'),
        t('Giá trị tồn kho')
      ]);
    }
    for (let item in dataInventoryReport) {
      if(this.viewColumn.length > 0){
        let bodyExcel = [parseInt(item) + 1];
        this.viewColumn.map(column => {
          if(column.visible || column.visible === undefined){
            if(column.dataIndex === "name")
              bodyExcel.push(trans(dataInventoryReport[item][column.dataIndex], true))
            else
              bodyExcel.push(dataInventoryReport[item][column.dataIndex])
          }
          return column;
        })
        dataExcel.push(bodyExcel)
      }
      else{
        dataExcel.push(
          [
            parseInt(item) + 1,
            trans(dataInventoryReport[item].name, true),
            dataInventoryReport[item].code,
            dataInventoryReport[item].quantityImport !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].quantityImport).toFixed(0)) : 0,
            dataInventoryReport[item].quantityStockCheckIncrease !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].quantityStockCheckIncrease).toFixed(0)) : 0,
            dataInventoryReport[item].quantityInvoiceReturn !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].quantityInvoiceReturn).toFixed(0)) : 0,
            dataInventoryReport[item].quantityInvoice !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].quantityInvoice).toFixed(0)) :0,
            dataInventoryReport[item].quantityImportReturn !== undefined ? ExtendFunction.FormatNumber(Number(dataInventoryReport[item].quantityImportReturn).toFixed(0)) : 0,
            dataInventoryReport[item].quantityStockCheckDecrease !== undefined ?  ExtendFunction.FormatNumber(Number(dataInventoryReport[item].quantityStockCheckDecrease).toFixed(0)) : 0,
            ExtendFunction.FormatNumber(Number(dataInventoryReport[item].costUnitPrice).toFixed(0)),
            ExtendFunction.FormatNumber(Number(dataInventoryReport[item].stockQuantity).toFixed(0)),
            ExtendFunction.FormatNumber(Number(dataInventoryReport[item].total).toFixed(0)),
          ]
        )
      }
    }

    ExportCSV([{data: dataExcel}], t("BaoCaoTonKho"));
  }

  render() {
    const { t } = this.props;
    const { InputValue, dateTime, dataInventoryReport, totalInventory, loading, stock_lists } = this.state;

    let columns = [
      {
        title: "Sản phẩm",
        align: 'left',
        width: 150,
        dataIndex: 'name',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : -1),
        render: value => {
          return (
            <Paragraph title={trans(value)} style={{ wordWrap: "break-word", wordBreak: "break-word", maxWidth: 200 }} ellipsis={{ rows: 4 }}>
              {trans(value)}
            </Paragraph>
          );
        },
      },
      {
        title: 'Mã',
        align: 'left',
        width: 70,
        dataIndex: 'code',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : -1),
        key: "code",
        render: value => {
          return <div title={value}>{value }</div>;
        },
      },
      {
        title: 'ĐVT',
        dataIndex: 'unitName',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.unitName ? a.unitName.localeCompare(b.unitName) : -1),
        key: "unitName",
      },
      {

        title: "SL nhập",
        align: 'right',
        dataIndex: 'quantityImport',
        key: "quantityImport",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.quantityImport - b.quantityImport),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: "SL kiểm kê tăng",
        align: 'right',
        dataIndex: 'quantityStockCheckIncrease',
        key: "quantityStockCheckIncrease",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.quantityStockCheckIncrease - b.quantityStockCheckIncrease),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        },
        visible: false
      },
      {

        title: "SL hàng trả lại",
        align: 'right',
        dataIndex: 'quantityInvoiceReturn',
        key: "quantityInvoiceReturn",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.quantityInvoiceReturn - b.quantityInvoiceReturn),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: "SL bán ra",
        align: 'right',
        dataIndex: 'quantityInvoice',
        key: "quantityInvoice",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.quantityInvoice - b.quantityInvoice),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: "SL trả NCC",
        align: 'right',
        dataIndex: 'quantityImportReturn',
        key: "quantityImportReturn",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.quantityImportReturn - b.quantityImportReturn),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: "SL kiểm kê giảm",
        align: 'right',
        dataIndex: 'quantityStockCheckDecrease',
        key: "quantityStockCheckDecrease",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.quantityStockCheckDecrease - b.quantityStockCheckDecrease),
        render: value => {
          return value ?  Math.abs(ExtendFunction.FormatNumber(value)) : 0
        },
        visible: false
      },
      {
        title: "Giá vốn",
        align: 'right',
        width: 120,
        dataIndex: 'costUnitPrice',
        key: "costUnitPrice",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.costUnitPrice - b.costUnitPrice),
        render: value => {
          return value ? ExtendFunction.FormatNumber(Number(value).toFixed(0)) : 0
        }
      },
      {
        title: "SL tồn kho",
        align: 'right',
        dataIndex: 'stockQuantity',
        key: "stockQuantity",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.stockQuantity - b.stockQuantity),
        render: value => {
          return value ? ExtendFunction.FormatNumber(value) : 0
        }
      },
      {
        title: "Giá trị tồn kho",
        align: 'right',
        width: 140,
        dataIndex: 'total',
        key: "total",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.total - b.total),
        render: value => {
          return value ? ExtendFunction.FormatNumber(Number(value).toFixed(0)) : 0
        }
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
                        type: "button",
                        label: t("Xuất báo cáo"),
                        typeButton:"export",
                        onClick: () => this.export(),
                        icon: <MdVerticalAlignBottom />,
                      },
                    ]}
                    />
                      <GridItem>
                        <span className="TitleInfoForm">{t("Ngày")}</span>
                      </GridItem>
                      <GridItem >
                      <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                          let dateTime = {start: start, end: end};
                          this.setState({dateTime})
                        }}
                      />
                      </GridItem>
                    
                   
                      <GridItem>
                          <span className="TitleInfoForm">{t("Theo")}</span>
                      </GridItem>
                      
                      <GridItem style={{ width: "310px" }} >
                        <OhMultiChoice
                          dataSourcePType={this.state.dataSourcePType}
                          placeholder={t("Chọn theo nhóm sản phẩm")}
                          onChange= {(selectTypes) => {
                            this.setState({
                              selectTypes: selectTypes,
                            })
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
                            })
                          }}
                          defaultValue={this.state.selectStockId}
                        />
                      </GridItem>: null}
                      <GridItem >
                        <OhToolbar
                          right={[
                            {
                              type: "button",
                              label: t("Xem báo cáo"),
                              onClick: () => this.getData(dateTime.start, dateTime.end),
                              icon: <MdViewList />,
                              simple: true,
                              typeButton:"add",
                            },
                            {
                              type: "button",
                              label: t("Tùy chỉnh hiển thị"),
                              icon: <AiOutlineSetting />,
                              onClick: () => this.tableRef.openSetting(),
                              typeButton: "export",
                              simple: true,
                            },
                          ]}
                        />
                      </GridItem>
              </GridContainer>
              <GridContainer>
                <CardBody style={{width: "100%"}}>
                {dataInventoryReport.length > 1000 ?
                    <GridItem >
                      <GridContainer >
                        <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                          <b className='HeaderForm'>{t("Hiển thị 1–{{maxLength}} của {{maxLength}}+ kết quả. Để thu hẹp kết quả, bạn hãy chỉnh sửa phạm vi thời gian hoặc chọn Xuất báo cáo để xem đầy đủ", {maxLength: 1000})}</b>
                        </FormLabel>
                      </GridContainer>
                    </GridItem>
                    :
                    <GridItem>
                      <GridContainer justify="flex-end">
                        <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                          <b className='HeaderForm'>{t("Tổng")}: {ExtendFunction.FormatNumberToInt(totalInventory)}</b>
                        </FormLabel>
                      </GridContainer>
                    </GridItem>
                  }
                  <OhTable
                    id= "inventory-report"
                    onRef={ref => this.tableRef = ref}
                    columns={columns}
                    dataSource={dataInventoryReport.length > 1000 ? dataInventoryReport.slice(0,1000) : dataInventoryReport}
                    isNonePagination={true}
                    loading={loading}
                    onChangeViewColumn={(column) => {
                      this.viewColumn = column;
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

InventoryReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (
  connect(function (state) {
    return {
      stockList: state.stockListReducer.stockList,
      nameBranch: state.branchReducer.nameBranch,
    };
  })
) (
  withTranslation("translations")(
    withStyles(theme => ({
      ...regularFormsStyle
    }))(InventoryReport)
  )
);
