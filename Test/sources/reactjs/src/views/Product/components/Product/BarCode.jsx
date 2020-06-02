import React from "react";
import { connect } from "react-redux";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import OhRadio from "components/Oh/OhRadio";
import OhToolbar from 'components/Oh/OhToolbar';
import { MdCancel, } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import GridItem from "components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { withTranslation } from "react-i18next";
import ExtendFunction from "lib/ExtendFunction";
import productService from 'services/ProductService';
import OhTable from "components/Oh/OhTable";
import FormLabel from "@material-ui/core/FormLabel";
import OhNumberInput from "components/Oh/OhNumberInput.jsx";
import Constants from 'variables/Constants/';
import { trans } from "lib/ExtendFunction";
import Barcode from "react-barcode";
import { Container, Col, Row } from "react-bootstrap";
import PrintComponent from "./PrintComponent";
import MauTemCuon from "assets/img/icons/menu/Temcuon.jpg";
import MauListCuon from "assets/img/icons/menu/Listcuon.jpg";
import ReactToPrint from 'react-to-print';
import { notifyError } from 'components/Oh/OhUtils';

class BarCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          stopOnCodeDuplicateError: 0,
          loading: false,
          dataSource: [],
          choseSamplePrint: 3,
          ready: false,
          printStyle: {height: 49}
        };
        this.filters = {};
        this.titleApp = document.title;
    }

    componentDidMount = () => {
      setTimeout(() => this.setState({ready: true}),3);
      this.getData()
      this.printStyle();
    }

    async getData() {
      let { filter, pageSize, pageNumber, sortField, sortOrder, manualFilter, isManualSort } = this.filters;
      pageSize = pageSize || 10;
      pageNumber = pageNumber || 1;
      
      if (this.props.location.state && this.props.location.state.selectedRowKeys) {
        filter = {
          ...filter,
          id: {in : this.props.location.state.selectedRowKeys}
        }
      }

      if (this.props.location.state && this.props.location.state.pageSize) {
        pageSize = this.props.location.state.pageSize;
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

    async setData(products, count) {
      var dataSource = products || [{}];
      let arrId = [];
      if (dataSource.length > 0) {
        dataSource.map(data => {
          data.key = data.id;
          data.ManufacturerName = data.customerId ? data.customerId.name : null;
          data.customerId = data.customerId ? data.customerId.id : null;
          data.fileStorage = [];
          data.quantity = 0;
          arrId.push(data.id)
  
          return data;
          
        });
  
        this.setState({
          dataSource: dataSource,
          totalProducts: count
        });
      }
      else
        this.setState({
          dataSource: [],
          totalProducts: count
        })
    }

    handleStopOnCodeDuplicateError(e){
      this.setState({stopOnCodeDuplicateError: e},() => this.printStyle());
    }

    handleChoseSamplePrint(e) {
      this.setState({choseSamplePrint: e},() => this.printStyle())
    }

    printStyle(){
      let { stopOnCodeDuplicateError, choseSamplePrint } = this.state;

      let heightType = 28, fontType = 8, paddingType = 0, marginType = 8.5, widthType = 180;

      switch(choseSamplePrint){
        case 0:
          heightType = heightType
          break;
        case 1:
          heightType = heightType
          break;
        case 2:
          heightType = heightType
          break;
        case 3:
          heightType = 49;
          fontType = 12;
          paddingType = '100px 35px';
          marginType = '17.9px 8.5px';
          widthType = 180;
          break;
        case 4:
          heightType = 28;
          fontType = 8;
          paddingType = 0;
          // marginType = 6.295;
          marginType = 8.7032;
          widthType = 180;
          break;
        default:
          heightType = heightType
          break;
      }

      switch(stopOnCodeDuplicateError){
        case 0:
          break;
        case 1:
        case 2:
          break;
        default:
          break;
      }
      this.setState({printStyle: {height: heightType, font: fontType, padding: paddingType, margin: marginType, width: widthType}})
    }

    createBarcode = (value) => {
      return (
        <Barcode ref={"barcode"} value = {value} />
      )
    }

    getDataPrintTemplate = () =>{ 
      let { dataSource} = this.state;
      let checkQuantity = false;

      checkQuantity = dataSource.every(item => item.quantity === 0);

      if (checkQuantity){
        notifyError("Vui lòng chọn số lượng tem in");
        return;
      }
      
      this.refs.print.handleClick();
    }

    render() {
      const  { t} = this.props
      const { dataSource, totalProducts, printStyle } = this.state
      let columns = [
        {
          title: t("Mã sản phẩm"),
          width: "25%",
          dataIndex: 'code',
          align: "left",
        },
        {
          title: t("Tên sản phẩm"),
          width: "25%",
          dataIndex: "name",
          align: "left",
          render: value => trans(value)
        },
        {
          title: t("Giá bán"),
          align: "left",
          dataIndex: "saleUnitPrice",
          width: "25%",
          render: value => {
            return <div className="ellipsis-not-span">{value ? ExtendFunction.FormatNumber(value) : "0"}</div>;
          },
        },
        {
          title: t("SL tem in"),
          align: "left",
          width: "25%",
          dataIndex: "quantity",
          render: (value, record) => {
            return <OhNumberInput
                    defaultValue={record.quantity || 0}
                    onChange={val => {
                      let dataSource_copy = dataSource;

                      let index = dataSource_copy.findIndex(item => item.id === record.id);

                      dataSource_copy[index].quantity = val;

                      this.setState({
                        dataSource: dataSource_copy
                      })
                    }}
                    isNegative={false}
                    permission= {{
                      name: Constants.PERMISSION_NAME.MANUFACTURE_PRODUCT,
                      type: Constants.PERMISSION_TYPE.TYPE_ALL
                    }}
                  />;
          },
        },
      ];

      return (
        <>
          <Card>
            <GridContainer>
              <GridItem xs = {12}>
              <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className='HeaderForm'>{t("Loại tem")}</b>
            </FormLabel>
              </GridItem>
            </GridContainer>
            <GridContainer style = {{marginTop:'-10px', marginLeft:'11px'}} >
              <GridItem xs = {6}>
              <OhRadio
                  name={"barcode"}
                  disabled={this.state.loading}
                  defaultValue={this.state.stopOnCodeDuplicateError}
                  onChange={(e) => this.handleStopOnCodeDuplicateError(e)}
                  options={Constants.BARCODE_PRINT}
                />
                <div style={{display: "none", width:'110',height:'50', maxHeight: "50",overflow: "scroll"}}>
                  <ReactToPrint
                    ref="print"
                    trigger={() => <button>{t("In mã vạch")}</button>}
                    content={() => this.componentRef}
                    onBeforePrint={() => document.title = t("MaVach")}
                    onAfterPrint={() => document.title = this.titleApp}
                  />
                  <PrintComponent ref={el => (this.componentRef = el)} style={printStyle} value = {this.state.stopOnCodeDuplicateError} dataSource={this.state.dataSource} language={this.props.languageCurrent}/>
                </div>
              </GridItem>
              <GridItem xs = {6} style = {{textAlign: "center"}}>
                <p style = {{font: "20px monospace", marginBottom: "0px", visibility: (this.state.stopOnCodeDuplicateError !== 0 && this.state.stopOnCodeDuplicateError !== 2) ? 'visible' : 'hidden'}}>{t("Tên sản phẩm")}</p>
              <Barcode ref={"barcode"}
                textAlign = "center"
                textPosition = "bottom"
                width = {2}
                value={"Barcode123"} />
                <p style = {{font: "20px monospace", marginTop: "-3px", visibility: (this.state.stopOnCodeDuplicateError !== 0 && this.state.stopOnCodeDuplicateError !== 1) ? 'visible' : 'hidden'}}>{"100,000đ"}</p>
              </GridItem>
            </GridContainer>
          </Card>
        <Card>
          <GridContainer>
            <GridItem xs = {12}>
            <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className='HeaderForm'>{t("Thông tin sản phẩm")}</b>
            </FormLabel>
            </GridItem>
          </GridContainer>
          <GridItem xs = {12}>
          <OhTable
            onRef={ref => (this.tableRef = ref)}
            columns={columns}
            dataSource={dataSource}
            id={"barcode-form-table"}
            total={totalProducts}
          />
         </GridItem>
          </Card>
          <Card>
          <GridItem xs = {12}>
            <FormLabel className="ProductFormAddEdit" style={{ margin: 0 }}>
              <b className='HeaderForm'>{t("Khổ in")}</b>
            </FormLabel>
            </GridItem>
            <Container 
            fluid = {true}
            >
              <Row style = {{paddingBottom: 30}}>
                <Col xs = {4}> 
                <div className = "sample-barcode">
                <img className = "img-samle-barcode" src = {MauTemCuon} />
                <OhRadio
                  name={"barcode"}
                  disabled={true}
                  defaultValue={this.state.choseSamplePrint}
                  onChange={(e) => this.handleChoseSamplePrint(e)}
                  options={[
                    {name: t("Cuộn 3 tem"), value: 0},
                  ]}
                />
                <span className = "notes">{t("(Khổ 110 * 22 mm)")}</span>
                </div>
                </Col>
                <Col xs = {4}>
                  <div className = "sample-barcode">
                    <img className = "img-samle-barcode" src = {MauTemCuon} />
                  <OhRadio
                    name={"barcode"}
                    disabled={true}
                    defaultValue={this.state.choseSamplePrint}
                    onChange={(e) => this.handleChoseSamplePrint(e)}
                    options={[
                      {name: t("Cuộn 2 tem"), value: 1}
                    ]}
                />
                 <span className = "notes">{t("(Khổ 74 * 22 mm)")}</span>
                  </div>
                </Col>
                <Col xs = {4}>
                  <div className = "sample-barcode">
                  <img className = "img-samle-barcode" src = {MauTemCuon} />
                    <OhRadio
                      name={"barcode"}
                      disabled={true}
                      defaultValue={this.state.choseSamplePrint}
                      onChange={(e) => this.handleChoseSamplePrint(e)}
                      options={[
                        {name: t("Cuộn 2 tem"), value: 2}
                      ]}
                />
                 <span className = "notes">{t("(Khổ 72 * 22 mm)")}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs = {4}> 
                <div className = "sample-barcode">
                <img className = "img-samle-barcode" src = {MauListCuon} />
                <OhRadio
                  name={"barcode"}
                  disabled={this.state.loading}
                  defaultValue={this.state.choseSamplePrint}
                  onChange={(e) => this.handleChoseSamplePrint(e)}
                  options={[
                    {name: t("A4 - No.145 - 65 tem"), value: 3},
                  ]}
                />
                </div>
                </Col>
                <Col xs = {4}>
                  <div className = "sample-barcode">
                  <img className = "img-samle-barcode" src = {MauListCuon} />
                  <OhRadio
                    name={"barcode"}
                    disabled={this.state.loading}
                    defaultValue={this.state.choseSamplePrint}
                    onChange={(e) => this.handleChoseSamplePrint(e)}
                    options={[
                      {name: t("A4 - No.138 - 100 tem"), value: 4}
                    ]}
                />
                  </div>
                </Col>
                <Col xs = {4}>
                  <div className = "sample-barcode">
                  <img className = "img-samle-barcode" src = {MauListCuon} />
                    <OhRadio
                      name={"barcode"}
                      disabled={true}
                      defaultValue={this.state.choseSamplePrint}
                      onChange={(e) => this.handleChoseSamplePrint(e)}
                      options={[
                        {name: t("A5 - No.108 - 40 tem"), value: 5}
                      ]}
                />
                  </div>
                </Col>
              </Row>
            </Container>
          </Card>
          <OhToolbar
          right={[
            {
              type: "button",
              label: t("In mã vạch"),
              icon: <AiFillPrinter />,
              typeButton: "add",
              onClick: () => this.getDataPrintTemplate()
            },
            {
              type: "link",
              label: t("Thoát"),
              linkTo: Constants.ADD_PRODUCT,
              icon: <MdCancel />,
              typeButton: "exit",
              simple: true,
              permission: {
                name: Constants.PERMISSION_NAME.PRODUCT,
                type: Constants.PERMISSION_TYPE.TYPE_ALL
              }
            },
          ]}
        />
        </>
      )
    }
}

export default connect(state => {
  return {
    languageCurrent: state.languageReducer.language
  }})(
    withTranslation("translations")(
      withStyles(theme => ({
        ...regularFormsStyle
      }))(BarCode)
    )
  );