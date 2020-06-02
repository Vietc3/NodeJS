import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import moment from "moment";
import ExtendFunction from "lib/ExtendFunction";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import FormLabel from "@material-ui/core/FormLabel";
import Constants from "variables/Constants/";
import { MdVerticalAlignBottom } from "react-icons/md";
import OhToolbar from "components/Oh/OhToolbar";
import { notifyError } from "components/Oh/OhUtils";
import OhSelect from "components/Oh/OhSelect";
import ProductTypeService from 'services/ProductTypeService';
import ReportImportExportDetail from 'services/ReportImportExportDetail';
import CustomerService from 'services/CustomerService';
import ProductService from 'services/ProductService';
import OhTable from "components/Oh/OhTable";
import OhInput from "components/Oh/OhInput";
import { trans } from "lib/ExtendFunction";
import OhDateTimePicker from 'components/Oh/OhDateTimePicker';
import OhMultiChoice from "components/Oh/OhMultiChoice";
import _ from "lodash";
class Debt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTime: {
        start: new Date(moment().startOf('month')).getTime(),
        end: new Date(moment().endOf('month')).getTime()
      },
      InputValue: [moment().startOf('month'),moment().endOf('month')],
      dataReport: [],
      dataSearch: [],
      valueSearch: '',
      dataSearchFull: [],
      groupType: Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.PRODUCT,
      id: 1,
      loadingReport: false,
      loadingSearch: false,
      selectStockId: [],
      stock_lists: ExtendFunction.getSelectStockList(this.props.stockList, false)


    }
  }

  componentDidMount() {
    let start = moment().startOf('month');
    let end = moment().endOf('month');

    this.getProductTypes();
    this.getDataSearch();
    this.getData(start, end)
  }

  componentDidUpdate = (prevProps, prevState) =>{
    if (this.props.stockList !== prevProps.stockList && this.props.stockList) {
      let stockId = Object.keys(this.props.stockList);

      if (Object.keys(prevProps.stockList).length){                
        this.getDataSearch(stockId)
      }
    }
  }

  async getData(start, end) {
    let { groupType, id, selectStockId, stock_lists } = this.state;
    let stocks = [];

    if (stock_lists.length) {
      stock_lists.map( item => stocks.push(item.id));
    }

    let list_Stocks = selectStockId.length === 0 ? stocks : selectStockId;
    
    this.setState({
      loadingReport: true
    })
    let getReport = await ReportImportExportDetail.getImportExportDetailReport({
      type: groupType,
      id: id,
      startDate: new Date(start).getTime(),
      endDate: new Date(end).getTime(),
      stockId: groupType === Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.PRODUCT ? list_Stocks  : stocks
    });

    if (getReport.status) {
      let data = getReport.data;      

      let i = 0;
      while (i < data.length) {
        let j = i + 1;
        let date = moment(data[i].createdAt).format(Constants.DISPLAY_DATE_FORMAT_STRING);
        while (j > 0 && j < data.length && moment(data[j].createdAt).format(Constants.DISPLAY_DATE_FORMAT_STRING) === date) {
          data[j].createdAt = '';
          j++;
        }
        i = j;
      }

      this.setState({
        dataReport: data,
        dataReport_full: data,
        loadingReport: false
      })
    }
    else{
      this.setState({
        loadingReport: true
      })
      notifyError(getReport.error);
    }

  }

  export = () => {
    const { dataReport, groupType, id, dataSearch } = this.state;
    const {t} = this.props;
    let record = dataSearch.find(item => item.id === id);

    let dataExcel = [
      [ t("Thời gian"), moment().format(Constants.DISPLAY_DATE_TIME_FORMAT_STRING_TIME_FORMAT)],
      [ t("Mã"), record ? record.code : ''],
      [ t("Tên"), record ? trans(record.name, true) : '']
    ];

    if (groupType) {
      if (groupType === Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.PRODUCT){
        dataExcel.push(
          [
            t("Thời gian"),
            t("Giao dịch"),
            t("SL thay đổi"),
            t("Giá trị"),
            t("Tham chiếu"),
          ]
        );
      }
      else{
        dataExcel.push(
          [
            t("Thời gian"),
            t("Giao dịch"),
            t("Giá trị"),
            t("Tham chiếu"),
          ]
        );
      }

      for (let item of dataReport) {
        let record = [
          item.createdAt ? moment(item.createdAt).format(Constants.DISPLAY_DATE_FORMAT_STRING) : '',
          t(Constants.TYPE_CARD_IMPORT_EXPORT_REPORT[item.type]),
          ExtendFunction.FormatNumber(item.quantity || 0),
          ExtendFunction.FormatNumber(item.finalAmount || 0),
          item.code,
        ];

        if (groupType !== Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.PRODUCT)
          record.splice(2, 1);
        dataExcel.push(record)
      }
    }

    return dataExcel;
  }

  getProductTypes = async () => {
      let getProductTypes = await ProductTypeService.getProductTypes({
        select: ['id', 'name'],
      });
      if (getProductTypes.status) {        
        this.setState({
          productTypes: getProductTypes.data
        });
      }
      else notifyError(getProductTypes.error)
  }

  getReportCustomer = (id) => {
    let { dataReport_full } = this.state;
    let data = dataReport_full.filter((item) => item.id === id);
    this.setState({
      dataReport: data
    })
  }

  getDataSearch = async (stockId) => {
    const { groupType, dataCustomer, dataSupplier, dataProduct } = this.state;
    let getData;

    this.setState({
      loadingSearch: true
    })

    switch (groupType) {
      case Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.CUSTOMER:{
        if(dataCustomer){
          this.getDataSearchProduct(dataCustomer);
        }
        else{
          getData = await CustomerService.getCustomers({
            select: ['id', 'name', 'code'],
          });
          this.getDataProduct(getData,"dataCustomer");
        }
        break;
      }
      case Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.SUPPLIER:{
        if(dataSupplier){
          this.getDataSearchProduct(dataSupplier);
        }
        else{
          getData = await CustomerService.getSuppliers({
            select: ['id', 'name', 'code'],
          });
          this.getDataProduct(getData,"dataSupplier");
        }
        break;
      }
      case Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.PRODUCT:{        
        if(dataProduct){
          this.getDataSearchProduct(dataProduct);
        }
        else{       
          getData = await ProductService.getProductList({
            select: ['id', 'name', 'code', 'productTypeId', 'stoppedAt'],
            filter: {deletedAt: 0, type: Constants.PRODUCT_TYPES.id.merchandise},

          });
          this.getDataProduct(getData,"dataProduct");
        }
        break;
      }
      default:
        break;
    }
  };

  getDataSearchProduct = (dataSource) =>{
    this.setState({ 
      dataSearch: dataSource,
      dataSearchFull: dataSource,
      loadingSearch: false
    }, () => this.onSearchData());
  }

  getDataProduct = (getData, name)=>{
    if (getData.status) {
      this.setState({ 
        [name]: getData.data,
        dataSearch: getData.data,
        dataSearchFull: getData.data,
        loadingSearch: false
      }, () => this.onSearchData());
    } else {
      notifyError(getData.message);        
      this.setState({
        loadingSearch: false
      })
    }
  }

  onSearchData = () => {
    const {dataSearchFull, valueSearch, productType, stock, groupType} = this.state;    
    let dataSearch = dataSearchFull;
    if(dataSearch.length > 0){
      if(valueSearch){
        dataSearch = dataSearch.filter((item) => 
          ExtendFunction.removeSign(trans(item.name, true).toLowerCase()).includes(ExtendFunction.removeSign(valueSearch.toLowerCase()))
          || item.code.toLowerCase().includes(valueSearch.toLowerCase())
        )
      }

      if(productType && groupType === Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.PRODUCT){                
        dataSearch = dataSearch.filter((item) =>
          item.productTypeId === productType

        )
      }

      this.setState({
        dataSearch
      })
    }
  }

  getLink = (type, id) => {
    let URL = window.location.origin;

    switch (type) {

      case 1:
      case 5:
        return (
          URL + Constants.MANAGE_INVOICE + id
        );

      case 2:
      case 6:
        return (
          URL + Constants.MANAGE_INVOICE_RETURN + id
        );

      case 3:
      case 7:
        return (
          URL + Constants.EDIT_IMPORT_CARD_PATH + id
        );

      case 4:
      case 8:
        return (
          URL + Constants.EDIT_EXPORT_CARD_PATH + id
        );

      case 9:
        return (
          URL + Constants.EDIT_STOCKTAKE_CARD_PATH + "/" + id
        );

      case 10:
        return (
          URL + "/admin" + Constants.EDIT_IMPORT_STOCK + "/" + id
        );

      case 11:
        return (
          URL + "/admin" + Constants.EDIT_EXPORT_STOCK + "/" + id
        );

      default:
        break;
    }
  }

  render() {
    const { t } = this.props
    const { InputValue, dateTime, dataReport, groupType, productTypes, dataSearch, productType, id, loadingReport, loadingSearch, stock_lists } = this.state;

    let columnSearch = [
      {
        title: t("Mã"),
        dataIndex: "code",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.code ? a.code.localeCompare(b.code) : -1),
        align: "left",
        width: "40%",
      },
      {
        title: t("Tên"),
        dataIndex: "name",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : -1),
        align: "left",
        width: "60%",
        render: value => trans(value)
      },
    ];

    let columnTable = [
      {
        title: t("Thời gian"),
        dataIndex: "createdAt",
        width: "20%",
        align: "left",
        type: "number",
        sorter: false,
        render: value => {
          return value ? moment(value).format(Constants.DISPLAY_DATE_FORMAT_STRING) : ''
        },
      },
      {
        title: t("Giao dịch"),
        dataIndex: "type",
        align: "left",
        width: "25%",
        sorter: false,
        render: value => {
          return value ? t(Constants.TYPE_CARD_IMPORT_EXPORT_REPORT[value]) : ''
        }
      },
      {
        title: t("SL"),
        dataIndex: "quantity",
        width: "15%",
        align: "right",
        sorter: false,
        render: value => {
          return ExtendFunction.FormatNumber(value) || 0;
        },
      },
      {
        title: t("Giá trị"),
        dataIndex: "finalAmount",
        align: "right",
        width: "22%",
        sorter: false,
        render: value => {
          return ExtendFunction.FormatNumber(value) || 0;
        },
      },
      {
        title: t("Tham chiếu"),
        dataIndex: "code",
        align: "left",
        sorter: false,
        render: (value, record) => {
          return (
            <span>
              <a style={{ cursor: "pointer" }} href={this.getLink(record.type, record.id)} target="_blank" rel="noopener noreferrer">{value}</a>
            </span>
          );
        }
      },
    ];

    if (groupType !== Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.PRODUCT) {
      columnTable.splice(2, 1);
    }

    return (
      <div>
        <Card >
          <GridContainer style={{ padding: '0px 0px 0px 40px' }} alignItems="center">
            <GridItem xs={12}>
              <GridContainer alignItems="center">
                <OhToolbar
                  left={[
                    {
                      type: "csvlink",
                      typeButton: "export",
                      csvData: this.export(),
                      fileName: t("BaoCaoXuatNhapChiTiet.xls"),
                      onClick: () => { },
                      label: t("Xuất báo cáo"),
                      icon: <MdVerticalAlignBottom />
                    }
                  ]}
                />
                <GridItem>
                  <span className="TitleInfoForm">{t("Ngày")}</span>
                </GridItem>
                <GridItem>
                  <OhDateTimePicker defaultValue={InputValue} onChange={(start,end) => {
                    let dateTime = {start: start, end: end};
                    this.setState({dateTime},() => this.getData(start, end))}
                    }/>
                </GridItem>
                <GridItem>
                  <FormLabel className="TitleReport">
                    <b className='TitleForm'>{t("Theo")}</b>
                  </FormLabel>
                </GridItem>
                <GridItem>
                  <OhSelect
                    options={Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT.map(item => (
                      {
                        value: item.value,
                        title: t(item.name),
                      }))}
                    onChange={(value) => {
                      this.setState({
                        groupType: value,
                        dataReport: [],
                        id: 0
                      }, () => this.getDataSearch());
                    }}
                    className='reportSelect'
                    value={groupType}
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
                      },() => {                        
                          this.getData(dateTime.start, dateTime.end)
                      })
                    }}
                    defaultValue={this.state.selectStockId}
                  />
                </GridItem>: null}
              </GridContainer>
            </GridItem>
          </GridContainer>

        </Card>

        <GridContainer style={{ width: "100%", marginLeft: 0 }}>
          <GridItem sm={12} md={4} className="gridItemReportLeft">
              <Card>
                <GridItem>
                  <OhInput
                    placeholder={t("Tìm kiếm bằng mã hoặc tên")}
                    onChange={(e) => {
                      this.setState({
                        valueSearch: e
                      }, () => this.onSearchData())
                    }}
                  />
                </GridItem>

                {groupType === Constants.SELECT_GROUP_IMPORT_EXPORT_REPORT_VALUE.PRODUCT && productTypes && productTypes.length > 0?
                  <GridItem>
                    <OhSelect
                      options={[{ name: t("Tất cả") }].concat(productTypes).map(item => (
                        {
                          value: item.id,
                          title: item.name,
                        }))}
                      placeholder={t("Chọn nhóm sản phẩm")}
                      onChange={(value) => {
                        this.setState({
                          productType: value
                        }, () => this.onSearchData());
                      }}
                      value = {productType}
                    />
                  </GridItem>
                  : null}
                <GridItem>
                  <OhTable
                    id='products-table'
                    columns={columnSearch}
                    dataSource={dataSearch}
                    onRowClick={(e, record, rowIndex) => {
                      this.setState({
                        id: record.id
                      }, () => this.getData(dateTime.start, dateTime.end))
                    }}
                    rowClassName={(record, index) => {
                      if (record.id === id){
                        return 'clickRowStyle';
                      } else {
                        if (record.stoppedAt > 0){                          
                          return 'blurRowOhTable';
                        } else return 'rowOhTable'
                      }
                    }}
                    x={"calc(100% - 500px)"}
                    y={window.innerHeight < 500 ? "300px" : "calc(100vh - 350px)"}
                    isNonePagination
                    loading={loadingSearch}
                  />
                </GridItem>
              </Card>
          </GridItem>

          <GridItem sm={12} md={8} className="gridItemReport" style={{  width: "100%"}}>
              <Card>
                <GridItem>
                  <OhTable
                    id='report-table'
                    columns={columnTable}
                    dataSource={dataReport.length > 500 ? dataReport.slice(0,500) : dataReport}
                    loading={loadingReport}
                    isNonePagination
                    y={window.innerHeight < 500 ? window.innerHeight : "calc(100vh - 250px)"}
                    x={550}
                  />
                  {dataReport.length > 500 ?
                    <GridContainer style={{ width: "100%", marginTop: 10, marginLeft: 0 }}>
                      <FormLabel className="ProductFormAddEdit" style={{ margin: 0, marginRight: 15 }}>
                        <b className='HeaderForm'>{t("Hiển thị 1–500 của 500+ kết quả. Để thu hẹp kết quả, bạn hãy chỉnh sửa phạm vi thời gian hoặc chọn Xuất báo cáo để xem đầy đủ")}</b>
                      </FormLabel>
                    </GridContainer>
                    :
                    null
                  }
                </GridItem>
              </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Debt.propTypes = {
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
  withStyles(dashboardStyle)
  (Debt))
);
